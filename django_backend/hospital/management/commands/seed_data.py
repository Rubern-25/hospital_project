"""
Management command to seed the database with sample data.
Run: python manage.py seed_data
"""
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from hospital.models import Appointment, Bill, Doctor, Medication, Patient, Treatment, UserProfile
from datetime import date, datetime
from django.utils import timezone


class Command(BaseCommand):
    help = 'Seeds the database with sample hospital data'

    def handle(self, *args, **options):
        self.stdout.write('Seeding database...')

        # Clear existing data
        Bill.objects.all().delete()
        Medication.objects.all().delete()
        UserProfile.objects.all().delete()
        User.objects.exclude(is_superuser=True).delete()
        Treatment.objects.all().delete()
        Appointment.objects.all().delete()
        Patient.objects.all().delete()
        Doctor.objects.all().delete()

        # Create Patients
        patients = [
            Patient.objects.create(first_name='John', last_name='Doe', gender='Male', date_of_birth=date(1985, 3, 15), phone='+1-555-0101', address='123 Main St, Springfield'),
            Patient.objects.create(first_name='Jane', last_name='Smith', gender='Female', date_of_birth=date(1990, 7, 22), phone='+1-555-0102', address='456 Oak Ave, Riverside'),
            Patient.objects.create(first_name='Robert', last_name='Johnson', gender='Male', date_of_birth=date(1978, 11, 8), phone='+1-555-0103', address='789 Pine Rd, Lakewood'),
            Patient.objects.create(first_name='Emily', last_name='Williams', gender='Female', date_of_birth=date(1995, 1, 30), phone='+1-555-0104', address='321 Elm St, Greenfield'),
            Patient.objects.create(first_name='Michael', last_name='Brown', gender='Male', date_of_birth=date(1982, 9, 14), phone='+1-555-0105', address='654 Maple Dr, Hillside'),
            Patient.objects.create(first_name='Sarah', last_name='Davis', gender='Female', date_of_birth=date(1988, 5, 19), phone='+1-555-0106', address='987 Cedar Ln, Valley View'),
        ]
        self.stdout.write(f'  Created {len(patients)} patients')

        # Create Doctors (is_verified=True so they appear to patients)
        doctors = [
            Doctor.objects.create(name='Dr. Amanda Wilson', specialization='Cardiology', phone='+1-555-0201', email='a.wilson@hospital.com', is_verified=True),
            Doctor.objects.create(name='Dr. James Chen', specialization='Neurology', phone='+1-555-0202', email='j.chen@hospital.com', is_verified=True),
            Doctor.objects.create(name='Dr. Priya Patel', specialization='Pediatrics', phone='+1-555-0203', email='p.patel@hospital.com', is_verified=True),
            Doctor.objects.create(name='Dr. Marcus Thompson', specialization='Orthopedics', phone='+1-555-0204', email='m.thompson@hospital.com', is_verified=True),
            Doctor.objects.create(name='Dr. Lisa Kim', specialization='Dermatology', phone='+1-555-0205', email='l.kim@hospital.com', is_verified=True),
        ]
        self.stdout.write(f'  Created {len(doctors)} doctors')

        # Create Appointments
        appointments = [
            Appointment.objects.create(patient=patients[0], doctor=doctors[0], appointment_date=timezone.make_aware(datetime(2026, 2, 23, 9, 0)), status='Scheduled', notes='Follow-up checkup'),
            Appointment.objects.create(patient=patients[1], doctor=doctors[1], appointment_date=timezone.make_aware(datetime(2026, 2, 23, 10, 30)), status='Scheduled', notes='Initial consultation'),
            Appointment.objects.create(patient=patients[2], doctor=doctors[2], appointment_date=timezone.make_aware(datetime(2026, 2, 22, 14, 0)), status='Completed', notes='Routine examination'),
            Appointment.objects.create(patient=patients[3], doctor=doctors[3], appointment_date=timezone.make_aware(datetime(2026, 2, 24, 11, 0)), status='Scheduled'),
            Appointment.objects.create(patient=patients[4], doctor=doctors[4], appointment_date=timezone.make_aware(datetime(2026, 2, 21, 16, 0)), status='Cancelled'),
        ]
        self.stdout.write(f'  Created {len(appointments)} appointments')

        # Create Treatments
        treatments = [
            Treatment.objects.create(patient=patients[0], doctor=doctors[0], diagnosis='Hypertension', prescription='Lisinopril 10mg daily', treatment_date=date(2026, 2, 20)),
            Treatment.objects.create(patient=patients[1], doctor=doctors[1], diagnosis='Migraine', prescription='Sumatriptan 50mg as needed', treatment_date=date(2026, 2, 19)),
            Treatment.objects.create(patient=patients[2], doctor=doctors[2], diagnosis='Common cold', prescription='Rest and fluids', treatment_date=date(2026, 2, 18)),
            Treatment.objects.create(patient=patients[3], doctor=doctors[3], diagnosis='Sprained ankle', prescription='RICE protocol, Ibuprofen 400mg', treatment_date=date(2026, 2, 17)),
        ]
        self.stdout.write(f'  Created {len(treatments)} treatments')

        medications = [
            Medication.objects.create(
                patient=patients[0],
                doctor=doctors[0],
                treatment=treatments[0],
                medication_name='Lisinopril',
                dosage='10mg',
                frequency='1 tablet daily',
                time_of_day='Morning',
                instructions='Take after breakfast',
                start_date=date(2026, 2, 20),
                end_date=date(2026, 3, 20),
            ),
            Medication.objects.create(
                patient=patients[1],
                doctor=doctors[1],
                treatment=treatments[1],
                medication_name='Sumatriptan',
                dosage='50mg',
                frequency='As needed for migraine',
                time_of_day='Night',
                instructions='Do not exceed 2 tablets/day',
                start_date=date(2026, 2, 19),
            ),
            Medication.objects.create(
                patient=patients[3],
                doctor=doctors[3],
                treatment=treatments[3],
                medication_name='Ibuprofen',
                dosage='400mg',
                frequency='Twice daily',
                time_of_day='Evening',
                instructions='Take after meals',
                start_date=date(2026, 2, 17),
                end_date=date(2026, 2, 24),
            ),
        ]
        self.stdout.write(f'  Created {len(medications)} medications')

        # Create Bills
        bills = [
            Bill.objects.create(patient=patients[0], doctor=doctors[0], treatment=treatments[0], amount=250000.00, bill_date=date(2026, 2, 20), status='Paid', description='Consultation + ECG'),
            Bill.objects.create(patient=patients[1], doctor=doctors[1], treatment=treatments[1], amount=180000.00, bill_date=date(2026, 2, 19), status='Pending', description='Neurological consultation'),
            Bill.objects.create(patient=patients[2], doctor=doctors[2], treatment=treatments[2], amount=120000.00, bill_date=date(2026, 2, 18), status='Paid', description='General checkup'),
            Bill.objects.create(patient=patients[3], doctor=doctors[3], treatment=treatments[3], amount=350000.00, bill_date=date(2026, 2, 17), status='Pending', description='X-ray + consultation'),
            Bill.objects.create(patient=patients[4], doctor=doctors[4], amount=200000.00, bill_date=date(2026, 2, 16), status='Cancelled', description='Dermatology consultation'),
        ]
        self.stdout.write(f'  Created {len(bills)} bills')

        # Create demo login users for each role
        admin_user = User.objects.create_user(
            username='admin_demo',
            password='admin123',
            first_name='Admin',
            last_name='User',
            is_staff=True,
        )
        UserProfile.objects.create(user=admin_user, role=UserProfile.ROLE_ADMIN)

        doctor_user = User.objects.create_user(
            username='doctor_demo',
            password='doctor123',
            first_name='Amanda',
            last_name='Wilson',
        )
        UserProfile.objects.create(user=doctor_user, role=UserProfile.ROLE_DOCTOR, doctor=doctors[0])

        patient_user = User.objects.create_user(
            username='patient_demo',
            password='patient123',
            first_name='John',
            last_name='Doe',
        )
        UserProfile.objects.create(user=patient_user, role=UserProfile.ROLE_PATIENT, patient=patients[0])
        self.stdout.write('  Created demo users: admin_demo, doctor_demo, patient_demo')

        self.stdout.write(self.style.SUCCESS('Database seeded successfully!'))
