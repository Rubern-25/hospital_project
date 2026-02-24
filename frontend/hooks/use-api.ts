"use client"

import { useState, useCallback, useEffect } from "react"
import type {
  Patient, PatientInput, Doctor, DoctorInput,
  Appointment, AppointmentInput, Treatment, TreatmentInput,
  Bill, BillInput, DashboardStats, Medication, MedicationInput,
} from "@/lib/api"
import {
  patientsApi, doctorsApi, appointmentsApi,
  treatmentsApi, billsApi, dashboardApi, medicationsApi,
} from "@/lib/api"
import {
  mockPatients, mockDoctors, mockAppointments,
  mockTreatments, mockBills, mockDashboardStats, mockMedications,
} from "@/lib/mock-data"

// Set this to true when your Django backend is running
const USE_LIVE_API = process.env.NEXT_PUBLIC_USE_LIVE_API === "true"

function useResource<T extends { id: number }, TInput>(
  mockData: T[],
  api: {
    list: () => Promise<T[]>
    create: (data: TInput) => Promise<T>
    update: (id: number, data: TInput) => Promise<T>
    delete: (id: number) => Promise<void>
  }
) {
  const [items, setItems] = useState<T[]>(mockData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    if (!USE_LIVE_API) return
    setLoading(true)
    setError(null)
    try {
      const data = await api.list()
      setItems(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch")
    } finally {
      setLoading(false)
    }
  }, [api])

  useEffect(() => {
    refresh()
  }, [refresh])

  const create = useCallback(async (data: TInput) => {
    setError(null)
    if (!USE_LIVE_API) {
      const newItem = { ...data, id: Math.max(0, ...items.map(i => i.id)) + 1 } as unknown as T
      setItems(prev => [...prev, newItem])
      return newItem
    }
    try {
      const created = await api.create(data)
      setItems(prev => [...prev, created])
      return created
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create")
      throw e
    }
  }, [api, items])

  const update = useCallback(async (id: number, data: TInput) => {
    setError(null)
    if (!USE_LIVE_API) {
      setItems(prev => prev.map(item => item.id === id ? { ...item, ...data } : item))
      return { ...data, id } as unknown as T
    }
    try {
      const updated = await api.update(id, data)
      setItems(prev => prev.map(item => item.id === id ? updated : item))
      return updated
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update")
      throw e
    }
  }, [api])

  const remove = useCallback(async (id: number) => {
    setError(null)
    if (!USE_LIVE_API) {
      setItems(prev => prev.filter(item => item.id !== id))
      return
    }
    try {
      await api.delete(id)
      setItems(prev => prev.filter(item => item.id !== id))
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete")
      throw e
    }
  }, [api])

  return { items, loading, error, refresh, create, update, remove }
}

export function usePatients() {
  return useResource<Patient, PatientInput>(mockPatients, patientsApi)
}

export function useDoctors() {
  return useResource<Doctor, DoctorInput>(mockDoctors, doctorsApi)
}

export function useAppointments() {
  return useResource<Appointment, AppointmentInput>(mockAppointments, appointmentsApi)
}

export function useTreatments() {
  return useResource<Treatment, TreatmentInput>(mockTreatments, treatmentsApi)
}

export function useBills() {
  return useResource<Bill, BillInput>(mockBills, billsApi)
}

export function useMedications() {
  return useResource<Medication, MedicationInput>(mockMedications, medicationsApi)
}

export function useDashboard() {
  const [stats, setStats] = useState<DashboardStats>(mockDashboardStats)
  const [loading] = useState(false)

  const refresh = useCallback(async () => {
    if (!USE_LIVE_API) return
    try {
      const liveStats = await dashboardApi.stats()
      setStats(liveStats)
    } catch {
      // silent
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { stats, loading, refresh }
}
