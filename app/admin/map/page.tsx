'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MapPin, Phone, Zap } from 'lucide-react'

interface TechnicianLocation {
  id: string
  technician_id: string
  name: string
  email: string
  phone: string
  latitude: number
  longitude: number
  recorded_at: string
}

export default function AdminMapPage() {
  const [technicians, setTechnicians] = useState<TechnicianLocation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLocations()
    const interval = setInterval(fetchLocations, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchLocations = async () => {
    try {
      const response = await fetch('/api/technicians/locations')
      const data = await response.json()
      if (data.data) {
        setTechnicians(data.data)
      }
    } catch (error) {
      console.error('Error fetching locations:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Mapa de Técnicos</h1>
        <p className="text-muted-foreground mt-1">Localización en tiempo real de técnicos activos</p>
      </div>

      {/* Map Placeholder */}
      <Card className="h-96 bg-muted/50 flex items-center justify-center">
        <CardContent className="text-center">
          <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground mb-2">
            Integración de Google Maps API pendiente
          </p>
          <p className="text-sm text-muted-foreground">
            Proporciona tu API key en la configuración para activar el mapa
          </p>
        </CardContent>
      </Card>

      {/* Technicians List */}
      <Card>
        <CardHeader>
          <CardTitle>Técnicos Conectados ({technicians.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center py-12 text-muted-foreground">Cargando ubicaciones...</p>
          ) : technicians.length === 0 ? (
            <p className="text-center py-12 text-muted-foreground">No hay técnicos conectados</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {technicians.map((tech) => (
                <div
                  key={tech.id}
                  className="p-4 border border-border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-foreground">{tech.name}</h3>
                      <p className="text-sm text-muted-foreground">{tech.email}</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs px-2 py-1 bg-success/10 text-success rounded-full">
                      <Zap className="w-3 h-3" />
                      En línea
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      {tech.phone}
                    </div>
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 mt-0.5" />
                      <div>
                        <p>{tech.latitude.toFixed(6)}, {tech.longitude.toFixed(6)}</p>
                        <p className="text-xs text-muted-foreground/70 mt-1">
                          Actualizado: {new Date(tech.recorded_at).toLocaleTimeString('es-MX')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
