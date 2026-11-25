/**
 * CENIZA — Cocina de humo y maíz.
 * Marca, contenido y datos de contacto ficticios, centralizados aquí
 * para que cada componente lea de una sola fuente.
 */

export const brand = {
  name: 'Ceniza',
  tagline: 'Todo lo que el fuego recuerda.',
  descriptor: 'Cocina mexicana de humo y maíz',
  founded: 2021,
  tables: 14,
  description:
    'Ceniza es un restaurante de cocina mexicana de humo y maíz en Roma Norte, Ciudad de México. Catorce mesas alrededor de un solo fogón de encino y mezquite.',
};

export const contact = {
  phoneDisplay: '+52 55 0000 1940',
  phoneHref: 'tel:+525500001940',
  whatsappHref:
    'https://wa.me/525500001940?text=' +
    encodeURIComponent('Hola Ceniza, me gustaría reservar una mesa.'),
  email: 'reservas@ceniza-cocina.mx',
  street: 'Calle Colima',
  district: 'Roma Norte',
  city: 'Ciudad de México',
  mapsHref:
    'https://www.google.com/maps/search/?api=1&query=' +
    encodeURIComponent('Calle Colima, Roma Norte, Ciudad de México'),
  social: [
    { label: 'Instagram', handle: '@ceniza.cocina', href: 'https://www.instagram.com/' },
    { label: 'TikTok', handle: '@ceniza.cocina', href: 'https://www.tiktok.com/' },
    { label: 'Spotify', handle: 'Ceniza · Sobremesa', href: 'https://open.spotify.com/' },
  ],
};

export const hours = [
  { days: 'Martes a jueves', time: '13:30 — 23:00' },
  { days: 'Viernes y sábado', time: '13:30 — 00:30' },
  { days: 'Domingo', time: '13:30 — 18:00' },
  { days: 'Lunes', time: 'Descansa el fogón' },
];

export const nav = [
  { label: 'Esencia', href: '#esencia' },
  { label: 'Carta', href: '#carta' },
  { label: 'Espacio', href: '#espacio' },
  { label: 'Chef', href: '#chef' },
  { label: 'Galería', href: '#galeria' },
  { label: 'Reservar', href: '#reservar' },
];

export type Dish = { name: string; description: string; price: number; note?: string };
export type MenuCategory = {
  id: string;
  label: string;
  numeral: string;
  intro: string;
  image: string;
  imageAlt: string;
  dishes: Dish[];
};

export const menu: MenuCategory[] = [
  {
    id: 'entradas',
    label: 'Entradas',
    numeral: 'I',
    intro: 'El maíz llega primero: molido cada mañana, tocado apenas por el comal.',
    image: 'entradas',
    imageAlt: 'Tetelas de maíz azul con rábano, cebolla y salsa sobre madera oscura',
    dishes: [
      {
        name: 'Tetela de ceniza',
        description: 'Masa de maíz azul nixtamalizado en casa, ayocote ahumado, quesillo de Reyes y hoja santa al rescoldo.',
        price: 240,
      },
      {
        name: 'Aguachile tatemado',
        description: 'Callo de hacha, serrano asado al carbón, pepino criollo y polvo de cebolla quemada.',
        price: 320,
      },
      {
        name: 'Tuétano al encino',
        description: 'Médula de res sobre la brasa, salsa macha de cacahuate y tortillas recién salidas del comal.',
        price: 290,
      },
      {
        name: 'Betabel de rescoldo',
        description: 'Enterrado doce horas entre cenizas, requesón de cabra, pepita tostada y miel de piloncillo.',
        price: 230,
      },
    ],
  },
  {
    id: 'fuertes',
    label: 'Platos fuertes',
    numeral: 'II',
    intro: 'Cocciones largas, maderas distintas para cada proteína y salsas que tardan días.',
    image: 'fuertes',
    imageAlt: 'Chef vertiendo salsa sobre un plato emplatado en una mesa oscura',
    dishes: [
      {
        name: 'Pulpo al mezquite',
        description: 'Adobo de guajillo, puré de camote ahumado y aceite de chile pasilla de Oaxaca.',
        price: 560,
      },
      {
        name: 'Costilla de catorce horas',
        description: 'Short rib al humo de encino, mole negro de treinta y dos ingredientes y ajonjolí tostado.',
        price: 720,
      },
      {
        name: 'Pesca zarandeada',
        description: 'Pescado del día en hoja de plátano, recado rojo, cebolla morada curada y limón asado.',
        price: 590,
      },
      {
        name: 'Pato en pipián',
        description: 'Pecho de pato madurado siete días, pipián verde de pepita y quelites de temporada.',
        price: 640,
      },
    ],
  },
  {
    id: 'postres',
    label: 'Postres',
    numeral: 'III',
    intro: 'El final también pasa por el fuego: azúcar quemada, cacao, frutas al carbón.',
    image: 'postre',
    imageAlt: 'Pastel de chocolate oscuro sobre superficie negra con hierbas',
    dishes: [
      {
        name: 'Elote al fuego',
        description: 'Helado de maíz tatemado, cajeta de cabra y polvo de tortilla quemada.',
        price: 210,
      },
      {
        name: 'Cacao y humo',
        description: 'Ganache de cacao de Tabasco, sal de chile ancho y crema batida con mezcal.',
        price: 230,
      },
      {
        name: 'Higos de rescoldo',
        description: 'Higos asados en las brasas, nata de piloncillo y galleta de amaranto.',
        price: 220,
      },
    ],
  },
  {
    id: 'barra',
    label: 'Barra de humo',
    numeral: 'IV',
    intro: 'Destilados de pequeños productores y cocteles que nacen junto al fogón.',
    image: 'coctel',
    imageAlt: 'Coctel ámbar con naranja en vaso corto sobre mármol oscuro',
    dishes: [
      {
        name: 'Ceniza negra',
        description: 'Mezcal espadín, licor de café de Veracruz y amargo de chile ancho.',
        price: 260,
      },
      {
        name: 'Copal',
        description: 'Mezcal tobalá, toronja tatemada y un velo de humo de resina de copal.',
        price: 290,
      },
      {
        name: 'Jamaica quemada',
        description: 'Sin alcohol. Flor de jamaica, jengibre al carbón y agua mineral de manantial.',
        price: 140,
      },
      {
        name: 'Vuelo de mezcal',
        description: 'Tres destilados de palenques de Oaxaca y Durango, servidos con naranja y sal de gusano.',
        price: 420,
      },
    ],
  },
];

export const gallery = [
  { src: 'flama', alt: 'Llamarada en un sartén de hierro en la cocina oscura', w: 1920, h: 2560 },
  { src: 'tamales', alt: 'Tamales envueltos en hoja y atados con hilo rojo', w: 1920, h: 1280 },
  { src: 'copa', alt: 'Copa de vino blanco junto a un plato en la mesa', w: 1920, h: 2880 },
  { src: 'chispas', alt: 'Brasas encendidas sobre fondo negro', w: 1920, h: 1280 },
  { src: 'pulpo', alt: 'Pulpo asado con hierbas, muy de cerca', w: 1920, h: 2879 },
  { src: 'tortillas', alt: 'Tortillas de maíz recién hechas sobre una servilleta', w: 1920, h: 1280 },
  { src: 'coupe', alt: 'Coctel ámbar en copa coupé con fondo rojo', w: 1920, h: 2880 },
  { src: 'sala2', alt: 'Comedor en penumbra con mesas puestas', w: 1920, h: 1286 },
  { src: 'lampara', alt: 'Lámpara colgante encendida en una sala oscura', w: 1920, h: 2880 },
];
