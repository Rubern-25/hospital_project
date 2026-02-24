"use client"

import { Users, Stethoscope, CalendarDays, Receipt } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { DashboardStats } from "@/lib/api"
import { formatTzs } from "@/lib/currency"

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
}

interface DashboardProps {
  stats: DashboardStats
}

const statCards = [
  { key: "total_patients" as const, label: "Total Patients", icon: Users, color: "bg-primary" },
  { key: "total_doctors" as const, label: "Total Doctors", icon: Stethoscope, color: "bg-accent" },
  { key: "total_appointments" as const, label: "Appointments", icon: CalendarDays, color: "bg-chart-4" },
  { key: "pending_bills" as const, label: "Pending Bills", icon: Receipt, color: "bg-destructive" },
]

export function Dashboard({ stats }: DashboardProps) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of hospital operations</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon
          const value = stats[stat.key]
          return (
            <Card key={stat.key} className="relative overflow-hidden">
              <CardContent className="flex items-center gap-4 p-6">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${stat.color}`}>
                  <Icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold text-card-foreground">{value}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Revenue Card */}
      <Card>
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
            <p className="text-3xl font-bold text-card-foreground">{formatTzs(stats.revenue)}</p>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-success">
            <Receipt className="h-7 w-7 text-success-foreground" />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Patients */}
        <Card>
          <CardHeader>
            <CardTitle className="text-card-foreground">Recent Patients</CardTitle>
            <CardDescription>Latest patient registrations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {stats.recent_patients.map((patient) => (
                <div
                  key={patient.id}
                  className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                      {patient.first_name[0]}{patient.last_name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-card-foreground">
                        {patient.first_name} {patient.last_name}
                      </p>
                      <p className="text-xs text-muted-foreground">{patient.phone}</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                    {patient.gender}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="text-card-foreground">Upcoming Appointments</CardTitle>
            <CardDescription>Scheduled for today and tomorrow</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {stats.recent_appointments.map((apt) => (
                <div
                  key={apt.id}
                  className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-card-foreground">{apt.patient_name}</p>
                    <p className="text-xs text-muted-foreground">{apt.doctor_name}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <p className="text-xs text-muted-foreground">
                      {formatDate(apt.appointment_date)}
                    </p>
                    <Badge
                      className={
                        apt.status === "Scheduled"
                          ? "bg-primary text-primary-foreground"
                          : apt.status === "Completed"
                          ? "bg-success text-success-foreground"
                          : "bg-destructive text-destructive-foreground"
                      }
                    >
                      {apt.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
