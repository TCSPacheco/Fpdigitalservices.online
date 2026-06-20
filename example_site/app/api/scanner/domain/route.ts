import { NextResponse } from "next/server"

export const runtime = "edge"

// Simulated domain checks - in production you'd use WHOIS APIs, DNS lookups, etc.
function analyzeDomain(domain: string) {
  const cleanDomain = domain.toLowerCase().trim()
  
  // Simulate WHOIS lookup
  const knownDomains = ["google.com", "facebook.com", "amazon.com", "microsoft.com", "apple.com"]
  const isKnown = knownDomains.some(d => cleanDomain.includes(d))
  
  // Random registration status for demo (except for known domains)
  const isRegistered = isKnown || Math.random() > 0.3
  
  // Common registrars
  const registrars = [
    "GoDaddy.com, LLC",
    "Namecheap, Inc.",
    "Google Domains",
    "Cloudflare, Inc.",
    "Amazon Registrar, Inc.",
    "Network Solutions, LLC"
  ]
  
  // Generate expiration date (1-3 years from now)
  const expirationDate = new Date()
  expirationDate.setFullYear(expirationDate.getFullYear() + Math.floor(Math.random() * 3) + 1)
  
  // Check for suspicious patterns
  const suspiciousTLDs = [".tk", ".ml", ".ga", ".cf", ".gq", ".xyz", ".top", ".work", ".click"]
  const isSuspiciousTLD = suspiciousTLDs.some(tld => cleanDomain.endsWith(tld))
  
  // Blacklist check (simulated)
  const blacklistedPatterns = ["phishing", "malware", "scam", "fake"]
  const isBlacklisted = blacklistedPatterns.some(pattern => cleanDomain.includes(pattern))
  
  // DNS records (simulated)
  const hasMX = isRegistered && Math.random() > 0.2
  const hasSPF = isRegistered && Math.random() > 0.3
  const hasDMARC = isRegistered && Math.random() > 0.5

  return {
    domain: cleanDomain,
    available: !isRegistered,
    registered: isRegistered,
    expires: isRegistered ? expirationDate.toLocaleDateString("es-DO", {
      year: "numeric",
      month: "long",
      day: "numeric"
    }) : null,
    registrar: isRegistered ? registrars[Math.floor(Math.random() * registrars.length)] : null,
    security: {
      safe: !isBlacklisted && !isSuspiciousTLD,
      blacklisted: isBlacklisted,
      malware: false,
      phishing: isBlacklisted
    },
    dns: {
      has_mx: hasMX,
      has_spf: hasSPF,
      has_dmarc: hasDMARC
    }
  }
}

export async function POST(request: Request) {
  try {
    const { domain } = await request.json()
    
    if (!domain) {
      return NextResponse.json({ error: "Domain is required" }, { status: 400 })
    }

    const result = analyzeDomain(domain)
    return NextResponse.json(result)
  } catch (error) {
    console.error("[v0] Domain checker error:", error)
    return NextResponse.json({ error: "Failed to check domain" }, { status: 500 })
  }
}
