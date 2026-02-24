import type { Appointment, AuthUser, Bill, DashboardStats, Doctor, Medication, Patient, Treatment } from "./api"

export const mockPatients: Patient[] = [
  { id: 1, first_name: "John", last_name: "Doe", gender: "Male", date_of_birth: "1985-03-15", phone: "+1-555-0101", address: "123 Main St, Springfield" },
  { id: 2, first_name: "Jane", last_name: "Smith", gender: "Female", date_of_birth: "1990-07-22", phone: "+1-555-0102", address: "456 Oak Ave, Riverside" },
  { id: 3, first_name: "Robert", last_name: "Johnson", gender: "Male", date_of_birth: "1978-11-08", phone: "+1-555-0103", address: "789 Pine Rd, Lakewood" },
  { id: 4, first_name: "Emily", last_name: "Williams", gender: "Female", date_of_birth: "1995-01-30", phone: "+1-555-0104", address: "321 Elm St, Greenfield" },
  { id: 5, first_name: "Michael", last_name: "Brown", gender: "Male", date_of_birth: "1982-09-14", phone: "+1-555-0105", address: "654 Maple Dr, Hillside" },
  { id: 6, first_name: "Sarah", last_name: "Davis", gender: "Female", date_of_birth: "1988-05-19", phone: "+1-555-0106", address: "987 Cedar Ln, Valley View" },
]

export const mockDoctors: Doctor[] = [
  { id: 1, name: "Dr. Amanda Wilson", specialization: "Cardiology", phone: "+1-555-0201", email: "a.wilson@hospital.com", is_verified: true },
  { id: 2, name: "Dr. James Chen", specialization: "Neurology", phone: "+1-555-0202", email: "j.chen@hospital.com", is_verified: true },
  { id: 3, name: "Dr. Priya Patel", specialization: "Pediatrics", phone: "+1-555-0203", email: "p.patel@hospital.com", is_verified: true },
  { id: 4, name: "Dr. Marcus Thompson", specialization: "Orthopedics", phone: "+1-555-0204", email: "m.thompson@hospital.com", is_verified: true },
  { id: 5, name: "Dr. Lisa Kim", specialization: "Dermatology", phone: "+1-555-0205", email: "l.kim@hospital.com", is_verified: true },
]

export const mockAppointments: Appointment[] = [
  { id: 1, patient: 1, doctor: 1, patient_name: "John Doe", doctor_name: "Dr. Amanda Wilson", appointment_date: "2026-02-23T09:00:00", status: "Scheduled", notes: "Follow-up checkup" },
  { id: 2, patient: 2, doctor: 2, patient_name: "Jane Smith", doctor_name: "Dr. James Chen", appointment_date: "2026-02-23T10:30:00", status: "Scheduled", notes: "Initial consultation" },
  { id: 3, patient: 3, doctor: 3, patient_name: "Robert Johnson", doctor_name: "Dr. Priya Patel", appointment_date: "2026-02-22T14:00:00", status: "Completed", notes: "Routine examination" },
  { id: 4, patient: 4, doctor: 4, patient_name: "Emily Williams", doctor_name: "Dr. Marcus Thompson", appointment_date: "2026-02-24T11:00:00", status: "Scheduled" },
  { id: 5, patient: 5, doctor: 5, patient_name: "Michael Brown", doctor_name: "Dr. Lisa Kim", appointment_date: "2026-02-21T16:00:00", status: "Cancelled" },
]

export const mockTreatments: Treatment[] = [
  { id: 1, patient: 1, doctor: 1, patient_name: "John Doe", doctor_name: "Dr. Amanda Wilson", diagnosis: "Hypertension", prescription: "Lisinopril 10mg daily", treatment_date: "2026-02-20" },
  { id: 2, patient: 2, doctor: 2, patient_name: "Jane Smith", doctor_name: "Dr. James Chen", diagnosis: "Migraine", prescription: "Sumatriptan 50mg as needed", treatment_date: "2026-02-19" },
  { id: 3, patient: 3, doctor: 3, patient_name: "Robert Johnson", doctor_name: "Dr. Priya Patel", diagnosis: "Common cold", prescription: "Rest and fluids", treatment_date: "2026-02-18" },
  { id: 4, patient: 4, doctor: 4, patient_name: "Emily Williams", doctor_name: "Dr. Marcus Thompson", diagnosis: "Sprained ankle", prescription: "RICE protocol, Ibuprofen 400mg", treatment_date: "2026-02-17" },
]

export const mockBills: Bill[] = [
  { id: 1, patient: 1, doctor: 1, treatment: 1, patient_name: "John Doe", doctor_name: "Dr. Amanda Wilson", treatment_diagnosis: "Hypertension", amount: "250000.00", bill_date: "2026-02-20", status: "Paid", description: "Consultation + ECG" },
  { id: 2, patient: 2, doctor: 2, treatment: 2, patient_name: "Jane Smith", doctor_name: "Dr. James Chen", treatment_diagnosis: "Migraine", amount: "180000.00", bill_date: "2026-02-19", status: "Pending", description: "Neurological consultation" },
  { id: 3, patient: 3, doctor: 3, treatment: 3, patient_name: "Robert Johnson", doctor_name: "Dr. Priya Patel", treatment_diagnosis: "Common cold", amount: "120000.00", bill_date: "2026-02-18", status: "Paid", description: "General checkup" },
  { id: 4, patient: 4, doctor: 4, treatment: 4, patient_name: "Emily Williams", doctor_name: "Dr. Marcus Thompson", treatment_diagnosis: "Sprained ankle", amount: "350000.00", bill_date: "2026-02-17", status: "Pending", description: "X-ray + consultation" },
  { id: 5, patient: 5, doctor: 5, patient_name: "Michael Brown", doctor_name: "Dr. Lisa Kim", amount: "200000.00", bill_date: "2026-02-16", status: "Cancelled", description: "Dermatology consultation" },
]

export const mockMedications: Medication[] = [
  {
    id: 1,
    patient: 1,
    doctor: 1,
    treatment: 1,
    patient_name: "John Doe",
    doctor_name: "Dr. Amanda Wilson",
    medication_name: "Lisinopril",
    dosage: "10mg",
    frequency: "1 tablet daily",
    time_of_day: "Morning",
    instructions: "Take after breakfast",
    start_date: "2026-02-20",
    end_date: "2026-03-20",
  },
  {
    id: 2,
    patient: 2,
    doctor: 2,
    treatment: 2,
    patient_name: "Jane Smith",
    doctor_name: "Dr. James Chen",
    medication_name: "Sumatriptan",
    dosage: "50mg",
    frequency: "As needed for migraine",
    time_of_day: "Night",
    instructions: "Do not exceed 2 tablets/day",
    start_date: "2026-02-19",
  },
]

export const mockDashboardStats: DashboardStats = {
  total_patients: 6,
  total_doctors: 5,
  total_appointments: 5,
  pending_bills: 2,
  recent_patients: mockPatients.slice(0, 4),
  recent_appointments: mockAppointments.slice(0, 4),
  revenue: 720000,
}

export const mockUsers = {
  admin: { id: 1, username: "admin_demo", first_name: "Admin", last_name: "User", role: "Admin", patient: null, doctor: null } as AuthUser,
  doctor: {
    id: 2,
    username: "doctor_demo",
    first_name: "Amanda",
    last_name: "Wilson",
    role: "Doctor",
    patient: null,
    doctor: 1,
    doctor_name: "Dr. Amanda Wilson",
  } as AuthUser,
  patient: {
    id: 3,
    username: "patient_demo",
    first_name: "John",
    last_name: "Doe",
    role: "Patient",
    patient: 1,
    doctor: null,
    patient_name: "John Doe",
  } as AuthUser,
}

export const mockCredentials = [
  { username: "admin_demo", password: "admin123", user: mockUsers.admin },
  { username: "doctor_demo", password: "doctor123", user: mockUsers.doctor },
  { username: "patient_demo", password: "patient123", user: mockUsers.patient },
]
