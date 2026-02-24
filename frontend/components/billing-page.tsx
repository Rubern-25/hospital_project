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
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import type { Bill, BillInput, Doctor, Patient, Treatment } from "@/lib/api"
import { formatTzs } from "@/lib/currency"

interface BillingPageProps {
  bills: Bill[]
  patients: Patient[]
  doctors: Doctor[]
  treatments: Treatment[]
  onCreate: (data: BillInput) => Promise<Bill>
  onUpdate: (id: number, data: BillInput) => Promise<Bill>
  onDelete: (id: number) => Promise<void>
}

export function BillingPage({ bills, patients, doctors, treatments, onCreate, onUpdate, onDelete }: BillingPageProps) {
  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Bill | null>(null)
  const [form, setForm] = useState<BillInput>({
    patient: 0, doctor: null, treatment: null, amount: "", bill_date: "", status: "Pending", description: "",
  })

  const filtered = bills.filter((b) => {
    const term = search.toLowerCase()
    return (
      (b.patient_name || "").toLowerCase().includes(term) ||
      b.status.toLowerCase().includes(term) ||
      (b.description || "").toLowerCase().includes(term)
    )
  })

  const totalPaid = bills.filter(b => b.status === "Paid").reduce((sum, b) => sum + parseFloat(b.amount), 0)
  const totalPending = bills.filter(b => b.status === "Pending").reduce((sum, b) => sum + parseFloat(b.amount), 0)

  function openCreate() {
    setEditing(null)
    setForm({
      patient: patients[0]?.id || 0,
      doctor: doctors[0]?.id || null,
      treatment: null,
      amount: "",
      bill_date: "",
      status: "Pending",
      description: "",
    })
    setDialogOpen(true)
  }

  function openEdit(bill: Bill) {
    setEditing(bill)
    setForm({
      patient: bill.patient,
      doctor: bill.doctor || null,
      treatment: bill.treatment || null,
      amount: bill.amount,
      bill_date: bill.bill_date,
      status: bill.status,
      description: bill.description,
    })
    setDialogOpen(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const payload = {
      ...form,
      patient_name: patients.find(p => p.id === form.patient)
        ? `${patients.find(p => p.id === form.patient)!.first_name} ${patients.find(p => p.id === form.patient)!.last_name}`
        : "",
    }
    if (editing) await onUpdate(editing.id, payload)
    else await onCreate(payload)
    setDialogOpen(false)
  }

  async function handleDelete(id: number) {
    if (confirm("Delete this bill?")) await onDelete(id)
  }

  const statusColor = (status: string) => {
    if (status === "Paid") return "bg-success text-success-foreground"
    if (status === "Pending") return "bg-warning text-warning-foreground"
    return "bg-destructive text-destructive-foreground"
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Billing</h1>
          <p className="text-sm text-muted-foreground">{bills.length} total bills</p>
        </div>
        <Button onClick={openCreate} className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" /> Create Bill
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-muted-foreground">Total Paid</p>
            <p className="text-2xl font-bold text-success">{formatTzs(totalPaid)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-muted-foreground">Total Pending</p>
            <p className="text-2xl font-bold text-warning">{formatTzs(totalPending)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-muted-foreground">Grand Total</p>
            <p className="text-2xl font-bold text-card-foreground">{formatTzs(totalPaid + totalPending)}</p>
          </CardContent>
        </Card>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search bills..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        {search && (
          <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-card-foreground">Bill Records</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Patient</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Doctor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Service</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((bill) => (
                  <tr key={bill.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                    <td className="px-6 py-4 text-sm font-medium text-card-foreground">{bill.patient_name}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{bill.doctor_name || "-"}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{bill.treatment_diagnosis || "-"}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground max-w-[200px] truncate">{bill.description || "-"}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-card-foreground">{formatTzs(bill.amount)}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{bill.bill_date}</td>
                    <td className="px-6 py-4">
                      <Badge className={statusColor(bill.status)}>{bill.status}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => openEdit(bill)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => handleDelete(bill.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={8} className="px-6 py-12 text-center text-sm text-muted-foreground">No bills found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Bill" : "Create Bill"}</DialogTitle>
            <DialogDescription>{editing ? "Update bill information." : "Create a new bill for a patient."}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label>Doctor</Label>
                <Select value={String(form.doctor || "")} onValueChange={(v) => setForm({ ...form, doctor: v ? Number(v) : null })}>
                  <SelectTrigger><SelectValue placeholder="Select doctor" /></SelectTrigger>
                  <SelectContent>
                    {doctors.map((d) => (
                      <SelectItem key={d.id} value={String(d.id)}>{d.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Service (Treatment)</Label>
                <Select value={String(form.treatment || "")} onValueChange={(v) => setForm({ ...form, treatment: v ? Number(v) : null })}>
                  <SelectTrigger><SelectValue placeholder="Optional service" /></SelectTrigger>
                  <SelectContent>
                    {treatments.map((t) => (
                      <SelectItem key={t.id} value={String(t.id)}>{t.patient_name} - {t.diagnosis}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label>Amount (TZS)</Label>
                <Input type="number" step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as Bill["status"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Paid">Paid</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Bill Date</Label>
              <Input type="date" value={form.bill_date} onChange={(e) => setForm({ ...form, bill_date: e.target.value })} required />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Description</Label>
              <Input value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Optional description" />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-primary text-primary-foreground">{editing ? "Update" : "Create Bill"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
