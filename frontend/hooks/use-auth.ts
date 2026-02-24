"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { authApi, type AuthUser, type RegisterInput } from "@/lib/api"
import { mockCredentials } from "@/lib/mock-data"

const USE_LIVE_API = process.env.NEXT_PUBLIC_USE_LIVE_API === "true"
const MOCK_AUTH_KEY = "hpms_mock_user"

interface LoginInput {
  username: string
  password: string
}

export function useAuthState() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadUser = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      if (USE_LIVE_API) {
        const me = await authApi.me()
        setUser(me)
      } else {
        const stored = window.localStorage.getItem(MOCK_AUTH_KEY)
        setUser(stored ? (JSON.parse(stored) as AuthUser) : null)
      }
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadUser()
  }, [loadUser])

  const login = useCallback(async ({ username, password }: LoginInput) => {
    setError(null)
    if (USE_LIVE_API) {
      try {
        const liveUser = await authApi.login(username, password)
        setUser(liveUser)
        return liveUser
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Login failed"
        setError(msg)
        throw e
      }
    }

    const matched = mockCredentials.find((c) => c.username === username && c.password === password)
    if (!matched) {
      const msg = "Invalid credentials"
      setError(msg)
      throw new Error(msg)
    }
    setUser(matched.user)
    window.localStorage.setItem(MOCK_AUTH_KEY, JSON.stringify(matched.user))
    return matched.user
  }, [])

  const register = useCallback(async (data: RegisterInput) => {
    setError(null)
    if (!USE_LIVE_API) {
      setError("Registration is only available when connected to the server. Enable live API.")
      throw new Error("Registration requires live API")
    }
    try {
      const liveUser = await authApi.register(data)
      setUser(liveUser)
      return liveUser
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Registration failed"
      setError(msg)
      throw e
    }
  }, [])

  const logout = useCallback(async () => {
    setError(null)
    if (USE_LIVE_API) {
      try {
        await authApi.logout()
      } finally {
        setUser(null)
      }
      return
    }
    window.localStorage.removeItem(MOCK_AUTH_KEY)
    setUser(null)
  }, [])

  const role = useMemo(() => user?.role ?? null, [user])
  const isAuthenticated = useMemo(() => Boolean(user), [user])

  return {
    user,
    role,
    loading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    refresh: loadUser,
    useLiveApi: USE_LIVE_API,
  }
}
