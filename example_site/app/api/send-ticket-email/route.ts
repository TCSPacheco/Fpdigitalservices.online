import { NextResponse } from "next/server"
import { Resend } from "resend"

export const runtime = "edge"

export async function POST(request: Request) {
  try {
    // Initialize Resend inside the function to avoid build-time errors
    const resend = new Resend(process.env.RESEND_API_KEY)
    
    const body = await request.json()
    const { ticketNumber, clientName, clientEmail, clientPhone, category, problemType, description } = body

    const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev"

    // Email to company
    await resend.emails.send({
      from: `FP Digital Services <${fromEmail}>`,
      to: ["fpdigitalservices@gmail.com"],
      subject: `Nuevo Ticket: ${ticketNumber} - ${category}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #2d7abf; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">FP Digital Services</h1>
            <p style="color: #e0e0e0; margin: 5px 0 0;">Nuevo Ticket de Soporte</p>
          </div>
          
          <div style="padding: 30px; background-color: #f9f9f9;">
            <div style="background-color: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h2 style="color: #2d7abf; margin-top: 0;">Ticket #${ticketNumber}</h2>
              
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold; width: 140px;">Cliente:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${clientName}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">Email:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${clientEmail}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">Telefono:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${clientPhone || "No proporcionado"}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">Categoria:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${category}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">Problema:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${problemType}</td>
                </tr>
              </table>
              
              <h3 style="color: #333; margin-top: 20px;">Descripcion:</h3>
              <p style="background-color: #f5f5f5; padding: 15px; border-radius: 4px; margin: 0;">${description}</p>
            </div>
          </div>
          
          <div style="padding: 20px; text-align: center; color: #666; font-size: 12px;">
            <p>Este correo fue generado automaticamente por el sistema de tickets de FP Digital Services.</p>
          </div>
        </div>
      `
    })

    // Confirmation email to client
    await resend.emails.send({
      from: `FP Digital Services <${fromEmail}>`,
      to: [clientEmail],
      subject: `Ticket Recibido: ${ticketNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #2d7abf; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">FP Digital Services</h1>
            <p style="color: #e0e0e0; margin: 5px 0 0;">Confirmacion de Ticket</p>
          </div>
          
          <div style="padding: 30px; background-color: #f9f9f9;">
            <div style="background-color: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h2 style="color: #333; margin-top: 0;">Hola ${clientName},</h2>
              <p>Hemos recibido tu solicitud de soporte. Nuestro equipo la revisara y te contactara pronto.</p>
              
              <div style="background-color: #2d7abf; color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
                <p style="margin: 0; font-size: 14px;">Tu numero de ticket</p>
                <p style="margin: 10px 0 0; font-size: 24px; font-weight: bold;">${ticketNumber}</p>
              </div>
              
              <p style="color: #666; font-size: 14px;">Guarda este numero para dar seguimiento a tu solicitud.</p>
              
              <h3 style="color: #333;">Resumen de tu solicitud:</h3>
              <ul style="color: #666;">
                <li><strong>Categoria:</strong> ${category}</li>
                <li><strong>Problema:</strong> ${problemType}</li>
              </ul>
            </div>
          </div>
          
          <div style="padding: 20px; text-align: center; color: #666; font-size: 12px;">
            <p>FP Digital Services - Soporte Tecnico y Ciberseguridad</p>
            <p>fpdigitalservices@gmail.com</p>
          </div>
        </div>
      `
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error sending email:", error)
    return NextResponse.json({ error: "Error sending email" }, { status: 500 })
  }
}
