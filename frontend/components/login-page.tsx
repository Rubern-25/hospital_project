"use client"

import { useState } from "react"
import { Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { mockCredentials } from "@/lib/mock-data"
import type { RegisterInput, RegisterRole } from "@/lib/api"

interface LoginPageProps {
  onLogin: (input: { username: string; password: string }) => Promise<unknown>
  onRegister: (data: RegisterInput) => Promise<unknown>
  error: string | null
  useLiveApi: boolean
}

const defaultPatientForm: RegisterInput = {
  role: "Patient",
  username: "",
  password: "",
  first_name: "",
  last_name: "",
  phone: "",
  gender: "Other",
  date_of_birth: "",
  address: "",
}

const defaultDoctorForm: RegisterInput = {
  role: "Doctor",
  username: "",
  password: "",
  first_name: "",
  last_name: "",
  phone: "",
  specialization: "",
  email: "",
}

export function LoginPage({ onLogin, onRegister, error, useLiveApi }: LoginPageProps) {
  const [showRegister, setShowRegister] = useState(false)
  const [username, setUsername] = useState("admin_demo")
  const [password, setPassword] = useState("admin123")
  const [loading, setLoading] = useState(false)
  const [registerForm, setRegisterForm] = useState<RegisterInput>(defaultPatientForm)

  async function submitLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await onLogin({ username: username.trim(), password: password.trim() })
    } finally {
      setLoading(false)
    }
  }

  async function submitRegister(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const isDoctor = registerForm.role === "Doctor"
      await onRegister({
        role: registerForm.role || "Patient",
        username: registerForm.username.trim(),
        password: registerForm.password.trim(),
        first_name: registerForm.first_name.trim(),
        last_name: registerForm.last_name.trim(),
        phone: registerForm.phone.trim(),
        ...(isDoctor
          ? { specialization: (registerForm.specialization || "").trim(), email: (registerForm.email || "").trim() }
          : {
              gender: registerForm.gender || "Other",
              date_of_birth: registerForm.date_of_birth || "",
              address: (registerForm.address || "").trim(),
            }),
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>{showRegister ? "Create account" : "Hospital Login"}</CardTitle>
              <CardDescription>
                {showRegister
                  ? "Register as a patient or doctor (doctors need admin verification)"
                  : "Sign in as Admin, Doctor, or Patient"}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {!showRegister ? (
            <>
              <form onSubmit={submitLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Signing in..." : "Sign in"}
                </Button>
              </form>
              <p className="mt-4 text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  className="font-medium text-primary underline-offset-4 hover:underline"
                  onClick={() => {
                    setShowRegister(true)
                    setRegisterForm(defaultPatientForm)
                  }}
                >
                  Register
                </button>
              </p>
            </>
          ) : (
            <>
              <form onSubmit={submitRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label>I am a</Label>
                  <Select
                    value={registerForm.role || "Patient"}
                    onValueChange={(v: RegisterRole) => {
                      setRegisterForm(v === "Doctor" ? defaultDoctorForm : defaultPatientForm)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Patient">Patient (book appointments)</SelectItem>
                      <SelectItem value="Doctor">Doctor (admin will verify you)</SelectItem>
                    </SelectContent>
                  </Select>
                  {registerForm.role === "Doctor" && (
                    <p className="text-xs text-muted-foreground">
                      After registering, an admin must verify you before patients can see you.
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="reg-first_name">First name</Label>
                    <Input
                      id="reg-first_name"
                      value={registerForm.first_name}
                      onChange={(e) => setRegisterForm({ ...registerForm, first_name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-last_name">Last name</Label>
                    <Input
                      id="reg-last_name"
                      value={registerForm.last_name}
                      onChange={(e) => setRegisterForm({ ...registerForm, last_name: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-username">Username</Label>
                  <Input
                    id="reg-username"
                    value={registerForm.username}
                    onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-password">Password</Label>
                  <Input
                    id="reg-password"
                    type="password"
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-phone">Phone</Label>
                  <Input
                    id="reg-phone"
                    value={registerForm.phone}
                    onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                    required
                  />
                </div>
                {registerForm.role === "Doctor" ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="reg-specialization">Specialization</Label>
                      <Input
                        id="reg-specialization"
                        value={registerForm.specialization || ""}
                        onChange={(e) => setRegisterForm({ ...registerForm, specialization: e.target.value })}
                        placeholder="e.g. Cardiology, Neurology"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-email">Email (optional)</Label>
                      <Input
                        id="reg-email"
                        type="email"
                        value={registerForm.email || ""}
                        onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                        placeholder="doctor@hospital.com"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="reg-gender">Gender</Label>
                      <Select
                        value={registerForm.gender || "Other"}
                        onValueChange={(v) => setRegisterForm({ ...registerForm, gender: v })}
                      >
                        <SelectTrigger id="reg-gender">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-dob">Date of birth</Label>
                      <Input
                        id="reg-dob"
                        type="date"
                        value={registerForm.date_of_birth || ""}
                        onChange={(e) => setRegisterForm({ ...registerForm, date_of_birth: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-address">Address</Label>
                      <Input
                        id="reg-address"
                        value={registerForm.address || ""}
                        onChange={(e) => setRegisterForm({ ...registerForm, address: e.target.value })}
                        required
                      />
                    </div>
                  </>
                )}
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Creating account..." : "Create account"}
                </Button>
              </form>
              <p className="mt-4 text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <button
                  type="button"
                  className="font-medium text-primary underline-offset-4 hover:underline"
                  onClick={() => setShowRegister(false)}
                >
                  Sign in
                </button>
              </p>
            </>
          )}

          {!showRegister && (
            <div className="mt-5 rounded-lg bg-muted/60 p-3 text-xs text-muted-foreground">
              <p className="font-medium">{useLiveApi ? "Live session auth" : "Demo credentials"}</p>
              <ul className="mt-2 space-y-1">
                {mockCredentials.map((item) => (
                  <li key={item.username} className="flex items-center justify-between gap-2">
                    <span>
                      {item.username} / {item.password}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-6 text-[10px]"
                      onClick={() => {
                        setUsername(item.username)
                        setPassword(item.password)
                      }}
                    >
                      Use
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
