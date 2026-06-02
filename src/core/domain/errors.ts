// ─── Error base del dominio ───────────────────────────────────────────────────

/**
 * Error base para todos los errores de la capa de dominio.
 * Extiende Error nativo y agrega `code` para identificación programática.
 */
export class DomainError extends Error {
  /** Código identificador del error (ej: 'DOMAIN_ERROR', 'NOT_FOUND', 'VALIDATION_ERROR') */
  readonly code: string

  constructor(message: string, code = 'DOMAIN_ERROR') {
    super(message)
    this.name = 'DomainError'
    this.code = code
    // Restaurar la cadena de prototipos (necesario para instanceof con targets < ES2015)
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

// ─── Errores específicos ──────────────────────────────────────────────────────

/**
 * Recurso no encontrado (equivale a HTTP 404).
 * Uso: cuando un slug de producto no existe, un usuario no se encuentra, etc.
 */
export class NotFoundError extends DomainError {
  /** Tipo de recurso buscado (ej: 'Product', 'User') */
  readonly resource: string
  /** Identificador usado en la búsqueda */
  readonly identifier: string

  constructor(resource: string, identifier: string) {
    super(`${resource} no encontrado: "${identifier}"`, 'NOT_FOUND')
    this.name = 'NotFoundError'
    this.resource = resource
    this.identifier = identifier
  }
}

/**
 * Error de validación de datos (equivale a HTTP 400).
 * Uso: cuando un schema Zod falla o datos de entrada son inválidos.
 */
export class ValidationError extends DomainError {
  /** Lista de errores de validación individuales */
  readonly fieldErrors: Record<string, string[]>

  constructor(message: string, fieldErrors: Record<string, string[]> = {}) {
    super(message, 'VALIDATION_ERROR')
    this.name = 'ValidationError'
    this.fieldErrors = fieldErrors
  }

  /** Crea un ValidationError a partir de un ZodError */
  static fromZodError(zodError: { flatten(): { fieldErrors: Record<string, string[]> } }): ValidationError {
    const flat = zodError.flatten()
    const errorDetails = Object.entries(flat.fieldErrors)
      .map(([field, msgs]) => `${field}: ${msgs.join(', ')}`)
      .join(' | ')
    const message = errorDetails ? `Datos inválidos -> ${errorDetails}` : 'Datos de entrada inválidos'
    return new ValidationError(message, flat.fieldErrors)
  }
}
