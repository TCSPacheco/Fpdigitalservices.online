"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Shield } from "lucide-react"

export default function EmployeeLoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const supabase = createClient()
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      })

      if (signInError) {
        throw signInError
      }

      router.push("/empleados/dashboard")
      router.refresh()
    } catch (err: unknown) {
      console.error("[v0] Login error:", err)
      const errorMessage = err instanceof Error ? err.message : "Error al iniciar sesion"
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Image
            src="/images/logo.jpg"
            alt="FP Digital Services"
            width={80}
            height={80}
            className="mx-auto rounded-lg"
          />
          <h1 className="mt-4 text-2xl font-bold text-foreground">FP Digital Services</h1>
          <p className="mt-1 text-muted-foreground">Panel de Empleados</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-lg">
          <div className="mb-6 flex items-center justify-center gap-2 text-primary">
            <Shield className="h-5 w-5" />
            <span className="font-medium">Acceso Restringido</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo electronico</Label>
              <Input
                id="email"
                type="email"
                required
                placeholder="empleado@fpdigitalservices.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contrasena</Label>
              <Input
                id="password"
                type="password"
                required
                placeholder="********"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            {error && (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Iniciando sesion...
                </>
              ) : (
                "Iniciar Sesion"
              )}
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          <a href="/" className="hover:underline">
            &larr; Volver al inicio
          </a>
        </p>
      </div>
    </main>
  )
}
