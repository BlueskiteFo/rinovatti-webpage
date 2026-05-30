// Corrección de perspectiva — detección de plano de suelo + homografía (stub)
//
// Para activar:
//   1. Elegir servicio de detección de plano:
//      - Opción A (cloud): Roboflow Inference API con modelo de detección de suelo
//      - Opción B (local): ml5.js PoseNet / BodyPix adaptado para detectar planos
//      - Opción C (API custom): endpoint propio con OpenCV + homography matrix
//   2. Instalar dependencias según la opción elegida
//   3. Crear /src/app/api/visualizer/perspective/route.ts
//   4. Implementar applyPerspectiveCorrection abajo
//   5. Cambiar VISUALIZER_CONFIG.mode a "perspective" en config.ts
//
// Flujo esperado:
//   1. Detectar plano del suelo en la foto de la sala → obtener 4 puntos de referencia
//   2. Calcular matriz de homografía entre plano detectado y plano de la foto del mueble
//   3. Transformar (warp) el PNG del mueble para que su perspectiva coincida
//   4. Componer la imagen final

export async function applyPerspectiveCorrection(_params: {
  roomImageBase64: string;
  furnitureImageBase64: string;
  targetX: number;
  targetY: number;
}): Promise<{ compositeImageUrl: string }> {
  throw new Error(
    "Perspective engine no implementado. Ver src/lib/visualizer/engines/perspective.ts para instrucciones."
  );
}
