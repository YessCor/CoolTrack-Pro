'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Zap, Thermometer, Calendar } from 'lucide-react'

interface Equipment {
  id: string
  name: string
  type: string
  brand: string
  model: string
  capacity_tons: number
  last_service_date: string
  location_description: string
}

export default function ClientEquipmentPage() {
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEquipment()
  }, [])

  const fetchEquipment = async () => {
    try {
      const response = await fetch('/api/equipment')
      const data = await response.json()
      if (data.data) {
        setEquipment(data.data)
      }
    } catch (error) {
      console.error('Error fetching equipment:', error)
    } finally {
      setLoading(false)
    }
  }

  const getEquipmentIcon = (type: string) => {
    switch (type) {
      case 'split':
      case 'mini_split':
      case 'central':
        return <Zap className="w-6 h-6 text-info" />
      default:
        return <Thermometer className="w-6 h-6 text-warning" />
    }
  }

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      split: 'Split',
      mini_split: 'Minisplit',
      central: 'Central',
      chiller: 'Chiller',
      fan_coil: 'Fan Coil',
      other: 'Otro',
    }
    return labels[type] || type
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Mis Equipos</h1>
          <p className="text-muted-foreground mt-1">Gestiona tus equipos HVAC registrados</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Registrar Equipo
        </Button>
      </div>

      {loading ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Cargando equipos...
          </CardContent>
        </Card>
      ) : equipment.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Thermometer className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No tienes equipos registrados</p>
            <Button>Registrar Primer Equipo</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {equipment.map(eq => (
            <Card key={eq.id} className="hover:shadow-md transition-shadow flex flex-col">
              <CardContent className="pt-6 flex-1 flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{eq.name}</h3>
                    <p className="text-sm text-muted-foreground">{getTypeLabel(eq.type)}</p>
                  </div>
                  {getEquipmentIcon(eq.type)}
                </div>

                <div className="space-y-2 text-sm text-muted-foreground flex-1">
                  <p><strong className="text-foreground">Marca:</strong> {eq.brand}</p>
                  <p><strong className="text-foreground">Modelo:</strong> {eq.model}</p>
                  {eq.capacity_tons && (
                    <p><strong className="text-foreground">Capacidad:</strong> {eq.capacity_tons} tons</p>
                  )}
                  <p><strong className="text-foreground">Ubicación:</strong> {eq.location_description}</p>
                </div>

                {eq.last_service_date && (
                  <div className="mt-4 pt-4 border-t border-border text-xs text-muted-foreground flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Último servicio: {new Date(eq.last_service_date).toLocaleDateString('es-MX')}
                  </div>
                )}

                <div className="mt-4 flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    Editar
                  </Button>
                  <Button size="sm" className="flex-1">
                    Servicio
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
