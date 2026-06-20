import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { Resend } from "resend"

// Create admin client inside functions to avoid build-time errors
function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}

function getResend() {
  return new Resend(process.env.RESEND_API_KEY)
}

export async function POST(request: Request) {
  try {
    const supabaseAdmin = getSupabaseAdmin()
    const resend = getResend()
    
    const body = await request.json()
    const { name, email, role, password } = body

    // Create user with admin API (no email confirmation required)
    const { data: userData, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        name,
        role
      }
    })

    if (createError) {
      console.error("Error creating user:", createError)
      if (createError.message.includes("already been registered")) {
        return NextResponse.json(
          { error: "Este correo ya esta registrado" },
          { status: 400 }
        )
      }
      return NextResponse.json(
        { error: createError.message },
        { status: 400 }
      )
    }

    // Send welcome email to the new employee
    const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev"
    
    try {
      await resend.emails.send({
        from: `FP Digital Services <${fromEmail}>`,
        to: [email],
        subject: "Bienvenido a FP Digital Services - Credenciales de Acceso",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #2d7abf; padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">FP Digital Services</h1>
              <p style="color: #e0e0e0; margin: 5px 0 0;">Bienvenido al Equipo</p>
            </div>
            
            <div style="padding: 30px; background-color: #f9f9f9;">
              <div style="background-color: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <h2 style="color: #333; margin-top: 0;">Hola ${name},</h2>
                <p>Se ha creado tu cuenta en el sistema de FP Digital Services. Ya puedes acceder al dashboard.</p>
                
                <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3 style="color: #2d7abf; margin-top: 0;">Tus Credenciales:</h3>
                  <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
                  <p style="margin: 5px 0;"><strong>Contrasena:</strong> ${password}</p>
                  <p style="margin: 5px 0;"><strong>Rol:</strong> ${role}</p>
                </div>
                
                <p style="color: #666; font-size: 14px;">
                  Por seguridad, te recomendamos cambiar tu contrasena despues de tu primer inicio de sesion.
                </p>
                
                <div style="text-align: center; margin-top: 20px;">
                  <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://fpdigitalservices.com'}/empleados/login" 
                     style="background-color: #2d7abf; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                    Iniciar Sesion
                  </a>
                </div>
              </div>
            </div>
            
            <div style="padding: 20px; text-align: center; color: #666; font-size: 12px;">
              <p>FP Digital Services - Soporte Tecnico y Ciberseguridad</p>
            </div>
          </div>
        `
      })
    } catch (emailError) {
      console.error("Error sending welcome email:", emailError)
      // Continue even if email fails - user is already created
    }

    return NextResponse.json({ 
      success: true, 
      user: {
        id: userData.user?.id,
        email: userData.user?.email,
        name,
        role
      }
    })
  } catch (error) {
    console.error("Error in add employee API:", error)
    return NextResponse.json(
      { error: "Error al agregar empleado" },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const supabaseAdmin = getSupabaseAdmin()
    
    // Get all users
    const { data: users, error } = await supabaseAdmin.auth.admin.listUsers()

    if (error) {
      console.error("Error listing users:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Format users for response
    const empleados = users.users.map(user => ({
      id: user.id,
      email: user.email,
      name: user.user_metadata?.name || "Sin nombre",
      role: user.user_metadata?.role || "tecnico",
      createdAt: user.created_at,
      lastSignIn: user.last_sign_in_at
    }))

    return NextResponse.json({ empleados })
  } catch (error) {
    console.error("Error fetching employees:", error)
    return NextResponse.json(
      { error: "Error al obtener empleados" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const supabaseAdmin = getSupabaseAdmin()
    
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("id")

    if (!userId) {
      return NextResponse.json(
        { error: "ID de empleado requerido" },
        { status: 400 }
      )
    }

    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId)

    if (error) {
      console.error("Error deleting user:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting employee:", error)
    return NextResponse.json(
      { error: "Error al eliminar empleado" },
      { status: 500 }
    )
  }
}
