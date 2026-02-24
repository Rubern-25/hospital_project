"use client"

import { useMemo, useState } from "react"
import type { AppointmentInput, Doctor } from "@/lib/api"
import { doctorsApi } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const USE_LIVE_API = process.env.NEXT_PUBLIC_USE_LIVE_API === "true"

interface PatientDoctorRecommendationProps {
  doctors: Doctor[]
  patientId: number
  onCreateAppointment: (data: AppointmentInput) => Promise<unknown>
}

export function PatientDoctorRecommendation({
  doctors,
  patientId,
  onCreateAppointment,
}: PatientDoctorRecommendationProps) {
  const [problem, setProblem] = useState("")
  const [searchResults, setSearchResults] = useState<Doctor[]>([])
  const [requestingDoctor, setRequestingDoctor] = useState<Doctor | null>(null)
  const [appointmentDate, setAppointmentDate] = useState("")
  const [notes, setNotes] = useState("")
  const [submitting, setSubmitting] = useState(false)

  // For patients, only show verified doctors (backend filters when live; for mock filter by is_verified !== false)
  const availableDoctors = useMemo(() => {
    return doctors.filter((d) => d.is_verified !== false)
  }, [doctors])

  const localSearchResults = useMemo(() => {
    const term = problem.toLowerCase()
    if (!term) return availableDoctors
    return availableDoctors.filter((doc) => {
      return (
        doc.specialization.toLowerCase().includes(term) ||
        (term.includes("head") && doc.specialization === "Neurology") ||
        (term.includes("heart") && doc.specialization === "Cardiology") ||
        (term.includes("skin") && doc.specialization === "Dermatology") ||
        (term.includes("bone") && doc.specialization === "Orthopedics") ||
        (term.includes("child") && doc.specialization === "Pediatrics")
      )
    })
  }, [availableDoctors, problem])

  async function findDoctor() {
    if (!problem.trim()) {
      setSearchResults(availableDoctors)
      return
    }
    if (USE_LIVE_API) {
      const recommended = await doctorsApi.recommended(problem)
      setSearchResults(recommended)
      return
    }
    setSearchResults(localSearchResults)
  }

  const displayList = problem.trim() && searchResults.length > 0
    ? searchResults
    : problem.trim()
      ? searchResults
      : availableDoctors

  async function submitRequest() {
    if (!requestingDoctor || !appointmentDate) return
    setSubmitting(true)
    try {
      await onCreateAppointment({
        patient: patientId,
        doctor: requestingDoctor.id,
        appointment_date: new Date(appointmentDate).toISOString(),
        status: "Pending",
        notes: notes.trim() || undefined,
      })
      setRequestingDoctor(null)
      setAppointmentDate("")
      setNotes("")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Available doctors</CardTitle>
          <p className="text-sm text-muted-foreground">
            Only verified doctors are shown. Request an appointment; the doctor can accept or reject it.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Input
              placeholder="Find by problem, e.g. headache, chest pain, skin rash"
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              className="max-w-sm"
            />
            <Button onClick={findDoctor} variant="secondary">
              Find by problem
            </Button>
            {problem && (
              <Button variant="ghost" onClick={() => { setProblem(""); setSearchResults([]) }}>
                Show all
              </Button>
            )}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {displayList.map((doctor) => (
              <div
                key={doctor.id}
                className="flex flex-col justify-between rounded-lg border p-4"
              >
                <div>
                  <p className="font-medium">{doctor.name}</p>
                  <p className="text-sm text-muted-foreground">{doctor.specialization}</p>
                  <p className="text-xs text-muted-foreground">{doctor.phone}</p>
                </div>
                <Button
                  className="mt-3 w-fit"
                  size="sm"
                  onClick={() => {
                    setRequestingDoctor(doctor)
                    setAppointmentDate("")
                    setNotes("")
                  }}
                >
                  Request appointment
                </Button>
              </div>
            ))}
          </div>
          {displayList.length === 0 && (
            <p className="text-sm text-muted-foreground">
              {availableDoctors.length === 0
                ? "No verified doctors available yet. Ask an admin to verify doctors."
                : "No doctors match your search. Try different keywords or show all."}
            </p>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!requestingDoctor} onOpenChange={() => setRequestingDoctor(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request appointment</DialogTitle>
            <DialogDescription>
              {requestingDoctor && (
                <>With {requestingDoctor.name} ({requestingDoctor.specialization}). The doctor will accept or reject your request.</>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Date and time</Label>
              <Input
                type="datetime-local"
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Notes (optional)</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Brief reason for visit"
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRequestingDoctor(null)}>
              Cancel
            </Button>
            <Button
              disabled={!appointmentDate || submitting}
              onClick={submitRequest}
            >
              {submitting ? "Sending..." : "Send request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
