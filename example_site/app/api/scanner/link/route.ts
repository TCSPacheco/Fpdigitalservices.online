import { NextResponse } from "next/server"

export const runtime = "edge"

// Simulated security checks - in production you'd use APIs like VirusTotal, Google Safe Browsing, etc.
function analyzeUrl(urlString: string) {
  const suspiciousPatterns: string[] = []
  const risks: string[] = []
  let score = 100

  try {
    const url = new URL(urlString)
    
    // Check for SSL
    const hasSSL = url.protocol === "https:"
    if (!hasSSL) {
      score -= 20
      risks.push("El sitio no usa HTTPS (conexion no segura)")
    }

    // Check for suspicious TLDs
    const suspiciousTLDs = [".tk", ".ml", ".ga", ".cf", ".gq", ".xyz", ".top", ".work", ".click"]
    if (suspiciousTLDs.some(tld => url.hostname.endsWith(tld))) {
      score -= 15
      suspiciousPatterns.push("TLD de alto riesgo")
      risks.push("El dominio usa un TLD frecuentemente asociado con spam")
    }

    // Check for IP address instead of domain
    const ipPattern = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/
    if (ipPattern.test(url.hostname)) {
      score -= 25
      suspiciousPatterns.push("Direccion IP en lugar de dominio")
      risks.push("Usa direccion IP directa en lugar de un nombre de dominio")
    }

    // Check for excessive subdomains
    const subdomains = url.hostname.split(".").length - 2
    if (subdomains > 3) {
      score -= 10
      suspiciousPatterns.push("Muchos subdominios")
      risks.push("El dominio tiene una cantidad inusual de subdominios")
    }

    // Check for suspicious keywords
    const suspiciousKeywords = ["login", "signin", "verify", "account", "secure", "update", "confirm", "banking", "paypal", "amazon"]
    const urlLower = urlString.toLowerCase()
    const foundKeywords = suspiciousKeywords.filter(kw => urlLower.includes(kw))
    if (foundKeywords.length > 1) {
      score -= 10
      suspiciousPatterns.push(`Palabras clave sospechosas: ${foundKeywords.join(", ")}`)
    }

    // Check for URL encoding tricks
    if (urlString.includes("%") || urlString.includes("@")) {
      score -= 10
      suspiciousPatterns.push("Caracteres codificados o @ en URL")
      risks.push("La URL contiene caracteres que podrian ocultar el destino real")
    }

    // Check for very long URLs
    if (urlString.length > 200) {
      score -= 5
      suspiciousPatterns.push("URL muy larga")
    }

    // Check for misspellings of common domains
    const commonMisspellings = [
      { pattern: /faceb[o0]{2}k/i, name: "Facebook" },
      { pattern: /g[o0]{2}gle/i, name: "Google" },
      { pattern: /amaz[o0]n/i, name: "Amazon" },
      { pattern: /micr[o0]s[o0]ft/i, name: "Microsoft" },
      { pattern: /payp[a4]l/i, name: "PayPal" },
    ]
    
    for (const check of commonMisspellings) {
      if (check.pattern.test(url.hostname) && !url.hostname.includes(check.name.toLowerCase() + ".com")) {
        score -= 25
        risks.push(`Posible imitacion de ${check.name}`)
        suspiciousPatterns.push(`Dominio similar a ${check.name}`)
      }
    }

    // Simulate domain age (random for demo)
    const domainAges = ["Menos de 30 dias", "1-6 meses", "6-12 meses", "Mas de 1 ano", "Mas de 5 anos"]
    const domainAgeIndex = Math.min(Math.floor(Math.random() * 5), 4)
    if (domainAgeIndex < 2) {
      score -= 10
      risks.push("El dominio es relativamente nuevo")
    }

    // Simulate redirects
    const redirects = Math.floor(Math.random() * 3)
    if (redirects > 1) {
      score -= 5
      risks.push("Multiples redirecciones detectadas")
    }

    return {
      url: urlString,
      safe: score >= 70,
      score: Math.max(0, score),
      risks,
      details: {
        ssl: hasSSL,
        domain_age: domainAges[domainAgeIndex],
        suspicious_patterns: suspiciousPatterns,
        redirects
      }
    }
  } catch {
    return {
      url: urlString,
      safe: false,
      score: 0,
      risks: ["URL invalida o mal formada"],
      details: {
        ssl: false,
        domain_age: "Desconocido",
        suspicious_patterns: ["URL invalida"],
        redirects: 0
      }
    }
  }
}

export async function POST(request: Request) {
  try {
    const { url } = await request.json()
    
    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    // Add protocol if missing
    let fullUrl = url
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      fullUrl = "https://" + url
    }

    const result = analyzeUrl(fullUrl)
    return NextResponse.json(result)
  } catch (error) {
    console.error("[v0] Link scanner error:", error)
    return NextResponse.json({ error: "Failed to analyze URL" }, { status: 500 })
  }
}
