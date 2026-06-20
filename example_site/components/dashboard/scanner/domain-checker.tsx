"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Globe, CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react"

interface DomainResult {
  domain: string
  available: boolean
  registered: boolean
  expires: string | null
  registrar: string | null
  security: {
    safe: boolean
    blacklisted: boolean
    malware: boolean
    phishing: boolean
  }
  dns: {
    has_mx: boolean
    has_spf: boolean
    has_dmarc: boolean
  }
}

export function DomainChecker() {
  const [domain, setDomain] = useState("")
  const [isChecking, setIsChecking] = useState(false)
  const [result, setResult] = useState<DomainResult | null>(null)

  const handleCheck = async () => {
    if (!domain) return
    setIsChecking(true)
    setResult(null)

    try {
      const res = await fetch("/api/scanner/domain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: domain.replace(/^https?:\/\//, "").replace(/\/.*$/, "") })
      })
      const data = await res.json()
      setResult(data)
    } catch (err) {
      console.error("[v0] Error checking domain:", err)
    } finally {
      setIsChecking(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <Input
          placeholder="ejemplo.com"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCheck()}
        />
        <Button onClick={handleCheck} disabled={isChecking || !domain}>
          {isChecking ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Globe className="mr-2 h-4 w-4" />
              Verificar
            </>
          )}
        </Button>
      </div>

      {result && (
        <div className="space-y-4">
          {/* Availability */}
          <div className={`rounded-lg p-4 ${
            result.available 
              ? "bg-green-50 border border-green-200" 
              : "bg-blue-50 border border-blue-200"
          }`}>
            <div className="flex items-center gap-3">
              {result.available ? (
                <>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                  <div>
                    <h3 className="font-semibold text-green-800">Dominio Disponible</h3>
                    <p className="text-sm text-green-600">
                      El dominio {result.domain} esta disponible para registro
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <Info className="h-8 w-8 text-blue-600" />
                  <div>
                    <h3 className="font-semibold text-blue-800">Dominio Registrado</h3>
                    <p className="text-sm text-blue-600">
                      El dominio {result.domain} ya esta en uso
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Security Status */}
          <div className={`rounded-lg p-4 ${
            result.security.safe 
              ? "bg-green-50 border border-green-200" 
              : "bg-red-50 border border-red-200"
          }`}>
            <h4 className="mb-3 flex items-center gap-2 font-medium">
              {result.security.safe ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-green-800">Sin Amenazas Detectadas</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <span className="text-red-800">Amenazas Detectadas</span>
                </>
              )}
            </h4>
            <div className="grid gap-2 sm:grid-cols-3">
              <div className="flex items-center gap-2 text-sm">
                {result.security.blacklisted ? (
                  <XCircle className="h-4 w-4 text-red-600" />
                ) : (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                )}
                <span className={result.security.blacklisted ? "text-red-700" : "text-green-700"}>
                  Lista negra
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                {result.security.malware ? (
                  <XCircle className="h-4 w-4 text-red-600" />
                ) : (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                )}
                <span className={result.security.malware ? "text-red-700" : "text-green-700"}>
                  Malware
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                {result.security.phishing ? (
                  <XCircle className="h-4 w-4 text-red-600" />
                ) : (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                )}
                <span className={result.security.phishing ? "text-red-700" : "text-green-700"}>
                  Phishing
                </span>
              </div>
            </div>
          </div>

          {/* Registration Info */}
          {result.registered && (
            <div className="grid gap-4 sm:grid-cols-2">
              {result.registrar && (
                <div className="rounded-lg border border-border p-4">
                  <h4 className="mb-2 font-medium text-foreground">Registrador</h4>
                  <p className="text-sm text-muted-foreground">{result.registrar}</p>
                </div>
              )}
              {result.expires && (
                <div className="rounded-lg border border-border p-4">
                  <h4 className="mb-2 font-medium text-foreground">Expira</h4>
                  <p className="text-sm text-muted-foreground">{result.expires}</p>
                </div>
              )}
            </div>
          )}

          {/* DNS Configuration */}
          <div className="rounded-lg border border-border p-4">
            <h4 className="mb-3 font-medium text-foreground">Configuracion DNS</h4>
            <div className="grid gap-2 sm:grid-cols-3">
              <div className="flex items-center gap-2 text-sm">
                {result.dns.has_mx ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-muted-foreground" />
                )}
                <span className={result.dns.has_mx ? "text-foreground" : "text-muted-foreground"}>
                  Registro MX
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                {result.dns.has_spf ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-muted-foreground" />
                )}
                <span className={result.dns.has_spf ? "text-foreground" : "text-muted-foreground"}>
                  Registro SPF
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                {result.dns.has_dmarc ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-muted-foreground" />
                )}
                <span className={result.dns.has_dmarc ? "text-foreground" : "text-muted-foreground"}>
                  Registro DMARC
                </span>
              </div>
            </div>
          </div>

          {/* Info about .edu.do */}
          {domain.includes(".edu.do") && (
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <h4 className="mb-2 flex items-center gap-2 font-medium text-blue-800">
                <Info className="h-4 w-4" />
                Sobre dominios .edu.do
              </h4>
              <p className="text-sm text-blue-700">
                Los dominios .edu.do estan reservados para instituciones educativas en la Republica Dominicana.
                Para registrar uno, visita{" "}
                <a href="https://www.nic.do" target="_blank" rel="noopener noreferrer" className="underline">
                  NIC.DO
                </a>{" "}
                y prepara documentacion que acredite tu institucion educativa.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
