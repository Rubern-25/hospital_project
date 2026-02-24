from rest_framework import serializers
from .models import Patient, Doctor, Appointment, Treatment, Bill, Medication, UserProfile


class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = '__all__'


class DoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        fields = '__all__'


class AppointmentSerializer(serializers.ModelSerializer):
    patient_name = serializers.SerializerMethodField()
    doctor_name = serializers.SerializerMethodField()

    class Meta:
        model = Appointment
        fields = '__all__'

    def get_patient_name(self, obj):
        return str(obj.patient)

    def get_doctor_name(self, obj):
        return str(obj.doctor)


class TreatmentSerializer(serializers.ModelSerializer):
    patient_name = serializers.SerializerMethodField()
    doctor_name = serializers.SerializerMethodField()

    class Meta:
        model = Treatment
        fields = '__all__'

    def get_patient_name(self, obj):
        return str(obj.patient)

    def get_doctor_name(self, obj):
        return str(obj.doctor)


class BillSerializer(serializers.ModelSerializer):
    patient_name = serializers.SerializerMethodField()
    doctor_name = serializers.SerializerMethodField()
    treatment_diagnosis = serializers.SerializerMethodField()

    class Meta:
        model = Bill
        fields = '__all__'

    def get_patient_name(self, obj):
        return str(obj.patient)

    def get_doctor_name(self, obj):
        return str(obj.doctor) if obj.doctor else None

    def get_treatment_diagnosis(self, obj):
        return obj.treatment.diagnosis if obj.treatment else None


class MedicationSerializer(serializers.ModelSerializer):
    patient_name = serializers.SerializerMethodField()
    doctor_name = serializers.SerializerMethodField()

    class Meta:
        model = Medication
        fields = '__all__'

    def get_patient_name(self, obj):
        return str(obj.patient)

    def get_doctor_name(self, obj):
        return str(obj.doctor)


class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)
    patient_name = serializers.SerializerMethodField()
    doctor_name = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile
        fields = (
            'id',
            'username',
            'first_name',
            'last_name',
            'role',
            'patient',
            'doctor',
            'patient_name',
            'doctor_name',
        )

    def get_patient_name(self, obj):
        return str(obj.patient) if obj.patient else None

    def get_doctor_name(self, obj):
        return str(obj.doctor) if obj.doctor else None
