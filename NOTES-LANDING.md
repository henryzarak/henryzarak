# Landing de guías — notas de construcción

**Fecha:** 2026-10-16
**Archivos:** `index.html` · `styles.css` · `app.js` · `favicon.svg`
**Peso total:** ~37 KB sin fuentes (Anton/Archivo/JetBrains Mono desde Google Fonts).
**Stack:** HTML + CSS + JS estáticos, cero build. Decisión a propósito: una página, una oferta.
Meter Next.js o GSAP acá era peso sin retorno.

---

## ⚠️ PENDIENTES DE DATOS (confirmar antes de publicar)

1. **Precios — son PROPUESTA, no decididos.**
   - `index.html`, sección `#precios`: `$19` Starter · `$29` Homelab · `$49` Todo.
   - `index.html`, sección `#servicio`: `desde $400 USD`.
   Confirmar o corregir los cuatro.
2. **WhatsApp** — vacío en `app.js` (`CONFIG.WHATSAPP`). Sin número, todos los CTA caen al DM de
   Instagram (`https://ig.me/m/henryzarak`). Si querés WhatsApp, poner el número en formato
   internacional sin `+` y **todos** los botones cambian solos.
3. **Link real de descarga / checkout** — hoy los botones abren DM. No hay pasarela de pago conectada.
   Cuando exista (Gumroad, Stripe, Lemon Squeezy), reemplazar `data-dm` por `href` directo.
4. **Nombre de las guías** — "Tu primer agente", "Hermes desde cero", "Homelab en una tarde",
   "Operar, no jugar". Cambiar acá y en el copy si querés otros.
5. **Email de contacto / legales** — la página no tiene email ni aviso legal más allá del disclaimer.

## Decisiones de contenido

- El copy vende **el resultado** ("tu primer agente hoy"), no la tecnología.
- Sección "Para quién NO" a propósito: filtrar mejor que aceptar a todos.
- **Disclaimer de no afiliación** con Nous Research en el footer. Hermes Agent es de ellos y es open
  source; estas guías son material independiente. Sin ese aviso la página sugiere respaldo oficial.
- La garantía de 7 días es una promesa comercial: **si no la vas a honrar, hay que sacarla.**

## Decisiones de ingeniería

- **La animación no puede ocultar contenido** (ver `app.js`): la clase que oculta la pone el JS dentro
  de un `try`, y hay watchdog de 1.8 s que fuerza visibilidad inline. Sin JS, todo se ve.
- **Formulario sin backend**: valida en JS y abre DM con el mensaje ya escrito; el texto se copia al
  portapapeles porque `ig.me` no acepta mensaje prellenado. `CONFIG.ENDPOINT` queda opcional y no
  bloquea el DM si falla.
- `prefers-reduced-motion` respetado.
- Sin sombras, sin `border-radius`, retícula de 1px, una sola palabra en outline.

## Deploy

Nada desplegado ni commiteado todavía. Opciones, de menor a mayor esfuerzo:

1. **GitHub Pages** (recomendado, $0, link corto `https://henryzarak.github.io`):
   ```bash
   cd ~/repos/henryzarak
   git add index.html styles.css app.js favicon.svg NOTES-LANDING.md
   git commit -m "landing: guías de agentes, homelab y automatización"
   git push origin main          # o rama + PR
   # luego: Settings → Pages → Deploy from branch → main / root
   ```
2. **Vercel** — requiere CLI o dashboard; no hay token configurado en esta máquina.
3. **Dell + systemd** en un puerto 8xxx — solo alcanzable por LAN/Tailscale, no sirve como link público.

⚠️ El repo `henryzarak/henryzarak` es el **repo de perfil de GitHub**: su `README.md` es lo que se ve
en el perfil público. Este trabajo **no lo toca**. GitHub Pages sirve igual desde `index.html` en la raíz.
