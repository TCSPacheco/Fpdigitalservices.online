"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"

interface TicketFormProps {
  category: string
  categoryName: string
  problemType: string
  onSuccess: (data: { ticketNumber: string; clientName: string; clientEmail: string }) => void
}

function generateTicketNumber(): string {
  const prefix = "FP"
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `${prefix}-${timestamp}-${random}`
}

export function TicketForm({ category, categoryName, problemType, onSuccess }: TicketFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    description: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const supabase = createClient()
      const ticketNumber = generateTicketNumber()

      // Insert ticket into database
      const { error: insertError } = await supabase.from("tickets").insert({
        ticket_number: ticketNumber,
        client_name: formData.name,
        client_email: formData.email,
        client_phone: formData.phone || null,
        category: category,
        problem_type: problemType,
        description: formData.description,
        priority: "media",
        status: "nuevo"
      })

      if (insertError) {
        throw insertError
      }

      // Send email notification
      await fetch("/api/send-ticket-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticketNumber,
          clientName: formData.name,
          clientEmail: formData.email,
          clientPhone: formData.phone,
          category: categoryName,
          problemType,
          description: formData.description
        })
      })

      onSuccess({
        ticketNumber,
        clientName: formData.name,
        clientEmail: formData.email
      })
    } catch (err) {
      console.error("[v0] Error creating ticket:", err)
      setError("Error al crear el ticket. Por favor intenta de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nombre completo *</Label>
        <Input
          id="name"
          type="text"
          required
          placeholder="Tu nombre"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Correo electronico *</Label>
        <Input
          id="email"
          type="email"
          required
          placeholder="tu@email.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Telefono (opcional)</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+1 809 555 1234"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descripcion del problema *</Label>
        <Textarea
          id="description"
          required
          placeholder="Describe tu problema con mas detalle..."
          rows={4}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
            Creando ticket...
          </>
        ) : (
          "Crear Ticket de Soporte"
        )}
      </Button>
    </form>
  )
}
