export type VisualizerMode = "canvas" | "ai" | "perspective";

export type VisualizerEngineConfig = {
  mode: VisualizerMode;
  /** canvas: overlay PNG client-side, sin API externa */
  canvasOptions?: {
    defaultScalePercent: number;
    overlayOpacity: number;
  };
  /** ai: llama a /api/visualizer con fal.ai o similar */
  aiOptions?: {
    apiRoute: string;
    provider: "fal" | "replicate" | "openai";
  };
  /** perspective: corrección de plano de suelo + homografía */
  perspectiveOptions?: {
    apiRoute: string;
  };
};

export type VisualizerResult =
  | { mode: "canvas" }           // renderizado client-side, sin resultado server
  | { mode: "ai"; imageUrl: string }
  | { mode: "perspective"; imageUrl: string };
