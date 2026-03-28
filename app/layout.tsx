import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { SessionProvider } from 'next-auth/react'
import './globals.css'

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  title: 'CoolTrack Pro - Gestión de Servicios HVAC',
  description: 'Plataforma profesional para gestión de órdenes de servicio, cotizaciones y seguimiento de técnicos de aire acondicionado',
  keywords: ['HVAC', 'aire acondicionado', 'mantenimiento', 'servicio técnico'],
  openGraph: {
    title: 'CoolTrack Pro',
    description: 'Gestión integral de servicios HVAC',
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#0052CC',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans`}>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
