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

const WRAP_COLORS = [
  { name: 'blush',    hex: '#f7d6e6' },
  { name: 'lavender', hex: '#e3d6f7' },
  { name: 'mint',     hex: '#d9f0e3' },
  { name: 'butter',   hex: '#faf0d0' },
  { name: 'peach',    hex: '#fbe0cf' },
  { name: 'cream',    hex: '#fffaf5' },
];

const RIBBON_COLORS = [
  { name: 'purple', hex: '#b48be0' },
  { name: 'pink',   hex: '#ff8fb3' },
  { name: 'gold',   hex: '#e3b23c' },
  { name: 'sage',   hex: '#8fae8f' },
  { name: 'berry',  hex: '#c65d7b' },
  { name: 'cream',  hex: '#f3e9da' },
];

const WRAP_PATTERNS = ['plain', 'dots', 'stripes'];
const PATTERN_LABELS = { plain: 'Plain', dots: 'Dots', stripes: 'Stripes' };

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
// each flower is drawn in a 100 x 130 viewBox, short stem at bottom (the rest
// of the stem is implied hidden inside the paper wrap), bloom near top.

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
    <line x1="50" y1="${topY}" x2="50" y2="126" stroke="${STEM_GREEN}" stroke-width="4" stroke-linecap="round"/>
    <path d="M50 92 C 32 87, 23 99, 18 111 C 33 109, 45 102, 50 92 Z" fill="${LEAF_GREEN}"/>
    <path d="M50 102 C 68 97, 79 109, 84 119 C 69 119, 57 112, 50 102 Z" fill="${LEAF_GREEN}"/>
  `;
}

function svgWrap(inner) {
  return `<svg viewBox="0 0 100 130" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;
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

// ===================== wrap / ribbon SVG generators =====================
// wrap viewBox 200x210: apex (tied point) near the bottom, wide curved
// opening near the top, so stems gather at the ribbon and blooms fan above.

function wrapPatternGroup(color, pattern) {
  const dot = shade(color, -0.16);
  if (pattern === 'dots') {
    let out = '';
    for (let y = 34; y < 210; y += 22) {
      for (let x = 6; x < 200; x += 22) {
        const offset = (Math.round((y - 34) / 22) % 2 === 0) ? 0 : 11;
        out += `<circle cx="${x + offset}" cy="${y}" r="3.6" fill="${dot}" opacity="0.4"/>`;
      }
    }
    return out;
  }
  if (pattern === 'stripes') {
    let out = '';
    for (let x = -220; x < 420; x += 24) {
      out += `<line x1="${x}" y1="0" x2="${x + 220}" y2="220" stroke="${dot}" stroke-width="9" opacity="0.22"/>`;
    }
    return out;
  }
  return '';
}

function generateWrapSVG(color, pattern) {
  const coneD = 'M14 26 Q100 8 186 26 L100 204 Z';
  return `
    <svg viewBox="0 0 200 210" xmlns="http://www.w3.org/2000/svg">
      <defs><clipPath id="wrapClip"><path d="${coneD}"/></clipPath></defs>
      <path d="${coneD}" fill="${color}"/>
      <g clip-path="url(#wrapClip)">
        <path d="M100 26 L186 26 L100 204 Z" fill="#000" opacity="0.06"/>
        <path d="M14 26 L100 26 L100 204 Z" fill="#fff" opacity="0.15"/>
        ${wrapPatternGroup(color, pattern)}
      </g>
      <path d="${coneD}" fill="none" stroke="${shade(color, -0.22)}" stroke-width="2" opacity="0.35"/>
    </svg>
  `;
}

function generateRibbonSVG(color) {
  const dark = shade(color, -0.2);
  return `
    <svg viewBox="0 0 100 54" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 27 C 34 6, 4 8, 6 27 C 4 44, 32 34, 50 27 Z" fill="${color}"/>
      <path d="M50 27 C 66 6, 96 8, 94 27 C 96 44, 68 34, 50 27 Z" fill="${color}"/>
      <path d="M44 29 L 36 52 L 47 42 Z" fill="${dark}"/>
      <path d="M56 29 L 64 52 L 53 42 Z" fill="${dark}"/>
      <circle cx="50" cy="27" r="9" fill="${dark}"/>
    </svg>
  `;
}

function renderWrapVisuals(paperEl, ribbonEl, wrapCol, wrapPat, ribbonCol) {
  paperEl.innerHTML = generateWrapSVG(wrapCol, wrapPat);
  ribbonEl.innerHTML = generateRibbonSVG(ribbonCol);
}

// ===================== bouquet arrangement =====================
// flowers fan out from a single gathered point (where the ribbon ties)
// rather than spreading sideways, so it actually reads as one bouquet.

function computeBaseLayout(i, n) {
  const center = (n - 1) / 2;
  const offset = i - center;
  const angleStep = n > 1 ? Math.min(11, 60 / (n - 1)) : 0;
  const angle = Math.max(-42, Math.min(42, offset * angleStep));
  const leftStep = n > 1 ? Math.min(9, 46 / (n - 1)) : 0;
  const leftPx = Math.max(-34, Math.min(34, offset * leftStep));
  const depthJitter = ((i * 37) % 13) - 6;
  const bottomPx = Math.abs(offset) * 3 + depthJitter * 0.6;
  const scale = 1 - Math.min(0.18, Math.abs(offset) * 0.025);
  const z = Math.round(100 - Math.abs(offset) * 3 + (i % 3));
  return { angle, leftPx, bottomPx, scale, z };
}

function layoutForFlower(f, i, n) {
  const base = computeBaseLayout(i, n);
  const x = f.pos ? f.pos.x : base.leftPx;
  const y = f.pos ? f.pos.y : base.bottomPx;
  const z = f.zOverride != null ? f.zOverride : base.z;
  return { x, y, angle: base.angle, scale: base.scale, z };
}

// ===================== state =====================

let currentType = TYPES[0];
let currentColor = COLORS[0].hex;
let bouquet = []; // { type, color, pos?: {x,y}, zOverride? }
let wrapColor = WRAP_COLORS[0].hex;
let wrapPattern = 'plain';
let ribbonColor = RIBBON_COLORS[0].hex;
let dragTopZ = 200;

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

// ===================== builder: wrap customizer UI =====================

function renderWrapCustomizer() {
  const colorEl = document.getElementById('wrapColorSwatches');
  colorEl.innerHTML = WRAP_COLORS.map(c => `
    <button type="button" class="swatch swatch-sm ${c.hex === wrapColor ? 'active' : ''}"
      style="background:${c.hex}" data-hex="${c.hex}" title="${c.name}" aria-label="${c.name} paper"></button>
  `).join('');
  colorEl.querySelectorAll('.swatch').forEach(btn => {
    btn.addEventListener('click', () => {
      wrapColor = btn.dataset.hex;
      renderWrapCustomizer();
      renderBouquetWrap();
    });
  });

  const patternEl = document.getElementById('wrapPatternBtns');
  patternEl.innerHTML = WRAP_PATTERNS.map(p => `
    <button type="button" class="pattern-btn ${p === wrapPattern ? 'active' : ''}" data-pattern="${p}">${PATTERN_LABELS[p]}</button>
  `).join('');
  patternEl.querySelectorAll('.pattern-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      wrapPattern = btn.dataset.pattern;
      renderWrapCustomizer();
      renderBouquetWrap();
    });
  });

  const ribbonEl = document.getElementById('ribbonColorSwatches');
  ribbonEl.innerHTML = RIBBON_COLORS.map(c => `
    <button type="button" class="swatch swatch-sm ${c.hex === ribbonColor ? 'active' : ''}"
      style="background:${c.hex}" data-hex="${c.hex}" title="${c.name}" aria-label="${c.name} ribbon"></button>
  `).join('');
  ribbonEl.querySelectorAll('.swatch').forEach(btn => {
    btn.addEventListener('click', () => {
      ribbonColor = btn.dataset.hex;
      renderWrapCustomizer();
      renderBouquetWrap();
    });
  });
}

function renderBouquetWrap() {
  renderWrapVisuals(
    document.getElementById('wrapPaper'),
    document.getElementById('wrapRibbon'),
    wrapColor, wrapPattern, ribbonColor
  );
}

// ===================== builder: bouquet UI =====================

function renderBouquet() {
  const container = document.getElementById('bouquetFlowers');
  const n = bouquet.length;
  document.getElementById('flowerCount').textContent = n;
  document.getElementById('emptyMsg').style.display = n === 0 ? 'block' : 'none';

  container.innerHTML = bouquet.map((f, i) => {
    const l = layoutForFlower(f, i, n);
    return `
      <div class="bouquet-flower" data-index="${i}"
        style="left:calc(50% + ${l.x}px); bottom:${l.y}px; transform: translateX(-50%) rotate(${l.angle}deg) scale(${l.scale}); z-index:${l.z}">
        ${flowerSVG(f.type, f.color)}
      </div>
    `;
  }).join('');

  container.querySelectorAll('.bouquet-flower').forEach(el => {
    attachFlowerDragHandlers(el, Number(el.dataset.index));
  });
}

function attachFlowerDragHandlers(el, index) {
  let startX = 0, startY = 0, baseX = 0, baseY = 0, moved = false, dragging = false;

  el.addEventListener('pointerdown', (e) => {
    const n = bouquet.length;
    const f = bouquet[index];
    if (!f) return;
    const base = computeBaseLayout(index, n);
    baseX = f.pos ? f.pos.x : base.leftPx;
    baseY = f.pos ? f.pos.y : base.bottomPx;
    startX = e.clientX;
    startY = e.clientY;
    moved = false;
    dragging = true;
    el.setPointerCapture(e.pointerId);
    dragTopZ += 1;
    el.style.zIndex = dragTopZ;
    el.style.transition = 'none';
  });

  el.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) moved = true;
    if (moved) {
      const newX = baseX + dx;
      const newY = baseY - dy;
      el.style.left = `calc(50% + ${newX}px)`;
      el.style.bottom = `${newY}px`;
    }
  });

  function endDrag(e) {
    if (!dragging) return;
    dragging = false;
    const f = bouquet[index];
    if (!f) return;
    if (moved) {
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      f.pos = { x: baseX + dx, y: baseY - dy };
      f.zOverride = dragTopZ;
    } else {
      bouquet.splice(index, 1);
    }
    renderBouquet();
  }

  el.addEventListener('pointerup', endDrag);
  el.addEventListener('pointercancel', endDrag);
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

  const data = { flowers: bouquet, recipient, sender, message, wrapColor, wrapPattern, ribbonColor };
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

  renderWrapVisuals(
    document.getElementById('revealWrapPaper'),
    document.getElementById('revealWrapRibbon'),
    data.wrapColor || WRAP_COLORS[0].hex,
    data.wrapPattern || 'plain',
    data.ribbonColor || RIBBON_COLORS[0].hex
  );

  const flowersContainer = document.getElementById('revealFlowers');
  const n = data.flowers.length;
  flowersContainer.innerHTML = data.flowers.map((f, i) => {
    const l = layoutForFlower(f, i, n);
    return `
      <div class="bouquet-flower" style="left:calc(50% + ${l.x}px); bottom:${l.y}px; transform: translateX(-50%) rotate(${l.angle}deg) scale(${l.scale}); z-index:${l.z}">
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
  renderWrapCustomizer();
  renderBouquetWrap();
  renderBouquet();
  initBuilderEvents();
}

document.addEventListener('DOMContentLoaded', init);
