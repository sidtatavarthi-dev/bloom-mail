// ===================== data =====================

const COLORS = [
  { name: 'blush',   hex: '#ffc2d6' },
  { name: 'hot pink',hex: '#ff6fa5' },
  { name: 'lavender',hex: '#c9a7eb' },
  { name: 'purple',  hex: '#9a6fd1' },
  { name: 'butter',  hex: '#ffe08a' },
  { name: 'cream',   hex: '#fffaf0' },
  { name: 'peach',   hex: '#ffbf96' },
  { name: 'berry',   hex: '#d9607e' },
];

const TYPES = ['daisy', 'rose', 'tulip', 'sunflower', 'peony', 'lavender-sprig'];

const TYPE_LABELS = {
  'daisy': 'Daisy',
  'rose': 'Rose',
  'tulip': 'Tulip',
  'sunflower': 'Sunflower',
  'peony': 'Peony',
  'lavender-sprig': 'Lavender',
};

// ===================== color helpers =====================

function shade(hex, percent) {
  const num = parseInt(hex.slice(1), 16);
  let r = (num >> 16) + Math.round(255 * percent);
  let g = ((num >> 8) & 0x00FF) + Math.round(255 * percent);
  let b = (num & 0x0000FF) + Math.round(255 * percent);
  r = Math.max(0, Math.min(255, r));
  g = Math.max(0, Math.min(255, g));
  b = Math.max(0, Math.min(255, b));
  return '#' + (0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1);
}

// ===================== SVG generators =====================
// each flower is drawn in a 100 x 160 viewBox, stem at bottom, bloom near top.

const STEM_GREEN = '#7cb47f';
const LEAF_GREEN = '#8fc78f';

function petalRing(cx, cy, count, rx, ry, distance, color, rotationOffset) {
  let out = '';
  for (let i = 0; i < count; i++) {
    const angle = (360 / count) * i + rotationOffset;
    out += `<ellipse cx="${cx}" cy="${cy - distance}" rx="${rx}" ry="${ry}" fill="${color}" transform="rotate(${angle} ${cx} ${cy})"/>`;
  }
  return out;
}

function stemAndLeaves(topY) {
  return `
    <line x1="50" y1="${topY}" x2="50" y2="158" stroke="${STEM_GREEN}" stroke-width="4" stroke-linecap="round"/>
    <path d="M50 118 C 30 112, 20 126, 14 140 C 30 138, 44 130, 50 118 Z" fill="${LEAF_GREEN}"/>
    <path d="M50 130 C 70 124, 82 138, 88 150 C 70 150, 56 142, 50 130 Z" fill="${LEAF_GREEN}"/>
  `;
}

function svgWrap(inner) {
  return `<svg viewBox="0 0 100 160" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;
}

function drawDaisy(color) {
  const petals = petalRing(50, 55, 10, 9, 21, 19, color, 0);
  return svgWrap(`
    ${stemAndLeaves(66)}
    ${petals}
    <circle cx="50" cy="55" r="12" fill="#ffd166"/>
  `);
}

function drawSunflower(color) {
  const petals = petalRing(50, 50, 13, 8, 24, 20, color, 0);
  return svgWrap(`
    ${stemAndLeaves(62)}
    ${petals}
    <circle cx="50" cy="50" r="15" fill="#6b4a2f"/>
    <circle cx="50" cy="50" r="15" fill="#000" opacity="0.08"/>
    <circle cx="46" cy="46" r="4" fill="#8a6540" opacity="0.6"/>
    <circle cx="55" cy="52" r="3" fill="#8a6540" opacity="0.6"/>
    <circle cx="50" cy="58" r="3" fill="#8a6540" opacity="0.6"/>
  `);
}

function drawTulip(color) {
  const dark = shade(color, -0.15);
  return svgWrap(`
    ${stemAndLeaves(78)}
    <path d="M50 22 C 46 34, 46 46, 50 58 C 54 46, 54 34, 50 22 Z" fill="${dark}"/>
    <path d="M32 40 C 30 54, 38 68, 50 76 C 48 58, 42 44, 32 40 Z" fill="${color}"/>
    <path d="M68 40 C 70 54, 62 68, 50 76 C 52 58, 58 44, 68 40 Z" fill="${color}"/>
    <path d="M50 26 C 40 40, 38 58, 50 76 C 62 58, 60 40, 50 26 Z" fill="${color}"/>
  `);
}

function drawPeony(color) {
  const light = shade(color, 0.18);
  const outer = petalRing(50, 55, 14, 8, 15, 25, color, 8);
  const inner = petalRing(50, 55, 10, 7, 12, 15, light, 0);
  return svgWrap(`
    ${stemAndLeaves(68)}
    ${outer}
    ${inner}
    <circle cx="50" cy="55" r="7" fill="${shade(color, -0.1)}"/>
  `);
}

function drawRose(color) {
  const mid = shade(color, -0.08);
  const dark = shade(color, -0.22);
  const outer = petalRing(50, 58, 8, 9, 16, 16, color, 5);
  const midRing = petalRing(50, 58, 6, 7, 12, 9, mid, 20);
  return svgWrap(`
    ${stemAndLeaves(70)}
    ${outer}
    ${midRing}
    <path d="M50 58 C 46 54, 46 50, 50 48 C 54 50, 54 54, 50 58 Z" fill="${dark}"/>
  `);
}

function drawLavenderSprig(color) {
  let buds = '';
  const budCount = 9;
  for (let i = 0; i < budCount; i++) {
    const y = 30 + i * 7;
    const wobble = (i % 2 === 0) ? -6 : 6;
    const r = 6 - i * 0.15;
    buds += `<circle cx="${50 + wobble * 0.5}" cy="${y}" r="${r}" fill="${color}"/>`;
    buds += `<circle cx="${50 - wobble * 0.3}" cy="${y + 3}" r="${r * 0.8}" fill="${shade(color, -0.1)}"/>`;
  }
  return svgWrap(`
    ${stemAndLeaves(88)}
    <line x1="50" y1="26" x2="50" y2="90" stroke="${STEM_GREEN}" stroke-width="3"/>
    ${buds}
  `);
}

const DRAWERS = {
  'daisy': drawDaisy,
  'rose': drawRose,
  'tulip': drawTulip,
  'sunflower': drawSunflower,
  'peony': drawPeony,
  'lavender-sprig': drawLavenderSprig,
};

function flowerSVG(type, colorHex) {
  const fn = DRAWERS[type] || drawDaisy;
  return fn(colorHex);
}

// ===================== state =====================

let currentType = TYPES[0];
let currentColor = COLORS[0].hex;
let bouquet = []; // { type, color }

// ===================== builder: picker UI =====================

function renderTypeTabs() {
  const el = document.getElementById('typeTabs');
  el.innerHTML = TYPES.map(t => `
    <button type="button" class="type-tab ${t === currentType ? 'active' : ''}" data-type="${t}">
      ${TYPE_LABELS[t]}
    </button>
  `).join('');
  el.querySelectorAll('.type-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      currentType = btn.dataset.type;
      renderTypeTabs();
      renderPreview();
    });
  });
}

function renderColorSwatches() {
  const el = document.getElementById('colorSwatches');
  el.innerHTML = COLORS.map(c => `
    <button type="button" class="swatch ${c.hex === currentColor ? 'active' : ''}"
      style="background:${c.hex}" data-hex="${c.hex}" title="${c.name}" aria-label="${c.name}"></button>
  `).join('');
  el.querySelectorAll('.swatch').forEach(btn => {
    btn.addEventListener('click', () => {
      currentColor = btn.dataset.hex;
      renderColorSwatches();
      renderPreview();
    });
  });
}

function renderPreview() {
  document.getElementById('previewStage').innerHTML = flowerSVG(currentType, currentColor);
}

// ===================== builder: bouquet UI =====================

function renderBouquet() {
  const container = document.getElementById('bouquetFlowers');
  const n = bouquet.length;
  document.getElementById('flowerCount').textContent = n;
  document.getElementById('emptyMsg').style.display = n === 0 ? 'block' : 'none';

  container.innerHTML = bouquet.map((f, i) => {
    const center = (n - 1) / 2;
    const offset = i - center;
    const angle = Math.max(-46, Math.min(46, offset * (n > 7 ? 9 : 13)));
    const leftPct = 50 + Math.max(-38, Math.min(38, offset * (n > 7 ? 4.2 : 6.5)));
    const bottomPx = Math.abs(offset) * 6 + (i % 2 === 0 ? 0 : 8);
    const scale = 1 - Math.min(0.22, Math.abs(offset) * 0.03);
    return `
      <div class="bouquet-flower" data-index="${i}"
        style="left:${leftPct}%; bottom:${bottomPx}px; transform: translateX(-50%) rotate(${angle}deg) scale(${scale}); z-index:${100 - Math.abs(offset)|0}">
        ${flowerSVG(f.type, f.color)}
      </div>
    `;
  }).join('');

  container.querySelectorAll('.bouquet-flower').forEach(el => {
    el.addEventListener('click', () => {
      const idx = Number(el.dataset.index);
      bouquet.splice(idx, 1);
      renderBouquet();
    });
  });
}

// ===================== events: builder =====================

function initBuilderEvents() {
  document.getElementById('addFlowerBtn').addEventListener('click', () => {
    if (bouquet.length >= 20) return;
    bouquet.push({ type: currentType, color: currentColor });
    renderBouquet();
  });

  document.getElementById('clearBtn').addEventListener('click', () => {
    bouquet = [];
    renderBouquet();
  });

  const noteMessage = document.getElementById('noteMessage');
  noteMessage.addEventListener('input', () => {
    document.getElementById('charCount').textContent = noteMessage.value.length;
  });

  document.getElementById('sendBtn').addEventListener('click', sendBouquet);
  document.getElementById('closeModalBtn').addEventListener('click', () => {
    document.getElementById('sendModal').hidden = true;
    bouquet = [];
    renderBouquet();
    document.getElementById('recipientName').value = '';
    document.getElementById('senderName').value = '';
    noteMessage.value = '';
    document.getElementById('charCount').textContent = '0';
  });

  document.getElementById('copyLinkBtn').addEventListener('click', async () => {
    const input = document.getElementById('shareLink');
    input.select();
    try {
      await navigator.clipboard.writeText(input.value);
    } catch (e) {
      document.execCommand('copy');
    }
    const msg = document.getElementById('copiedMsg');
    msg.hidden = false;
    setTimeout(() => { msg.hidden = true; }, 2000);
  });
}

// ===================== encode / decode share link =====================

function encodeGift(data) {
  const json = JSON.stringify(data);
  const b64 = btoa(unescape(encodeURIComponent(json)));
  return b64;
}

function decodeGift(b64) {
  try {
    const json = decodeURIComponent(escape(atob(b64)));
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
}

function sendBouquet() {
  if (bouquet.length === 0) {
    alert('add at least one flower to your bouquet first! 🌸');
    return;
  }
  const message = document.getElementById('noteMessage').value.trim();
  if (!message) {
    alert('write a little note before sending 💌');
    return;
  }
  const recipient = document.getElementById('recipientName').value.trim();
  const sender = document.getElementById('senderName').value.trim();

  const data = { flowers: bouquet, recipient, sender, message };
  const b64 = encodeGift(data);
  const url = `${location.origin}${location.pathname}#gift=${b64}`;

  document.getElementById('shareLink').value = url;
  document.getElementById('copiedMsg').hidden = true;
  document.getElementById('sendModal').hidden = false;

  spawnFallingPetals(28);
}

// ===================== received view =====================

function renderReceivedView(data) {
  document.getElementById('builderView').hidden = true;
  document.getElementById('receivedView').hidden = false;

  const recipientBit = data.recipient ? `${escapeHtml(data.recipient)}, ` : '';
  const senderBit = data.sender ? escapeHtml(data.sender) : 'a friend who is thinking of you';

  document.getElementById('revealTitle').innerHTML = `${recipientBit}you've got a bouquet! 🌷`;
  document.getElementById('revealMessage').textContent = data.message || '';
  document.getElementById('revealSignature').textContent = data.sender ? `— ${data.sender}` : '';

  const flowersContainer = document.getElementById('revealFlowers');
  const n = data.flowers.length;
  flowersContainer.innerHTML = data.flowers.map((f, i) => {
    const center = (n - 1) / 2;
    const offset = i - center;
    const angle = Math.max(-46, Math.min(46, offset * (n > 7 ? 9 : 13)));
    const leftPct = 50 + Math.max(-38, Math.min(38, offset * (n > 7 ? 4.2 : 6.5)));
    const bottomPx = Math.abs(offset) * 6 + (i % 2 === 0 ? 0 : 8);
    const scale = 1 - Math.min(0.22, Math.abs(offset) * 0.03);
    return `
      <div class="bouquet-flower" style="left:${leftPct}%; bottom:${bottomPx}px; transform: translateX(-50%) rotate(${angle}deg) scale(${scale});">
        ${flowerSVG(f.type, f.color)}
      </div>
    `;
  }).join('');

  const envelope = document.getElementById('envelope');
  const envelopeScene = document.getElementById('envelopeScene');
  const revealScene = document.getElementById('revealScene');

  envelope.addEventListener('click', () => {
    envelope.classList.add('open');
    spawnFallingPetals(20);
    setTimeout(() => {
      envelopeScene.hidden = true;
      revealScene.hidden = false;
    }, 550);
  });

  document.getElementById('sendBackBtn').addEventListener('click', () => {
    history.replaceState(null, '', location.pathname);
    document.getElementById('receivedView').hidden = true;
    document.getElementById('builderView').hidden = false;
  });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ===================== decorative petal animations =====================

const PETAL_EMOJI = ['🌸', '🌷', '🌺', '💮', '🩷'];

function spawnDriftPetals() {
  const el = document.getElementById('driftPetals');
  const count = 14;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('span');
    p.className = 'drift-petal';
    p.textContent = PETAL_EMOJI[Math.floor(Math.random() * PETAL_EMOJI.length)];
    p.style.left = Math.random() * 100 + 'vw';
    p.style.setProperty('--drift-x', (Math.random() * 80 - 40) + 'px');
    p.style.animationDuration = (14 + Math.random() * 12) + 's';
    p.style.animationDelay = (Math.random() * -20) + 's';
    p.style.fontSize = (14 + Math.random() * 14) + 'px';
    el.appendChild(p);
  }
}

function spawnFallingPetals(count) {
  for (let i = 0; i < count; i++) {
    const p = document.createElement('span');
    p.className = 'falling-petal';
    p.textContent = PETAL_EMOJI[Math.floor(Math.random() * PETAL_EMOJI.length)];
    p.style.left = Math.random() * 100 + 'vw';
    p.style.setProperty('--fall-x', (Math.random() * 120 - 60) + 'px');
    p.style.animationDuration = (2.2 + Math.random() * 1.6) + 's';
    p.style.animationDelay = (Math.random() * 0.6) + 's';
    p.style.fontSize = (16 + Math.random() * 12) + 'px';
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 4500);
  }
}

// ===================== init =====================

function init() {
  spawnDriftPetals();

  const hash = location.hash;
  if (hash.startsWith('#gift=')) {
    const data = decodeGift(hash.slice(6));
    if (data && Array.isArray(data.flowers) && data.flowers.length) {
      renderReceivedView(data);
      return;
    }
  }

  renderTypeTabs();
  renderColorSwatches();
  renderPreview();
  renderBouquet();
  initBuilderEvents();
}

document.addEventListener('DOMContentLoaded', init);
