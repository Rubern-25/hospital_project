"use client"

import {
  LayoutDashboard,
  Users,
  Stethoscope,
  CalendarDays,
  ClipboardList,
  Receipt,
  Activity,
  ChevronLeft,
  ChevronRight,
  Pill,
  LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { UserRole } from "@/lib/api"

export type ActivePage =
  | "dashboard"
  | "patients"
  | "doctors"
  | "appointments"
  | "treatments"
  | "billing"
  | "my-appointments"
  | "my-diagnosis"
  | "my-medications"
  | "my-bills"
  | "recommended-doctors"
  | "assigned-patients"
  | "doctor-appointments"
  | "doctor-treatments"

interface AppSidebarProps {
  activePage: ActivePage
  onNavigate: (page: ActivePage) => void
  collapsed: boolean
  onToggleCollapse: () => void
  role: UserRole
  onLogout: () => void
}

const adminNav: { id: ActivePage; label: string; icon: React.ElementType }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "patients", label: "Patients", icon: Users },
  { id: "doctors", label: "Doctors", icon: Stethoscope },
  { id: "appointments", label: "Appointments", icon: CalendarDays },
  { id: "treatments", label: "Treatments", icon: ClipboardList },
  { id: "billing", label: "Billing", icon: Receipt },
]

const patientNav: { id: ActivePage; label: string; icon: React.ElementType }[] = [
  { id: "dashboard", label: "My Dashboard", icon: LayoutDashboard },
  { id: "my-appointments", label: "My Appointments", icon: CalendarDays },
  { id: "my-diagnosis", label: "Diagnosis", icon: ClipboardList },
  { id: "my-medications", label: "Drug Timetable", icon: Pill },
  { id: "my-bills", label: "My Bills", icon: Receipt },
  { id: "recommended-doctors", label: "Find Doctor", icon: Stethoscope },
]

const doctorNav: { id: ActivePage; label: string; icon: React.ElementType }[] = [
  { id: "dashboard", label: "My Dashboard", icon: LayoutDashboard },
  { id: "assigned-patients", label: "Assigned Patients", icon: Users },
  { id: "doctor-appointments", label: "Appointments", icon: CalendarDays },
  { id: "doctor-treatments", label: "Treatments & Rx", icon: ClipboardList },
]

export function AppSidebar({
  activePage,
  onNavigate,
  collapsed,
  onToggleCollapse,
  role,
  onLogout,
}: AppSidebarProps) {
  const navItems = role === "Admin" ? adminNav : role === "Doctor" ? doctorNav : patientNav

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-30 flex h-screen flex-col bg-sidebar text-sidebar-foreground transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary">
          <Activity className="h-5 w-5 text-sidebar-primary-foreground" />
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-tight">HPMS</span>
            <span className="text-xs text-sidebar-foreground/60">Hospital Management</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
        <ul className="flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activePage === item.id
            return (
              <li key={item.id}>
                <button
                  onClick={() => onNavigate(item.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Collapse Toggle */}
      <div className="border-t border-sidebar-border p-3">
        <button
          onClick={onLogout}
          className={cn(
            "mb-2 flex w-full items-center justify-center gap-2 rounded-lg py-2 text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            collapsed ? "px-0" : "px-3"
          )}
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
        <button
          onClick={onToggleCollapse}
          className="flex w-full items-center justify-center rounded-lg py-2 text-sidebar-foreground/60 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </button>
      </div>
    </aside>
  )
}
