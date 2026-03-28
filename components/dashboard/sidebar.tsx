'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { signOut } from 'next-auth/react'
import { 
  LayoutDashboard, 
  Users, 
  Wrench, 
  FileText, 
  Settings, 
  LogOut,
  MapPin,
  ShoppingCart,
  BarChart3,
  Home
} from 'lucide-react'

const adminMenuItems = [
  { icon: BarChart3, label: 'Dashboard', href: '/dashboard' },
  { icon: ShoppingCart, label: 'Órdenes', href: '/admin/orders' },
  { icon: FileText, label: 'Cotizaciones', href: '/admin/quotes' },
  { icon: Users, label: 'Clientes', href: '/admin/clients' },
  { icon: Wrench, label: 'Técnicos', href: '/admin/technicians' },
  { icon: MapPin, label: 'Mapa de Técnicos', href: '/admin/map' },
  { icon: Settings, label: 'Catálogo', href: '/admin/catalog' },
]

const technicianMenuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: ShoppingCart, label: 'Mis Órdenes', href: '/technician/orders' },
  { icon: FileText, label: 'Cotizaciones', href: '/technician/quotes' },
  { icon: Home, label: 'Mi Perfil', href: '/technician/profile' },
]

const clientMenuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: ShoppingCart, label: 'Mis Órdenes', href: '/client/orders' },
  { icon: FileText, label: 'Cotizaciones', href: '/client/quotes' },
  { icon: Wrench, label: 'Mis Equipos', href: '/client/equipment' },
  { icon: Home, label: 'Mi Perfil', href: '/client/profile' },
]

interface SidebarProps {
  user: {
    id: string
    name: string
    email: string
    role: string
    avatar_url?: string
  }
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()
  
  let menuItems = adminMenuItems
  if (user.role === 'technician') menuItems = technicianMenuItems
  if (user.role === 'client') menuItems = clientMenuItems

  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-800 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">CT</span>
          </div>
          <div>
            <div className="font-bold text-foreground">CoolTrack</div>
            <div className="text-xs text-muted-foreground">Pro</div>
          </div>
        </Link>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-border space-y-4">
        <div className="px-2 py-2">
          <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
        </div>
        <button
          onClick={() => signOut({ redirect: true, callbackUrl: '/auth/login' })}
          className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
