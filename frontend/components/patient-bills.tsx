"use client"

import type { Bill } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatTzs } from "@/lib/currency"

export function PatientBills({ bills }: { bills: Bill[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Bills</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {bills.map((bill) => (
          <div key={bill.id} className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
            <div>
              <p className="text-sm font-medium">{bill.description || "Medical service"}</p>
              <p className="text-xs text-muted-foreground">Doctor: {bill.doctor_name || "-"}</p>
              <p className="text-xs text-muted-foreground">Service: {bill.treatment_diagnosis || "-"}</p>
              <p className="text-xs text-muted-foreground">{bill.bill_date}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold">{formatTzs(bill.amount)}</p>
              <Badge variant="secondary">{bill.status}</Badge>
            </div>
          </div>
        ))}
        {bills.length === 0 && <p className="text-sm text-muted-foreground">No bills available.</p>}
      </CardContent>
    </Card>
  )
}
