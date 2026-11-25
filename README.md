# CENIZA — Cocina de humo y maíz

Sitio conceptual de un restaurante ficticio de alta cocina mexicana en Roma Norte, CDMX.
Proyecto de portafolio: marca, contenido y experiencia digital completos.

## Concepto

- **Nombre:** Ceniza. Lo que queda después del fuego, y el sabor que deja.
- **Eslogan:** *Todo lo que el fuego recuerda.*
- **Propuesta:** cocina mexicana sin una sola flama de gas. Catorce mesas, un fogón de encino y mezquite, maíz criollo nixtamalizado en casa y una barra de mezcal.
- **Chef:** Inés Valdivia, de la Sierra Norte de Puebla, formada entre San Sebastián y Copenhague.

## Sistema visual

| Token | Valor | Uso |
|---|---|---|
| Carbón | `#0f0d0b` | Fondo principal |
| Tizne | `#171411` | Secciones alternas |
| Hueso | `#efe8dc` | Texto y botón principal |
| Ceniza | `#958c81` | Texto secundario y etiquetas |
| Brasa | `#df6a3d` | Acento: itálicas, estados, la brasa sobre la Z |

- **Display:** Bodoni Moda (variable, con eje óptico). Alto contraste, cursivas en color brasa.
- **Texto:** Hanken Grotesk. Etiquetas en mayúsculas con espaciado amplio.
- **Wordmark:** CENIZA en Bodoni con una brasa encendida sobre la Z.

## Movimiento (GSAP + ScrollTrigger + Lenis)

- Telón de entrada y aparición del nombre letra por letra.
- Títulos revelados línea por línea (SplitText con máscara).
- Manifiesto que se enciende palabra por palabra al hacer scroll.
- Imágenes que se abren como telón, con parallax moderado dentro de su marco.
- Carta con imagen fija que cambia por categoría.
- Sala que se expande de una ventana a pantalla completa (sección anclada).
- Galería horizontal anclada en escritorio, deslizable en móvil, con visor a pantalla completa (React).
- Botones magnéticos, etiquetas que ruedan y subrayados que se dibujan.
- Con `prefers-reduced-motion` todo queda visible y quieto.

## Stack

Astro 7 · React 19 (menú y galería) · TypeScript · Tailwind CSS 4 · GSAP 3 (ScrollTrigger, SplitText) · Lenis.

## Desarrollo

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # astro check + build estático en dist/
npm run preview
```

## Estructura

```
src/
  data/site.ts        Marca, contacto, horario, carta y galería (una sola fuente)
  layouts/Layout.astro  SEO, Open Graph, JSON-LD Restaurant
  components/         Una sección por componente + Img, Button, SectionHead
  scripts/motion.ts   Toda la capa de animación, declarada con atributos data-*
  styles/global.css   Tokens, tipografía, botones y utilidades
public/img/           Fotografías optimizadas en WebP (900 y 1600–1920 px)
```

## Notas

- Restaurante, chef, teléfono, correo y redes son **ficticios**. El número usa un prefijo inválido a propósito; las redes apuntan a la página principal de cada plataforma. Cámbielos en `src/data/site.ts`.
- La dirección se muestra sin número (calle y colonia).
- Fotografías de [Unsplash](https://unsplash.com/) bajo su licencia, usadas como material de demostración.
