'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import Image from 'next/image'
import { WhatsAppModal } from './WhatsAppModal'
import { getCanvasConfig } from '@/lib/visualizer/engines/canvas'
import type { Product, ProductColor } from '@/core/domain/entities'

type Props = {
  product: Product
  roomPhotoUrl: string
  onRetry: () => void
  onCancel: () => void
}

type Position = { x: number; y: number }

export function VisualizerCanvas({ product, roomPhotoUrl, onRetry, onCancel }: Props) {
  const { defaultScalePercent, overlayOpacity } = getCanvasConfig()

  const [position, setPosition] = useState<Position>({ x: 0, y: 0 })
  const [scale, setScale] = useState(defaultScalePercent)
  const [selectedColor, setSelectedColor] = useState<ProductColor>(product.colors[0])
  const [showModal, setShowModal] = useState(false)
  const [roomWidth, setRoomWidth] = useState('')

  const containerRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const dragStart = useRef<{ mouseX: number; mouseY: number; posX: number; posY: number }>({
    mouseX: 0,
    mouseY: 0,
    posX: 0,
    posY: 0,
  })

  // Centrar el mueble al montar
  useEffect(() => {
    setPosition({ x: 0, y: 0 })
  }, [product.slug])

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      isDragging.current = true
      dragStart.current = {
        mouseX: e.clientX,
        mouseY: e.clientY,
        posX: position.x,
        posY: position.y,
      }
    },
    [position]
  )

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current) return
    const dx = e.clientX - dragStart.current.mouseX
    const dy = e.clientY - dragStart.current.mouseY
    setPosition({
      x: dragStart.current.posX + dx,
      y: dragStart.current.posY + dy,
    })
  }, [])

  const stopDrag = useCallback(() => {
    isDragging.current = false
  }, [])

  // Touch events
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.touches[0]
      isDragging.current = true
      dragStart.current = {
        mouseX: touch.clientX,
        mouseY: touch.clientY,
        posX: position.x,
        posY: position.y,
      }
    },
    [position]
  )

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging.current) return
    const touch = e.touches[0]
    const dx = touch.clientX - dragStart.current.mouseX
    const dy = touch.clientY - dragStart.current.mouseY
    setPosition({
      x: dragStart.current.posX + dx,
      y: dragStart.current.posY + dy,
    })
  }, [])

  return (
    <div className="space-y-4">
      {/* Canvas principal */}
      <div
        ref={containerRef}
        className="bg-rv-cream relative aspect-video w-full overflow-hidden rounded select-none"
        onMouseMove={handleMouseMove}
        onMouseUp={stopDrag}
        onMouseLeave={stopDrag}
      >
        {/* Foto de la sala */}
        <Image
          src={roomPhotoUrl}
          alt="Tu sala"
          fill
          className="pointer-events-none object-cover"
          unoptimized
        />

        {/* Mueble superpuesto — arrastrable */}
        {product.overlayImageUrl && (
          <div
            className="absolute cursor-grab active:cursor-grabbing"
            style={{
              left: '50%',
              top: '60%',
              transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`,
              width: `${scale}%`,
            }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={stopDrag}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.overlayImageUrl}
              alt={product.name}
              draggable={false}
              style={{ opacity: overlayOpacity, width: '100%', display: 'block' }}
            />
          </div>
        )}

        {/* Tag del mueble */}
        <div className="bg-rv-dark/80 absolute bottom-5 left-5 rounded px-4 py-3 text-white backdrop-blur-sm">
          <p className="font-heading text-[16px] font-normal">{product.name}</p>
          <p className="mt-0.5 text-[11px] text-white/60">
            {selectedColor.name} · Arrastra para reposicionar
          </p>
        </div>
      </div>

      {/* Controles */}
      <div className="bg-rv-cream border-rv-sand grid grid-cols-1 gap-4 rounded border p-5 sm:grid-cols-2">
        {/* Tamaño */}
        <div>
          <label className="text-rv-charcoal mb-2 block text-[11px] font-medium tracking-[0.12em] uppercase">
            Tamaño relativo — {scale}%
          </label>
          <input
            type="range"
            min={15}
            max={85}
            value={scale}
            onChange={(e) => setScale(Number(e.target.value))}
            className="w-full accent-[#C4714A]"
          />
        </div>

        {/* Color */}
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

        {/* Ancho de sala (para el mensaje WA) */}
        <div className="sm:col-span-2">
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

      {/* Acciones */}
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
          Reintentar con otra foto
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
