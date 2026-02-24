const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

interface RequestOptions {
  method?: string
  body?: unknown
  headers?: Record<string, string>
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() || null
  }
  return null
}

async function ensureCsrfCookie() {
  await fetch(`${API_BASE_URL}/auth/csrf/`, {
    credentials: "include",
  })
}

async function apiRequest<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, headers = {} } = options
  const upperMethod = method.toUpperCase()

  if (upperMethod !== "GET" && upperMethod !== "HEAD" && upperMethod !== "OPTIONS") {
    if (!getCookie("csrftoken")) {
      await ensureCsrfCookie()
    }
  }

  const config: RequestInit = {
    method: upperMethod,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(upperMethod !== "GET" && upperMethod !== "HEAD" ? { "X-CSRFToken": getCookie("csrftoken") || "" } : {}),
      ...headers,
    },
  }

  if (body) {
    config.body = JSON.stringify(body)
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config)

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "An error occurred" }))
    throw new Error(error.detail || `HTTP ${response.status}`)
  }

  if (response.status === 204) {
    return {} as T
  }

  return response.json()
}

// Patients
export const patientsApi = {
  list: () => apiRequest<Patient[]>("/patients/"),
  get: (id: number) => apiRequest<Patient>(`/patients/${id}/`),
  create: (data: PatientInput) => apiRequest<Patient>("/patients/", { method: "POST", body: data }),
  update: (id: number, data: PatientInput) => apiRequest<Patient>(`/patients/${id}/`, { method: "PUT", body: data }),
  delete: (id: number) => apiRequest<void>(`/patients/${id}/`, { method: "DELETE" }),
}

// Doctors
export const doctorsApi = {
  list: () => apiRequest<Doctor[]>("/doctors/"),
  recommended: (problem: string) =>
    apiRequest<Doctor[]>(`/doctors/recommended/?problem=${encodeURIComponent(problem)}`),
  get: (id: number) => apiRequest<Doctor>(`/doctors/${id}/`),
  create: (data: DoctorInput) => apiRequest<Doctor>("/doctors/", { method: "POST", body: data }),
  update: (id: number, data: DoctorInput) => apiRequest<Doctor>(`/doctors/${id}/`, { method: "PUT", body: data }),
  delete: (id: number) => apiRequest<void>(`/doctors/${id}/`, { method: "DELETE" }),
}

// Appointments
export const appointmentsApi = {
  list: () => apiRequest<Appointment[]>("/appointments/"),
  get: (id: number) => apiRequest<Appointment>(`/appointments/${id}/`),
  create: (data: AppointmentInput) => apiRequest<Appointment>("/appointments/", { method: "POST", body: data }),
  update: (id: number, data: AppointmentInput) => apiRequest<Appointment>(`/appointments/${id}/`, { method: "PUT", body: data }),
  delete: (id: number) => apiRequest<void>(`/appointments/${id}/`, { method: "DELETE" }),
}

// Treatments
export const treatmentsApi = {
  list: () => apiRequest<Treatment[]>("/treatments/"),
  get: (id: number) => apiRequest<Treatment>(`/treatments/${id}/`),
  create: (data: TreatmentInput) => apiRequest<Treatment>("/treatments/", { method: "POST", body: data }),
  update: (id: number, data: TreatmentInput) => apiRequest<Treatment>(`/treatments/${id}/`, { method: "PUT", body: data }),
  delete: (id: number) => apiRequest<void>(`/treatments/${id}/`, { method: "DELETE" }),
}

// Medications
export const medicationsApi = {
  list: () => apiRequest<Medication[]>("/medications/"),
  get: (id: number) => apiRequest<Medication>(`/medications/${id}/`),
  create: (data: MedicationInput) => apiRequest<Medication>("/medications/", { method: "POST", body: data }),
  update: (id: number, data: MedicationInput) => apiRequest<Medication>(`/medications/${id}/`, { method: "PUT", body: data }),
  delete: (id: number) => apiRequest<void>(`/medications/${id}/`, { method: "DELETE" }),
}

// Bills
export const billsApi = {
  list: () => apiRequest<Bill[]>("/bills/"),
  get: (id: number) => apiRequest<Bill>(`/bills/${id}/`),
  create: (data: BillInput) => apiRequest<Bill>("/bills/", { method: "POST", body: data }),
  update: (id: number, data: BillInput) => apiRequest<Bill>(`/bills/${id}/`, { method: "PUT", body: data }),
  delete: (id: number) => apiRequest<void>(`/bills/${id}/`, { method: "DELETE" }),
}

// Dashboard stats
export const dashboardApi = {
  stats: () => apiRequest<DashboardStats>("/dashboard/stats/"),
}

// Session auth
export type RegisterRole = "Patient" | "Doctor"

export interface RegisterInput {
  role?: RegisterRole
  username: string
  password: string
  first_name: string
  last_name: string
  phone: string
  /** Patient only */
  gender?: string
  date_of_birth?: string
  address?: string
  /** Doctor only */
  specialization?: string
  email?: string
}

export const authApi = {
  login: (username: string, password: string) =>
    apiRequest<AuthUser>("/auth/login/", { method: "POST", body: { username, password } }),
  register: (data: RegisterInput) =>
    apiRequest<AuthUser>("/auth/register/", { method: "POST", body: data }),
  me: () => apiRequest<AuthUser>("/auth/me/"),
  logout: () => apiRequest<{ detail: string }>("/auth/logout/", { method: "POST" }),
}

// Types
export type UserRole = "Admin" | "Doctor" | "Patient"

export interface AuthUser {
  id: number
  username: string
  first_name: string
  last_name: string
  role: UserRole
  patient: number | null
  doctor: number | null
  patient_name?: string | null
  doctor_name?: string | null
}

export interface Patient {
  id: number
  first_name: string
  last_name: string
  gender: string
  date_of_birth: string
  phone: string
  address: string
  created_at?: string
}

export type PatientInput = Omit<Patient, "id" | "created_at">

export interface Doctor {
  id: number
  name: string
  specialization: string
  phone: string
  email?: string
  is_verified?: boolean
  created_at?: string
}

export type DoctorInput = Omit<Doctor, "id" | "created_at">

export interface Appointment {
  id: number
  patient: number
  doctor: number
  patient_name?: string
  doctor_name?: string
  appointment_date: string
  status: "Pending" | "Scheduled" | "Completed" | "Cancelled"
  notes?: string
  created_at?: string
}

export type AppointmentInput = Omit<Appointment, "id" | "patient_name" | "doctor_name" | "created_at">

export interface Treatment {
  id: number
  patient: number
  doctor: number
  patient_name?: string
  doctor_name?: string
  diagnosis: string
  prescription: string
  treatment_date: string
  created_at?: string
}

export type TreatmentInput = Omit<Treatment, "id" | "patient_name" | "doctor_name" | "created_at">

export interface Medication {
  id: number
  patient: number
  doctor: number
  treatment?: number | null
  patient_name?: string
  doctor_name?: string
  medication_name: string
  dosage: string
  frequency: string
  time_of_day: "Morning" | "Afternoon" | "Evening" | "Night"
  instructions?: string
  start_date: string
  end_date?: string | null
  created_at?: string
}

export type MedicationInput = Omit<Medication, "id" | "patient_name" | "doctor_name" | "created_at">

export interface Bill {
  id: number
  patient: number
  doctor?: number | null
  treatment?: number | null
  patient_name?: string
  doctor_name?: string | null
  treatment_diagnosis?: string | null
  amount: string
  bill_date: string
  status: "Pending" | "Paid" | "Cancelled"
  description?: string
  created_at?: string
}

export type BillInput = Omit<Bill, "id" | "patient_name" | "doctor_name" | "treatment_diagnosis" | "created_at">

export interface DashboardStats {
  total_patients: number
  total_doctors: number
  total_appointments: number
  pending_bills: number
  recent_patients: Patient[]
  recent_appointments: Appointment[]
  revenue: number
}
