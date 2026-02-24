"use client"

import type { Appointment } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface DoctorAppointmentsManagerProps {
  appointments: Appointment[]
  onUpdateStatus: (id: number, status: Appointment["status"]) => Promise<unknown>
}

export function DoctorAppointmentsManager({ appointments, onUpdateStatus }: DoctorAppointmentsManagerProps) {
  const pending = appointments.filter((a) => a.status === "Pending")
  const scheduledOrCompleted = appointments.filter((a) => a.status !== "Pending")

  return (
    <div className="space-y-6">
      {pending.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Pending requests
              <Badge variant="secondary">{pending.length}</Badge>
            </CardTitle>
            <p className="text-sm text-muted-foreground">Accept or reject appointment requests from patients.</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {pending.map((apt) => (
              <div
                key={apt.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-amber-500/30 bg-amber-500/5 p-3"
              >
                <div>
                  <p className="font-medium">{apt.patient_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(apt.appointment_date).toLocaleString()}
                  </p>
                  {apt.notes && (
                    <p className="mt-1 text-xs text-muted-foreground">Note: {apt.notes}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => onUpdateStatus(apt.id, "Scheduled")}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Accept
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onUpdateStatus(apt.id, "Cancelled")}
                  >
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All appointments</CardTitle>
          <p className="text-sm text-muted-foreground">Scheduled, completed, and cancelled.</p>
        </CardHeader>
        <CardContent className="space-y-3">
          {scheduledOrCompleted.map((apt) => (
            <div
              key={apt.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-muted/50 p-3"
            >
              <div>
                <p className="font-medium">{apt.patient_name}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(apt.appointment_date).toLocaleString()}
                </p>
                <Badge
                  variant={apt.status === "Scheduled" ? "default" : apt.status === "Completed" ? "secondary" : "destructive"}
                  className="mt-1"
                >
                  {apt.status}
                </Badge>
              </div>
              {apt.status === "Scheduled" && (
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => onUpdateStatus(apt.id, "Completed")}>
                    Mark completed
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => onUpdateStatus(apt.id, "Cancelled")}>
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          ))}
          {appointments.length === 0 && (
            <p className="text-sm text-muted-foreground">No appointments yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
