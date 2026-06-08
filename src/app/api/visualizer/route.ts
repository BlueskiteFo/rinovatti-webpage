import { NextResponse } from 'next/server'
import { GenerateRoomVisualizationUseCase } from '@/core/application/use-cases'
import { aiVisualizerService } from '@/core/infrastructure/dependencies'
import { ValidationError, DomainError } from '@/core/domain/errors'
import { InfrastructureError } from '@/core/infrastructure/errors'

export async function POST(req: Request) {
  try {
    const body: unknown = await req.json()
    const useCase = new GenerateRoomVisualizationUseCase(aiVisualizerService)
    const imageUrls = await useCase.execute(body)
    return NextResponse.json({ imageUrls })
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json(
        { error: error.message, details: error.fieldErrors },
        { status: 400 }
      )
    }

    if (error instanceof InfrastructureError) {
      console.error('[InfrastructureError]', error.provider, error.message)
      return NextResponse.json(
        { error: 'Error del servicio de visualización externa' },
        { status: 500 }
      )
    }

    if (error instanceof DomainError) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    // Errores inesperados de sistema
    const message = error instanceof Error ? error.message : 'Error inesperado'
    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}
