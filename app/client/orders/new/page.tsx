'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function NewOrderPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    service_type: '',
    description: '',
    address: '',
    scheduled_date: '',
    equipment_id: '',
  })

  const serviceTypes = [
    'Mantenimiento Preventivo',
    'Reparación',
    'Diagnóstico General',
    'Instalación',
    'Emergencia',
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        toast({
          title: 'Error',
          description: data.error || 'No se pudo crear la orden',
          variant: 'destructive',
        })
        return
      }

      toast({
        title: 'Orden creada',
        description: `Tu orden ${data.data.order_number} ha sido creada exitosamente`,
      })

      router.push('/client/orders')
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Ocurrió un error al crear la orden',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Nueva Orden de Servicio</h1>
        <p className="text-muted-foreground mt-1">Completa el formulario para solicitar un servicio</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información del Servicio</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Tipo de Servicio *
              </label>
              <Select
                value={formData.service_type}
                onValueChange={(value) =>
                  setFormData({ ...formData, service_type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un tipo de servicio" />
                </SelectTrigger>
                <SelectContent>
                  {serviceTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Descripción del Problema *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Describe detalladamente el problema..."
                className="w-full px-3 py-2 border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary"
                rows={4}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Dirección del Servicio *
              </label>
              <Input
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                placeholder="Calle, número, ciudad..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Fecha Preferida de Servicio
              </label>
              <Input
                type="datetime-local"
                value={formData.scheduled_date}
                onChange={(e) =>
                  setFormData({ ...formData, scheduled_date: e.target.value })
                }
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Creando...' : 'Crear Orden'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
