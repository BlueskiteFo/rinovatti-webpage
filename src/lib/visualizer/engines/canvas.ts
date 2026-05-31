// Opción 2 — Canvas overlay (ACTIVO)
// Superposición PNG client-side. Toda la lógica vive en VisualizerCanvas.tsx.
// Este módulo expone solo los parámetros que el componente necesita.

import { VISUALIZER_CONFIG } from "../config";

export function getCanvasConfig() {
  if (VISUALIZER_CONFIG.mode !== "canvas") {
    throw new Error("Canvas engine invocado con modo incorrecto");
  }
  return VISUALIZER_CONFIG.canvasOptions ?? { defaultScalePercent: 42, overlayOpacity: 0.92 };
}
