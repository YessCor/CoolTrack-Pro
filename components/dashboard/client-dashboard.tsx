'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ShoppingCart, FileText, Zap, Plus } from 'lucide-react'

interface ClientOrder {
  id: string
  order_number: string
  service_type: string
  status: string
  created_at: string
  total_amount: number
}

export function ClientDashboard() {
  const [orders, setOrders] = useState<ClientOrder[]>([])
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

  const recentOrders = orders.slice(0, 5)
  const pendingOrders = orders.filter(o => o.status === 'pending')
  const completedOrders = orders.filter(o => o.status === 'completed')

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

  if (loading) {
    return <div className="text-center py-12">Cargando datos...</div>
  }

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/client/orders/new">
          <Card className="cursor-pointer hover:shadow-md transition-shadow h-full">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">Nueva Orden de Servicio</h3>
                  <p className="text-sm text-muted-foreground mt-1">Solicita mantenimiento o reparación</p>
                </div>
                <div className="p-3 bg-primary/10 text-primary rounded-lg">
                  <Plus className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/client/equipment">
          <Card className="cursor-pointer hover:shadow-md transition-shadow h-full">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">Mis Equipos</h3>
                  <p className="text-sm text-muted-foreground mt-1">Gestiona tus equipos HVAC</p>
                </div>
                <div className="p-3 bg-info/10 text-info rounded-lg">
                  <Zap className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Órdenes Totales</p>
                <p className="text-2xl font-bold text-foreground mt-1">{orders.length}</p>
              </div>
              <div className="p-3 bg-primary/10 text-primary rounded-lg">
                <ShoppingCart className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pendientes</p>
                <p className="text-2xl font-bold text-foreground mt-1">{pendingOrders.length}</p>
              </div>
              <div className="p-3 bg-warning/10 text-warning rounded-lg">
                <FileText className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completadas</p>
                <p className="text-2xl font-bold text-foreground mt-1">{completedOrders.length}</p>
              </div>
              <div className="p-3 bg-success/10 text-success rounded-lg">
                <ShoppingCart className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Órdenes Recientes</CardTitle>
          <Link href="/client/orders">
            <Button variant="outline" size="sm">Ver Todas</Button>
          </Link>
        </CardHeader>
        <CardContent>
          {recentOrders.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No tienes órdenes aún</p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map(order => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-foreground">{order.order_number}</span>
                      <span className={`text-xs px-2 py-1 rounded ${getStatusColor(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{order.service_type}</p>
                  </div>
                  {order.total_amount && (
                    <p className="font-semibold text-foreground">
                      ${order.total_amount.toLocaleString('es-MX')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
