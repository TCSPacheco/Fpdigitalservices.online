"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LinkScanner } from "@/components/dashboard/scanner/link-scanner"
import { DomainChecker } from "@/components/dashboard/scanner/domain-checker"
import { EmailVerifier } from "@/components/dashboard/scanner/email-verifier"
import { Link2, Globe, Mail } from "lucide-react"

export default function ScannerPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Herramientas de Escaner</h1>
        <p className="text-muted-foreground">
          Analiza links, dominios y correos para detectar amenazas o verificar disponibilidad
        </p>
      </div>

      <Tabs defaultValue="links" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="links" className="flex items-center gap-2">
            <Link2 className="h-4 w-4" />
            <span className="hidden sm:inline">Links</span>
          </TabsTrigger>
          <TabsTrigger value="domains" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">Dominios</span>
          </TabsTrigger>
          <TabsTrigger value="emails" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            <span className="hidden sm:inline">Correos</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="links" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link2 className="h-5 w-5 text-primary" />
                Escaner de Links
              </CardTitle>
              <CardDescription>
                Verifica si un link es seguro o potencialmente malicioso
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LinkScanner />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="domains" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                Verificador de Dominios
              </CardTitle>
              <CardDescription>
                Comprueba disponibilidad y seguridad de dominios
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DomainChecker />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="emails" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                Verificador de Correos
              </CardTitle>
              <CardDescription>
                Valida direcciones de correo y detecta correos de riesgo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EmailVerifier />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
