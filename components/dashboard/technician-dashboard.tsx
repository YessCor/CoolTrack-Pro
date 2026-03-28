'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Clock, CheckCircle2, MapPin, AlertCircle } from 'lucide-react'

interface TechOrder {
  id: string
  order_number: string
  service_type: string
  address: string
  status: string
  scheduled_date: string
  priority: string
  client_name: string
}

export function TechnicianDashboard() {
  const [orders, setOrders] = useState<TechOrder[]>([])
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

  if (loading) {
    return <div className="text-center py-12">Cargando órdenes...</div>
  }

  const todayOrders = orders.filter(o => o.status === 'assigned' || o.status === 'in_progress')
  const pendingOrders = orders.filter(o => o.status === 'pending')

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Hoy</p>
                <p className="text-2xl font-bold text-foreground mt-1">{todayOrders.length}</p>
              </div>
              <div className="p-3 bg-info/10 text-info rounded-lg">
                <Clock className="w-6 h-6" />
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
                <AlertCircle className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completadas</p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {orders.filter(o => o.status === 'completed').length}
                </p>
              </div>
              <div className="p-3 bg-success/10 text-success rounded-lg">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Órdenes de Hoy</CardTitle>
        </CardHeader>
        <CardContent>
          {todayOrders.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No hay órdenes asignadas para hoy</p>
          ) : (
            <div className="space-y-3">
              {todayOrders.map(order => (
                <div
                  key={order.id}
                  className="flex items-start justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">{order.order_number}</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        order.priority === 'urgent'
                          ? 'bg-destructive/10 text-destructive'
                          : 'bg-primary/10 text-primary'
                      }`}>
                        {order.priority === 'urgent' ? 'Urgente' : 'Normal'}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{order.service_type}</p>
                    <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      {order.address}
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Ver Detalles
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
