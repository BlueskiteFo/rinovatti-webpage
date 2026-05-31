import type { Product } from '@/core/domain/entities'

/**
 * Datos estáticos del catálogo Rinnovati.
 * Fuente: migrado desde rinnovati-antiguo/src/lib/constants/rinnovati.ts
 *
 * En producción, estos datos vendrán de Supabase (SupabaseProductRepository).
 * Este seed se usa para el InMemoryProductRepository durante desarrollo.
 */
export const PRODUCTS_SEED: Product[] = [
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
