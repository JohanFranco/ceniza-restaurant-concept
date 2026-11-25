import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

/**
 * Capa de movimiento de Ceniza.
 * Todo se declara con atributos data-* en el marcado:
 *  data-split        títulos que se revelan línea por línea
 *  data-fade         bloques que aparecen con un leve ascenso
 *  data-reveal       marcos de imagen que se abren como un telón
 *  data-parallax=N   imágenes que se desplazan N% dentro de su marco
 *  data-magnetic     botones que siguen sutilmente al cursor
 */

const EASE = 'expo.out';
const q = <T extends Element = HTMLElement>(s: string, root: ParentNode = document) => [...root.querySelectorAll<T>(s)];

export function initMotion() {
  const root = document.documentElement;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  gsap.registerPlugin(ScrollTrigger, SplitText);
  root.classList.add('motion-ready');

  mobileBar();

  if (reduced) {
    gsap.set('[data-expand-frame]', { clipPath: 'inset(0% 0% 0% 0%)' });
    menuStage(true);
    return;
  }

  const lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.95 });
  window.__lenis = lenis;
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  anchors(lenis);

  // Arrancar arriba en cada carga para que la intro tenga sentido.
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  if (!location.hash) window.scrollTo(0, 0);

  document.fonts.ready.then(() => {
    intro(lenis);
    splits();
    fades();
    reveals();
    parallax();
    heroScroll();
    scrubWords();
    menuStage(false);
    expand();
    gallery();
    footerWord();
    magnetic();
    window.addEventListener('load', () => ScrollTrigger.refresh());
  });
}

/* ---------------- Intro ---------------- */
function intro(lenis: Lenis) {
  const pre = document.querySelector<HTMLElement>('[data-preloader]');
  const seen = sessionStorage.getItem('ceniza-intro') === '1';
  sessionStorage.setItem('ceniza-intro', '1');

  lenis.stop();
  const tl = gsap.timeline({
    defaults: { ease: EASE },
    onComplete: () => {
      lenis.start();
      pre?.remove();
    },
  });

  if (pre && !seen) {
    tl.from('[data-pre-word]', { yPercent: 110, duration: 1.1, ease: 'expo.out' })
      .to('[data-pre-line]', { scaleX: 1, duration: 1.1, ease: 'expo.inOut' }, '-=0.6')
      .from('[data-pre-sub]', { autoAlpha: 0, y: 8, duration: 0.6 }, '<0.2')
      .to(pre, { yPercent: -100, duration: 1.1, ease: 'expo.inOut' }, '+=0.15');
  } else if (pre) {
    tl.to(pre, { autoAlpha: 0, duration: 0.5, ease: 'power2.out' });
  }

  tl.fromTo(
    '[data-hero-img]',
    { scale: 1.32, clipPath: 'inset(12% 8% 12% 8%)' },
    { scale: 1.06, clipPath: 'inset(0% 0% 0% 0%)', duration: 2.2, ease: 'expo.out' },
    pre && !seen ? '-=0.75' : 0.1,
  )
    .from('[data-hero-letter]', { yPercent: 105, duration: 1.5, stagger: 0.07, ease: 'expo.out' }, '<0.25')
    .fromTo(
      '[data-hero-fade]',
      { y: 26, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 1.2, stagger: 0.09 },
      '<0.35',
    );
}

/* ---------------- Hero al hacer scroll ---------------- */
function heroScroll() {
  const hero = document.querySelector('[data-hero]');
  if (!hero) return;
  gsap.to('[data-hero-media]', {
    yPercent: 22,
    ease: 'none',
    scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
  });
  gsap.to('[data-hero-content]', {
    yPercent: -8,
    autoAlpha: 0.15,
    ease: 'none',
    scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
  });
}

/* ---------------- Títulos línea por línea ---------------- */
function splits() {
  q('[data-split]').forEach((el) => {
    SplitText.create(el, {
      type: 'lines',
      mask: 'lines',
      linesClass: 'split-line',
      autoSplit: true,
      onSplit(self) {
        gsap.set(el, { visibility: 'visible' });
        return gsap.from(self.lines, {
          yPercent: 108,
          duration: 1.4,
          stagger: 0.11,
          ease: EASE,
          scrollTrigger: { trigger: el, start: 'top 86%', once: true },
        });
      },
    });
  });
}

/* ---------------- Apariciones suaves ---------------- */
function fades() {
  gsap.set('[data-fade], [data-dish]', { autoAlpha: 0, y: 28 });
  ScrollTrigger.batch('[data-fade], [data-dish]', {
    start: 'top 90%',
    once: true,
    onEnter: (els) =>
      gsap.to(els, { autoAlpha: 1, y: 0, duration: 1.2, stagger: 0.09, ease: EASE, overwrite: true }),
  });
}

/* ---------------- Telón de imágenes ---------------- */
function reveals() {
  q('[data-reveal]').forEach((frame) => {
    const img = frame.querySelector('img');
    const tl = gsap.timeline({ scrollTrigger: { trigger: frame, start: 'top 88%', once: true } });
    tl.fromTo(
      frame,
      { clipPath: 'inset(100% 0% 0% 0%)' },
      { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'expo.inOut' },
    );
    if (img) tl.from(img, { scale: 1.3, duration: 2, ease: EASE }, 0.1);
  });
}

/* ---------------- Parallax moderado ---------------- */
function parallax() {
  q<HTMLImageElement>('img[data-parallax]').forEach((img) => {
    const amount = Number(img.dataset.parallax) || 10;
    gsap.fromTo(
      img,
      { yPercent: -amount / 2 },
      {
        yPercent: amount / 2,
        ease: 'none',
        scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
      },
    );
  });
}

/* ---------------- Manifiesto que se enciende palabra por palabra ---------------- */
function scrubWords() {
  q('[data-scrub-words]').forEach((el) => {
    const words = q('.w', el);
    gsap.fromTo(
      words,
      { opacity: 0.14 },
      {
        opacity: 1,
        stagger: 0.05,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top 78%', end: 'bottom 45%', scrub: 0.6 },
      },
    );
  });
}

/* ---------------- Carta: imagen fija que cambia por categoría ---------------- */
function menuStage(instant: boolean) {
  const stage = document.querySelector('[data-menu-stage]');
  const counter = document.querySelector<HTMLElement>('[data-menu-counter]');
  if (!stage) return;
  let current = q('[data-menu-cat]')[0]?.dataset.menuCat;
  let z = 1;

  const show = (id: string, numeral: string) => {
    if (id === current) return;
    current = id;
    const layer = stage.querySelector<HTMLElement>(`[data-menu-img="${id}"]`);
    if (!layer) return;
    z += 1;
    gsap.set(layer, { zIndex: z });
    gsap.fromTo(
      layer,
      { clipPath: 'inset(100% 0% 0% 0%)' },
      { clipPath: 'inset(0% 0% 0% 0%)', duration: instant ? 0 : 1.2, ease: 'expo.inOut' },
    );
    const img = layer.querySelector('img');
    if (img && !instant) gsap.fromTo(img, { scale: 1.2 }, { scale: 1, duration: 1.8, ease: EASE });
    if (counter) {
      if (instant) counter.textContent = numeral;
      else
        gsap
          .timeline()
          .to(counter, { yPercent: -110, duration: 0.4, ease: 'power3.in' })
          .add(() => (counter.textContent = numeral))
          .fromTo(counter, { yPercent: 110 }, { yPercent: 0, duration: 0.7, ease: EASE });
    }
  };

  q('[data-menu-cat]').forEach((cat, i, all) => {
    ScrollTrigger.create({
      trigger: cat,
      start: 'top 55%',
      end: 'bottom 55%',
      onEnter: () => show(cat.dataset.menuCat!, cat.dataset.numeral!),
      onEnterBack: () => show(cat.dataset.menuCat!, cat.dataset.numeral!),
      onLeaveBack: () => {
        if (i > 0) show(all[i - 1].dataset.menuCat!, all[i - 1].dataset.numeral!);
      },
    });
  });
}

/* ---------------- Espacio: la sala se abre a pantalla completa ---------------- */
function expand() {
  const section = document.querySelector<HTMLElement>('[data-expand]');
  const frame = document.querySelector<HTMLElement>('[data-expand-frame]');
  if (!section || !frame) return;
  const img = frame.querySelector('img');
  const mm = gsap.matchMedia();
  mm.add({ wide: '(min-width: 768px)', narrow: '(max-width: 767px)' }, (ctx) => {
    const start = ctx.conditions?.wide ? 'inset(20% 32% 20% 32%)' : 'inset(24% 10% 24% 10%)';
    gsap.set(frame, { clipPath: start });
    const tl = gsap.timeline({
      scrollTrigger: { trigger: section, start: 'top top', end: '+=110%', pin: true, scrub: 1 },
    });
    tl.to(frame, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none' });
    if (img) tl.fromTo(img, { scale: 1.25 }, { scale: 1, ease: 'none' }, 0);
  });
}

/* ---------------- Galería horizontal (escritorio) ---------------- */
function gallery() {
  const section = document.querySelector<HTMLElement>('[data-gallery]');
  if (!section) return;
  const mm = gsap.matchMedia();
  mm.add('(min-width: 1024px)', () => {
    const pin = section.querySelector<HTMLElement>('[data-gallery-pin]')!;
    const viewport = section.querySelector<HTMLElement>('[data-gallery-viewport]')!;
    const track = section.querySelector<HTMLElement>('[data-gallery-track]')!;
    const bar = section.querySelector<HTMLElement>('[data-gallery-progress]');
    const distance = () => {
      const pad = parseFloat(getComputedStyle(viewport).paddingLeft) || 0;
      return Math.max(0, track.scrollWidth - (window.innerWidth - pad * 2));
    };
    const tween = gsap.to(track, {
      x: () => -distance(),
      ease: 'none',
      scrollTrigger: {
        trigger: pin,
        start: 'top top',
        end: () => `+=${distance()}`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => bar && gsap.set(bar, { scaleX: self.progress }),
      },
    });
    // Leve deriva interna de cada foto mientras la pista avanza
    q<HTMLImageElement>('[data-gallery-img]', track).forEach((img) => {
      gsap.fromTo(
        img,
        { xPercent: -5, scale: 1.12 },
        {
          xPercent: 5,
          ease: 'none',
          scrollTrigger: { trigger: img.parentElement, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true },
        },
      );
    });
  });
}

/* ---------------- Nombre gigante del pie ---------------- */
function footerWord() {
  const word = document.querySelector('[data-footer-word]');
  if (!word) return;
  gsap.from(word.children, {
    yPercent: 70,
    opacity: 0,
    stagger: 0.06,
    ease: 'none',
    scrollTrigger: { trigger: word, start: 'top bottom', end: 'bottom bottom', scrub: 0.8 },
  });
}

/* ---------------- Botones magnéticos ---------------- */
function magnetic() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  q('[data-magnetic]').forEach((el) => {
    const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' });
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * 0.22);
      yTo((e.clientY - (r.top + r.height / 2)) * 0.32);
    });
    el.addEventListener('pointerleave', () => {
      xTo(0);
      yTo(0);
    });
  });
}

/* ---------------- Anclas con scroll suave ---------------- */
function anchors(lenis: Lenis) {
  document.addEventListener('click', (e) => {
    if (e.defaultPrevented) return;
    const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href')!;
    const target = id === '#top' ? document.body : document.querySelector<HTMLElement>(id);
    if (!target) return;
    e.preventDefault();
    lenis.scrollTo(id === '#top' ? 0 : target, { duration: 1.6 });
    history.replaceState(null, '', id);
  });
}

/* ---------------- Barra de acciones en móvil ---------------- */
function mobileBar() {
  const bar = document.querySelector('[data-mobile-bar]');
  const hero = document.querySelector('[data-hero]');
  const reservas = document.querySelector('#reservar');
  if (!bar || !hero) return;
  let pastHero = false;
  let onReservas = false;
  const update = () => bar.classList.toggle('is-visible', pastHero && !onReservas);
  new IntersectionObserver(([e]) => {
    pastHero = !e.isIntersecting;
    update();
  }).observe(hero);
  if (reservas)
    new IntersectionObserver(
      ([e]) => {
        onReservas = e.isIntersecting;
        update();
      },
      { threshold: 0.35 },
    ).observe(reservas);
}
