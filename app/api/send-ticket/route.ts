import { NextResponse } from "next/server"
import { Resend } from "resend"

export const runtime = "edge"

interface TicketEmailRequest {
  ticketNumber: string
  clientName: string
  clientEmail: string
  clientPhone?: string
  category: string
  problemType: string
  description: string
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.RESEND_API_KEY
    
    if (!apiKey) {
      return NextResponse.json(
        { error: "El servicio de email no esta configurado. Por favor contacta al administrador." },
        { status: 500 }
      )
    }

    const resend = new Resend(apiKey)
    const body: TicketEmailRequest = await request.json()
    const { ticketNumber, clientName, clientEmail, clientPhone, category, problemType, description } = body

    // Validaciones basicas
    if (!ticketNumber || !clientName || !clientEmail || !category || !problemType || !description) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 }
      )
    }

    const fromEmail = process.env.RESEND_FROM_EMAIL || "noreply@fpdigitalservices.online"
    const supportEmail = "fpdigitalservices@gmail.com"

    // Email al equipo de soporte
    await resend.emails.send({
      from: `FP Digital Services <${fromEmail}>`,
      to: [supportEmail],
      subject: `Nuevo Ticket: ${ticketNumber} - ${category}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">FP Digital Services</h1>
            <p style="color: #bfdbfe; margin: 8px 0 0; font-size: 14px;">Nuevo Ticket de Soporte</p>
          </div>
          
          <div style="padding: 30px; background-color: #f8fafc;">
            <div style="background-color: white; border-radius: 8px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
              <h2 style="color: #2563eb; margin-top: 0; font-size: 20px;">Ticket #${ticketNumber}</h2>
              
              <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #334155; width: 140px;">Cliente:</td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; color: #475569;">${clientName}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #334155;">Email:</td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;"><a href="mailto:${clientEmail}" style="color: #2563eb;">${clientEmail}</a></td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #334155;">Telefono:</td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; color: #475569;">${clientPhone || "No proporcionado"}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #334155;">Categoria:</td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; color: #475569;">${category}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #334155;">Problema:</td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; color: #475569;">${problemType}</td>
                </tr>
              </table>
              
              <h3 style="color: #334155; margin-top: 24px; margin-bottom: 12px; font-size: 16px;">Descripcion:</h3>
              <p style="background-color: #f1f5f9; padding: 16px; border-radius: 6px; margin: 0; color: #475569; line-height: 1.6;">${description}</p>
            </div>
          </div>
          
          <div style="padding: 20px; text-align: center; color: #64748b; font-size: 12px; background-color: #f1f5f9; border-radius: 0 0 8px 8px;">
            <p style="margin: 0;">Este correo fue generado automaticamente por el sistema de tickets de FP Digital Services.</p>
          </div>
        </div>
      `
    })

    // Email de confirmacion al cliente
    await resend.emails.send({
      from: `FP Digital Services <${fromEmail}>`,
      to: [clientEmail],
      subject: `Ticket Recibido: ${ticketNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">FP Digital Services</h1>
            <p style="color: #bfdbfe; margin: 8px 0 0; font-size: 14px;">Confirmacion de Ticket</p>
          </div>
          
          <div style="padding: 30px; background-color: #f8fafc;">
            <div style="background-color: white; border-radius: 8px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
              <h2 style="color: #334155; margin-top: 0; font-size: 20px;">Hola ${clientName},</h2>
              <p style="color: #475569; line-height: 1.6;">Hemos recibido tu solicitud de soporte. Nuestro equipo la revisara y te contactara lo antes posible.</p>
              
              <div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white; padding: 24px; border-radius: 8px; text-align: center; margin: 24px 0;">
                <p style="margin: 0; font-size: 14px; opacity: 0.9;">Tu numero de ticket</p>
                <p style="margin: 12px 0 0; font-size: 28px; font-weight: bold; letter-spacing: 1px;">${ticketNumber}</p>
              </div>
              
              <p style="color: #64748b; font-size: 14px; margin-bottom: 20px;">Guarda este numero para dar seguimiento a tu solicitud.</p>
              
              <h3 style="color: #334155; font-size: 16px; margin-bottom: 12px;">Resumen de tu solicitud:</h3>
              <ul style="color: #475569; line-height: 1.8; padding-left: 20px;">
                <li><strong>Categoria:</strong> ${category}</li>
                <li><strong>Problema:</strong> ${problemType}</li>
              </ul>
            </div>
          </div>
          
          <div style="padding: 20px; text-align: center; color: #64748b; font-size: 12px; background-color: #f1f5f9; border-radius: 0 0 8px 8px;">
            <p style="margin: 0 0 8px;">FP Digital Services - Soporte Tecnico y Ciberseguridad</p>
            <p style="margin: 0;"><a href="mailto:soporte@fpdigitalservices.online" style="color: #2563eb;">soporte@fpdigitalservices.online</a></p>
          </div>
        </div>
      `
    })

    return NextResponse.json({ success: true, ticketNumber })
  } catch (error) {
    console.error("[v0] Error sending email:", error)
    return NextResponse.json(
      { error: "Error al enviar el correo. Por favor intenta de nuevo." },
      { status: 500 }
    )
  }
}
