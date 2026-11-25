import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';

type Link = { label: string; href: string };
type Hour = { days: string; time: string };

interface Props {
  links: Link[];
  hours: Hour[];
  phoneDisplay: string;
  phoneHref: string;
  address: string;
}

declare global {
  interface Window {
    __lenis?: { stop: () => void; start: () => void; scrollTo: (t: string | number | HTMLElement, o?: object) => void };
  }
}

export default function Nav({ links, hours, phoneDisplay, phoneHref, address }: Props) {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const overlay = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  // Barra: se oculta al bajar y reaparece al subir.
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setSolid(y > window.innerHeight * 0.6);
      if (Math.abs(y - last) > 6) {
        setHidden(y > last && y > 240);
        last = y;
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Timeline de apertura del menú a pantalla completa.
  useLayoutEffect(() => {
    const el = overlay.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.set(el, { autoAlpha: 0 });
      tl.current = gsap
        .timeline({ paused: true, defaults: { ease: 'expo.inOut' } })
        .set(el, { autoAlpha: 1 })
        .fromTo('[data-curtain]', { scaleY: 0 }, { scaleY: 1, duration: 0.9, transformOrigin: 'top' })
        .fromTo(
          '[data-menu-link]',
          { yPercent: 110 },
          { yPercent: 0, duration: 1, stagger: 0.06, ease: 'expo.out' },
          '-=0.35',
        )
        .fromTo('[data-menu-meta]', { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.08, ease: 'expo.out' }, '-=0.8');
    }, el);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const t = tl.current;
    if (!t) return;
    if (open) {
      window.__lenis?.stop();
      document.documentElement.style.overflow = 'hidden';
      t.timeScale(1).play();
      const first = overlay.current?.querySelector<HTMLElement>('a');
      window.setTimeout(() => first?.focus({ preventScroll: true }), 500);
    } else {
      t.timeScale(1.6).reverse();
      document.documentElement.style.overflow = '';
      window.__lenis?.start();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggle.current?.focus();
      }
      // Mantener el foco dentro del menú
      if (e.key === 'Tab' && overlay.current) {
        const nodes = [toggle.current, ...overlay.current.querySelectorAll<HTMLElement>('a')].filter(Boolean) as HTMLElement[];
        const i = nodes.indexOf(document.activeElement as HTMLElement);
        if (e.shiftKey && i <= 0) {
          e.preventDefault();
          nodes[nodes.length - 1].focus();
        } else if (!e.shiftKey && i === nodes.length - 1) {
          e.preventDefault();
          nodes[0].focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const go = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith('#')) return;
    e.preventDefault();
    setOpen(false);
    window.setTimeout(() => {
      const target = document.querySelector<HTMLElement>(href);
      if (!target) return;
      if (window.__lenis) window.__lenis.scrollTo(target, { duration: 1.6 });
      else target.scrollIntoView({ behavior: 'smooth' });
      history.replaceState(null, '', href);
    }, open ? 650 : 0);
  };

  return (
    <>
      <header
        data-nav
        className={[
          'fixed inset-x-0 top-0 z-50 transition-[transform,background-color,backdrop-filter] duration-700 ease-[var(--ease-luxe)]',
          hidden && !open ? '-translate-y-full' : 'translate-y-0',
          solid && !open ? 'bg-carbon/70 backdrop-blur-md' : 'bg-transparent',
        ].join(' ')}
      >
        <div className="shell grid h-20 grid-cols-[1fr_auto_1fr] items-center">
          <button
            ref={toggle}
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="menu-overlay"
            className="group -ml-2 flex min-h-11 items-center gap-3 justify-self-start px-2 text-[0.6875rem] font-medium uppercase tracking-[0.3em]"
          >
            <span className="relative block h-[9px] w-7" aria-hidden="true">
              <span
                className={`absolute left-0 top-0 h-px w-full bg-current transition-transform duration-500 ${open ? 'translate-y-[4px] rotate-45' : 'group-hover:scale-x-75 origin-left'}`}
              />
              <span
                className={`absolute bottom-0 left-0 h-px w-full bg-current transition-transform duration-500 ${open ? '-translate-y-[4px] -rotate-45' : ''}`}
              />
            </span>
            <span className="hidden sm:inline">{open ? 'Cerrar' : 'Menú'}</span>
            <span className="sr-only sm:hidden">{open ? 'Cerrar menú' : 'Abrir menú'}</span>
          </button>

          <a
            href="#top"
            onClick={(e) => go(e, '#top')}
            className="flex min-h-11 items-center font-display text-[1.05rem] tracking-[0.42em] [font-variation-settings:'opsz'_96]"
            aria-label="Ceniza, volver al inicio"
          >
            CENI<span className="relative">Z<span className="absolute -top-[0.2em] left-1/2 size-[0.17em] -translate-x-1/2 rounded-full bg-brasa shadow-[0_0_8px_var(--color-brasa)]" /></span>A
          </a>

          <a
            href="#reservar"
            onClick={(e) => go(e, '#reservar')}
            className="group flex min-h-11 items-center gap-2 justify-self-end text-[0.6875rem] font-medium uppercase tracking-[0.3em]"
          >
            <span className="link-draw">Reservar</span>
            <span className="hidden size-1.5 rounded-full bg-brasa sm:block" aria-hidden="true" />
          </a>
        </div>
      </header>

      <div
        ref={overlay}
        id="menu-overlay"
        role="dialog"
        aria-modal="true"
        aria-label="Menú principal"
        aria-hidden={!open}
        className="fixed inset-0 z-40"
      >
        <div data-curtain className="absolute inset-0 bg-tizne" />
        <div className="shell relative flex h-full flex-col justify-between pb-10 pt-28 md:pb-14">
          <div
            data-menu-meta
            aria-hidden="true"
            className="pointer-events-none absolute right-[clamp(1.25rem,4vw,4rem)] top-28 hidden aspect-[3/4] h-[52vh] overflow-hidden lg:block"
          >
            <img src="/img/flama-sm.webp" alt="" className="h-full w-full object-cover opacity-80" loading="lazy" />
          </div>
          <nav aria-label="Secciones">
            <ul className="grid gap-1 md:gap-0">
              {links.map((l, i) => (
                <li key={l.href} className="overflow-hidden">
                  <a
                    data-menu-link
                    href={l.href}
                    onClick={(e) => go(e, l.href)}
                    tabIndex={open ? 0 : -1}
                    className="group flex items-baseline gap-5 py-1 font-display text-[clamp(2.4rem,min(7vw,8.4vh),6rem)] leading-[1.02] tracking-[-0.02em] [font-variation-settings:'opsz'_96]"
                  >
                    <span className="font-sans text-xs tracking-[0.3em] text-ceniza">0{i + 1}</span>
                    <span className="transition-[color,translate] duration-700 ease-[var(--ease-luxe)] group-hover:translate-x-3 group-hover:text-brasa group-hover:italic">
                      {l.label}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="grid gap-6 border-t border-hueso/15 pt-6 text-sm text-hueso/75 sm:grid-cols-3">
            <p data-menu-meta>
              <span className="eyebrow mb-2 block">Dónde</span>
              {address}
            </p>
            <div data-menu-meta>
              <span className="eyebrow mb-2 block">Horario</span>
              {hours.slice(0, 3).map((h) => (
                <span key={h.days} className="block">
                  {h.days} · {h.time}
                </span>
              ))}
            </div>
            <p data-menu-meta>
              <span className="eyebrow mb-2 block">Reservas</span>
              <a href={phoneHref} tabIndex={open ? 0 : -1} className="link-draw">
                {phoneDisplay}
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
