'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useParams, useRouter } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowLeft, Clock, MapPin, Phone, Camera, FileText } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface Order {
  id: string
  order_number: string
  client_name: string
  client_email: string
  service_type: string
  description: string
  status: string
  address: string
  scheduled_date: string
  created_at: string
}

export default function TechnicianOrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [newStatus, setNewStatus] = useState('')
  const [notes, setNotes] = useState('')

  const orderId = params.id as string

  useEffect(() => {
    fetchOrder()
  }, [orderId])

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}`)
      const data = await response.json()
      if (data.data) {
        setOrder(data.data)
        setNewStatus(data.data.status)
        setNotes(data.data.technician_notes || '')
      }
    } catch (error) {
      console.error('Error fetching order:', error)
      toast({
        title: 'Error',
        description: 'No se pudo cargar la orden',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async () => {
    if (!newStatus) return

    setUpdating(true)
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          technician_notes: notes,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update order')
      }

      const data = await response.json()
      setOrder(data.data)

      toast({
        title: 'Estado actualizado',
        description: `La orden ha sido actualizada a ${newStatus}`,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo actualizar la orden',
        variant: 'destructive',
      })
    } finally {
      setUpdating(false)
    }
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'Pendiente',
      assigned: 'Asignada',
      in_transit: 'En Tránsito',
      in_progress: 'En Progreso',
      completed: 'Completada',
      cancelled: 'Cancelada',
    }
    return labels[status] || status
  }

  if (loading) {
    return <div className="text-center py-12">Cargando detalles de la orden...</div>
  }

  if (!order) {
    return <div className="text-center py-12">Orden no encontrada</div>
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{order.order_number}</h1>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Detalles del Servicio</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Tipo de Servicio</p>
                <p className="text-lg font-semibold text-foreground">{order.service_type}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Descripción</p>
                <p className="text-foreground whitespace-pre-wrap">{order.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                <div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-4 h-4" /> Ubicación
                  </p>
                  <p className="text-foreground">{order.address}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="w-4 h-4" /> Fecha Programada
                  </p>
                  <p className="text-foreground">
                    {order.scheduled_date
                      ? new Date(order.scheduled_date).toLocaleDateString('es-MX')
                      : 'Por confirmar'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Client Info */}
          <Card>
            <CardHeader>
              <CardTitle>Información del Cliente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="font-semibold text-foreground">{order.client_name}</p>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Phone className="w-4 h-4" />
                {order.client_email}
              </p>
            </CardContent>
          </Card>

          {/* Photos & Documents */}
          <Card>
            <CardHeader>
              <CardTitle>Fotos y Documentos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <button className="aspect-square border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-2 hover:border-primary transition-colors">
                  <Camera className="w-6 h-6 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Antes</span>
                </button>
                <button className="aspect-square border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-2 hover:border-primary transition-colors">
                  <Camera className="w-6 h-6 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Durante</span>
                </button>
                <button className="aspect-square border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-2 hover:border-primary transition-colors">
                  <Camera className="w-6 h-6 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Después</span>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status & Actions */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Estado de la Orden</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Cambiar estado</p>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="assigned">Asignada</SelectItem>
                    <SelectItem value="in_transit">En Tránsito</SelectItem>
                    <SelectItem value="in_progress">En Progreso</SelectItem>
                    <SelectItem value="completed">Completada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm text-muted-foreground block mb-2">
                  Notas Técnicas
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Registra detalles del trabajo realizado..."
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm text-foreground focus:ring-2 focus:ring-primary"
                  rows={3}
                />
              </div>

              <Button
                onClick={handleStatusUpdate}
                disabled={updating}
                className="w-full"
              >
                {updating ? 'Actualizando...' : 'Guardar Cambios'}
              </Button>

              <Button variant="outline" className="w-full gap-2">
                <FileText className="w-4 h-4" />
                Generar Cotización
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
