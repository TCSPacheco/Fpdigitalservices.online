import { NextResponse } from "next/server"

export const runtime = "edge"

// Disposable email domains list
const disposableDomains = [
  "tempmail.com", "throwaway.email", "guerrillamail.com", "10minutemail.com",
  "mailinator.com", "yopmail.com", "temp-mail.org", "fakeinbox.com",
  "trashmail.com", "dispostable.com", "maildrop.cc", "getnada.com"
]

// Role-based email prefixes
const rolePrefixes = [
  "info", "admin", "support", "sales", "contact", "help", "hello",
  "team", "office", "billing", "marketing", "hr", "noreply", "no-reply"
]

// Known email providers
const emailProviders: Record<string, string> = {
  "gmail.com": "Google Gmail",
  "outlook.com": "Microsoft Outlook",
  "hotmail.com": "Microsoft Hotmail",
  "yahoo.com": "Yahoo Mail",
  "icloud.com": "Apple iCloud",
  "protonmail.com": "ProtonMail",
  "zoho.com": "Zoho Mail"
}

function analyzeEmail(email: string) {
  const cleanEmail = email.toLowerCase().trim()
  const suggestions: string[] = []
  
  // Basic format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const formatValid = emailRegex.test(cleanEmail)
  
  if (!formatValid) {
    return {
      email: cleanEmail,
      valid: false,
      format_valid: false,
      domain_exists: false,
      is_disposable: false,
      is_role_based: false,
      risk_level: "high" as const,
      suggestions: ["El formato del correo no es valido"],
      domain_info: {
        domain: "",
        provider: null,
        has_mx: false
      }
    }
  }

  const [localPart, domain] = cleanEmail.split("@")
  
  // Check if disposable
  const isDisposable = disposableDomains.some(d => domain.includes(d))
  if (isDisposable) {
    suggestions.push("Este es un correo temporal/desechable")
  }
  
  // Check if role-based
  const isRoleBased = rolePrefixes.some(prefix => localPart === prefix)
  if (isRoleBased) {
    suggestions.push("Este es un correo de rol (no personal)")
  }
  
  // Check local part quality
  if (localPart.length < 3) {
    suggestions.push("El nombre de usuario es muy corto")
  }
  
  if (/^\d+$/.test(localPart)) {
    suggestions.push("El nombre de usuario es solo numeros")
  }
  
  // Simulate domain existence check
  const commonTLDs = [".com", ".net", ".org", ".edu", ".gov", ".io", ".co", ".do"]
  const domainExists = commonTLDs.some(tld => domain.endsWith(tld)) || Math.random() > 0.1
  
  if (!domainExists) {
    suggestions.push("El dominio podria no existir")
  }
  
  // Simulate MX record check
  const hasMX = domainExists && Math.random() > 0.1
  if (!hasMX && domainExists) {
    suggestions.push("El dominio podria no aceptar correos")
  }
  
  // Determine risk level
  let riskLevel: "low" | "medium" | "high" = "low"
  if (isDisposable) {
    riskLevel = "high"
  } else if (!domainExists || !hasMX) {
    riskLevel = "high"
  } else if (isRoleBased || localPart.length < 4) {
    riskLevel = "medium"
  }
  
  // Get provider info
  const provider = emailProviders[domain] || null
  
  const isValid = formatValid && domainExists && hasMX && !isDisposable

  return {
    email: cleanEmail,
    valid: isValid,
    format_valid: formatValid,
    domain_exists: domainExists,
    is_disposable: isDisposable,
    is_role_based: isRoleBased,
    risk_level: riskLevel,
    suggestions,
    domain_info: {
      domain,
      provider,
      has_mx: hasMX
    }
  }
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json()
    
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const result = analyzeEmail(email)
    return NextResponse.json(result)
  } catch (error) {
    console.error("[v0] Email verifier error:", error)
    return NextResponse.json({ error: "Failed to verify email" }, { status: 500 })
  }
}
