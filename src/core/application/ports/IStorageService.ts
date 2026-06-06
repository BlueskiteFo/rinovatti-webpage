/**
 * Puerto de salida para el servicio de almacenamiento de archivos.
 * La capa de infraestructura provee la implementación concreta
 * (Supabase Storage, AWS S3, Cloudinary, etc.).
 *
 * Responsabilidad única: abstraer la operación de subir archivos
 * sin acoplar el caso de uso a ningún proveedor específico.
 */
export interface IStorageService {
  /**
   * Sube un archivo al servicio de almacenamiento y retorna su URL pública.
   *
   * @param file - Archivo a subir (File API nativa del browser / Node.js)
   * @param path - Ruta destino dentro del bucket (ej: `products/sofia-beige.jpg`)
   * @returns URL pública del archivo subido
   * @throws InfrastructureError si la subida falla en el proveedor externo
   */
  uploadImage(file: File, path: string): Promise<string>

  /**
   * Elimina un archivo del servicio de almacenamiento a partir de su URL pública.
   * Si el archivo no existe, no lanza error (operación idempotente).
   *
   * @param url - URL pública del archivo a eliminar
   * @throws InfrastructureError si la eliminación falla en el proveedor externo
   */
  deleteImage(url: string): Promise<void>
}
