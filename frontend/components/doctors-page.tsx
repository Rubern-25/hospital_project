"use client"

import { useState } from "react"
import { Plus, Search, Pencil, Trash2, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import type { Doctor, DoctorInput } from "@/lib/api"

interface DoctorsPageProps {
  doctors: Doctor[]
  onCreate: (data: DoctorInput) => Promise<Doctor>
  onUpdate: (id: number, data: DoctorInput) => Promise<Doctor>
  onDelete: (id: number) => Promise<void>
}

const emptyForm: DoctorInput = { name: "", specialization: "", phone: "", email: "", is_verified: false }

export function DoctorsPage({ doctors, onCreate, onUpdate, onDelete }: DoctorsPageProps) {
  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Doctor | null>(null)
  const [form, setForm] = useState<DoctorInput>(emptyForm)

  const filtered = doctors.filter((d) => d.is_verified === true)

  function openCreate() {
    setEditing(null)
    setForm(emptyForm)
    setDialogOpen(true)
  }

  function openEdit(doctor: Doctor) {
    setEditing(doctor)
    setForm({
      name: doctor.name,
      specialization: doctor.specialization,
      phone: doctor.phone,
      email: doctor.email ?? "",
      is_verified: doctor.is_verified ?? false,
    })
    setDialogOpen(true)
  }

  async function toggleVerified(doctor: Doctor) {
    await onUpdate(doctor.id, {
      name: doctor.name,
      specialization: doctor.specialization,
      phone: doctor.phone,
      email: doctor.email ?? "",
      is_verified: !(doctor.is_verified ?? false),
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (editing) await onUpdate(editing.id, form)
    else await onCreate(form)
    setDialogOpen(false)
  }

  async function handleDelete(id: number) {
    if (confirm("Are you sure you want to delete this doctor?")) await onDelete(id)
  }

  const specColors: Record<string, string> = {
    Cardiology: "bg-chart-5 text-destructive-foreground",
    Neurology: "bg-primary text-primary-foreground",
    Pediatrics: "bg-success text-success-foreground",
    Orthopedics: "bg-chart-4 text-warning-foreground",
    Dermatology: "bg-accent text-accent-foreground",
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Doctors</h1>
          <p className="text-sm text-muted-foreground">{doctors.length} registered doctors</p>
        </div>
        <Button onClick={openCreate} className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" /> Add Doctor
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search doctors..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        {search && (
          <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((doctor) => (
          <Card key={doctor.id} className="group relative overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    {doctor.name.split(" ").slice(-1)[0][0]}
                  </div>
                  <div>
                    <CardTitle className="text-base text-card-foreground">{doctor.name}</CardTitle>
                    <div className="flex flex-wrap items-center gap-1.5 mt-1">
                      <Badge className={specColors[doctor.specialization] || "bg-secondary text-secondary-foreground"}>
                        {doctor.specialization}
                      </Badge>
                      <Badge variant={doctor.is_verified ? "default" : "outline"} className="text-xs">
                        {doctor.is_verified ? "Verified" : "Unverified"}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs text-muted-foreground hover:text-foreground"
                    onClick={() => toggleVerified(doctor)}
                  >
                    {doctor.is_verified ? "Unverify" : "Verify"}
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => openEdit(doctor)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => handleDelete(doctor.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-1 text-sm text-muted-foreground">
              <p>Phone: {doctor.phone}</p>
              {doctor.email && <p>Email: {doctor.email}</p>}
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full py-12 text-center text-sm text-muted-foreground">
            No doctors found
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Doctor" : "Add New Doctor"}</DialogTitle>
            <DialogDescription>{editing ? "Update doctor information." : "Enter the doctor's details."}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="specialization">Specialization</Label>
              <Input id="specialization" value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={form.email || ""} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
            </div>
            {editing && (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="verified"
                  checked={!!form.is_verified}
                  onChange={(e) => setForm({ ...form, is_verified: e.target.checked })}
                  className="h-4 w-4 rounded border-input"
                />
                <Label htmlFor="verified">Verified (visible to patients)</Label>
              </div>
            )}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-primary text-primary-foreground">{editing ? "Update" : "Add Doctor"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
