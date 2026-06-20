import { createClient } from "@/lib/supabase/server"
import { TicketList } from "@/components/dashboard/ticket-list"

export default async function TicketsPage() {
  const supabase = await createClient()
  
  const { data: tickets } = await supabase
    .from("tickets")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Tickets</h1>
        <p className="text-muted-foreground">Gestiona todos los tickets de soporte</p>
      </div>

      <TicketList initialTickets={tickets ?? []} />
    </div>
  )
}
