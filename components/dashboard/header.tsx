'use client'

import { Bell, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface HeaderProps {
  user: {
    id: string
    name: string
    email: string
    role: string
  }
}

export function Header({ user }: HeaderProps) {
  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 gap-4">
      <div className="flex items-center gap-2 flex-1 max-w-md">
        <Search className="w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar órdenes, clientes..."
          className="h-9 bg-muted border-0 text-sm"
        />
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 hover:bg-muted rounded-lg transition-colors">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
        </button>
      </div>
    </header>
  )
}
