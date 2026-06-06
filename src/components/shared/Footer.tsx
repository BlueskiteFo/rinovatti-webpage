import Link from 'next/link'
import { RINNOVATI_CONFIG } from '@/lib/constants/rinnovati'

export function Footer() {
  return (
    <footer className="bg-rv-dark px-[8%] pt-16 pb-10 text-white/60">
      <div className="mb-12 grid grid-cols-2 gap-12 md:grid-cols-4">
        <div className="col-span-2 md:col-span-1">
          <p className="font-heading mb-4 text-[24px] font-semibold text-white">
            Rinnovati<span className="text-rv-terracotta">.</span>
          </p>
          <p className="max-w-[260px] text-[13px] leading-relaxed">
            Diseñamos y fabricamos muebles a medida para transformar tu hogar.{' '}
            {RINNOVATI_CONFIG.location} — {RINNOVATI_CONFIG.tagline}.
          </p>
        </div>

        <div>
          <p className="mb-5 text-[11px] font-medium tracking-[0.15em] text-white uppercase">
            Catálogo
          </p>
          <ul className="list-none space-y-2.5 p-0">
            {['Sofás', 'Seccionales', 'Butacas', 'Mesas'].map((cat) => (
              <li key={cat}>
                <Link
                  href={`/catalogo?categoria=${cat.toLowerCase()}`}
                  className="hover:text-rv-terracotta text-[13px] text-white/60 no-underline transition-colors"
                >
                  {cat}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-5 text-[11px] font-medium tracking-[0.15em] text-white uppercase">
            Nosotros
          </p>
          <ul className="list-none space-y-2.5 p-0">
            <li>
              <Link
                href="/#visualizador"
                className="hover:text-rv-terracotta text-[13px] text-white/60 no-underline transition-colors"
              >
                Visualizador IA
              </Link>
            </li>
            <li>
              <a
                href={RINNOVATI_CONFIG.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-rv-terracotta text-[13px] text-white/60 no-underline transition-colors"
              >
                Instagram
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="mb-5 text-[11px] font-medium tracking-[0.15em] text-white uppercase">
            Contacto
          </p>
          <ul className="list-none space-y-2.5 p-0">
            <li>
              <a
                href={`https://wa.me/${RINNOVATI_CONFIG.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-rv-terracotta text-[13px] text-white/60 no-underline transition-colors"
              >
                WhatsApp
              </a>
            </li>
            <li>
              <span className="text-[13px]">{RINNOVATI_CONFIG.location}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-7 sm:flex-row">
        <p className="text-[12px]">
          © {new Date().getFullYear()} Rinnovati. Todos los derechos reservados.
        </p>
        <p className="text-[10px] tracking-[0.05em] text-white/30">MVP — versión de demostración</p>
      </div>
    </footer>
  )
}
