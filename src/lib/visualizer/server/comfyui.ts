// ComfyUI en fal.ai — Fase Producción
//
// Activar cuando el cliente valide el MVP y se quiera mayor fidelidad:
//   1. Diseñar workflow ComfyUI local: FLUX + IP-Adapter + ControlNet Depth
//   2. Agregar 2-3 fotos por ángulo en referenceImageUrls[] de cada producto
//   3. Exportar workflow como JSON y subir a fal.ai
//   4. Implementar aquí con el workflow ID de fal.ai
//   5. Cambiar AI_ENGINE=comfyui en .env del servidor — el cliente no cambia

export async function generateWithComfyUI(_params: {
  roomImageBase64: string
  productImageUrl: string
  productName: string
  colorName: string
  material: string
}): Promise<{ data: { imageUrl: string } | null; error: string | null }> {
  throw new Error('ComfyUI engine: pendiente implementación Fase Producción')
}
