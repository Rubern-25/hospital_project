"use client"

import { useState } from "react"
import { Plus, Search, Pencil, Trash2, X } from "lucide-react"

function formatDateTime(dateStr: string): string {
  const d = new Date(dateStr)
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const hours = d.getHours()
  const minutes = d.getMinutes().toString().padStart(2, "0")
  const ampm = hours >= 12 ? "PM" : "AM"
  const h = hours % 12 || 12
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()} ${h}:${minutes} ${ampm}`
}
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import type { Appointment, AppointmentInput, Patient, Doctor } from "@/lib/api"

interface AppointmentsPageProps {
  appointments: Appointment[]
  patients: Patient[]
  doctors: Doctor[]
  onCreate: (data: AppointmentInput) => Promise<Appointment>
  onUpdate: (id: number, data: AppointmentInput) => Promise<Appointment>
  onDelete: (id: number) => Promise<void>
}

export function AppointmentsPage({ appointments, patients, doctors, onCreate, onUpdate, onDelete }: AppointmentsPageProps) {
  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Appointment | null>(null)
  const [form, setForm] = useState<AppointmentInput>({
    patient: 0, doctor: 0, appointment_date: "", status: "Scheduled", notes: "",
  })

  const filtered = appointments.filter((a) => {
    const term = search.toLowerCase()
    return (
      (a.patient_name || "").toLowerCase().includes(term) ||
      (a.doctor_name || "").toLowerCase().includes(term) ||
      a.status.toLowerCase().includes(term)
    )
  })

  function openCreate() {
    setEditing(null)
    setForm({ patient: patients[0]?.id || 0, doctor: doctors[0]?.id || 0, appointment_date: "", status: "Scheduled", notes: "" })
    setDialogOpen(true)
  }

  function openEdit(apt: Appointment) {
    setEditing(apt)
    setForm({ patient: apt.patient, doctor: apt.doctor, appointment_date: apt.appointment_date.slice(0, 16), status: apt.status, notes: apt.notes })
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
    if (confirm("Delete this appointment?")) await onDelete(id)
  }

  const statusColor = (status: string) => {
    if (status === "Scheduled") return "bg-primary text-primary-foreground"
    if (status === "Completed") return "bg-success text-success-foreground"
    return "bg-destructive text-destructive-foreground"
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Appointments</h1>
          <p className="text-sm text-muted-foreground">{appointments.length} total appointments</p>
        </div>
        <Button onClick={openCreate} className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" /> Schedule Appointment
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search appointments..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        {search && (
          <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-card-foreground">Appointment Schedule</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Patient</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Doctor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Date & Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Notes</th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((apt) => (
                  <tr key={apt.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                    <td className="px-6 py-4 text-sm font-medium text-card-foreground">{apt.patient_name}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{apt.doctor_name}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {formatDateTime(apt.appointment_date)}
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={statusColor(apt.status)}>{apt.status}</Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground max-w-[200px] truncate">{apt.notes || "-"}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => openEdit(apt)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => handleDelete(apt.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={6} className="px-6 py-12 text-center text-sm text-muted-foreground">No appointments found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Appointment" : "Schedule Appointment"}</DialogTitle>
            <DialogDescription>{editing ? "Update appointment details." : "Schedule a new appointment."}</DialogDescription>
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
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label>Date & Time</Label>
                <Input type="datetime-local" value={form.appointment_date} onChange={(e) => setForm({ ...form, appointment_date: e.target.value })} required />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as Appointment["status"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Scheduled">Scheduled</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Notes</Label>
              <Input value={form.notes || ""} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Optional notes" />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-primary text-primary-foreground">{editing ? "Update" : "Schedule"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
