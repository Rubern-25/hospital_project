"use client"

import { CalendarDays, Receipt, Stethoscope, Pill } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface PatientDashboardProps {
  appointmentCount: number
  diagnosisCount: number
  medicationCount: number
  pendingBillCount: number
}

export function PatientDashboard({
  appointmentCount,
  diagnosisCount,
  medicationCount,
  pendingBillCount,
}: PatientDashboardProps) {
  const cards = [
    { label: "My Appointments", value: appointmentCount, icon: CalendarDays },
    { label: "Diagnoses", value: diagnosisCount, icon: Stethoscope },
    { label: "Drug Schedule Items", value: medicationCount, icon: Pill },
    { label: "Pending Bills", value: pendingBillCount, icon: Receipt },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <Card key={card.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{card.label}</CardTitle>
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
