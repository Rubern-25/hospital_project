from django.db.models import Q, Sum
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import Appointment, Bill, Doctor, Medication, Patient, Treatment, UserProfile
from .serializers import (
    AuthUserSerializer,
    AppointmentSerializer,
    BillSerializer,
    DoctorSerializer,
    MedicationSerializer,
    PatientSerializer,
    TreatmentSerializer,
    UserProfileSerializer,
)


def get_profile(request):
    if not request.user.is_authenticated:
        return None
    try:
        return request.user.profile
    except UserProfile.DoesNotExist:
        return None


class BaseRoleViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]

    @staticmethod
    def _is_admin(profile):
        return bool(profile and profile.role == UserProfile.ROLE_ADMIN)

    @staticmethod
    def _is_doctor(profile):
        return bool(profile and profile.role == UserProfile.ROLE_DOCTOR and profile.doctor_id)

    @staticmethod
    def _is_patient(profile):
        return bool(profile and profile.role == UserProfile.ROLE_PATIENT and profile.patient_id)


class PatientViewSet(BaseRoleViewSet):
    serializer_class = PatientSerializer

    def get_queryset(self):
        profile = get_profile(self.request)
        if self._is_admin(profile):
            return Patient.objects.all()
        if self._is_doctor(profile):
            return Patient.objects.filter(appointments__doctor=profile.doctor).distinct()
        if self._is_patient(profile):
            return Patient.objects.filter(id=profile.patient_id)
        return Patient.objects.none()

    def get_permissions(self):
        profile = get_profile(self.request)
        if self.action in ('create', 'update', 'partial_update', 'destroy') and not self._is_admin(profile):
            return [permissions.IsAdminUser()]
        return super().get_permissions()


class DoctorViewSet(BaseRoleViewSet):
    serializer_class = DoctorSerializer

    def get_queryset(self):
        profile = get_profile(self.request)
        if self._is_admin(profile):
            return Doctor.objects.all()
        if self._is_doctor(profile):
            return Doctor.objects.filter(id=profile.doctor_id)
        if self._is_patient(profile):
            # Patients see only admin-verified doctors (to browse and request appointments)
            return Doctor.objects.filter(is_verified=True)
        return Doctor.objects.none()

    def get_permissions(self):
        profile = get_profile(self.request)
        if self.action in ('create', 'update', 'partial_update', 'destroy') and not self._is_admin(profile):
            return [permissions.IsAdminUser()]
        return super().get_permissions()


class AppointmentViewSet(BaseRoleViewSet):
    serializer_class = AppointmentSerializer

    def get_queryset(self):
        profile = get_profile(self.request)
        if self._is_admin(profile):
            return Appointment.objects.all()
        if self._is_doctor(profile):
            return Appointment.objects.filter(doctor_id=profile.doctor_id)
        if self._is_patient(profile):
            return Appointment.objects.filter(patient_id=profile.patient_id)
        return Appointment.objects.none()

    def get_permissions(self):
        profile = get_profile(self.request)
        if self.action in ('destroy',):
            return [permissions.IsAdminUser()]
        if self.action in ('update', 'partial_update') and not self._is_admin(profile) and not self._is_doctor(profile):
            return [permissions.IsAdminUser()]
        return super().get_permissions()

    def create(self, request, *args, **kwargs):
        """When a patient creates an appointment, force patient_id from profile so validation passes."""
        profile = get_profile(request)
        if self._is_patient(profile) and profile.patient_id and request.data is not None:
            try:
                data = dict(request.data) if isinstance(request.data, dict) else request.data.copy()
            except (AttributeError, TypeError):
                data = dict(request.data)
            data['patient'] = profile.patient_id
            serializer = self.get_serializer(data=data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        return super().create(request, *args, **kwargs)

    def perform_create(self, serializer):
        profile = get_profile(self.request)
        if self._is_patient(profile):
            # Patient requests create as Pending until doctor accepts/rejects
            serializer.save(patient_id=profile.patient_id, status='Pending')
            return
        if self._is_doctor(profile):
            serializer.save(doctor_id=profile.doctor_id)
            return
        serializer.save()

    def perform_update(self, serializer):
        profile = get_profile(self.request)
        if self._is_doctor(profile):
            # Doctors can only update status/notes for their own appointments.
            serializer.save(doctor_id=profile.doctor_id)
            return
        if self._is_patient(profile):
            serializer.save(patient_id=profile.patient_id)
            return
        serializer.save()


class TreatmentViewSet(BaseRoleViewSet):
    serializer_class = TreatmentSerializer

    def get_queryset(self):
        profile = get_profile(self.request)
        if self._is_admin(profile):
            return Treatment.objects.all()
        if self._is_doctor(profile):
            return Treatment.objects.filter(doctor_id=profile.doctor_id)
        if self._is_patient(profile):
            return Treatment.objects.filter(patient_id=profile.patient_id)
        return Treatment.objects.none()

    def get_permissions(self):
        profile = get_profile(self.request)
        if self.action in ('create', 'update', 'partial_update') and not self._is_admin(profile) and not self._is_doctor(profile):
            return [permissions.IsAdminUser()]
        if self.action == 'destroy' and not self._is_admin(profile):
            return [permissions.IsAdminUser()]
        return super().get_permissions()

    def perform_create(self, serializer):
        profile = get_profile(self.request)
        if self._is_doctor(profile):
            serializer.save(doctor_id=profile.doctor_id)
            return
        serializer.save()

    def perform_update(self, serializer):
        profile = get_profile(self.request)
        if self._is_doctor(profile):
            serializer.save(doctor_id=profile.doctor_id)
            return
        serializer.save()


class MedicationViewSet(BaseRoleViewSet):
    serializer_class = MedicationSerializer

    def get_queryset(self):
        profile = get_profile(self.request)
        if self._is_admin(profile):
            return Medication.objects.all()
        if self._is_doctor(profile):
            return Medication.objects.filter(doctor_id=profile.doctor_id)
        if self._is_patient(profile):
            return Medication.objects.filter(patient_id=profile.patient_id)
        return Medication.objects.none()

    def get_permissions(self):
        profile = get_profile(self.request)
        if self.action in ('create', 'update', 'partial_update') and not self._is_admin(profile) and not self._is_doctor(profile):
            return [permissions.IsAdminUser()]
        if self.action == 'destroy' and not self._is_admin(profile):
            return [permissions.IsAdminUser()]
        return super().get_permissions()

    def perform_create(self, serializer):
        profile = get_profile(self.request)
        if self._is_doctor(profile):
            serializer.save(doctor_id=profile.doctor_id)
            return
        serializer.save()

    def perform_update(self, serializer):
        profile = get_profile(self.request)
        if self._is_doctor(profile):
            serializer.save(doctor_id=profile.doctor_id)
            return
        serializer.save()


class BillViewSet(BaseRoleViewSet):
    serializer_class = BillSerializer

    def get_queryset(self):
        profile = get_profile(self.request)
        if self._is_admin(profile):
            return Bill.objects.all()
        if self._is_doctor(profile):
            return Bill.objects.filter(doctor_id=profile.doctor_id)
        if self._is_patient(profile):
            return Bill.objects.filter(patient_id=profile.patient_id)
        return Bill.objects.none()

    def get_permissions(self):
        profile = get_profile(self.request)
        if self.action in ('create', 'update', 'partial_update', 'destroy') and not self._is_admin(profile):
            return [permissions.IsAdminUser()]
        return super().get_permissions()

    def perform_create(self, serializer):
        profile = get_profile(self.request)
        if self._is_doctor(profile):
            serializer.save(doctor_id=profile.doctor_id)
            return
        serializer.save()


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login_view(request):
    username = (request.data.get('username') or '').strip()
    password = request.data.get('password') or ''
    if not username or not password:
        return Response({'detail': 'Username and password required'}, status=status.HTTP_400_BAD_REQUEST)
    user = authenticate(request, username=username, password=password)
    if not user:
        return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

    login(request, user)
    profile = get_profile(request)
    if not profile:
        return Response({'detail': 'User profile not configured'}, status=status.HTTP_400_BAD_REQUEST)
    return Response(AuthUserSerializer(profile).data)



@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register_view(request):
    """Register a new patient or doctor. Doctors start unverified until admin verifies them."""
    from datetime import datetime
    role = (request.data.get('role') or 'Patient').strip()
    if role not in (UserProfile.ROLE_PATIENT, UserProfile.ROLE_DOCTOR):
        role = UserProfile.ROLE_PATIENT

    username = (request.data.get('username') or '').strip()
    password = request.data.get('password') or ''
    first_name = (request.data.get('first_name') or '').strip()
    last_name = (request.data.get('last_name') or '').strip()
    phone = (request.data.get('phone') or '').strip()

    if not username or not password:
        return Response({'detail': 'Username and password required'}, status=status.HTTP_400_BAD_REQUEST)
    if User.objects.filter(username=username).exists():
        return Response({'detail': 'Username already taken'}, status=status.HTTP_400_BAD_REQUEST)
    if not first_name or not last_name:
        return Response({'detail': 'First name and last name required'}, status=status.HTTP_400_BAD_REQUEST)
    if not phone:
        return Response({'detail': 'Phone required'}, status=status.HTTP_400_BAD_REQUEST)

    if role == UserProfile.ROLE_DOCTOR:
        specialization = (request.data.get('specialization') or '').strip()
        email = (request.data.get('email') or '').strip() or None
        if not specialization:
            return Response({'detail': 'Specialization required for doctor registration'}, status=status.HTTP_400_BAD_REQUEST)
        user = User.objects.create_user(
            username=username,
            password=password,
            first_name=first_name,
            last_name=last_name,
        )
        doctor_name = f"{first_name} {last_name}".strip() or username
        doctor = Doctor.objects.create(
            name=doctor_name,
            specialization=specialization,
            phone=phone,
            email=email,
            is_verified=False,
        )
        UserProfile.objects.create(user=user, role=UserProfile.ROLE_DOCTOR, doctor=doctor)
        login(request, user)
        profile = get_profile(request)
        return Response(AuthUserSerializer(profile).data)

    # Patient registration
    gender = request.data.get('gender') or 'Other'
    date_of_birth_raw = request.data.get('date_of_birth')
    address = (request.data.get('address') or '').strip()
    if not date_of_birth_raw:
        return Response({'detail': 'Date of birth required'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        if isinstance(date_of_birth_raw, str):
            date_of_birth = datetime.strptime(date_of_birth_raw[:10], '%Y-%m-%d').date()
        else:
            date_of_birth = date_of_birth_raw
    except (ValueError, TypeError):
        return Response({'detail': 'Invalid date of birth'}, status=status.HTTP_400_BAD_REQUEST)
    if not address:
        return Response({'detail': 'Address required'}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(
        username=username,
        password=password,
        first_name=first_name,
        last_name=last_name,
    )
    patient = Patient.objects.create(
        first_name=first_name,
        last_name=last_name,
        gender=gender,
        date_of_birth=date_of_birth,
        phone=phone,
        address=address,
    )
    UserProfile.objects.create(user=user, role=UserProfile.ROLE_PATIENT, patient=patient)
    login(request, user)
    profile = get_profile(request)
    return Response(AuthUserSerializer(profile).data)


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
@ensure_csrf_cookie
def csrf_view(request):
    return Response({'detail': 'CSRF cookie set'})


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def logout_view(request):
    logout(request)
    return Response({'detail': 'Logged out successfully'})


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def me_view(request):
    profile = get_profile(request)
    if not profile:
        return Response({'detail': 'User profile not configured'}, status=status.HTTP_400_BAD_REQUEST)
    return Response(AuthUserSerializer(profile).data)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def recommended_doctors(request):
    # Only verified doctors are visible to patients
    base_qs = Doctor.objects.filter(is_verified=True)
    problem = (request.query_params.get('problem') or '').lower()
    if not problem:
        return Response(DoctorSerializer(base_qs, many=True).data)

    specialization_map = {
        'heart': ['Cardiology'],
        'chest pain': ['Cardiology'],
        'blood pressure': ['Cardiology'],
        'headache': ['Neurology'],
        'migraine': ['Neurology'],
        'brain': ['Neurology'],
        'child': ['Pediatrics'],
        'baby': ['Pediatrics'],
        'bone': ['Orthopedics'],
        'joint': ['Orthopedics'],
        'skin': ['Dermatology'],
        'rash': ['Dermatology'],
    }
    matched_specs = set()
    for key, specs in specialization_map.items():
        if key in problem:
            matched_specs.update(specs)

    queryset = base_qs
    if matched_specs:
        queryset = queryset.filter(specialization__in=matched_specs)
    return Response(DoctorSerializer(queryset, many=True).data)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def dashboard_stats(request):
    """Return aggregated dashboard statistics."""
    profile = get_profile(request)
    if profile and profile.role == UserProfile.ROLE_ADMIN:
        patients_qs = Patient.objects.all()
        doctors_qs = Doctor.objects.all()
        appointments_qs = Appointment.objects.all()
        bills_qs = Bill.objects.all()
    elif profile and profile.role == UserProfile.ROLE_DOCTOR and profile.doctor_id:
        patients_qs = Patient.objects.filter(appointments__doctor_id=profile.doctor_id).distinct()
        doctors_qs = Doctor.objects.filter(id=profile.doctor_id)
        appointments_qs = Appointment.objects.filter(doctor_id=profile.doctor_id)
        bills_qs = Bill.objects.filter(doctor_id=profile.doctor_id)
    elif profile and profile.role == UserProfile.ROLE_PATIENT and profile.patient_id:
        patients_qs = Patient.objects.filter(id=profile.patient_id)
        doctors_qs = Doctor.objects.filter(appointments__patient_id=profile.patient_id).distinct()
        appointments_qs = Appointment.objects.filter(patient_id=profile.patient_id)
        bills_qs = Bill.objects.filter(patient_id=profile.patient_id)
    else:
        patients_qs = Patient.objects.none()
        doctors_qs = Doctor.objects.none()
        appointments_qs = Appointment.objects.none()
        bills_qs = Bill.objects.none()

    total_patients = patients_qs.count()
    total_doctors = doctors_qs.count()
    total_appointments = appointments_qs.count()
    pending_bills = bills_qs.filter(status='Pending').count()

    # Revenue from paid bills
    revenue_data = bills_qs.filter(status='Paid').aggregate(total=Sum('amount'))
    revenue = float(revenue_data['total'] or 0)

    # Recent patients (last 4)
    recent_patients = PatientSerializer(
        patients_qs[:4], many=True
    ).data

    # Recent appointments (last 4)
    recent_appointments = AppointmentSerializer(
        appointments_qs[:4], many=True
    ).data

    return Response({
        'total_patients': total_patients,
        'total_doctors': total_doctors,
        'total_appointments': total_appointments,
        'pending_bills': pending_bills,
        'recent_patients': recent_patients,
        'recent_appointments': recent_appointments,
        'revenue': revenue,
    })
