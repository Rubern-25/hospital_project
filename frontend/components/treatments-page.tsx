"use client"

import { useState } from "react"
import { Plus, Search, Pencil, Trash2, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import type { Treatment, TreatmentInput, Patient, Doctor } from "@/lib/api"

interface TreatmentsPageProps {
  treatments: Treatment[]
  patients: Patient[]
  doctors: Doctor[]
  onCreate: (data: TreatmentInput) => Promise<Treatment>
  onUpdate: (id: number, data: TreatmentInput) => Promise<Treatment>
  onDelete: (id: number) => Promise<void>
}

export function TreatmentsPage({ treatments, patients, doctors, onCreate, onUpdate, onDelete }: TreatmentsPageProps) {
  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Treatment | null>(null)
  const [form, setForm] = useState<TreatmentInput>({
    patient: 0, doctor: 0, diagnosis: "", prescription: "", treatment_date: "",
  })

  const filtered = treatments.filter((t) => {
    const term = search.toLowerCase()
    return (
      (t.patient_name || "").toLowerCase().includes(term) ||
      t.diagnosis.toLowerCase().includes(term) ||
      t.prescription.toLowerCase().includes(term)
    )
  })

  function openCreate() {
    setEditing(null)
    setForm({ patient: patients[0]?.id || 0, doctor: doctors[0]?.id || 0, diagnosis: "", prescription: "", treatment_date: "" })
    setDialogOpen(true)
  }

  function openEdit(t: Treatment) {
    setEditing(t)
    setForm({ patient: t.patient, doctor: t.doctor, diagnosis: t.diagnosis, prescription: t.prescription, treatment_date: t.treatment_date })
    setDialogOpen(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const payload = {
      ...form,
      patient_name: patients.find(p => p.id === form.patient)
        ? `${patients.find(p => p.id === form.patient)!.first_name} ${patients.find(p => p.id === form.patient)!.last_name}`
        : "",
      doctor_name: doctors.find(d => d.id === form.doctor)?.name || "",
    }
    if (editing) await onUpdate(editing.id, payload)
    else await onCreate(payload)
    setDialogOpen(false)
  }

  async function handleDelete(id: number) {
    if (confirm("Delete this treatment record?")) await onDelete(id)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Treatments</h1>
          <p className="text-sm text-muted-foreground">{treatments.length} treatment records</p>
        </div>
        <Button onClick={openCreate} className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" /> Add Treatment
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search treatments..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        {search && (
          <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-card-foreground">Treatment Records</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Patient</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Doctor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Diagnosis</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Prescription</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Date</th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => (
                  <tr key={t.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                    <td className="px-6 py-4 text-sm font-medium text-card-foreground">{t.patient_name}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{t.doctor_name}</td>
                    <td className="px-6 py-4 text-sm text-card-foreground max-w-[200px] truncate">{t.diagnosis}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground max-w-[200px] truncate">{t.prescription}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{t.treatment_date}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => openEdit(t)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => handleDelete(t.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={6} className="px-6 py-12 text-center text-sm text-muted-foreground">No treatment records found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Treatment" : "Add Treatment"}</DialogTitle>
            <DialogDescription>{editing ? "Update treatment record." : "Record a new treatment."}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label>Patient</Label>
                <Select value={String(form.patient)} onValueChange={(v) => setForm({ ...form, patient: Number(v) })}>
                  <SelectTrigger><SelectValue placeholder="Select patient" /></SelectTrigger>
                  <SelectContent>
                    {patients.map((p) => (
                      <SelectItem key={p.id} value={String(p.id)}>{p.first_name} {p.last_name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Doctor</Label>
                <Select value={String(form.doctor)} onValueChange={(v) => setForm({ ...form, doctor: Number(v) })}>
                  <SelectTrigger><SelectValue placeholder="Select doctor" /></SelectTrigger>
                  <SelectContent>
                    {doctors.map((d) => (
                      <SelectItem key={d.id} value={String(d.id)}>{d.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Diagnosis</Label>
              <Textarea value={form.diagnosis} onChange={(e) => setForm({ ...form, diagnosis: e.target.value })} required rows={2} />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Prescription</Label>
              <Textarea value={form.prescription} onChange={(e) => setForm({ ...form, prescription: e.target.value })} required rows={2} />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Treatment Date</Label>
              <Input type="date" value={form.treatment_date} onChange={(e) => setForm({ ...form, treatment_date: e.target.value })} required />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-primary text-primary-foreground">{editing ? "Update" : "Add Treatment"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
