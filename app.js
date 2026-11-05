/* ============================================================
   HZ — GUÍAS · app.js
   Reglas duras:
   - La clase que oculta (.reveal-out) la pone SOLO el JS.
   - Watchdog de 1.8s: si nada se reveló, se fuerza visibilidad inline.
   - Sin WhatsApp configurado, todos los CTA caen al DM de Instagram.
   ============================================================ */

const CONFIG = {
  // DM de Instagram (link oficial de Meta). Confirmado: @henryzarak
  DM: 'https://ig.me/m/henryzarak',
  // Opcional: si algún día hay número, poner formato internacional sin + (ej: '5216861234567')
  WHATSAPP: '',
  // Opcional: endpoint que reciba POST JSON del formulario. Si está vacío, no se envía nada.
  ENDPOINT: ''
};

/* ---------- links de DM ---------- */
function dmHref(msg) {
  if (CONFIG.WHATSAPP) {
    return 'https://wa.me/' + CONFIG.WHATSAPP + '?text=' + encodeURIComponent(msg || 'Hola Hz');
  }
  // ig.me no acepta texto prellenado: el mensaje se copia al portapapeles.
  return CONFIG.DM;
}

function wireDM() {
  document.querySelectorAll('[data-dm]').forEach(function (el) {
    const msg = el.getAttribute('data-dm');
    el.setAttribute('href', dmHref(msg));
    el.setAttribute('target', '_blank');
    el.setAttribute('rel', 'noopener');
    el.addEventListener('click', function () {
      copyToClipboard(msg);
    });
  });
}

function copyToClipboard(text) {
  if (!text || !navigator.clipboard) return;
  navigator.clipboard.writeText(text).catch(function () {/* silencio: no bloquear el link */});
}

/* ---------- reveal con watchdog ---------- */
function initReveal() {
  const els = Array.from(document.querySelectorAll('.reveal'));
  if (!els.length) return;

  const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) {
    els.forEach(function (el) { el.classList.add('reveal-in'); });
    return;
  }

  let revealed = 0;

  function show(el) {
    if (el.classList.contains('reveal-in')) return;
    el.classList.remove('reveal-out');
    el.classList.add('reveal-in');
    revealed++;
  }

  let io = null;
  try {
    if (!('IntersectionObserver' in window)) throw new Error('no IO');
    // La clase que oculta se pone acá, dentro del try: si algo falla, nada queda oculto.
    els.forEach(function (el) { el.classList.add('reveal-out'); });
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { show(e.target); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    els.forEach(function (el) { io.observe(el); });
  } catch (err) {
    els.forEach(function (el) { el.classList.add('reveal-in'); });
    revealed = els.length;
    return;
  }

  // Watchdog: nunca dejar la página en blanco.
  window.setTimeout(function () {
    if (revealed === 0) {
      els.forEach(function (el) {
        el.style.opacity = '1';
        el.style.transform = 'none';
        el.style.transition = 'none';
        el.classList.remove('reveal-out');
        el.classList.add('reveal-in');
      });
      revealed = els.length;
      if (io) io.disconnect();
    }
  }, 1800);
}

/* ---------- formulario ---------- */
function initForm() {
  const form = document.getElementById('lead-form');
  if (!form) return;

  function setErr(name, msg) {
    const field = form.querySelector('#' + name);
    if (!field) return;
    const wrap = field.closest('.field');
    const err = form.querySelector('.err[data-for="' + name + '"]');
    if (msg) {
      wrap.classList.add('invalid');
      if (err) err.textContent = msg;
    } else {
      wrap.classList.remove('invalid');
      if (err) err.textContent = '';
    }
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const nombre = form.nombre.value.trim();
    const contacto = form.contacto.value.trim();
    const tarea = form.tarea.value.trim();
    let ok = true;

    if (nombre.length < 2) { setErr('nombre', 'Necesito un nombre.'); ok = false; } else setErr('nombre', '');
    if (contacto.length < 3) { setErr('contacto', 'Dejame un Instagram o correo.'); ok = false; } else setErr('contacto', '');
    if (tarea.length < 8) { setErr('tarea', 'Contame la tarea en una línea.'); ok = false; } else setErr('tarea', '');

    if (!ok) return;

    const msg = 'Hola Hz. Soy ' + nombre + ' (' + contacto + ').\nQuiero automatizar: ' + tarea;

    if (CONFIG.ENDPOINT) {
      try {
        fetch(CONFIG.ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nombre: nombre, contacto: contacto, tarea: tarea })
        }).catch(function () {/* el DM no se bloquea si el endpoint falla */});
      } catch (err) {/* idem */}
    }

    copyToClipboard(msg);
    const btn = form.querySelector('button[type="submit"]');
    const original = btn.textContent;
    btn.textContent = 'Mensaje copiado — abriendo DM…';
    window.open(dmHref(msg), '_blank', 'noopener');
    window.setTimeout(function () { btn.textContent = original; }, 3200);
  });
}

/* ---------- init ---------- */
document.addEventListener('DOMContentLoaded', function () {
  wireDM();
  initReveal();
  initForm();
  const y = document.getElementById('year');
  if (y) y.textContent = String(new Date().getFullYear());
});
