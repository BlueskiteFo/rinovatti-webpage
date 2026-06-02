'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface ProductImageZoomProps {
  imageUrl: string
  productName: string
  badge?: 'nuevo' | 'popular' | null
}

export function ProductImageZoom({ imageUrl, productName, badge }: ProductImageZoomProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Prevenir scroll cuando el lightbox está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Cerrar con Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) setIsOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  return (
    <>
      <div className="relative w-full aspect-[4/5] overflow-hidden md:aspect-auto md:min-h-[600px] group">
        <Image
          src={imageUrl}
          alt={productName}
          fill
          unoptimized={true}
          className="object-contain object-center w-full h-full cursor-zoom-in"
          priority
          onClick={() => setIsOpen(true)}
        />

        {/* Badge */}
        {badge && (
          <span
            className={`absolute top-5 left-5 z-10 rounded-[2px] px-3 py-1.5 text-[10px] font-medium tracking-[0.1em] text-white uppercase ${
              badge === 'nuevo' ? 'bg-rv-dark' : 'bg-rv-terracotta'
            }`}
          >
            {badge === 'nuevo' ? 'Nuevo' : 'Popular'}
          </span>
        )}

        {/* Botón de lupa (visible en hover o siempre en mobile) */}
        <button
          onClick={() => setIsOpen(true)}
          className="absolute top-5 right-5 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white text-rv-dark shadow-md transition-transform duration-200 hover:scale-105 md:opacity-0 md:group-hover:opacity-100"
          aria-label="Ver imagen en pantalla completa"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </button>
      </div>

      {/* Lightbox Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm">
          {/* Botones de control top-right */}
          <div className="absolute top-6 right-6 z-10 flex items-center gap-4">
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/70 transition-colors hover:text-white"
              aria-label="Cerrar"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>

          {/* Imagen Full Screen */}
          <div className="relative h-[90vh] w-[90vw] md:h-[95vh] md:w-[95vw]">
            <Image
              src={imageUrl}
              alt={productName}
              fill
              unoptimized={true}
              className="object-contain object-center"
              quality={100}
            />
          </div>
        </div>
      )}
    </>
  )
}
