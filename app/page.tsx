"use client"

import { useState } from "react"
import { TicketForm } from "@/components/ticket-form"
import { TicketSuccess } from "@/components/ticket-success"
import { problems } from "@/lib/categories"

export default function HomePage() {
  const [step, setStep] = useState(1)
  const [selectedProblem, setSelectedProblem] = useState("")
  const [ticketData, setTicketData] = useState<{
    ticketNumber: string
    clientName: string
    clientEmail: string
  } | null>(null)

  const handleProblemSelect = (problem: string) => {
    setSelectedProblem(problem)
    setStep(2)
  }

  const handleFormComplete = (data: { ticketNumber: string; clientName: string; clientEmail: string }) => {
    setTicketData(data)
    setStep(3)
  }

  const handleReset = () => {
    setStep(1)
    setSelectedProblem("")
    setTicketData(null)
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-5xl px-4 py-4">
          <div className="flex items-center gap-4">
            <img
              src="/logo.jpg"
              alt="FP Digital Services Logo"
              className="h-14 w-auto"
            />
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-foreground">Soporte Tecnico</h1>
              <p className="text-sm text-muted-foreground">Sistema de Tickets</p>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="border-b border-border bg-card/50">
        <div className="mx-auto max-w-5xl px-4 py-4">
          <div className="flex items-center justify-center gap-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                    step >= s
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {s}
                </div>
                {s < 3 && (
                  <div className={`mx-3 h-0.5 w-8 ${step > s ? "bg-primary" : "bg-muted"}`} />
                )}
              </div>
            ))}
          </div>
          <div className="mt-2 text-center text-sm text-muted-foreground">
            {step === 1 && "Selecciona tu problema"}
            {step === 2 && "Completa tus datos"}
            {step === 3 && "Ticket generado"}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-5xl px-4 py-8">
        {/* Step 1: Problem Selection */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground text-balance">Como podemos ayudarte?</h2>
              <p className="mt-2 text-muted-foreground">
                Selecciona el problema que mejor describe tu situacion
              </p>
            </div>
            <div className="mx-auto max-w-2xl space-y-3">
              {problems.map((problem) => (
                <button
                  key={problem}
                  onClick={() => handleProblemSelect(problem)}
                  className="w-full rounded-lg border border-border bg-card p-4 text-left transition-all hover:border-primary hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  <span className="text-foreground">{problem}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Contact Form */}
        {step === 2 && (
          <div className="mx-auto max-w-2xl space-y-6">
            <div className="text-center">
              <button
                onClick={() => setStep(1)}
                className="mb-4 text-sm text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-ring rounded"
              >
                &larr; Volver a problemas
              </button>
              <h2 className="text-2xl font-bold text-foreground">Completa tus datos</h2>
              <p className="mt-2 text-muted-foreground">
                Necesitamos tu informacion para crear el ticket de soporte
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="mb-6 rounded-lg bg-muted/50 p-4">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Problema:</strong> {selectedProblem}
                </p>
              </div>
              <TicketForm
                category="Soporte General"
                categoryName="Soporte General"
                problemType={selectedProblem}
                onSuccess={handleFormComplete}
              />
            </div>
          </div>
        )}

        {/* Step 3: Success */}
        {step === 3 && ticketData && (
          <TicketSuccess
            ticketNumber={ticketData.ticketNumber}
            clientName={ticketData.clientName}
            clientEmail={ticketData.clientEmail}
            onCreateNew={handleReset}
          />
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-auto">
        <div className="mx-auto max-w-5xl px-4 py-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} FP Digital Services. Todos los derechos reservados.
            </p>
            <a
              href="mailto:gerencia@fpdigitalservices.online"
              className="text-sm text-primary hover:underline"
            >
              gerencia@fpdigitalservices.online
            </a>
          </div>
        </div>
      </footer>
    </main>
  )
}
