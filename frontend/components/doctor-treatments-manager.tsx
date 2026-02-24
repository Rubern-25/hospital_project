"use client"

import { useState } from "react"
import type { Patient, Treatment, TreatmentInput } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DoctorTreatmentsManagerProps {
  treatments: Treatment[]
  patients: Patient[]
  doctorId: number
  onCreate: (data: TreatmentInput) => Promise<unknown>
  onUpdate: (id: number, data: TreatmentInput) => Promise<unknown>
}

const initialForm: TreatmentInput = {
  patient: 0,
  doctor: 0,
  diagnosis: "",
  prescription: "",
  treatment_date: "",
}

export function DoctorTreatmentsManager({
  treatments,
  patients,
  doctorId,
  onCreate,
  onUpdate,
}: DoctorTreatmentsManagerProps) {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Treatment | null>(null)
  const [form, setForm] = useState<TreatmentInput>({ ...initialForm, doctor: doctorId })

  function startCreate() {
    setEditing(null)
    setForm({ ...initialForm, doctor: doctorId, patient: patients[0]?.id || 0 })
    setOpen(true)
  }

  function startEdit(row: Treatment) {
    setEditing(row)
    setForm({
      patient: row.patient,
      doctor: doctorId,
      diagnosis: row.diagnosis,
      prescription: row.prescription,
      treatment_date: row.treatment_date,
    })
    setOpen(true)
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (editing) await onUpdate(editing.id, form)
    else await onCreate(form)
    setOpen(false)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Treatments & Prescriptions</CardTitle>
        <Button onClick={startCreate}>Add Treatment</Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {treatments.map((item) => (
          <div key={item.id} className="rounded-lg border p-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium">{item.patient_name}</p>
                <p className="text-xs text-muted-foreground">{item.treatment_date}</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => startEdit(item)}>
                Edit
              </Button>
            </div>
            <p className="mt-2 text-sm"><span className="font-medium">Diagnosis:</span> {item.diagnosis}</p>
            <p className="text-sm"><span className="font-medium">Prescription:</span> {item.prescription}</p>
          </div>
        ))}
        {treatments.length === 0 && <p className="text-sm text-muted-foreground">No treatment records yet.</p>}
      </CardContent>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit treatment" : "Create treatment"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={submit} className="space-y-3">
            <div className="space-y-2">
              <Label>Patient</Label>
              <Select value={String(form.patient)} onValueChange={(v) => setForm({ ...form, patient: Number(v) })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {patients.map((p) => (
                    <SelectItem key={p.id} value={String(p.id)}>
                      {p.first_name} {p.last_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Diagnosis</Label>
              <Textarea value={form.diagnosis} onChange={(e) => setForm({ ...form, diagnosis: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>Prescription</Label>
              <Textarea value={form.prescription} onChange={(e) => setForm({ ...form, prescription: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>Treatment date</Label>
              <Input type="date" value={form.treatment_date} onChange={(e) => setForm({ ...form, treatment_date: e.target.value })} required />
            </div>
            <Button type="submit">{editing ? "Update" : "Create"}</Button>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
