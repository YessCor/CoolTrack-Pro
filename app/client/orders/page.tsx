'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus, Eye, Calendar, MapPin, DollarSign } from 'lucide-react'

interface Order {
  id: string
  order_number: string
  service_type: string
  status: string
  scheduled_date: string
  address: string
  total_amount: number
  created_at: string
}

export default function ClientOrdersPage() {
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

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      assigned: 'bg-blue-100 text-blue-800',
      in_transit: 'bg-cyan-100 text-cyan-800',
      in_progress: 'bg-purple-100 text-purple-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Mis Órdenes de Servicio</h1>
          <p className="text-muted-foreground mt-1">Solicita y gestiona tus servicios HVAC</p>
        </div>
        <Link href="/client/orders/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Nueva Orden
          </Button>
        </Link>
      </div>

      {/* Orders Grid */}
      {loading ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Cargando órdenes...
          </CardContent>
        </Card>
      ) : orders.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">Aún no has creado ninguna orden de servicio</p>
            <Link href="/client/orders/new">
              <Button>Crear Primera Orden</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => (
            <Card key={order.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-semibold text-foreground">{order.order_number}</h3>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getStatusColor(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </div>
                    <p className="text-foreground font-medium mb-3">{order.service_type}</p>

                    <div className="space-y-2 text-sm text-muted-foreground">
                      {order.scheduled_date && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {new Date(order.scheduled_date).toLocaleDateString('es-MX')}
                        </div>
                      )}
                      {order.address && (
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 mt-0.5" />
                          {order.address}
                        </div>
                      )}
                      {order.total_amount && (
                        <div className="flex items-center gap-2 pt-2">
                          <DollarSign className="w-4 h-4" />
                          ${order.total_amount.toLocaleString('es-MX')}
                        </div>
                      )}
                    </div>
                  </div>

                  <Link href={`/client/orders/${order.id}`}>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Eye className="w-4 h-4" />
                      Detalles
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
