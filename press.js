/* ─── Press kit gate ────────────────────────────────────────────────────────── */
/* Soft gate only. The passcode never appears in source — we compare the SHA-256
   of the entered value against a stored digest. Determined visitors can still
   bypass this; it stops casual access via the QR/link. */

const PASS_HASH = '61aad04aa9341a27da25994e4e72be78828a848291b781d8c19a5192b860f033';
const SESSION_KEY = 'tgha-press-ok';

const gate = document.getElementById('gate');
const kit = document.getElementById('kit');
const form = document.getElementById('gate-form');
const input = document.getElementById('gate-input');
const error = document.getElementById('gate-error');

async function sha256Hex(text) {
  const bytes = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

function unlock() {
  gate.hidden = true;
  kit.hidden = false;
  document.body.classList.remove('gated');
}

function alreadyUnlocked() {
  try {
    return sessionStorage.getItem(SESSION_KEY) === '1';
  } catch (_) {
    return false;
  }
}

function rememberUnlock() {
  try {
    sessionStorage.setItem(SESSION_KEY, '1');
  } catch (_) {
    /* private mode — gate just re-prompts next visit */
  }
}

form.addEventListener('submit', async e => {
  e.preventDefault();
  error.hidden = true;
  const entered = input.value.trim();
  if (!entered) return;

  const hex = await sha256Hex(entered);
  if (hex === PASS_HASH) {
    rememberUnlock();
    unlock();
  } else {
    error.hidden = false;
    input.value = '';
    input.focus();
  }
});

if (alreadyUnlocked()) {
  unlock();
} else {
  document.body.classList.add('gated');
  input.focus();
}

/* ─── Lightbox ──────────────────────────────────────────────────────────────── */
const lb = document.getElementById('lightbox');
const lbImg = document.getElementById('lightbox-img');

document.querySelectorAll('.still-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    lbImg.src = btn.dataset.full;
    lbImg.alt = btn.querySelector('img').alt;
    lb.classList.add('open');
    lb.setAttribute('aria-hidden', 'false');
  });
});

function closeLightbox() {
  lb.classList.remove('open');
  lb.setAttribute('aria-hidden', 'true');
  lbImg.src = '';
}

lb.addEventListener('click', closeLightbox);
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
});
