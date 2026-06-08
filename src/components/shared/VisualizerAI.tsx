'use client'

import { useState } from 'react'
import Image from 'next/image'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'
import { generateWithAI } from '@/lib/visualizer/engines/ai'
import { buildWhatsAppUrl } from '@/lib/constants/rinnovati'
import { type Product, type ProductColor } from '@/core/domain/entities'

type Props = {
  product: Product
  roomPhotoUrl: string
  onRetry: () => void
  onCancel: () => void
}

type ViewState = 'idle' | 'generating' | 'done' | 'error'

/** Etiquetas de perspectiva en el mismo orden en que el backend las genera */
const PERSPECTIVE_LABELS = ['Centro', 'Izquierda', 'Derecha', 'Fondo'] as const

export function VisualizerAI({ product, roomPhotoUrl, onRetry, onCancel }: Props) {
  const [viewState, setViewState]             = useState<ViewState>('idle')
  const [selectedColor, setSelectedColor]     = useState<ProductColor>(product.colors[0])
  const [roomWidth, setRoomWidth]             = useState('')
  const [generatedImageUrls, setGeneratedImageUrls] = useState<string[]>([])
  const [errorMessage, setErrorMessage]       = useState<string | null>(null)

  async function handleGenerate() {
    setViewState('generating')
    setErrorMessage(null)
    setGeneratedImageUrls([])

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

    setGeneratedImageUrls(data.imageUrls)
    setViewState('done')
  }

  // ─── Estado: idle ───────────────────────────────────────────────────────────
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
            ✦ Generar 4 perspectivas
          </button>
        </div>
      </div>
    )
  }

  // ─── Estado: generating ─────────────────────────────────────────────────────
  if (viewState === 'generating') {
    return (
      <div className="flex animate-[rv-fade-in_0.25s_ease-out] flex-col items-center justify-center space-y-6 py-24">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#E8DDD5] border-t-[#C4714A]" />
        <div className="text-center">
          <p className="font-heading text-rv-dark text-[20px] font-light">
            Generando 4 perspectivas…
          </p>
          <p className="text-rv-mid mt-2 text-[13px]">
            Centro · Izquierda · Derecha · Fondo — en paralelo
          </p>
          <p className="text-rv-mid mt-1 text-[12px]">Esto toma aproximadamente 60 segundos</p>
        </div>
        <p className="text-rv-charcoal text-[12px]">
          {product.name} · {selectedColor.name}
        </p>
      </div>
    )
  }

  // ─── Estado: done — Galería 2×2 ─────────────────────────────────────────────
  if (viewState === 'done' && generatedImageUrls.length > 0) {
    return (
      <div className="animate-[rv-fade-in_0.25s_ease-out] space-y-5">

        {/* Título de galería */}
        <div className="text-center">
          <p className="font-heading text-rv-dark text-[18px] font-light tracking-wide">
            {product.name} <span className="text-rv-mid font-sans text-[14px]">· {selectedColor.name}</span>
          </p>
          <p className="text-rv-mid mt-1 text-[11px] tracking-[0.08em] uppercase">
            4 perspectivas generadas por IA · Toca para zoom máximo
          </p>
        </div>

        {/*
          Grid 2×2 en desktop · scroll horizontal en móvil (slider táctil).
          En móvil (< sm) las 4 tarjetas se muestran en fila horizontal
          desplazable con snap, para facilitar el swipe y el zoom táctil.
        */}
        <div
          className="
            grid gap-3
            sm:grid-cols-2
            grid-cols-1
            max-sm:flex max-sm:overflow-x-auto max-sm:snap-x max-sm:snap-mandatory
            max-sm:scroll-smooth max-sm:pb-2
          "
        >
          {generatedImageUrls.map((url, index) => (
            <div
              key={url}
              /* En móvil: tarjeta de ancho fijo con snap; en desktop: block normal */
              className="
                relative aspect-[4/5] overflow-hidden rounded bg-[#f5f5f3]
                flex items-center justify-center
                max-sm:min-w-[82vw] max-sm:snap-center max-sm:flex-shrink-0
              "
            >
              {/* Zoom individual por perspectiva */}
              <Zoom>
                <Image
                  src={url}
                  alt={`${product.name} — perspectiva ${PERSPECTIVE_LABELS[index] ?? index + 1}`}
                  width={1200}
                  height={1500}
                  className="w-full h-full object-contain"
                  unoptimized={true}
                  priority={index < 2}
                />
              </Zoom>

              {/* Etiqueta de perspectiva */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent px-3 py-3 pointer-events-none">
                <p className="font-heading text-[13px] font-normal text-white">
                  {PERSPECTIVE_LABELS[index]}
                </p>
                <p className="text-[10px] text-white/60">Toca para ver en detalle</p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-rv-mid text-center text-[11px]">
          Imágenes generadas por IA · resultado orientativo · resolución nativa fal.ai
        </p>

        {/* Acciones */}
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
            ↺ Regenerar perspectivas
          </button>
          <button
            onClick={() => {
              const url = buildWhatsAppUrl({
                productName: product.name,
                colorName: selectedColor.name,
                roomWidth,
              })
              window.open(url, '_blank', 'noopener,noreferrer')
            }}
            className="bg-rv-terracotta flex-1 rounded-[2px] px-6 py-3 font-sans text-[12px] font-medium tracking-[0.08em] text-white uppercase transition-colors hover:bg-[#A85D3A]"
          >
            ✓ Agendar cita
          </button>
        </div>
      </div>
    )
  }

  // ─── Estado: error ──────────────────────────────────────────────────────────
  return (
    <div className="flex animate-[rv-fade-in_0.25s_ease-out] flex-col items-center justify-center space-y-6 py-24 text-center">
      <div className="bg-rv-sand flex h-14 w-14 items-center justify-center rounded-full text-2xl">
        ⚠
      </div>
      <div>
        <p className="font-heading text-rv-dark text-[20px] font-light">
          No pudimos generar las perspectivas
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
