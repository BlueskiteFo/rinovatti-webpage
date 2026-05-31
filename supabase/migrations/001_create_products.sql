-- ═══════════════════════════════════════════════════════════════════════════════
-- MIGRACIÓN 001 — Rinnovati Webpage
-- Ejecutar en: app.supabase.com → Proyecto rinnovati → SQL Editor
-- ═══════════════════════════════════════════════════════════════════════════════

-- ─── 1. Tabla products ────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.products (
  id                UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  slug              TEXT          NOT NULL UNIQUE,
  name              TEXT          NOT NULL,
  category          TEXT          NOT NULL CHECK (category IN ('sofas','seccionales','butacas','mesas','dormitorios')),
  price             NUMERIC       NOT NULL CHECK (price >= 0),
  material          TEXT          NOT NULL,
  description       TEXT          NOT NULL,
  image_url         TEXT          NOT NULL,
  overlay_image_url TEXT          NULL,
  colors            JSONB         NOT NULL DEFAULT '[]'::jsonb,
  created_at        TIMESTAMPTZ   NOT NULL DEFAULT now()
);

-- Índices para consultas frecuentes
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products (category);
CREATE INDEX IF NOT EXISTS idx_products_slug     ON public.products (slug);

-- RLS (Row Level Security): lectura pública, escritura solo autenticada
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lectura pública de productos"
  ON public.products FOR SELECT
  USING (true);

CREATE POLICY "Solo autenticados pueden crear productos"
  ON public.products FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Solo autenticados pueden actualizar productos"
  ON public.products FOR UPDATE
  TO authenticated
  USING (true);

-- ─── 2. Bucket de Storage: product-images ────────────────────────────────────

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,                                   -- Bucket público
  5242880,                                -- Límite: 5 MB por archivo
  ARRAY['image/jpeg','image/png','image/webp','image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Política de Storage: lectura pública
CREATE POLICY "Lectura pública de imágenes de productos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

-- Política de Storage: subida solo autenticada
CREATE POLICY "Solo autenticados pueden subir imágenes"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'product-images');

-- ─── VERIFICACIÓN ─────────────────────────────────────────────────────────────
-- Después de ejecutar, verifica con:
--   SELECT * FROM public.products LIMIT 1;
--   SELECT * FROM storage.buckets WHERE id = 'product-images';
