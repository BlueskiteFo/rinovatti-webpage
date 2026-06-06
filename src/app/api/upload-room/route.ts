import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

/**
 * POST /api/upload-room
 *
 * Recibe una imagen de sala en base64 (data URL), la sube a Supabase Storage
 * como archivo temporal y devuelve la URL pública HTTPS.
 *
 * fal.ai solo acepta URLs públicas — no base64 ni blob URLs.
 */

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!,
  { auth: { persistSession: false } },
)

const BUCKET = 'product-images'

export async function POST(req: Request) {
  try {
    const body = await req.json() as { dataUrl?: string }

    if (!body.dataUrl || typeof body.dataUrl !== 'string') {
      return NextResponse.json({ error: 'dataUrl requerido' }, { status: 400 })
    }

    // Parsear el data URL: "data:image/jpeg;base64,<datos>"
    const matches = body.dataUrl.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/)
    if (!matches) {
      return NextResponse.json({ error: 'Formato de dataUrl inválido' }, { status: 400 })
    }

    const mimeType   = matches[1]                          // e.g. "image/jpeg"
    const base64Data = matches[2]
    const buffer     = Buffer.from(base64Data, 'base64')
    const ext        = mimeType.split('/')[1]?.replace('jpeg', 'jpg') ?? 'jpg'

    // Nombre único para evitar colisiones
    const fileName    = `room-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const storagePath = `rooms/temp/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, buffer, {
        contentType: mimeType,
        upsert: false,
      })

    if (uploadError) {
      return NextResponse.json(
        { error: `Error subiendo imagen: ${uploadError.message}` },
        { status: 500 },
      )
    }

    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(storagePath)

    return NextResponse.json({ url: urlData.publicUrl })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error inesperado'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
