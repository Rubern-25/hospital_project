from django.contrib.auth.models import User
from django.db import models


class Patient(models.Model):
    GENDER_CHOICES = [
        ('Male', 'Male'),
        ('Female', 'Female'),
        ('Other', 'Other'),
    ]

    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    date_of_birth = models.DateField()
    phone = models.CharField(max_length=20)
    address = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.first_name} {self.last_name}"


class Doctor(models.Model):
    name = models.CharField(max_length=200)
    specialization = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)
    email = models.EmailField(blank=True, null=True)
    is_verified = models.BooleanField(default=False, help_text="Admin must verify for doctor to appear to patients")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name


class UserProfile(models.Model):
    ROLE_ADMIN = 'Admin'
    ROLE_DOCTOR = 'Doctor'
    ROLE_PATIENT = 'Patient'
    ROLE_CHOICES = [
        (ROLE_ADMIN, ROLE_ADMIN),
        (ROLE_DOCTOR, ROLE_DOCTOR),
        (ROLE_PATIENT, ROLE_PATIENT),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    patient = models.OneToOneField(
        Patient,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='user_profile',
    )
    doctor = models.OneToOneField(
        Doctor,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='user_profile',
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} ({self.role})"


class Appointment(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),      # Requested by patient; doctor may accept or reject
        ('Scheduled', 'Scheduled'),
        ('Completed', 'Completed'),
        ('Cancelled', 'Cancelled'),
    ]

    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='appointments')
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='appointments')
    appointment_date = models.DateTimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-appointment_date']

    def __str__(self):
        return f"{self.patient} - {self.doctor} on {self.appointment_date}"


class Treatment(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='treatments')
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='treatments')
    diagnosis = models.TextField()
    prescription = models.TextField()
    treatment_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-treatment_date']

    def __str__(self):
        return f"{self.patient} - {self.diagnosis}"


class Medication(models.Model):
    TIME_MORNING = 'Morning'
    TIME_AFTERNOON = 'Afternoon'
    TIME_EVENING = 'Evening'
    TIME_NIGHT = 'Night'
    TIME_CHOICES = [
        (TIME_MORNING, TIME_MORNING),
        (TIME_AFTERNOON, TIME_AFTERNOON),
        (TIME_EVENING, TIME_EVENING),
        (TIME_NIGHT, TIME_NIGHT),
    ]

    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='medications')
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='medications')
    treatment = models.ForeignKey(
        Treatment,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='medications',
    )
    medication_name = models.CharField(max_length=150)
    dosage = models.CharField(max_length=120)
    frequency = models.CharField(max_length=120, help_text='e.g. 1 tablet daily')
    time_of_day = models.CharField(max_length=20, choices=TIME_CHOICES)
    instructions = models.TextField(blank=True, null=True)
    start_date = models.DateField()
    end_date = models.DateField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['time_of_day', '-created_at']

    def __str__(self):
        return f"{self.patient} - {self.medication_name} ({self.time_of_day})"


class Bill(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Paid', 'Paid'),
        ('Cancelled', 'Cancelled'),
    ]

    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='bills')
    doctor = models.ForeignKey(Doctor, on_delete=models.SET_NULL, null=True, blank=True, related_name='bills')
    treatment = models.ForeignKey(Treatment, on_delete=models.SET_NULL, null=True, blank=True, related_name='bills')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    bill_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-bill_date']

    def __str__(self):
        return f"Bill #{self.pk} - {self.patient} - TZS {self.amount}"
