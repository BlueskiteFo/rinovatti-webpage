/**
 * scripts/sync-renders.ts
 *
 * Sincroniza la carpeta local `Render/` con Supabase Storage y actualiza
 * la columna `context_images` en la tabla `products`.
 *
 * Uso:
 *   npx tsx scripts/sync-renders.ts
 *
 * Requiere en .env.local:
 *   NEXT_PUBLIC_SUPABASE_URL=...
 *   SUPABASE_SERVICE_KEY=...   ← service_role key (bypass RLS)
 */

import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'

// ─── Cargar variables de entorno ──────────────────────────────────────────────
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_KEY
const BUCKET       = 'product-images'
const RENDER_DIR   = path.resolve(process.cwd(), 'Render')

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('❌  Faltan variables de entorno: NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_KEY')
  process.exit(1)
}

if (SERVICE_KEY === 'REEMPLAZAR_CON_SERVICE_ROLE_KEY') {
  console.error('❌  Debes reemplazar SUPABASE_SERVICE_KEY en .env.local con tu service_role key real.')
  console.error('    La encontrarás en: Supabase Dashboard → Settings → API → service_role secret')
  process.exit(1)
}

// ─── Cliente con service_role (bypass RLS) ────────────────────────────────────
const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false },
})

// ─── Mapa: nombre de carpeta → slug del producto ──────────────────────────────
// Permite hacer match entre la carpeta local y el slug en la DB.
// Si el slug no existe, se creará el producto con datos mínimos.
const FOLDER_TO_SLUG: Record<string, { slug: string; name: string; category: string }> = {
  'BUTACA PETRA':         { slug: 'butaca-petra',          name: 'Butaca Petra',          category: 'butacas'     },
  'BUTACA VELA':          { slug: 'butaca-vela',           name: 'Butaca Vela',           category: 'butacas'     },
  'SECCIONAL MADISSON':   { slug: 'seccional-madisson',    name: 'Seccional Madisson',    category: 'seccionales' },
  'SECCIONAL ZENIT EN L': { slug: 'seccional-zenit-en-l',  name: 'Seccional Zenit en L',  category: 'seccionales' },
  'SECCIONAL ZENIT LINEAL':{ slug: 'seccional-zenit-lineal',name: 'Seccional Zenit Lineal',category: 'seccionales'},
  'SOFÁ AURA':            { slug: 'sofa-aura',             name: 'Sofá Aura',             category: 'sofas'       },
  'SOFÁ MADISSON LITE':   { slug: 'sofa-madisson-lite',    name: 'Sofá Madisson Lite',    category: 'sofas'       },
  'SOFÁ VELA':            { slug: 'sofa-vela',             name: 'Sofá Vela',             category: 'sofas'       },
  'Virginia':             { slug: 'sofa-virginia',         name: 'Sofá Virginia',         category: 'sofas'       },
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Sube un archivo local al bucket de Supabase Storage. Retorna la URL pública. */
async function uploadFile(localPath: string, storagePath: string): Promise<string> {
  const buffer   = fs.readFileSync(localPath)
  const mimeType = localPath.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg'

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, buffer, { contentType: mimeType, upsert: true })

  if (error) {
    throw new Error(`Storage upload error [${storagePath}]: ${error.message}`)
  }

  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(storagePath)
  return urlData.publicUrl
}

/** Obtiene el ID de un producto por slug. Retorna null si no existe. */
async function getProductIdBySlug(slug: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('products')
    .select('id')
    .eq('slug', slug)
    .maybeSingle()

  if (error) throw new Error(`DB query error: ${error.message}`)
  return (data as { id: string } | null)?.id ?? null
}

/** Actualiza context_images de un producto existente. */
async function updateContextImages(id: string, urls: string[]): Promise<void> {
  const { error } = await supabase
    .from('products')
    .update({ context_images: urls })
    .eq('id', id)

  if (error) throw new Error(`DB update error [id=${id}]: ${error.message}`)
}

/** Crea un producto nuevo con datos mínimos + context_images. */
async function createProductWithImages(
  meta: { slug: string; name: string; category: string },
  contextImages: string[],
  firstImageUrl: string,
): Promise<string> {
  const { data, error } = await supabase
    .from('products')
    .insert({
      slug:           meta.slug,
      name:           meta.name,
      category:       meta.category,
      price:          0,
      material:       'Por definir',
      description:    `Producto ${meta.name} — descripción pendiente de completar.`,
      image_url:      firstImageUrl,
      context_images: contextImages,
      colors:         [{ name: 'Por definir', hex: '#888888' }],
    })
    .select('id')
    .single()

  if (error) throw new Error(`DB insert error [${meta.slug}]: ${error.message}`)
  return (data as { id: string }).id
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  console.log('🚀  Iniciando sincronización de renders...\n')

  const folders = fs.readdirSync(RENDER_DIR).filter((f) =>
    fs.statSync(path.join(RENDER_DIR, f)).isDirectory(),
  )

  let created = 0
  let updated = 0
  let errors  = 0

  for (const folder of folders) {
    const meta = FOLDER_TO_SLUG[folder]

    if (!meta) {
      console.warn(`⚠️   Carpeta sin mapa de slug: "${folder}" — omitiendo`)
      continue
    }

    const folderPath = path.join(RENDER_DIR, folder)
    const imageFiles = fs
      .readdirSync(folderPath)
      .filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f))
      .sort()

    if (imageFiles.length === 0) {
      console.warn(`⚠️   Sin imágenes en carpeta: "${folder}" — omitiendo`)
      continue
    }

    console.log(`📦  Procesando "${folder}" (${imageFiles.length} imágenes)...`)

    try {
      // Subir todas las imágenes al Storage
      const publicUrls: string[] = []

      for (const imgFile of imageFiles) {
        const localPath   = path.join(folderPath, imgFile)
        const storagePath = `renders/${meta.slug}/${imgFile}`
        const url         = await uploadFile(localPath, storagePath)
        publicUrls.push(url)
        console.log(`   ✅  Subida: ${storagePath}`)
      }

      // Buscar si el producto ya existe en DB
      const existingId = await getProductIdBySlug(meta.slug)

      if (existingId) {
        await updateContextImages(existingId, publicUrls)
        console.log(`   🔄  Actualizado context_images para "${meta.name}" (id: ${existingId})\n`)
        updated++
      } else {
        const newId = await createProductWithImages(meta, publicUrls, publicUrls[0])
        console.log(`   ➕  Creado producto "${meta.name}" (id: ${newId})\n`)
        created++
      }
    } catch (err) {
      console.error(`   ❌  Error procesando "${folder}": ${err instanceof Error ? err.message : err}\n`)
      errors++
    }
  }

  console.log('─'.repeat(50))
  console.log(`✅  Sincronización completada:`)
  console.log(`    • Productos actualizados: ${updated}`)
  console.log(`    • Productos creados:      ${created}`)
  console.log(`    • Errores:                ${errors}`)
}

main().catch((err) => {
  console.error('❌  Error fatal:', err)
  process.exit(1)
})
