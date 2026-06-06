'use server'

import { revalidatePath } from 'next/cache'
import { createProductUseCase, updateProductUseCase, deleteProductUseCase } from '@/core/infrastructure/dependencies'
import { DomainError } from '@/core/domain/errors'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const COLOR_MAP: Record<string, string> = {
  blanco: '#FFFFFF',
  negro: '#000000',
  gris: '#808080',
  'gris claro': '#D3D3D3',
  'gris oscuro': '#A9A9A9',
  beige: '#F5F5DC',
  crema: '#FFFDD0',
  arena: '#F4A460',
  marron: '#8B4513',
  'marrón': '#8B4513',
  chocolate: '#D2691E',
  azul: '#0000FF',
  'azul marino': '#000080',
  verde: '#008000',
  'verde esmeralda': '#50C878',
  rojo: '#FF0000',
  terracota: '#E2725B',
  amarillo: '#FFFF00',
  mostaza: '#FFDB58',
  naranja: '#FFA500',
  rosa: '#FFC0CB',
  morado: '#800080',
  plomo: '#708090',
  'palo rosa': '#DAB5BA',
  taupe: '#483C32',
  crudo: '#F5F5DC',
  hueso: '#F9F6EE',
  perla: '#EAE0C8',
}

function getHexForColor(name: string): string {
  const normalized = name.toLowerCase().trim()
  return COLOR_MAP[normalized] || '#9CA3AF' // Gris neutro por defecto si no existe
}

/**
 * Normaliza el campo "colors" del FormData.
 * El formulario envía una cadena separada por comas; lo convertimos al formato
 * JSON que espera el caso de uso: [{ name: string, hex: string }].
 */
function normalizeColorsField(formData: FormData): void {
  const colorsString = formData.get('colors')
  if (typeof colorsString === 'string' && colorsString.trim()) {
    const colorsArray = colorsString
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean)
      .map((name) => ({ name, hex: getHexForColor(name) }))
    formData.set('colors', JSON.stringify(colorsArray))
  }
}

// ─── Server Actions ────────────────────────────────────────────────────────────

export async function createProductAction(prevState: unknown, formData: FormData) {
  try {
    normalizeColorsField(formData)
    await createProductUseCase.execute(formData)
    revalidatePath('/dashboard')
    revalidatePath('/catalogo')
    return { success: true, error: null }
  } catch (error) {
    if (error instanceof DomainError) {
      return { success: false, error: error.message }
    }
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: 'Ocurrió un error inesperado al crear el producto.' }
  }
}

export async function updateProductAction(
  id: string,
  prevState: unknown,
  formData: FormData,
) {
  try {
    normalizeColorsField(formData)
    await updateProductUseCase.execute(id, formData)
    revalidatePath('/dashboard')
    revalidatePath('/catalogo')
    return { success: true, error: null }
  } catch (error) {
    if (error instanceof DomainError) {
      return { success: false, error: error.message }
    }
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: 'Ocurrió un error inesperado al actualizar el producto.' }
  }
}

export async function deleteProductAction(id: string, _formData: FormData): Promise<void> {
  try {
    await deleteProductUseCase.execute(id)
    revalidatePath('/dashboard')
    revalidatePath('/catalogo')
  } catch (error) {
    // Los errores en form actions que retornan void se loguean en servidor.
    // El cliente verá la página refrescada sin el producto si tuvo éxito.
    console.error('[deleteProductAction] Error al eliminar producto:', error)
  }
}
