from django.contrib import admin
from .models import Appointment, Bill, Doctor, Medication, Patient, Treatment, UserProfile


@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'gender', 'date_of_birth', 'phone', 'created_at')
    search_fields = ('first_name', 'last_name', 'phone')
    list_filter = ('gender',)


@admin.register(Doctor)
class DoctorAdmin(admin.ModelAdmin):
    list_display = ('name', 'specialization', 'phone', 'email', 'created_at')
    search_fields = ('name', 'specialization')
    list_filter = ('specialization',)


@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ('patient', 'doctor', 'appointment_date', 'status', 'created_at')
    search_fields = ('patient__first_name', 'patient__last_name', 'doctor__name')
    list_filter = ('status', 'appointment_date')


@admin.register(Treatment)
class TreatmentAdmin(admin.ModelAdmin):
    list_display = ('patient', 'doctor', 'diagnosis', 'treatment_date', 'created_at')
    search_fields = ('patient__first_name', 'diagnosis')
    list_filter = ('treatment_date',)


@admin.register(Bill)
class BillAdmin(admin.ModelAdmin):
    list_display = ('patient', 'doctor', 'amount', 'bill_date', 'status', 'created_at')
    search_fields = ('patient__first_name', 'patient__last_name')
    list_filter = ('status', 'bill_date')


@admin.register(Medication)
class MedicationAdmin(admin.ModelAdmin):
    list_display = ('patient', 'doctor', 'medication_name', 'time_of_day', 'start_date', 'end_date')
    search_fields = ('patient__first_name', 'patient__last_name', 'medication_name')
    list_filter = ('time_of_day', 'start_date')


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'role', 'patient', 'doctor', 'created_at')
    search_fields = ('user__username',)
    list_filter = ('role',)
