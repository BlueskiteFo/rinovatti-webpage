import Link from 'next/link'
import Image from 'next/image'
import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'
import { ProductCard } from '@/components/shared/ProductCard'
import { PRODUCTS, RINNOVATI_CONFIG } from '@/lib/constants/rinnovati'

export default function HomePage() {
  const featuredProducts = PRODUCTS.slice(0, 3)

  return (
    <>
      <Navbar />

      {/* ── HERO ── */}
      <section className="grid min-h-screen grid-cols-1 pt-[72px] md:grid-cols-2">
        <div className="bg-rv-cream flex flex-col justify-center px-[8%] py-20">
          <p className="text-rv-terracotta mb-6 text-[11px] font-medium tracking-[0.2em] uppercase">
            {RINNOVATI_CONFIG.location} — {RINNOVATI_CONFIG.tagline}
          </p>
          <h1 className="font-heading text-rv-dark mb-6 text-[clamp(44px,5vw,68px)] leading-[1.1] font-light">
            Muebles que
            <br />
            <em className="text-rv-terracotta italic">transforman</em>
            <br />
            tu hogar
          </h1>
          <p className="text-rv-mid mb-10 max-w-[420px] text-[15px] leading-relaxed font-light">
            Diseñamos y fabricamos muebles a medida para cada espacio. Ahora puedes visualizar cómo
            quedarán en tu sala antes de comprar.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/#visualizador"
              className="bg-rv-dark hover:bg-rv-terracotta rounded-[2px] px-8 py-3.5 text-[12px] font-medium tracking-[0.1em] text-white uppercase no-underline transition-colors"
            >
              Visualizar en mi sala
            </Link>
            <Link
              href="/catalogo"
              className="text-rv-charcoal hover:text-rv-terracotta group flex items-center gap-2 text-[13px] tracking-[0.05em] no-underline transition-colors"
            >
              Ver catálogo
              <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>

        <div className="group relative min-h-[400px] overflow-hidden bg-[#E8DDD0] md:min-h-0">
          <Image
            src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&q=80"
            alt="Sala Rinnovati"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            priority
          />
          <div className="bg-rv-dark/85 absolute bottom-10 left-10 rounded px-5 py-4 text-white backdrop-blur-sm">
            <p className="font-heading text-[32px] leading-none font-semibold">
              {RINNOVATI_CONFIG.hogaresTransformados}
            </p>
            <p className="mt-1 text-[11px] font-light tracking-[0.1em] text-white/70 uppercase">
              Hogares transformados
            </p>
          </div>
        </div>
      </section>

      {/* ── VISUALIZADOR CTA ── */}
      <section id="visualizador" className="bg-rv-warm-white px-[8%] py-24">
        <p className="text-rv-terracotta mb-4 text-[11px] font-medium tracking-[0.2em] uppercase">
          Tecnología IA
        </p>
        <h2 className="font-heading text-rv-dark mb-4 text-[clamp(36px,4vw,52px)] leading-[1.15] font-light">
          Visualiza tu mueble
          <br />
          <em className="italic">en tu espacio real</em>
        </h2>
        <p className="text-rv-mid mb-10 max-w-[560px] text-[15px] leading-relaxed font-light">
          Sube una foto de tu sala, elige el mueble y posiciónalo donde desees. Cuando estés
          satisfecho, agenda tu cita en tienda con un solo clic.
        </p>

        <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          {[
            {
              num: '1',
              title: 'Elige un mueble',
              desc: 'Explora el catálogo y selecciona el modelo que te interesa.',
            },
            {
              num: '2',
              title: 'Sube tu foto',
              desc: 'Toma o selecciona una foto frontal de tu sala con buena iluminación.',
            },
            {
              num: '3',
              title: 'Posiciona y agenda',
              desc: 'Arrastra el mueble a su lugar y agenda tu cita con el resultado listo.',
            },
          ].map((step) => (
            <div key={step.num} className="flex items-start gap-5">
              <div className="bg-rv-terracotta/20 border-rv-terracotta flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border">
                <span className="font-heading text-rv-terracotta text-[16px]">{step.num}</span>
              </div>
              <div>
                <p className="text-rv-dark mb-1 font-medium">{step.title}</p>
                <p className="text-rv-mid text-[13px] leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <Link
          href="/catalogo"
          className="bg-rv-dark hover:bg-rv-terracotta inline-block rounded-[2px] px-8 py-3.5 text-[12px] font-medium tracking-[0.1em] text-white uppercase no-underline transition-colors"
        >
          Ir al catálogo
        </Link>
      </section>

      {/* ── PRODUCTOS DESTACADOS ── */}
      <section className="bg-rv-cream px-[8%] py-24">
        <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-rv-terracotta mb-3 text-[11px] font-medium tracking-[0.2em] uppercase">
              Colección 2025
            </p>
            <h2 className="font-heading text-rv-dark text-[clamp(36px,4vw,52px)] leading-[1.15] font-light">
              Nuestros
              <br />
              <em className="italic">mejores diseños</em>
            </h2>
          </div>
          <Link
            href="/catalogo"
            className="text-rv-charcoal hover:text-rv-terracotta group flex items-center gap-2 text-[13px] tracking-[0.05em] no-underline transition-colors"
          >
            Ver catálogo completo
            <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      {/* ── CONTACTO ── */}
      <section id="contacto" className="bg-rv-terracotta-light px-[8%] py-20 text-center">
        <p className="text-rv-terracotta mb-4 text-[11px] font-medium tracking-[0.2em] uppercase">
          ¿Listo para transformar tu hogar?
        </p>
        <h2 className="font-heading text-rv-dark mb-4 text-[clamp(32px,4vw,48px)] leading-[1.2] font-light">
          Agenda tu cita
          <br />
          sin compromiso
        </h2>
        <p className="text-rv-mid mx-auto mb-10 max-w-[460px] text-[15px]">
          Visítanos en tienda y descubre toda nuestra colección. Te asesoramos en la elección y
          medidas perfectas para tu espacio.
        </p>
        <a
          href={`https://wa.me/${RINNOVATI_CONFIG.whatsappNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-rv-dark hover:bg-rv-terracotta inline-block rounded-[2px] px-10 py-4 text-[12px] font-medium tracking-[0.1em] text-white uppercase no-underline transition-colors"
        >
          Contactar por WhatsApp
        </a>
      </section>

      <Footer />
    </>
  )
}
