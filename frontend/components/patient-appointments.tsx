"use client"

import type { Appointment } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function PatientAppointments({ appointments }: { appointments: Appointment[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Appointments</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {appointments.map((item) => (
          <div key={item.id} className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
            <div>
              <p className="text-sm font-medium">{item.doctor_name}</p>
              <p className="text-xs text-muted-foreground">{new Date(item.appointment_date).toLocaleString()}</p>
              {item.notes && <p className="text-xs text-muted-foreground">{item.notes}</p>}
            </div>
            <Badge>{item.status}</Badge>
          </div>
        ))}
        {appointments.length === 0 && <p className="text-sm text-muted-foreground">No appointments found.</p>}
      </CardContent>
    </Card>
  )
}
