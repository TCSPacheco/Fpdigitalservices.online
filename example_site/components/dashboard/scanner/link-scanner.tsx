"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Shield, AlertTriangle, CheckCircle, Info } from "lucide-react"

interface ScanResult {
  url: string
  safe: boolean
  score: number
  risks: string[]
  details: {
    ssl: boolean
    domain_age: string
    suspicious_patterns: string[]
    redirects: number
  }
}

export function LinkScanner() {
  const [url, setUrl] = useState("")
  const [isScanning, setIsScanning] = useState(false)
  const [result, setResult] = useState<ScanResult | null>(null)

  const handleScan = async () => {
    if (!url) return
    setIsScanning(true)
    setResult(null)

    try {
      const res = await fetch("/api/scanner/link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url })
      })
      const data = await res.json()
      setResult(data)
    } catch (err) {
      console.error("[v0] Error scanning link:", err)
    } finally {
      setIsScanning(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <Input
          placeholder="https://ejemplo.com/pagina"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleScan()}
        />
        <Button onClick={handleScan} disabled={isScanning || !url}>
          {isScanning ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Shield className="mr-2 h-4 w-4" />
              Escanear
            </>
          )}
        </Button>
      </div>

      {result && (
        <div className="space-y-4">
          {/* Overall Result */}
          <div className={`rounded-lg p-4 ${
            result.safe 
              ? "bg-green-50 border border-green-200" 
              : "bg-red-50 border border-red-200"
          }`}>
            <div className="flex items-center gap-3">
              {result.safe ? (
                <CheckCircle className="h-8 w-8 text-green-600" />
              ) : (
                <AlertTriangle className="h-8 w-8 text-red-600" />
              )}
              <div>
                <h3 className={`font-semibold ${result.safe ? "text-green-800" : "text-red-800"}`}>
                  {result.safe ? "Link Seguro" : "Riesgo Detectado"}
                </h3>
                <p className={`text-sm ${result.safe ? "text-green-600" : "text-red-600"}`}>
                  Puntuacion de seguridad: {result.score}/100
                </p>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-border p-4">
              <h4 className="mb-2 font-medium text-foreground">Certificado SSL</h4>
              <div className="flex items-center gap-2">
                {result.details.ssl ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-600">Valido</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <span className="text-sm text-red-600">No detectado</span>
                  </>
                )}
              </div>
            </div>

            <div className="rounded-lg border border-border p-4">
              <h4 className="mb-2 font-medium text-foreground">Antiguedad del Dominio</h4>
              <p className="text-sm text-muted-foreground">{result.details.domain_age}</p>
            </div>

            <div className="rounded-lg border border-border p-4">
              <h4 className="mb-2 font-medium text-foreground">Redirecciones</h4>
              <p className="text-sm text-muted-foreground">{result.details.redirects} detectadas</p>
            </div>

            <div className="rounded-lg border border-border p-4">
              <h4 className="mb-2 font-medium text-foreground">URL Analizada</h4>
              <p className="text-sm text-muted-foreground break-all">{result.url}</p>
            </div>
          </div>

          {/* Risks */}
          {result.risks.length > 0 && (
            <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
              <h4 className="mb-2 flex items-center gap-2 font-medium text-orange-800">
                <Info className="h-4 w-4" />
                Riesgos Detectados
              </h4>
              <ul className="space-y-1">
                {result.risks.map((risk, i) => (
                  <li key={i} className="text-sm text-orange-700">• {risk}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Suspicious Patterns */}
          {result.details.suspicious_patterns.length > 0 && (
            <div className="rounded-lg border border-border p-4">
              <h4 className="mb-2 font-medium text-foreground">Patrones Sospechosos</h4>
              <div className="flex flex-wrap gap-2">
                {result.details.suspicious_patterns.map((pattern, i) => (
                  <span key={i} className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                    {pattern}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
