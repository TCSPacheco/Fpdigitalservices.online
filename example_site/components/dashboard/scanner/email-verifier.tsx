"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Mail, CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react"

interface EmailResult {
  email: string
  valid: boolean
  format_valid: boolean
  domain_exists: boolean
  is_disposable: boolean
  is_role_based: boolean
  risk_level: "low" | "medium" | "high"
  suggestions: string[]
  domain_info: {
    domain: string
    provider: string | null
    has_mx: boolean
  }
}

export function EmailVerifier() {
  const [email, setEmail] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [result, setResult] = useState<EmailResult | null>(null)

  const handleVerify = async () => {
    if (!email) return
    setIsVerifying(true)
    setResult(null)

    try {
      const res = await fetch("/api/scanner/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      })
      const data = await res.json()
      setResult(data)
    } catch (err) {
      console.error("[v0] Error verifying email:", err)
    } finally {
      setIsVerifying(false)
    }
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case "low": return "text-green-600 bg-green-100"
      case "medium": return "text-yellow-600 bg-yellow-100"
      case "high": return "text-red-600 bg-red-100"
      default: return "text-gray-600 bg-gray-100"
    }
  }

  const getRiskLabel = (level: string) => {
    switch (level) {
      case "low": return "Bajo"
      case "medium": return "Medio"
      case "high": return "Alto"
      default: return level
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <Input
          type="email"
          placeholder="ejemplo@dominio.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleVerify()}
        />
        <Button onClick={handleVerify} disabled={isVerifying || !email}>
          {isVerifying ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Mail className="mr-2 h-4 w-4" />
              Verificar
            </>
          )}
        </Button>
      </div>

      {result && (
        <div className="space-y-4">
          {/* Overall Result */}
          <div className={`rounded-lg p-4 ${
            result.valid 
              ? "bg-green-50 border border-green-200" 
              : "bg-red-50 border border-red-200"
          }`}>
            <div className="flex items-center gap-3">
              {result.valid ? (
                <CheckCircle className="h-8 w-8 text-green-600" />
              ) : (
                <XCircle className="h-8 w-8 text-red-600" />
              )}
              <div>
                <h3 className={`font-semibold ${result.valid ? "text-green-800" : "text-red-800"}`}>
                  {result.valid ? "Correo Valido" : "Correo No Valido"}
                </h3>
                <p className={`text-sm ${result.valid ? "text-green-600" : "text-red-600"}`}>
                  {result.email}
                </p>
              </div>
            </div>
          </div>

          {/* Risk Level */}
          <div className="rounded-lg border border-border p-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-foreground">Nivel de Riesgo</h4>
              <span className={`rounded-full px-3 py-1 text-sm font-medium ${getRiskColor(result.risk_level)}`}>
                {getRiskLabel(result.risk_level)}
              </span>
            </div>
          </div>

          {/* Checks */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-border p-4">
              <h4 className="mb-3 font-medium text-foreground">Verificaciones</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  {result.format_valid ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                  <span>Formato valido</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  {result.domain_exists ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                  <span>Dominio existe</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  {result.domain_info.has_mx ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                  <span>Acepta correos (MX)</span>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-border p-4">
              <h4 className="mb-3 font-medium text-foreground">Advertencias</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  {result.is_disposable ? (
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                  ) : (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  )}
                  <span className={result.is_disposable ? "text-orange-700" : ""}>
                    {result.is_disposable ? "Correo temporal" : "No es correo temporal"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  {result.is_role_based ? (
                    <Info className="h-4 w-4 text-blue-600" />
                  ) : (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  )}
                  <span className={result.is_role_based ? "text-blue-700" : ""}>
                    {result.is_role_based ? "Correo de rol (info@, admin@)" : "Correo personal"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Domain Info */}
          <div className="rounded-lg border border-border p-4">
            <h4 className="mb-3 font-medium text-foreground">Informacion del Dominio</h4>
            <div className="space-y-2 text-sm">
              <p><strong>Dominio:</strong> {result.domain_info.domain}</p>
              {result.domain_info.provider && (
                <p><strong>Proveedor:</strong> {result.domain_info.provider}</p>
              )}
            </div>
          </div>

          {/* Suggestions */}
          {result.suggestions.length > 0 && (
            <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
              <h4 className="mb-2 flex items-center gap-2 font-medium text-orange-800">
                <Info className="h-4 w-4" />
                Sugerencias
              </h4>
              <ul className="space-y-1">
                {result.suggestions.map((suggestion, i) => (
                  <li key={i} className="text-sm text-orange-700">• {suggestion}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
