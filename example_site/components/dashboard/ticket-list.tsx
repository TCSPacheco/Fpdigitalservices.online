"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Filter, Eye, Loader2, Mail, Phone } from "lucide-react"

interface Ticket {
  id: string
  ticket_number: string
  client_name: string
  client_email: string
  client_phone: string | null
  category: string
  problem_type: string
  description: string
  priority: string
  status: string
  employee_notes: string | null
  recommendations: string | null
  created_at: string
  updated_at: string
}

interface TicketListProps {
  initialTickets: Ticket[]
}

const categoryLabels: Record<string, string> = {
  "soporte-tecnico": "Soporte Tecnico",
  "ciberseguridad": "Ciberseguridad",
  "capacitacion": "Capacitacion",
  "redes-internet": "Redes e Internet"
}

const statusLabels: Record<string, string> = {
  "nuevo": "Nuevo",
  "en_progreso": "En Progreso",
  "resuelto": "Resuelto",
  "cerrado": "Cerrado"
}

const priorityLabels: Record<string, string> = {
  "baja": "Baja",
  "media": "Media",
  "alta": "Alta",
  "urgente": "Urgente"
}

export function TicketList({ initialTickets }: TicketListProps) {
  const [tickets, setTickets] = useState(initialTickets)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [editData, setEditData] = useState({
    status: "",
    priority: "",
    employee_notes: "",
    recommendations: ""
  })

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = 
      ticket.ticket_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.client_email.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter
    const matchesCategory = categoryFilter === "all" || ticket.category === categoryFilter

    return matchesSearch && matchesStatus && matchesCategory
  })

  const handleViewTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket)
    setEditData({
      status: ticket.status,
      priority: ticket.priority,
      employee_notes: ticket.employee_notes || "",
      recommendations: ticket.recommendations || ""
    })
  }

  const handleUpdateTicket = async () => {
    if (!selectedTicket) return
    setIsUpdating(true)

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from("tickets")
        .update({
          status: editData.status,
          priority: editData.priority,
          employee_notes: editData.employee_notes,
          recommendations: editData.recommendations
        })
        .eq("id", selectedTicket.id)

      if (error) throw error

      // Update local state
      setTickets(prev => prev.map(t => 
        t.id === selectedTicket.id 
          ? { ...t, ...editData, updated_at: new Date().toISOString() }
          : t
      ))
      setSelectedTicket(null)
    } catch (err) {
      console.error("[v0] Error updating ticket:", err)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por ticket, nombre o email..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="nuevo">Nuevo</SelectItem>
                  <SelectItem value="en_progreso">En Progreso</SelectItem>
                  <SelectItem value="resuelto">Resuelto</SelectItem>
                  <SelectItem value="cerrado">Cerrado</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-44">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="soporte-tecnico">Soporte Tecnico</SelectItem>
                  <SelectItem value="ciberseguridad">Ciberseguridad</SelectItem>
                  <SelectItem value="capacitacion">Capacitacion</SelectItem>
                  <SelectItem value="redes-internet">Redes e Internet</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tickets Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Ticket</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Cliente</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Categoria</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Estado</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Prioridad</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Fecha</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                      No se encontraron tickets
                    </td>
                  </tr>
                ) : (
                  filteredTickets.map((ticket) => (
                    <tr key={ticket.id} className="border-b border-border hover:bg-muted/30">
                      <td className="px-4 py-3">
                        <code className="text-sm font-medium text-primary">{ticket.ticket_number}</code>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm font-medium text-foreground">{ticket.client_name}</p>
                          <p className="text-xs text-muted-foreground">{ticket.client_email}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground">
                        {categoryLabels[ticket.category] || ticket.category}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
                          ticket.status === "nuevo" ? "bg-orange-100 text-orange-700" :
                          ticket.status === "en_progreso" ? "bg-blue-100 text-blue-700" :
                          ticket.status === "resuelto" ? "bg-green-100 text-green-700" :
                          "bg-gray-100 text-gray-700"
                        }`}>
                          {statusLabels[ticket.status] || ticket.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
                          ticket.priority === "urgente" ? "bg-red-100 text-red-700" :
                          ticket.priority === "alta" ? "bg-orange-100 text-orange-700" :
                          ticket.priority === "media" ? "bg-yellow-100 text-yellow-700" :
                          "bg-gray-100 text-gray-700"
                        }`}>
                          {priorityLabels[ticket.priority] || ticket.priority}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {new Date(ticket.created_at).toLocaleDateString("es-DO", {
                          day: "numeric",
                          month: "short",
                          year: "numeric"
                        })}
                      </td>
                      <td className="px-4 py-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewTicket(ticket)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Ticket Detail Dialog */}
      <Dialog open={!!selectedTicket} onOpenChange={() => setSelectedTicket(null)}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Ticket: <code className="text-primary">{selectedTicket?.ticket_number}</code>
            </DialogTitle>
          </DialogHeader>

          {selectedTicket && (
            <div className="space-y-6">
              {/* Client Info */}
              <div className="rounded-lg bg-muted/50 p-4">
                <h3 className="mb-3 font-semibold text-foreground">Informacion del Cliente</h3>
                <div className="space-y-2">
                  <p className="text-sm">
                    <strong>Nombre:</strong> {selectedTicket.client_name}
                  </p>
                  <p className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    {selectedTicket.client_email}
                  </p>
                  {selectedTicket.client_phone && (
                    <p className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      {selectedTicket.client_phone}
                    </p>
                  )}
                </div>
              </div>

              {/* Problem Info */}
              <div className="rounded-lg bg-muted/50 p-4">
                <h3 className="mb-3 font-semibold text-foreground">Problema Reportado</h3>
                <p className="mb-2 text-sm">
                  <strong>Categoria:</strong> {categoryLabels[selectedTicket.category]}
                </p>
                <p className="mb-2 text-sm">
                  <strong>Tipo:</strong> {selectedTicket.problem_type}
                </p>
                <p className="text-sm">
                  <strong>Descripcion:</strong>
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{selectedTicket.description}</p>
              </div>

              {/* Edit Form */}
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground">Gestionar Ticket</h3>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Estado</Label>
                    <Select value={editData.status} onValueChange={(v) => setEditData({...editData, status: v})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nuevo">Nuevo</SelectItem>
                        <SelectItem value="en_progreso">En Progreso</SelectItem>
                        <SelectItem value="resuelto">Resuelto</SelectItem>
                        <SelectItem value="cerrado">Cerrado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Prioridad</Label>
                    <Select value={editData.priority} onValueChange={(v) => setEditData({...editData, priority: v})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="baja">Baja</SelectItem>
                        <SelectItem value="media">Media</SelectItem>
                        <SelectItem value="alta">Alta</SelectItem>
                        <SelectItem value="urgente">Urgente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Notas del Empleado</Label>
                  <Textarea
                    placeholder="Agrega notas internas sobre este ticket..."
                    rows={3}
                    value={editData.employee_notes}
                    onChange={(e) => setEditData({...editData, employee_notes: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Recomendaciones para el Cliente</Label>
                  <Textarea
                    placeholder="Herramientas o soluciones recomendadas..."
                    rows={3}
                    value={editData.recommendations}
                    onChange={(e) => setEditData({...editData, recommendations: e.target.value})}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setSelectedTicket(null)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleUpdateTicket} disabled={isUpdating}>
                    {isUpdating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      "Guardar Cambios"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
