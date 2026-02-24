"use client"

import type { Patient } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function DoctorAssignedPatients({ patients }: { patients: Patient[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Assigned Patients</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {patients.map((patient) => (
          <div key={patient.id} className="rounded-lg border p-3">
            <p className="text-sm font-medium">
              {patient.first_name} {patient.last_name}
            </p>
            <p className="text-xs text-muted-foreground">{patient.phone}</p>
          </div>
        ))}
        {patients.length === 0 && <p className="text-sm text-muted-foreground">No assigned patients.</p>}
      </CardContent>
    </Card>
  )
}
