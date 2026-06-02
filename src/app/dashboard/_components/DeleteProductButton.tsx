'use client'

import { deleteProductAction } from '@/app/dashboard/actions'

interface DeleteProductButtonProps {
  productId: string
  productName: string
}

/**
 * Client Component hoja para el botón de eliminación.
 * Es el único nodo que necesita interactividad (confirm dialog).
 * El resto del dashboard permanece como Server Component.
 */
export function DeleteProductButton({ productId, productName }: DeleteProductButtonProps) {
  const boundAction = deleteProductAction.bind(null, productId)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    if (!confirm(`¿Eliminar «${productName}»? Esta acción no se puede deshacer.`)) {
      e.preventDefault()
    }
  }

  return (
    <form action={boundAction} onSubmit={handleSubmit}>
      <button
        type="submit"
        className="inline-flex items-center gap-1.5 text-[11px] font-medium tracking-[0.08em] uppercase text-red-600 border border-red-200 px-3 py-1.5 rounded-sm hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="11"
          height="11"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
          <path d="M10 11v6" />
          <path d="M14 11v6" />
          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
        </svg>
        Eliminar
      </button>
    </form>
  )
}
