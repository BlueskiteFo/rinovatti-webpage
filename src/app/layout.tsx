import type { Metadata } from 'next'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'
import { Toaster } from '@/components/ui/sonner'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-dm-sans',
})

export const metadata: Metadata = {
  title: 'Rinnovati — Muebles que transforman tu hogar',
  description:
    'Diseñamos y fabricamos muebles a medida para cada espacio. Visualiza cómo quedarán en tu sala antes de comprar.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={cn(cormorant.variable, dmSans.variable)} suppressHydrationWarning>
      <body className="bg-rv-warm-white text-rv-dark font-sans antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  )
}
