'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { MapPin, Clock, AlertCircle, CheckCircle2 } from 'lucide-react'

interface Order {
  id: string
  order_number: string
  service_type: string
  status: string
  scheduled_date: string
  address: string
  client_name: string
  priority: string
}

export default function TechnicianOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders')
      const data = await response.json()
      if (data.data) {
        setOrders(data.data)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'assigned':
        return <Clock className="w-5 h-5 text-info" />
      case 'in_transit':
        return <MapPin className="w-5 h-5 text-warning" />
      case 'in_progress':
        return <AlertCircle className="w-5 h-5 text-warning" />
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-success" />
      default:
        return null
    }
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      assigned: 'Asignada',
      in_transit: 'En Tránsito',
      in_progress: 'En Progreso',
      completed: 'Completada',
    }
    return labels[status] || status
  }

  const groupedOrders = {
    assigned: orders.filter(o => o.status === 'assigned'),
    in_transit: orders.filter(o => o.status === 'in_transit'),
    in_progress: orders.filter(o => o.status === 'in_progress'),
    completed: orders.filter(o => o.status === 'completed'),
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Mis Órdenes</h1>
        <p className="text-muted-foreground mt-1">Gestiona tus órdenes asignadas</p>
      </div>

      {loading ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Cargando órdenes...
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Today's Orders - Assigned */}
          {groupedOrders.assigned.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
                <Clock className="w-5 h-5 text-info" />
                Órdenes Asignadas ({groupedOrders.assigned.length})
              </h2>
              <div className="grid gap-4">
                {groupedOrders.assigned.map(order => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            </div>
          )}

          {/* In Transit */}
          {groupedOrders.in_transit.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-warning" />
                En Tránsito ({groupedOrders.in_transit.length})
              </h2>
              <div className="grid gap-4">
                {groupedOrders.in_transit.map(order => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            </div>
          )}

          {/* In Progress */}
          {groupedOrders.in_progress.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-warning" />
                En Progreso ({groupedOrders.in_progress.length})
              </h2>
              <div className="grid gap-4">
                {groupedOrders.in_progress.map(order => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            </div>
          )}

          {/* Completed */}
          {groupedOrders.completed.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-success" />
                Completadas ({groupedOrders.completed.length})
              </h2>
              <div className="grid gap-4">
                {groupedOrders.completed.map(order => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            </div>
          )}

          {orders.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No tienes órdenes asignadas</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}

function OrderCard({ order }: { order: Order }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-foreground">{order.order_number}</h3>
              <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
                {order.priority === 'urgent' ? 'Urgente' : 'Normal'}
              </span>
            </div>
            <p className="text-foreground font-medium mb-3">{order.service_type}</p>

            <div className="space-y-1 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {order.address}
              </div>
              {order.scheduled_date && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {new Date(order.scheduled_date).toLocaleDateString('es-MX')}
                </div>
              )}
              <p className="text-xs">Cliente: {order.client_name}</p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Link href={`/technician/orders/${order.id}`}>
              <Button size="sm">Ver Detalles</Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
