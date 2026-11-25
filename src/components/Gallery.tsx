import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

type Photo = { src: string; alt: string; w: number; h: number };

/**
 * Galería: una pista horizontal (anclada con ScrollTrigger en escritorio desde
 * animations.ts) y un visor a pantalla completa con teclado y gestos.
 */
export default function Gallery({ photos }: { photos: Photo[] }) {
  const [index, setIndex] = useState<number | null>(null);
  const viewer = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const lastTrigger = useRef<HTMLButtonElement | null>(null);
  const touchX = useRef<number | null>(null);

  const open = (i: number, el: HTMLButtonElement) => {
    lastTrigger.current = el;
    setIndex(i);
  };
  const close = useCallback(() => setIndex(null), []);
  const step = useCallback(
    (dir: 1 | -1) => setIndex((i) => (i === null ? i : (i + dir + photos.length) % photos.length)),
    [photos.length],
  );

  useEffect(() => {
    const el = viewer.current;
    if (!el) return;
    if (index !== null) {
      window.__lenis?.stop();
      gsap.to(el, { autoAlpha: 1, duration: 0.6, ease: 'power2.out' });
      el.querySelector<HTMLButtonElement>('[data-close]')?.focus({ preventScroll: true });
    } else {
      gsap.to(el, { autoAlpha: 0, duration: 0.45, ease: 'power2.in' });
      window.__lenis?.start();
      lastTrigger.current?.focus({ preventScroll: true });
    }
  }, [index === null]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (index === null || !imgRef.current) return;
    gsap.fromTo(
      imgRef.current,
      { autoAlpha: 0, scale: 1.04 },
      { autoAlpha: 1, scale: 1, duration: 0.9, ease: 'expo.out' },
    );
  }, [index]);

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'Tab' && viewer.current) {
        const nodes = [...viewer.current.querySelectorAll<HTMLElement>('button')];
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
  }, [index, close, step]);

  const current = index === null ? null : photos[index];

  return (
    <>
      <div data-gallery-track className="flex gap-4 md:gap-6 lg:w-max lg:items-center lg:gap-8">
        {photos.map((p, i) => {
          const portrait = p.h > p.w;
          return (
            <button
              key={p.src}
              type="button"
              onClick={(e) => open(i, e.currentTarget)}
              data-gallery-item
              className={[
                'frame frame-zoom group relative shrink-0 snap-center cursor-zoom-in',
                portrait
                  ? 'aspect-[3/4] w-[72vw] sm:w-[44vw] lg:h-[62vh] lg:w-auto'
                  : 'aspect-[3/2] w-[86vw] sm:w-[62vw] lg:h-[50vh] lg:w-auto',
                i % 3 === 1 ? 'lg:self-end' : i % 3 === 2 ? 'lg:self-start' : '',
              ].join(' ')}
              aria-label={`Ampliar imagen: ${p.alt}`}
            >
              <img
                src={`/img/${p.src}-sm.webp`}
                srcSet={`/img/${p.src}-sm.webp 900w, /img/${p.src}-lg.webp 1920w`}
                sizes="(min-width: 1024px) 45vw, 86vw"
                alt={p.alt}
                width={p.w}
                height={p.h}
                loading="lazy"
                decoding="async"
                data-gallery-img
              />
              <span className="pointer-events-none absolute bottom-4 left-4 font-sans text-[0.6875rem] tracking-[0.3em] text-hueso/80 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100">
                {String(i + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')}
              </span>
            </button>
          );
        })}
      </div>

      <div
        ref={viewer}
        role="dialog"
        aria-modal="true"
        aria-label="Visor de galería"
        aria-hidden={index === null}
        className="invisible fixed inset-0 z-[80] flex items-center justify-center bg-carbon/95 opacity-0 backdrop-blur-sm"
        onClick={(e) => e.target === e.currentTarget && close()}
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
          touchX.current = null;
        }}
      >
        {current && (
          <img
            ref={imgRef}
            key={current.src}
            src={`/img/${current.src}-lg.webp`}
            alt={current.alt}
            width={current.w}
            height={current.h}
            className="max-h-[82svh] max-w-[90vw] object-contain"
          />
        )}
        <div className="absolute inset-x-0 top-0 flex h-20 items-center justify-between px-[clamp(1.25rem,4vw,4rem)]">
          <span className="font-sans text-[0.6875rem] tracking-[0.3em] text-hueso/70" aria-live="polite">
            {index !== null && `${String(index + 1).padStart(2, '0')} / ${String(photos.length).padStart(2, '0')}`}
          </span>
          <button
            data-close
            type="button"
            onClick={close}
            tabIndex={index === null ? -1 : 0}
            className="flex min-h-11 items-center gap-3 text-[0.6875rem] uppercase tracking-[0.3em]"
          >
            Cerrar
            <span aria-hidden="true" className="relative block size-4">
              <span className="absolute left-0 top-1/2 h-px w-full rotate-45 bg-current" />
              <span className="absolute left-0 top-1/2 h-px w-full -rotate-45 bg-current" />
            </span>
          </button>
        </div>
        <div className="absolute inset-x-0 bottom-6 flex justify-center gap-3">
          {[-1, 1].map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => step(d as 1 | -1)}
              tabIndex={index === null ? -1 : 0}
              aria-label={d < 0 ? 'Imagen anterior' : 'Imagen siguiente'}
              className="grid size-12 place-items-center rounded-full border border-hueso/30 transition-colors duration-500 hover:border-brasa hover:bg-brasa hover:text-carbon"
            >
              <svg width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden="true" className={d < 0 ? 'rotate-180' : ''}>
                <path d="M0 5h12.5M8.5 1l4 4-4 4" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
