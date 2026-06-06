'use client'

import { useState } from 'react'
import Image from 'next/image'
import { WhatsAppModal } from './WhatsAppModal'
import { generateWithAI } from '@/lib/visualizer/engines/ai'
import type { Product, ProductColor } from '@/core/domain/entities'

type Props = {
  product: Product
  roomPhotoUrl: string
  onRetry: () => void
  onCancel: () => void
}

type ViewState = 'idle' | 'generating' | 'done' | 'error'

export function VisualizerAI({ product, roomPhotoUrl, onRetry, onCancel }: Props) {
  const [viewState, setViewState] = useState<ViewState>('idle')
  const [selectedColor, setSelectedColor] = useState<ProductColor>(product.colors[0])
  const [roomWidth, setRoomWidth] = useState('')
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)

  async function handleGenerate() {
    setViewState('generating')
    setErrorMessage(null)

    const { data, error } = await generateWithAI({
      roomImageBase64: roomPhotoUrl,
      product,
      colorName: selectedColor.name,
    })

    if (error || !data) {
      setErrorMessage(error ?? 'Error desconocido')
      setViewState('error')
      return
    }

    setGeneratedImageUrl(data.imageUrl)
    setViewState('done')
  }

  if (viewState === 'idle') {
    return (
      <div className="animate-[rv-fade-in_0.25s_ease-out] space-y-6">
        <div className="relative aspect-video w-full overflow-hidden rounded">
          <Image
            src={roomPhotoUrl}
            alt="Tu sala"
            fill
            sizes="100vw"
            className="object-cover"
            unoptimized
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <p className="text-[13px] text-white/80">Vista previa de tu sala</p>
          </div>
        </div>

        <div className="bg-rv-cream border-rv-sand space-y-4 rounded border p-5">
          <div>
            <label className="text-rv-charcoal mb-2 block text-[11px] font-medium tracking-[0.12em] uppercase">
              Color — {selectedColor.name}
            </label>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((color) => (
                <button
                  key={color.name}
                  title={color.name}
                  onClick={() => setSelectedColor(color)}
                  className={`h-7 w-7 rounded-full border-2 transition-all ${
                    selectedColor.name === color.name
                      ? 'border-rv-dark scale-110'
                      : 'hover:border-rv-mid border-transparent'
                  }`}
                  style={{ backgroundColor: color.hex }}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="text-rv-charcoal mb-2 block text-[11px] font-medium tracking-[0.12em] uppercase">
              Ancho de tu espacio (cm) — opcional
            </label>
            <input
              type="number"
              placeholder="Ej: 320"
              value={roomWidth}
              onChange={(e) => setRoomWidth(e.target.value)}
              className="border-rv-sand text-rv-dark focus:border-rv-terracotta w-full rounded-[2px] border bg-white px-4 py-2.5 font-sans text-[14px] transition-colors outline-none sm:w-48"
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            onClick={onCancel}
            className="border-rv-sand text-rv-charcoal hover:border-rv-terracotta hover:text-rv-terracotta flex-1 rounded-[2px] border px-6 py-3 font-sans text-[12px] font-medium tracking-[0.08em] uppercase transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onRetry}
            className="border-rv-sand text-rv-charcoal hover:border-rv-terracotta hover:text-rv-terracotta flex-1 rounded-[2px] border px-6 py-3 font-sans text-[12px] font-medium tracking-[0.08em] uppercase transition-colors"
          >
            Cambiar foto
          </button>
          <button
            onClick={handleGenerate}
            className="bg-rv-terracotta flex-1 rounded-[2px] px-6 py-3 font-sans text-[12px] font-medium tracking-[0.08em] text-white uppercase transition-colors hover:bg-[#A85D3A]"
          >
            ✦ Generar visualización
          </button>
        </div>
      </div>
    )
  }

  if (viewState === 'generating') {
    return (
      <div className="flex animate-[rv-fade-in_0.25s_ease-out] flex-col items-center justify-center space-y-6 py-24">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#E8DDD5] border-t-[#C4714A]" />
        <div className="text-center">
          <p className="font-heading text-rv-dark text-[20px] font-light">
            Generando visualización…
          </p>
          <p className="text-rv-mid mt-2 text-[13px]">Esto toma aproximadamente 30 segundos</p>
        </div>
        <p className="text-rv-charcoal text-[12px]">
          {product.name} · {selectedColor.name}
        </p>
      </div>
    )
  }

  if (viewState === 'done' && generatedImageUrl) {
    return (
      <div className="animate-[rv-fade-in_0.25s_ease-out] space-y-4">
        <div className="relative w-full overflow-hidden rounded">
          <Image
            src={generatedImageUrl}
            alt={`${product.name} en tu sala`}
            width={1200}
            height={800}
            className="w-full object-cover"
            unoptimized
          />
          <div className="bg-rv-dark/80 absolute bottom-5 left-5 rounded px-4 py-3 text-white backdrop-blur-sm">
            <p className="font-heading text-[16px] font-normal">{product.name}</p>
            <p className="mt-0.5 text-[11px] text-white/60">
              {selectedColor.name} · Generado por IA
            </p>
          </div>
        </div>

        <p className="text-rv-mid text-center text-[11px]">
          Imagen generada por IA — resultado orientativo
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            onClick={onRetry}
            className="border-rv-sand text-rv-charcoal hover:border-rv-terracotta hover:text-rv-terracotta flex-1 rounded-[2px] border px-6 py-3 font-sans text-[12px] font-medium tracking-[0.08em] uppercase transition-colors"
          >
            Cambiar foto
          </button>
          <button
            onClick={handleGenerate}
            className="border-rv-sand text-rv-charcoal hover:border-rv-terracotta hover:text-rv-terracotta flex-1 rounded-[2px] border px-6 py-3 font-sans text-[12px] font-medium tracking-[0.08em] uppercase transition-colors"
          >
            Regenerar
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="bg-rv-terracotta flex-1 rounded-[2px] px-6 py-3 font-sans text-[12px] font-medium tracking-[0.08em] text-white uppercase transition-colors hover:bg-[#A85D3A]"
          >
            ✓ Agendar cita
          </button>
        </div>

        <WhatsAppModal
          open={showModal}
          onClose={() => setShowModal(false)}
          productName={product.name}
          colorName={selectedColor.name}
          roomWidth={roomWidth}
        />
      </div>
    )
  }

  return (
    <div className="flex animate-[rv-fade-in_0.25s_ease-out] flex-col items-center justify-center space-y-6 py-24 text-center">
      <div className="bg-rv-sand flex h-14 w-14 items-center justify-center rounded-full text-2xl">
        ⚠
      </div>
      <div>
        <p className="font-heading text-rv-dark text-[20px] font-light">
          No pudimos generar la imagen
        </p>
        {errorMessage && <p className="text-rv-mid mt-2 text-[13px]">{errorMessage}</p>}
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          onClick={onRetry}
          className="border-rv-sand text-rv-charcoal hover:border-rv-terracotta hover:text-rv-terracotta rounded-[2px] border px-6 py-3 font-sans text-[12px] font-medium tracking-[0.08em] uppercase transition-colors"
        >
          Cambiar foto
        </button>
        <button
          onClick={handleGenerate}
          className="bg-rv-terracotta rounded-[2px] px-6 py-3 font-sans text-[12px] font-medium tracking-[0.08em] text-white uppercase transition-colors hover:bg-[#A85D3A]"
        >
          Reintentar
        </button>
      </div>
    </div>
  )
}
