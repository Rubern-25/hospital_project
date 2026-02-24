"use client"

import type { Treatment } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function PatientDiagnosis({ treatments }: { treatments: Treatment[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Diagnosis & Treatment Notes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {treatments.map((item) => (
          <div key={item.id} className="rounded-lg border p-3">
            <p className="text-sm font-semibold">{item.diagnosis}</p>
            <p className="text-xs text-muted-foreground">Doctor: {item.doctor_name}</p>
            <p className="text-xs text-muted-foreground">Date: {item.treatment_date}</p>
            <p className="mt-1 text-sm">{item.prescription}</p>
          </div>
        ))}
        {treatments.length === 0 && <p className="text-sm text-muted-foreground">No diagnosis records found.</p>}
      </CardContent>
    </Card>
  )
}
