import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardNav } from "@/components/dashboard/nav"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/empleados/login")
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav user={user} />
      <main className="p-4 md:p-6 lg:p-8">
        {children}
      </main>
    </div>
  )
}
