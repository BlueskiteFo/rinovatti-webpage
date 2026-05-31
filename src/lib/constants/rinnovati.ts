// ─── Configuración de contacto ────────────────────────────────────────────────
// Reemplazar con datos reales del cliente antes de lanzar

export const RINNOVATI_CONFIG = {
  whatsappNumber: '51920478785',
  instagramUrl: 'https://instagram.com/rinnovati.pe',
  location: 'Lima, Perú',
  tagline: 'Envíos a todo el país',
  hogaresTransformados: '+500',
} as const

// ─── Plantilla de mensaje WhatsApp ────────────────────────────────────────────
// Usar {productName}, {colorName}, {roomWidth} como variables

export const WHATSAPP_MESSAGE_TEMPLATE =
  'Hola Rinnovati! 👋 Me interesa el *{productName}* en *{colorName}*. ' +
  'Mi espacio mide aproximadamente *{roomWidth} cm* de ancho. ' +
  '¿Podríamos agendar una cita para verlo en tienda?'

export function buildWhatsAppMessage(vars: {
  productName: string
  colorName: string
  roomWidth: string
}): string {
  return WHATSAPP_MESSAGE_TEMPLATE.replace('{productName}', vars.productName)
    .replace('{colorName}', vars.colorName)
    .replace('{roomWidth}', vars.roomWidth || '—')
}

// ─── Instrucciones de foto para el visualizador ───────────────────────────────

export const PHOTO_INSTRUCTIONS = {
  title: '¿Cómo tomar la foto para mejores resultados?',
  steps: [
    'Párate en el centro de la habitación, frente a la pared donde irá el mueble.',
    'Toma la foto a altura de cintura (~90 cm del suelo), sin inclinar el teléfono.',
    'Asegúrate de que el espacio esté bien iluminado y sin objetos que obstruyan la vista.',
    'Incluye una referencia de medida (cinta métrica o un objeto de tamaño conocido).',
  ],
  goodAngleLabel: '✓ Vista frontal, a altura de cintura',
  badAngleLabel: '✗ Evitar diagonal o desde arriba',
  goodAngleImageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=70',
  badAngleImageUrl: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&q=70',
} as const

// ─── Tipos ────────────────────────────────────────────────────────────────────

export type ProductCategory = 'sofas' | 'seccionales' | 'butacas' | 'mesas' | 'dormitorios'

export type ProductColor = {
  name: string
  hex: string
}

export type Product = {
  slug: string
  name: string
  category: ProductCategory
  price: string
  material: string
  description: string
  imageUrl: string
  /** Imagen para superponer en el visualizador (modo canvas). Idealmente PNG sin fondo. */
  overlayImageUrl: string
  /** URLs de fotos adicionales para IP-Adapter (ComfyUI fase producción).
   *  Con 2-3 fotos desde ángulos distintos mejora la fidelidad del mueble generado. */
  referenceImageUrls?: string[]
  colors: ProductColor[]
  badge?: 'nuevo' | 'popular'
  dimensions?: string
}

// ─── Catálogo de productos ────────────────────────────────────────────────────
// imageUrl: fotos reales del catálogo Rinnovati
// overlayImageUrl: para el visualizador canvas — reemplazar con PNG sin fondo cuando estén disponibles
// TODO cliente: proporcionar fotos frontales sobre fondo claro para mejores resultados en el visualizador

export const PRODUCTS: Product[] = [
  {
    slug: 'camila',
    name: 'Camila',
    category: 'sofas',
    price: 'Consultar precio',
    material: 'Tela premium · 3 plazas · Personalizable',
    description:
      'El sofá Camila combina confort y elegancia con líneas limpias y materiales de primera. Disponible en múltiples colores para adaptarse a cualquier sala.',
    imageUrl: 'https://panel.construproductos.com/images/thumbnails/66c782af78af4.jpg',
    overlayImageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=700&q=80',
    colors: [
      { name: 'Gris Oxford', hex: '#6B6E7A' },
      { name: 'Beige Lino', hex: '#C8B99A' },
      { name: 'Azul Noche', hex: '#2C3E6B' },
      { name: 'Verde Salvia', hex: '#7A8F6B' },
    ],
    badge: 'nuevo',
    dimensions: '220 × 95 × 80 cm',
  },
  {
    slug: 'carmin',
    name: 'Carmín',
    category: 'sofas',
    price: 'Consultar precio',
    material: 'Cuero sintético premium · 2 plazas · Minimalista',
    description:
      'Diseño contemporáneo con acabados en cuero sintético de alta resistencia. El sofá Carmín es ideal para espacios modernos que buscan estilo sin sacrificar comodidad.',
    imageUrl: 'https://panel.construproductos.com/images/thumbnails/66c79b0176fd4.jpg',
    overlayImageUrl: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=700&q=80',
    colors: [
      { name: 'Negro', hex: '#1C1A18' },
      { name: 'Caramelo', hex: '#8B7355' },
      { name: 'Blanco Hueso', hex: '#F0EDE8' },
    ],
    dimensions: '185 × 90 × 78 cm',
  },
  {
    slug: 'florencia',
    name: 'Florencia',
    category: 'butacas',
    price: 'Consultar precio',
    material: 'Tela bouclé · Con otomana · Giratoria',
    description:
      'La butaca Florencia es la pieza perfecta para crear un rincón de lectura o descanso. Su tapizado en bouclé y diseño giratorio la hacen única en cualquier espacio.',
    imageUrl: 'https://panel.construproductos.com/images/thumbnails/66c785ab49071.jpg',
    overlayImageUrl: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=700&q=80',
    colors: [
      { name: 'Blanco Hueso', hex: '#E8E0D8' },
      { name: 'Terracota', hex: '#C4714A' },
      { name: 'Verde Botella', hex: '#4A6741' },
    ],
    badge: 'popular',
    dimensions: '85 × 85 × 95 cm',
  },
  {
    slug: 'oslo',
    name: 'Oslo',
    category: 'mesas',
    price: 'Consultar precio',
    material: 'Madera maciza · 4 a 8 personas · A medida',
    description:
      'Mesa de comedor Oslo en madera maciza de primera calidad. Su diseño nórdico y acabados artesanales la convierten en el centro de atención de cualquier comedor.',
    imageUrl: 'https://panel.construproductos.com/images/thumbnails/66c78809d8ba2.jpg',
    overlayImageUrl: 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=700&q=80',
    colors: [
      { name: 'Nogal', hex: '#5C3D2E' },
      { name: 'Wengue', hex: '#1C1A18' },
      { name: 'Natural', hex: '#C8B99A' },
    ],
    dimensions: '160–240 × 90 × 76 cm',
  },
  {
    slug: 'madisson',
    name: 'Madisson',
    category: 'seccionales',
    price: 'Consultar precio',
    material: 'Tela premium · En L · Medidas a pedido',
    description:
      'El seccional Madisson transforma cualquier sala en un espacio de reunión. Su configuración en L se adapta a diferentes dimensiones y ofrece máxima comodidad.',
    imageUrl: 'https://panel.construproductos.com/images/thumbnails/66c7944dab4f8.jpg',
    overlayImageUrl: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=700&q=80',
    colors: [
      { name: 'Gris Oxford', hex: '#6B6E7A' },
      { name: 'Beige Lino', hex: '#C8B99A' },
      { name: 'Azul Noche', hex: '#2C3E6B' },
    ],
    badge: 'popular',
    dimensions: '280 × 180 × 80 cm',
  },
  {
    slug: 'sofia',
    name: 'Sofía',
    category: 'sofas',
    price: 'Consultar precio',
    material: 'Terciopelo · 3 plazas · Clásico moderno',
    description:
      'El sofá Sofía reinterpreta el diseño clásico con tapizado en terciopelo de alta calidad. Sus patas de madera torneada le dan un toque de distinción incomparable.',
    imageUrl: 'https://panel.construproductos.com/images/thumbnails/66c796353843b.jpg',
    overlayImageUrl: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=700&q=80',
    colors: [
      { name: 'Verde Botella', hex: '#4A6741' },
      { name: 'Morado', hex: '#6B4E71' },
      { name: 'Azul Noche', hex: '#2C3E6B' },
    ],
    dimensions: '210 × 90 × 82 cm',
  },
]

export const PRODUCT_CATEGORIES: {
  value: ProductCategory | 'todos'
  label: string
}[] = [
  { value: 'todos', label: 'Todos' },
  { value: 'sofas', label: 'Sofás' },
  { value: 'seccionales', label: 'Seccionales' },
  { value: 'butacas', label: 'Butacas' },
  { value: 'mesas', label: 'Mesas' },
  { value: 'dormitorios', label: 'Dormitorios' },
]

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug)
}
