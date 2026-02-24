"use client"

import { useEffect, useMemo, useState } from "react"
import { AppSidebar, type ActivePage } from "@/components/app-sidebar"
import { Dashboard } from "@/components/dashboard"
import { PatientsPage } from "@/components/patients-page"
import { DoctorsPage } from "@/components/doctors-page"
import { AppointmentsPage } from "@/components/appointments-page"
import { TreatmentsPage } from "@/components/treatments-page"
import { BillingPage } from "@/components/billing-page"
import { LoginPage } from "@/components/login-page"
import { PatientDashboard } from "@/components/patient-dashboard"
import { PatientAppointments } from "@/components/patient-appointments"
import { PatientDiagnosis } from "@/components/patient-diagnosis"
import { PatientMedicationTimetable } from "@/components/patient-medication-timetable"
import { PatientBills } from "@/components/patient-bills"
import { PatientDoctorRecommendation } from "@/components/patient-doctor-recommendation"
import { DoctorDashboard } from "@/components/doctor-dashboard"
import { DoctorAssignedPatients } from "@/components/doctor-assigned-patients"
import { DoctorAppointmentsManager } from "@/components/doctor-appointments-manager"
import { DoctorTreatmentsManager } from "@/components/doctor-treatments-manager"
import {
  usePatients,
  useDoctors,
  useAppointments,
  useTreatments,
  useMedications,
  useBills,
  useDashboard,
} from "@/hooks/use-api"
import { useAuth } from "@/components/auth-provider"
import { cn } from "@/lib/utils"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  const auth = useAuth()
  const [activePage, setActivePage] = useState<ActivePage>("dashboard")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const patients = usePatients()
  const doctors = useDoctors()
  const appointments = useAppointments()
  const treatments = useTreatments()
  const medications = useMedications()
  const bills = useBills()
  const dashboard = useDashboard()

  useEffect(() => {
    setActivePage("dashboard")
  }, [auth.role])

  const currentPatient = useMemo(
    () => patients.items.find((p) => p.id === auth.user?.patient),
    [patients.items, auth.user?.patient]
  )

  const rolePatients = useMemo(() => {
    if (auth.role === "Admin") return patients.items
    if (auth.role === "Patient") return currentPatient ? [currentPatient] : []
    const assignedPatientIds = new Set(
      appointments.items.filter((a) => a.doctor === auth.user?.doctor).map((a) => a.patient)
    )
    return patients.items.filter((p) => assignedPatientIds.has(p.id))
  }, [auth.role, auth.user?.doctor, appointments.items, patients.items, currentPatient])

  const roleAppointments = useMemo(() => {
    if (auth.role === "Admin") return appointments.items
    if (auth.role === "Patient") return appointments.items.filter((a) => a.patient === auth.user?.patient)
    return appointments.items.filter((a) => a.doctor === auth.user?.doctor)
  }, [auth.role, auth.user?.patient, auth.user?.doctor, appointments.items])

  const roleTreatments = useMemo(() => {
    if (auth.role === "Admin") return treatments.items
    if (auth.role === "Patient") return treatments.items.filter((t) => t.patient === auth.user?.patient)
    return treatments.items.filter((t) => t.doctor === auth.user?.doctor)
  }, [auth.role, auth.user?.patient, auth.user?.doctor, treatments.items])

  const roleBills = useMemo(() => {
    if (auth.role === "Admin") return bills.items
    if (auth.role === "Patient") return bills.items.filter((b) => b.patient === auth.user?.patient)
    return bills.items.filter((b) => b.doctor === auth.user?.doctor)
  }, [auth.role, auth.user?.patient, auth.user?.doctor, bills.items])

  const roleMedications = useMemo(() => {
    if (auth.role === "Admin") return medications.items
    if (auth.role === "Patient") return medications.items.filter((m) => m.patient === auth.user?.patient)
    return medications.items.filter((m) => m.doctor === auth.user?.doctor)
  }, [auth.role, auth.user?.patient, auth.user?.doctor, medications.items])

  if (!auth.loading && !auth.isAuthenticated) {
    return (
      <LoginPage
        onLogin={auth.login}
        onRegister={auth.register}
        error={auth.error}
        useLiveApi={auth.useLiveApi}
      />
    )
  }

  if (auth.loading || !auth.role) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">Loading...</div>
  }

  function handleNavigate(page: ActivePage) {
    setActivePage(page)
    setMobileMenuOpen(false)
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-20 bg-foreground/30 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Desktop */}
      <div className="hidden lg:block">
        <AppSidebar
          activePage={activePage}
          onNavigate={handleNavigate}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          role={auth.role}
          onLogout={auth.logout}
        />
      </div>

      {/* Sidebar - Mobile */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-30 lg:hidden transition-transform duration-300",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <AppSidebar
          activePage={activePage}
          onNavigate={handleNavigate}
          collapsed={false}
          onToggleCollapse={() => setMobileMenuOpen(false)}
          role={auth.role}
          onLogout={auth.logout}
        />
      </div>

      {/* Main Content */}
      <main
        className={cn(
          "flex-1 transition-all duration-300",
          sidebarCollapsed ? "lg:ml-16" : "lg:ml-64"
        )}
      >
        {/* Top Bar */}
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-border bg-card px-4 lg:px-8">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-foreground"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open menu</span>
          </Button>
          <h2 className="text-lg font-semibold capitalize text-card-foreground">
            {activePage}
          </h2>
          <div className="ml-auto flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              {(auth.user?.first_name?.[0] || "U").toUpperCase()}
            </div>
            <span className="hidden text-sm font-medium text-card-foreground sm:block">
              {auth.user?.first_name} ({auth.role})
            </span>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 lg:p-8">
          {activePage === "dashboard" && auth.role === "Admin" && <Dashboard stats={dashboard.stats} />}
          {activePage === "dashboard" && auth.role === "Patient" && (
            <PatientDashboard
              appointmentCount={roleAppointments.length}
              diagnosisCount={roleTreatments.length}
              medicationCount={roleMedications.length}
              pendingBillCount={roleBills.filter((b) => b.status === "Pending").length}
            />
          )}
          {activePage === "dashboard" && auth.role === "Doctor" && (
            <DoctorDashboard
              assignedPatients={rolePatients.length}
              upcomingAppointments={roleAppointments.length}
              treatmentsWritten={roleTreatments.length}
            />
          )}

          {activePage === "patients" && auth.role === "Admin" && (
            <PatientsPage
              patients={rolePatients}
              onCreate={patients.create}
              onUpdate={patients.update}
              onDelete={patients.remove}
            />
          )}
          {activePage === "doctors" && auth.role === "Admin" && (
            <DoctorsPage
              doctors={doctors.items}
              onCreate={doctors.create}
              onUpdate={doctors.update}
              onDelete={doctors.remove}
            />
          )}
          {activePage === "appointments" && auth.role === "Admin" && (
            <AppointmentsPage
              appointments={roleAppointments}
              patients={patients.items}
              doctors={doctors.items}
              onCreate={appointments.create}
              onUpdate={appointments.update}
              onDelete={appointments.remove}
            />
          )}
          {activePage === "treatments" && auth.role === "Admin" && (
            <TreatmentsPage
              treatments={roleTreatments}
              patients={patients.items}
              doctors={doctors.items}
              onCreate={treatments.create}
              onUpdate={treatments.update}
              onDelete={treatments.remove}
            />
          )}
          {activePage === "billing" && auth.role === "Admin" && (
            <BillingPage
              bills={roleBills}
              patients={patients.items}
              doctors={doctors.items}
              treatments={treatments.items}
              onCreate={bills.create}
              onUpdate={bills.update}
              onDelete={bills.remove}
            />
          )}

          {activePage === "my-appointments" && auth.role === "Patient" && (
            <PatientAppointments appointments={roleAppointments} />
          )}
          {activePage === "my-diagnosis" && auth.role === "Patient" && (
            <PatientDiagnosis treatments={roleTreatments} />
          )}
          {activePage === "my-medications" && auth.role === "Patient" && (
            <PatientMedicationTimetable medications={roleMedications} />
          )}
          {activePage === "my-bills" && auth.role === "Patient" && (
            <PatientBills bills={roleBills} />
          )}
          {activePage === "recommended-doctors" && auth.role === "Patient" && (
            <PatientDoctorRecommendation
              doctors={doctors.items}
              patientId={auth.user?.patient ?? 0}
              onCreateAppointment={appointments.create}
            />
          )}

          {activePage === "assigned-patients" && auth.role === "Doctor" && (
            <DoctorAssignedPatients patients={rolePatients} />
          )}
          {activePage === "doctor-appointments" && auth.role === "Doctor" && (
            <DoctorAppointmentsManager
              appointments={roleAppointments}
              onUpdateStatus={async (id, status) => {
                const row = roleAppointments.find((a) => a.id === id)
                if (!row) return
                await appointments.update(id, {
                  patient: row.patient,
                  doctor: row.doctor,
                  appointment_date: row.appointment_date,
                  status,
                  notes: row.notes || "",
                })
              }}
            />
          )}
          {activePage === "doctor-treatments" && auth.role === "Doctor" && auth.user?.doctor && (
            <DoctorTreatmentsManager
              treatments={roleTreatments}
              patients={rolePatients}
              doctorId={auth.user.doctor}
              onCreate={treatments.create}
              onUpdate={treatments.update}
            />
          )}
        </div>
      </main>
    </div>
  )
}
