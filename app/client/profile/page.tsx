'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'

interface UserProfile {
  id: string
  name: string
  email: string
  phone?: string
  address?: string
  avatar_url?: string
}

export default function ClientProfilePage() {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/users/me')
      const data = await response.json()
      if (data.data) {
        setProfile(data.data)
        setFormData({
          name: data.data.name || '',
          phone: data.data.phone || '',
          address: data.data.address || '',
        })
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      toast({
        title: 'Error',
        description: 'No se pudo cargar el perfil',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/users/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      const data = await response.json()
      setProfile(data.data)

      toast({
        title: 'Perfil actualizado',
        description: 'Tus datos han sido guardados',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo guardar los cambios',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12">Cargando perfil...</div>
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Mi Perfil</h1>
        <p className="text-muted-foreground mt-1">Gestiona tu información personal</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información Personal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Nombre Completo
            </label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Correo Electrónico
            </label>
            <Input value={profile?.email || ''} disabled className="bg-muted" />
            <p className="text-xs text-muted-foreground mt-1">No se puede cambiar el email</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Teléfono
            </label>
            <Input
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+52 55 1234 5678"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Dirección
            </label>
            <Input
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Calle, número, ciudad..."
            />
          </div>

          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Seguridad</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-3">
              Para cambiar tu contraseña, por favor contacta al soporte.
            </p>
            <Button variant="outline">Contactar Soporte</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
