"use client"

import type { Medication } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const slotOrder = ["Morning", "Afternoon", "Evening", "Night"] as const

export function PatientMedicationTimetable({ medications }: { medications: Medication[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {slotOrder.map((slot) => {
        const rows = medications.filter((m) => m.time_of_day === slot)
        return (
          <Card key={slot}>
            <CardHeader>
              <CardTitle>{slot}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {rows.map((med) => (
                <div key={med.id} className="rounded-lg bg-muted/50 p-3">
                  <p className="text-sm font-medium">{med.medication_name}</p>
                  <p className="text-xs text-muted-foreground">{med.dosage} - {med.frequency}</p>
                  <p className="text-xs text-muted-foreground">By {med.doctor_name}</p>
                </div>
              ))}
              {rows.length === 0 && <p className="text-sm text-muted-foreground">No medication in this time slot.</p>}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
