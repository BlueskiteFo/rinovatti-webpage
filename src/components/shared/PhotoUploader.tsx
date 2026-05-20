'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { PHOTO_INSTRUCTIONS } from '@/lib/constants/rinnovati'

type Props = {
  onPhotoSelected: (dataUrl: string) => void
}

export function PhotoUploader({ onPhotoSelected }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFile(file: File) {
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result
      if (typeof result === 'string') onPhotoSelected(result)
    }
    reader.readAsDataURL(file)
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) handleFile(file)
  }

  return (
    <div className="space-y-6">
      {/* Zona de upload */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className="border-rv-sand hover:border-rv-terracotta hover:bg-rv-terracotta-light cursor-pointer rounded border-[1.5px] border-dashed p-14 text-center transition-all"
      >
        <div className="bg-rv-sand mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full text-2xl">
          📷
        </div>
        <h3 className="font-heading text-rv-dark mb-2 text-[22px] font-normal">
          Sube una foto de tu sala
        </h3>
        <p className="text-rv-mid mb-6 text-[13px]">PNG o JPG — vista frontal, buena iluminación</p>
        <button className="bg-rv-dark hover:bg-rv-terracotta pointer-events-none rounded-[2px] px-6 py-2.5 text-[12px] font-medium tracking-[0.08em] text-white uppercase transition-colors">
          Seleccionar foto
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={handleInputChange}
        />
      </div>

      {/* Instrucciones */}
      <div className="bg-rv-cream border-rv-sand rounded border p-5">
        <p className="text-rv-charcoal mb-3 text-[12px] font-medium tracking-[0.1em] uppercase">
          {PHOTO_INSTRUCTIONS.title}
        </p>
        <ol className="list-inside list-decimal space-y-2">
          {PHOTO_INSTRUCTIONS.steps.map((step, i) => (
            <li key={i} className="text-rv-mid text-[13px] leading-relaxed">
              {step}
            </li>
          ))}
        </ol>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="relative mb-2 aspect-video overflow-hidden rounded">
              <Image
                src={PHOTO_INSTRUCTIONS.goodAngleImageUrl}
                alt="Ángulo correcto"
                fill
                className="object-cover"
              />
            </div>
            <p className="text-rv-mid text-[11px]">{PHOTO_INSTRUCTIONS.goodAngleLabel}</p>
          </div>
          <div className="text-center">
            <div className="relative mb-2 aspect-video overflow-hidden rounded">
              <Image
                src={PHOTO_INSTRUCTIONS.badAngleImageUrl}
                alt="Ángulo a evitar"
                fill
                className="object-cover opacity-60"
              />
            </div>
            <p className="text-rv-mid text-[11px]">{PHOTO_INSTRUCTIONS.badAngleLabel}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
