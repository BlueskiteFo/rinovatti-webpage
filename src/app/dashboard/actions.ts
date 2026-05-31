'use server'

import { createProductUseCase } from '@/core/infrastructure/dependencies'
import { DomainError } from '@/core/domain/errors'

export async function createProductAction(prevState: any, formData: FormData) {
  try {
    const colorsString = formData.get('colors') as string
    if (colorsString) {
      const colorsArray = colorsString
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean)
        .map((name) => ({
          name,
          hex: '#000000', // Código hex por defecto para la validación
        }))
      formData.set('colors', JSON.stringify(colorsArray))
    }

    await createProductUseCase.execute(formData)
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
