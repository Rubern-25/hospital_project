"use client"

import { createContext, useContext } from "react"
import { useAuthState } from "@/hooks/use-auth"

type AuthContextValue = ReturnType<typeof useAuthState>

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const value = useAuthState()
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
