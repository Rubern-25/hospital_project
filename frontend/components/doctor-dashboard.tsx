"use client"

import { CalendarDays, Users, ClipboardList } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface DoctorDashboardProps {
  assignedPatients: number
  upcomingAppointments: number
  treatmentsWritten: number
}

export function DoctorDashboard({
  assignedPatients,
  upcomingAppointments,
  treatmentsWritten,
}: DoctorDashboardProps) {
  const cards = [
    { label: "Assigned Patients", value: assignedPatients, icon: Users },
    { label: "Appointments", value: upcomingAppointments, icon: CalendarDays },
    { label: "Treatments / Prescriptions", value: treatmentsWritten, icon: ClipboardList },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <Card key={card.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">{card.label}</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <p className="text-2xl font-bold">{card.value}</p>
              <Icon className="h-5 w-5 text-primary" />
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
