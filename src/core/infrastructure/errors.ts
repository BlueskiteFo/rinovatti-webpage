import { DomainError } from '@/core/domain/errors'

/**
 * Error originado en la capa de infraestructura (APIs externas, base de datos, servicios de terceros).
 * Extiende DomainError para permitir manejo unificado de errores en las capas superiores.
 *
 * Uso: cuando fal.ai falla, Supabase retorna error, timeout de red, etc.
 */
export class InfrastructureError extends DomainError {
  /** Nombre del servicio o proveedor que originó el error */
  readonly provider: string

  constructor(message: string, provider: string) {
    super(message, 'INFRASTRUCTURE_ERROR')
    this.name = 'InfrastructureError'
    this.provider = provider
  }
}
