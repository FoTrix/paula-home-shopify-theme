# Paula Home — Shopify Theme

Tema Shopify para tienda de grifería y sanitarios. Diseño editorial cálido con estilo Dwell, migrado desde [paula-home-store](https://github.com/FoTrix/paula-home-store) (React) a Liquid.

## 🎨 Design System

| Token | Color | Uso |
|-------|-------|-----|
| `--cream` | `#F6F1EA` | Fondo base |
| `--sand` | `#EDE4D8` | Secciones alternas |
| `--ink` | `#241E19` | Texto principal |
| `--muted` | `#857567` | Texto secundario |
| `--clay` | `#8A5A44` | Acento / CTA |
| `--clay-dark` | `#6E4535` | Hover CTA |
| `--line` | `#E0D5C7` | Bordes suaves |
| `--sale` | `#B5462F` | Etiqueta oferta |

**Tipografías:** Fraunces (display) + DM Sans (body) vía Google Fonts

## 📁 Estructura

```
paula-home-theme/
├── layout/theme.liquid          # HTML base
├── templates/index.liquid       # Homepage
├── sections/
│   ├── header.liquid            # Nav + búsqueda + carrito
│   ├── footer.liquid            # Footer + trust strip
│   ├── hero.liquid              # Hero principal
│   ├── trust-bar.liquid         # Badges confianza
│   ├── categories.liquid        # Grid categorías
│   ├── featured-products.liquid # Productos destacados
│   ├── offers-banner.liquid     # Banner ofertas
│   ├── pickup-teaser.liquid     # Teaser retiro
│   └── cart-drawer.liquid       # Carrito lateral
├── snippets/
│   ├── product-card.liquid      # Tarjeta producto
│   └── category-icon.liquid     # Iconos SVG
├── assets/
│   ├── theme.css                # Estilos
│   ├── theme.js                 # Cart + nav + search
│   ├── hero-main.png            # ← Agregar desde el repo React
│   ├── hero-offers.png          # ← Agregar desde el repo React
│   └── store-pickup.png         # ← Agregar desde el repo React
├── config/settings_schema.json  # Configurable
└── locales/es.default.json      # Traducciones
```

## 🚀 Instalación

### Opción 1: Shopify GitHub Integration
1. Ve a **Tienda online > Temas > Personalizar**
2. Haz clic en **Agregar tema > Conectar desde GitHub**
3. Selecciona este repositorio `paula-home-shopify-theme`

### Opción 2: Upload manual
1. Descarga el repositorio como ZIP
2. Ve a **Tienda online > Temas > Subir archivo ZIP**
3. Sube el archivo

## 📸 Imágenes requeridas

Las imágenes del hero y banners deben ser agregadas como **Theme Assets**:

1. Ve a **Tienda online > Temas > Editar código**
2. En la carpeta `assets`, agrega los siguientes archivos descargados del [repo original](https://github.com/FoTrix/paula-home-store/tree/4649a1c30334427bf04fa33f93ef9c819ffe2884/packages/web/public/images):
   - `hero-main.png` (2.6 MB) — Imagen principal del hero
   - `hero-offers.png` (3.4 MB) — Banner de ofertas
   - `store-pickup.png` (2.9 MB) — Imagen tienda para retiro

Alternativamente, puedes subir imágenes personalizadas desde el **Personalizador de tema** en cada sección.

## ⚙️ Configuración

### Personalizador de tema
- **Colores:** Personaliza los colores del design system
- **Header:** Texto de anuncio y teléfono
- **Hero:** Título, descripción, CTAs e imagen
- **Productos destacados:** Selecciona la colección
- **Footer:** Teléfono, email, dirección

### Colecciones requeridas
Para que el tema funcione correctamente, crea estas colecciones en Shopify:
- `monomandos` — Grifería/monomandos
- `tinas-y-receptaculos-de-ducha` — Baño/tinas
- `shower-e-hidromasaje` — Shower
- `saldos-ofertas` — Productos en oferta
- `destacados` — Productos destacados (homepage)

### Páginas requeridas
- Crea una página con handle `retiro` para la funcionalidad de retiro en tienda

## 🛒 Funcionalidades

- ✅ Carrito lateral con AJAX (Shopify Cart API)
- ✅ Navegación móvil responsive
- ✅ Búsqueda con autocompletado
- ✅ Placeholders visuales con iconos por categoría
- ✅ Badges de confianza configurables
- ✅ Banner de ofertas con overlay
- ✅ Teaser de retiro en tienda
- ✅ Diseño mobile-first
- ✅ Animaciones suaves (CSS)

## 📝 Notas

- Los precios se muestran en CLP (configurar moneda en Shopify)
- El sistema de placeholders usa gradientes deterministas basados en SKU
- Los iconos se asignan por tag de producto: `icon-Droplet`, `icon-Wrench`, etc.
- Tags especiales: `oferta` o `sale` muestran badge de oferta en productos

---

**Autor:** Daniel Uribe ([@FoTrix](https://github.com/FoTrix))
**Licencia:** MIT
