-- ═══════════════════════════════════════════════════════════════════════════════
-- MIGRACIÓN 002 — Añadir context_images a products
-- ═══════════════════════════════════════════════════════════════════════════════

ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS context_images TEXT[] DEFAULT '{}' NOT NULL;

-- Comentario descriptivo
COMMENT ON COLUMN public.products.context_images IS
  'URLs públicas de renders del producto (hasta 4 ángulos) usadas como contexto visual para la IA. Sincronizadas desde la carpeta local Render/.';
