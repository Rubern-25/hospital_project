"use client"

import { useState } from "react"
import { Plus, Search, Pencil, Trash2, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Patient, PatientInput } from "@/lib/api"

interface PatientsPageProps {
  patients: Patient[]
  onCreate: (data: PatientInput) => Promise<Patient>
  onUpdate: (id: number, data: PatientInput) => Promise<Patient>
  onDelete: (id: number) => Promise<void>
}

const emptyForm: PatientInput = {
  first_name: "",
  last_name: "",
  gender: "Male",
  date_of_birth: "",
  phone: "",
  address: "",
}

export function PatientsPage({ patients, onCreate, onUpdate, onDelete }: PatientsPageProps) {
  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Patient | null>(null)
  const [form, setForm] = useState<PatientInput>(emptyForm)

  const filtered = patients.filter((p) => {
    const term = search.toLowerCase()
    return (
      p.first_name.toLowerCase().includes(term) ||
      p.last_name.toLowerCase().includes(term) ||
      p.phone.includes(term)
    )
  })

  function openCreate() {
    setEditing(null)
    setForm(emptyForm)
    setDialogOpen(true)
  }

  function openEdit(patient: Patient) {
    setEditing(patient)
    setForm({
      first_name: patient.first_name,
      last_name: patient.last_name,
      gender: patient.gender,
      date_of_birth: patient.date_of_birth,
      phone: patient.phone,
      address: patient.address,
    })
    setDialogOpen(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (editing) {
      await onUpdate(editing.id, form)
    } else {
      await onCreate(form)
    }
    setDialogOpen(false)
  }

  async function handleDelete(id: number) {
    if (confirm("Are you sure you want to delete this patient?")) {
      await onDelete(id)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Patients</h1>
          <p className="text-sm text-muted-foreground">{patients.length} registered patients</p>
        </div>
        <Button onClick={openCreate} className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" /> Add Patient
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search patients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
        {search && (
          <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-card-foreground">Patient Records</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Gender</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Date of Birth</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Address</th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((patient) => (
                  <tr key={patient.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                          {patient.first_name[0]}{patient.last_name[0]}
                        </div>
                        <span className="text-sm font-medium text-card-foreground">{patient.first_name} {patient.last_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="secondary" className="bg-secondary text-secondary-foreground">{patient.gender}</Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{patient.date_of_birth}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{patient.phone}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground max-w-[200px] truncate">{patient.address}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(patient)} className="h-8 w-8 text-muted-foreground hover:text-foreground">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(patient.id)} className="h-8 w-8 text-muted-foreground hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-sm text-muted-foreground">
                      No patients found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Patient" : "Add New Patient"}</DialogTitle>
            <DialogDescription>
              {editing ? "Update the patient's information." : "Enter the patient's details to register them."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="first_name">First Name</Label>
                <Input id="first_name" value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} required />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="last_name">Last Name</Label>
                <Input id="last_name" value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="gender">Gender</Label>
                <Select value={form.gender} onValueChange={(v) => setForm({ ...form, gender: v })}>
                  <SelectTrigger id="gender"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input id="dob" type="date" value={form.date_of_birth} onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })} required />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-primary text-primary-foreground">{editing ? "Update" : "Add Patient"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
