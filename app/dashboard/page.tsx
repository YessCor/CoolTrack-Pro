'use client'

import { useSession } from 'next-auth/react'
import { AdminDashboard } from '@/components/dashboard/admin-dashboard'
import { TechnicianDashboard } from '@/components/dashboard/technician-dashboard'
import { ClientDashboard } from '@/components/dashboard/client-dashboard'

export default function DashboardPage() {
  const { data: session } = useSession()

  if (!session?.user) return null

  const role = (session.user as any).role

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Bienvenido, {session.user.name}
        </h1>
        <p className="text-muted-foreground mt-1">
          {role === 'admin' && 'Panel de Administración'}
          {role === 'technician' && 'Dashboard de Técnico'}
          {role === 'client' && 'Tu Portal de Servicio'}
        </p>
      </div>

      {role === 'admin' && <AdminDashboard />}
      {role === 'technician' && <TechnicianDashboard />}
      {role === 'client' && <ClientDashboard />}
    </div>
  )
}
