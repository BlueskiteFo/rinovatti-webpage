// Opción 1 — IA generativa (stub)
//
// Para activar:
//   1. Instalar: npm install @fal-ai/client   (o el SDK del proveedor elegido)
//   2. Agregar env vars: FAL_KEY (o equivalente)
//   3. Crear /src/app/api/visualizer/route.ts que llame al proveedor
//   4. Cambiar VISUALIZER_CONFIG.mode a "ai" en config.ts
//
// Proveedor recomendado: fal.ai — modelo fal-ai/flux/dev/image-to-image
// Alternativa: Replicate con stability-ai/stable-diffusion-inpainting

export async function generateWithAI(_params: {
  roomImageBase64: string;
  furnitureName: string;
  colorName: string;
}): Promise<{ imageUrl: string }> {
  throw new Error(
    "AI engine no implementado. Ver src/lib/visualizer/engines/ai.ts para instrucciones."
  );
}
