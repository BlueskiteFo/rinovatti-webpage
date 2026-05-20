import Link from 'next/link'
import { RINNOVATI_CONFIG } from '@/lib/constants/rinnovati'

export function Navbar() {
  return (
    <nav className="bg-rv-warm-white/95 border-rv-sand fixed top-0 right-0 left-0 z-50 flex h-[72px] items-center justify-between border-b px-[5%] backdrop-blur-sm">
      <Link
        href="/"
        className="font-heading text-rv-dark text-[26px] font-semibold tracking-[0.05em] no-underline"
      >
        Rinnovati<span className="text-rv-terracotta">.</span>
      </Link>

      <ul className="hidden list-none items-center gap-8 md:flex">
        <li>
          <Link
            href="/catalogo"
            className="text-rv-charcoal hover:text-rv-terracotta text-[13px] font-normal tracking-[0.08em] uppercase no-underline transition-colors"
          >
            Catálogo
          </Link>
        </li>
        <li>
          <Link
            href="/#visualizador"
            className="text-rv-charcoal hover:text-rv-terracotta text-[13px] font-normal tracking-[0.08em] uppercase no-underline transition-colors"
          >
            Visualizador
          </Link>
        </li>
        <li>
          <Link
            href="/#contacto"
            className="text-rv-charcoal hover:text-rv-terracotta text-[13px] font-normal tracking-[0.08em] uppercase no-underline transition-colors"
          >
            Contacto
          </Link>
        </li>
        <li>
          <a
            href={`https://wa.me/${RINNOVATI_CONFIG.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-rv-dark hover:bg-rv-terracotta rounded-[2px] px-[22px] py-[10px] text-[12px] font-medium tracking-[0.1em] text-white uppercase no-underline transition-colors"
          >
            Agendar cita
          </a>
        </li>
        <li>
          <a
            href={RINNOVATI_CONFIG.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-rv-charcoal hover:text-rv-terracotta text-[13px] font-normal tracking-[0.08em] uppercase no-underline transition-colors"
          >
            Instagram
          </a>
        </li>
      </ul>

      {/* Mobile: solo el CTA */}
      <a
        href={`https://wa.me/${RINNOVATI_CONFIG.whatsappNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-rv-dark hover:bg-rv-terracotta rounded-[2px] px-4 py-2 text-[12px] font-medium tracking-[0.1em] text-white uppercase no-underline transition-colors md:hidden"
      >
        Cita
      </a>
    </nav>
  )
}
