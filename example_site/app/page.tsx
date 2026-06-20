"use client"

import { useState } from "react"
import Image from "next/image"
import { TicketForm } from "@/components/ticket-form"
import { TicketSuccess } from "@/components/ticket-success"
import { Shield, Monitor, GraduationCap, Wifi, ChevronRight } from "lucide-react"

const categories = [
  {
    id: "soporte-tecnico",
    name: "Soporte Tecnico",
    description: "Problemas con computadoras, software, hardware",
    icon: Monitor,
    problems: [
      "Mi computadora no enciende",
      "Pantalla azul o errores del sistema",
      "El equipo esta muy lento",
      "Problemas con impresora",
      "Instalacion de software",
      "Recuperacion de datos",
      "Otro problema de hardware/software"
    ]
  },
  {
    id: "ciberseguridad",
    name: "Ciberseguridad",
    description: "Amenazas, malware, vulnerabilidades",
    icon: Shield,
    problems: [
      "Creo que tengo un virus o malware",
      "Recibi un correo sospechoso (phishing)",
      "Mi cuenta fue hackeada",
      "Necesito analisis de seguridad",
      "Configuracion de antivirus",
      "Auditoria de seguridad",
      "Otro problema de seguridad"
    ]
  },
  {
    id: "capacitacion",
    name: "Capacitacion",
    description: "Solicitudes de cursos y entrenamientos",
    icon: GraduationCap,
    problems: [
      "Curso de ciberseguridad basica",
      "Capacitacion en Microsoft Office",
      "Entrenamiento para empleados",
      "Certificaciones profesionales",
      "Curso personalizado",
      "Otro tipo de capacitacion"
    ]
  },
  {
    id: "redes-internet",
    name: "Redes e Internet",
    description: "Problemas de conectividad y redes",
    icon: Wifi,
    problems: [
      "No tengo conexion a internet",
      "Internet muy lento",
      "Problemas con WiFi",
      "Configuracion de router",
      "Red empresarial",
      "VPN o acceso remoto",
      "Otro problema de red"
    ]
  }
]

export default function HomePage() {
  const [step, setStep] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState<typeof categories[0] | null>(null)
  const [selectedProblem, setSelectedProblem] = useState("")
  const [ticketData, setTicketData] = useState<{
    ticketNumber: string
    clientName: string
    clientEmail: string
  } | null>(null)

  const handleCategorySelect = (category: typeof categories[0]) => {
    setSelectedCategory(category)
    setStep(2)
  }

  const handleProblemSelect = (problem: string) => {
    setSelectedProblem(problem)
    setStep(3)
  }

  const handleFormComplete = (data: { ticketNumber: string; clientName: string; clientEmail: string }) => {
    setTicketData(data)
    setStep(4)
  }

  const handleReset = () => {
    setStep(1)
    setSelectedCategory(null)
    setSelectedProblem("")
    setTicketData(null)
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <div className="flex items-center gap-4">
            <Image
              src="/images/logo.jpg"
              alt="FP Digital Services"
              width={60}
              height={60}
              className="rounded-lg"
            />
            <div>
              <h1 className="text-xl font-bold text-foreground">FP Digital Services</h1>
              <p className="text-sm text-muted-foreground">Soporte Tecnico y Ciberseguridad</p>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="border-b border-border bg-card/50">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3, 4].map((s) => (
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
                {s < 4 && (
                  <ChevronRight className={`mx-2 h-4 w-4 ${step > s ? "text-primary" : "text-muted-foreground"}`} />
                )}
              </div>
            ))}
          </div>
          <div className="mt-2 text-center text-sm text-muted-foreground">
            {step === 1 && "Selecciona la categoria del problema"}
            {step === 2 && "Describe tu problema"}
            {step === 3 && "Completa tus datos"}
            {step === 4 && "Ticket generado"}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Step 1: Category Selection */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground">Como podemos ayudarte?</h2>
              <p className="mt-2 text-muted-foreground">
                Selecciona la categoria que mejor describe tu problema
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {categories.map((category) => {
                const Icon = category.icon
                return (
                  <button
                    key={category.id}
                    onClick={() => handleCategorySelect(category)}
                    className="group flex items-start gap-4 rounded-xl border border-border bg-card p-6 text-left transition-all hover:border-primary hover:shadow-lg"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{category.name}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{category.description}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Step 2: Problem Selection */}
        {step === 2 && selectedCategory && (
          <div className="space-y-6">
            <div className="text-center">
              <button
                onClick={() => setStep(1)}
                className="mb-4 text-sm text-primary hover:underline"
              >
                &larr; Volver a categorias
              </button>
              <h2 className="text-2xl font-bold text-foreground">{selectedCategory.name}</h2>
              <p className="mt-2 text-muted-foreground">
                Selecciona el problema que estas experimentando
              </p>
            </div>
            <div className="mx-auto max-w-2xl space-y-3">
              {selectedCategory.problems.map((problem) => (
                <button
                  key={problem}
                  onClick={() => handleProblemSelect(problem)}
                  className="w-full rounded-lg border border-border bg-card p-4 text-left transition-all hover:border-primary hover:bg-primary/5"
                >
                  <span className="text-foreground">{problem}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Contact Form */}
        {step === 3 && selectedCategory && (
          <div className="mx-auto max-w-2xl space-y-6">
            <div className="text-center">
              <button
                onClick={() => setStep(2)}
                className="mb-4 text-sm text-primary hover:underline"
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
                  <strong className="text-foreground">Categoria:</strong> {selectedCategory.name}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  <strong className="text-foreground">Problema:</strong> {selectedProblem}
                </p>
              </div>
              <TicketForm
                category={selectedCategory.id}
                categoryName={selectedCategory.name}
                problemType={selectedProblem}
                onSuccess={handleFormComplete}
              />
            </div>
          </div>
        )}

        {/* Step 4: Success */}
        {step === 4 && ticketData && (
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
        <div className="mx-auto max-w-6xl px-4 py-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-muted-foreground">
              &copy; 2026 FP Digital Services. Todos los derechos reservados.
            </p>
            <a
              href="/empleados/login"
              className="text-sm text-primary hover:underline"
            >
              Acceso Empleados
            </a>
          </div>
        </div>
      </footer>
    </main>
  )
}
