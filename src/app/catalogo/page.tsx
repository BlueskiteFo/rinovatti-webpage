import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'
import { CatalogFilters } from '@/components/shared/CatalogFilters'

export const metadata = {
  title: 'Catálogo — Rinnovati',
  description:
    'Explora nuestra colección de muebles a medida. Sofás, seccionales, butacas, mesas y más.',
}

export default function CatalogoPage() {
  return (
    <>
      <Navbar />

      <main className="pt-[72px]">
        <div className="bg-rv-cream px-[8%] py-16">
          <p className="text-rv-terracotta mb-3 text-[11px] font-medium tracking-[0.2em] uppercase">
            Colección 2025
          </p>
          <h1 className="font-heading text-rv-dark mb-2 text-[clamp(36px,4vw,52px)] leading-[1.15] font-light">
            Nuestro catálogo
          </h1>
          <p className="text-rv-mid text-[15px] font-light">
            Todos nuestros diseños, personalizables a medida y en los colores que prefieras.
          </p>
        </div>

        <div className="bg-rv-warm-white px-[8%] py-16">
          <CatalogFilters />
        </div>
      </main>

      <Footer />
    </>
  )
}
