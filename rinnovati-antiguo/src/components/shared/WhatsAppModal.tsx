'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { buildWhatsAppMessage } from '@/lib/constants/rinnovati'

type Props = {
  open: boolean
  onClose: () => void
  productName: string
  colorName: string
  roomWidth: string
}

export function WhatsAppModal({ open, onClose, productName, colorName, roomWidth }: Props) {
  const [copied, setCopied] = useState(false)

  const message = buildWhatsAppMessage({ productName, colorName, roomWidth })

  function handleCopy() {
    navigator.clipboard.writeText(message).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-rv-warm-white border-rv-sand max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-heading text-rv-dark text-[22px] font-normal">
            Tu mensaje está listo
          </DialogTitle>
        </DialogHeader>

        <p className="text-rv-mid mb-4 text-[13px] leading-relaxed">
          Copia este mensaje y envíalo por WhatsApp a Rinnovati para agendar tu cita. Adjunta
          también la foto de tu sala para que puedan prepararse.
        </p>

        {/* Mensaje pre-armado */}
        <div className="bg-rv-cream border-rv-sand text-rv-dark rounded border p-4 font-sans text-[14px] leading-relaxed whitespace-pre-wrap">
          {message}
        </div>

        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <Button
            onClick={handleCopy}
            variant="outline"
            className="border-rv-sand text-rv-charcoal hover:border-rv-terracotta hover:text-rv-terracotta flex-1 rounded-[2px]"
          >
            {copied ? '✓ Copiado' : 'Copiar mensaje'}
          </Button>
          <Button
            onClick={onClose}
            className="bg-rv-dark hover:bg-rv-terracotta flex-1 rounded-[2px] text-[12px] tracking-[0.08em] text-white uppercase"
          >
            Cerrar
          </Button>
        </div>

        <p className="text-rv-mid mt-1 text-center text-[11px]">
          Integración con WhatsApp disponible próximamente.
        </p>
      </DialogContent>
    </Dialog>
  )
}
