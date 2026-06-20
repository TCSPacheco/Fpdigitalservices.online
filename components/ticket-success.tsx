"use client"

import { CheckCircle2, Copy, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface TicketSuccessProps {
  ticketNumber: string
  clientName: string
  clientEmail: string
  onCreateNew: () => void
}

export function TicketSuccess({ ticketNumber, clientName, clientEmail, onCreateNew }: TicketSuccessProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(ticketNumber)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="mx-auto max-w-lg text-center">
      <div className="mb-6 flex justify-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success/10">
          <CheckCircle2 className="h-10 w-10 text-success" />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-foreground">Ticket Creado Exitosamente</h2>
      <p className="mt-2 text-muted-foreground">
        Gracias {clientName}, hemos recibido tu solicitud de soporte.
      </p>

      <div className="mt-6 rounded-xl border border-border bg-card p-6">
        <p className="text-sm text-muted-foreground">Tu numero de ticket</p>
        <div className="mt-2 flex items-center justify-center gap-2">
          <code className="text-2xl font-bold text-primary">{ticketNumber}</code>
          <button
            onClick={handleCopy}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            title="Copiar numero"
            aria-label="Copiar numero de ticket"
          >
            <Copy className="h-5 w-5" />
          </button>
        </div>
        {copied && (
          <p className="mt-2 text-sm text-success">Copiado al portapapeles</p>
        )}
      </div>

      <div className="mt-6 rounded-lg bg-muted/50 p-4">
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Mail className="h-4 w-4" />
          <span>
            Hemos enviado los detalles a <strong className="text-foreground">{clientEmail}</strong>
          </span>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <p className="text-sm text-muted-foreground">
          Nuestro equipo revisara tu solicitud y te contactara pronto.
        </p>
        <Button onClick={onCreateNew} variant="outline" className="w-full">
          Crear otro ticket
        </Button>
      </div>
    </div>
  )
}
