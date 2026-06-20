import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'FP Digital Services - Soporte Tecnico y Ciberseguridad',
  description: 'Plataforma de soporte tecnico profesional, capacitacion en ciberseguridad y soluciones digitales para tu empresa',
  keywords: ['soporte tecnico', 'ciberseguridad', 'capacitacion', 'tickets', 'ayuda tecnica'],
  authors: [{ name: 'FP Digital Services' }],
  openGraph: {
    title: 'FP Digital Services - Soporte Tecnico',
    description: 'Sistema de tickets de soporte tecnico profesional',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="bg-background">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
