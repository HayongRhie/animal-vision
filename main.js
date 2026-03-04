console.log("✅ main.js loaded");

const $ = (id) => document.getElementById(id);

// Elements
const video = $("video");
const canvas = $("canvas");

const modeEl = $("mode");
const strengthEl = $("strength");
const uvEl = $("uv");
const compareEl = $("compare");
const splitEl = $("split");
const splitRow = $("splitRow");
const strengthLabel = $("strengthLabel");
const uvLabel = $("uvLabel");
const modeTitle = $("modeTitle");

const thermalLegend = $("thermalLegend");

const learnBtn = $("learnBtn");
const colourBtn = $("colourBtn");

const statusEl = $("status");

const modalBackdrop = $("modalBackdrop");
const modalTitleEl = $("modalTitle");
const modalBody = $("modalBody");
const modalClose = $("modalClose");

function setStatus(html, show = true) {
  if (!statusEl) return;
  statusEl.innerHTML = html;
  statusEl.style.display = show ? "block" : "none";
}

function safeOn(el, event, handler) {
  if (!el) {
    console.warn(`[UI] Missing element for ${event} listener.`);
    return;
  }
  el.addEventListener(event, handler);
}

/* ---------- Tiny SVG graphics ---------- */

function wavelengthScaleSVG() {
  return `
  <svg class="learnSvg" viewBox="0 0 520 120" xmlns="http://www.w3.org/2000/svg" aria-label="Wavelength scale">
    <defs>
      <linearGradient id="visGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#6b00ff"/>
        <stop offset="18%" stop-color="#0066ff"/>
        <stop offset="42%" stop-color="#00b0ff"/>
        <stop offset="58%" stop-color="#00ff6a"/>
        <stop offset="75%" stop-color="#ffe600"/>
        <stop offset="100%" stop-color="#ff3b3b"/>
      </linearGradient>
    </defs>

    <text x="10" y="20" fill="rgba(255,255,255,0.85)" font-size="14" font-family="system-ui">Electromagnetic spectrum (simplified)</text>

    <rect x="10" y="38" width="500" height="18" rx="9" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.12)"/>

    <rect x="10" y="38" width="130" height="18" rx="9" fill="rgba(155,80,255,0.25)"/>
    <text x="18" y="52" fill="rgba(255,255,255,0.8)" font-size="12" font-family="system-ui">UV</text>

    <rect x="140" y="38" width="220" height="18" rx="9" fill="url(#visGrad)"/>
    <text x="150" y="52" fill="rgba(0,0,0,0.8)" font-size="12" font-family="system-ui">Visible (≈400–700 nm)</text>

    <rect x="360" y="38" width="150" height="18" rx="9" fill="rgba(255,120,80,0.22)"/>
    <text x="370" y="52" fill="rgba(255,255,255,0.8)" font-size="12" font-family="system-ui">IR</text>

    <text x="10" y="80" fill="rgba(255,255,255,0.72)" font-size="12" font-family="system-ui">~300 nm</text>
    <text x="140" y="80" fill="rgba(255,255,255,0.72)" font-size="12" font-family="system-ui">400</text>
    <text x="250" y="80" fill="rgba(255,255,255,0.72)" font-size="12" font-family="system-ui">550</text>
    <text x="350" y="80" fill="rgba(255,255,255,0.72)" font-size="12" font-family="system-ui">700</text>
    <text x="470" y="80" fill="rgba(255,255,255,0.72)" font-size="12" font-family="system-ui">~1000+ nm</text>

    <text x="10" y="105" fill="rgba(255,255,255,0.65)" font-size="12" font-family="system-ui">
      A phone camera measures RGB in visible light only.
    </text>
  </svg>
  `;
}

function coneDiagramSVG() {
  return `
  <svg class="learnSvg" viewBox="0 0 520 160" xmlns="http://www.w3.org/2000/svg" aria-label="Human photoreceptors diagram">
    <text x="10" y="20" fill="rgba(255,255,255,0.85)" font-size="14" font-family="system-ui">Human photoreceptors (simplified)</text>

    <g>
      <rect x="20" y="40" width="110" height="70" rx="16" fill="rgba(255,255,255,0.10)" stroke="rgba(255,255,255,0.18)"/>
      <text x="75" y="75" text-anchor="middle" fill="rgba(255,255,255,0.88)" font-size="18" font-family="system-ui" font-weight="700">S</text>
      <text x="75" y="100" text-anchor="middle" fill="rgba(255,255,255,0.65)" font-size="12" font-family="system-ui">short</text>
    </g>

    <g>
      <rect x="155" y="40" width="110" height="70" rx="16" fill="rgba(255,255,255,0.10)" stroke="rgba(255,255,255,0.18)"/>
      <text x="210" y="75" text-anchor="middle" fill="rgba(255,255,255,0.88)" font-size="18" font-family="system-ui" font-weight="700">M</text>
      <text x="210" y="100" text-anchor="middle" fill="rgba(255,255,255,0.65)" font-size="12" font-family="system-ui">medium</text>
    </g>

    <g>
      <rect x="290" y="40" width="110" height="70" rx="16" fill="rgba(255,255,255,0.10)" stroke="rgba(255,255,255,0.18)"/>
      <text x="345" y="75" text-anchor="middle" fill="rgba(255,255,255,0.88)" font-size="18" font-family="system-ui" font-weight="700">L</text>
      <text x="345" y="100" text-anchor="middle" fill="rgba(255,255,255,0.65)" font-size="12" font-family="system-ui">long</text>
    </g>

    <g>
      <rect x="425" y="40" width="75" height="70" rx="16" fill="rgba(255,255,255,0.10)" stroke="rgba(255,255,255,0.18)"/>
      <text x="462.5" y="75" text-anchor="middle" fill="rgba(255,255,255,0.88)" font-size="15" font-family="system-ui" font-weight="700">Rods</text>
      <text x="462.5" y="100" text-anchor="middle" fill="rgba(255,255,255,0.65)" font-size="12" font-family="system-ui">low-light</text>
    </g>

    <text x="10" y="145" fill="rgba(255,255,255,0.65)" font-size="12" font-family="system-ui">
      Colour comes from comparing cone responses; rods mainly encode brightness in dim light.
    </text>
  </svg>
  `;
}

/* ---------- Modal content ---------- */

const COLOUR_101_HTML = `
<h2>What is colour?</h2>

<p>
<b>Colour</b> isn’t stored “inside” objects! It’s a <b>perception</b> built from how light hits a surface and how your eyes measure that light.
</p>

<div class="learnGrid">
  <div class="learnCard">
    <div class="learnCardTitle">Wavelengths</div>
    ${wavelengthScaleSVG()}
  </div>
  <div class="learnCard">
    <div class="learnCardTitle">Human vision channels</div>
    ${coneDiagramSVG()}
  </div>
</div>

<h3>Three steps</h3>
<ul>
  <li><b>Illumination:</b> a light source provides a range of wavelengths.</li>
  <li><b>Interaction:</b> surfaces absorb and reflect different wavelengths.</li>
  <li><b>Sensing:</b> cones/rods sample that reflected light; your brain interprets it as colour.</li>
</ul>

<h3>Why animals “see differently”</h3>
<ul>
  <li>Different species can have <b>different photoreceptors</b> (fewer, more, or shifted).</li>
  <li>Some use extra cues like <b>polarisation</b> or special optics.</li>
  <li>Some prioritise <b>motion</b> or <b>contrast</b> over colour (especially in low light).</li>
</ul>

<h3>What this app can and cannot do</h3>
<ul>
  <li>Your phone camera measures only <b>three channels (RGB)</b> in visible light.</li>
  <li>So UV/IR/polarisation modes here are <b>visualisations</b>: we infer a proxy from RGB and map it to colours.</li>
  <li>Even when biology is real, this is still an RGB screen. Some animal colour spaces can’t be shown perfectly.</li>
</ul>

<div class="smallNote">
Tip: turn on <b>Compare</b>, keep the split near the middle, then switch modes while pointing at something colourful or shiny.
</div>
`;

const MODE_INFO = {
  0: {
    name: "Human (baseline)",
    what: ["No transform. This is your reference."],
    why: ["Used as the baseline for comparison."],
    model: ["None."],
    limits: ["None."],
    try: ["Turn on Compare and slide the split."]
  },
  1: {
    name: "Mammal (dichromat: dog/cat/horse concept)",
    what: ["Some red–green differences compress; blues stand out more."],
    why: ["Fewer cone channels means more colours map to similar responses."],
    model: ["We mix red and green into a shared channel; Strength blends the effect."],
    limits: ["Approximation from RGB camera data."],
    try: ["Point at red vs green objects (fruit, labels)."]
  },
  2: {
    name: "Bee (concept: UV inferred)",
    what: ["An inferred UV layer appears as false colour in bright areas."],
    why: ["Many insects have UV-sensitive receptors; UV patterns can carry information."],
    model: ["We compute a UV proxy from RGB and blend it; UV slider controls strength."],
    limits: ["Not real UV capture."],
    try: ["Try glossy packaging, bright whites, printed pages."]
  },
  3: {
    name: "Bird (tetrachromat concept)",
    what: ["More saturated with a subtle inferred UV contribution."],
    why: ["Many birds have an extra cone channel (often UV)."],
    model: ["Strength boosts saturation; UV adds inferred UV layer."],
    limits: ["A 4D colour space can’t be perfectly shown on an RGB screen."],
    try: ["Try colourful posters/clothing and compare."]
  },
  4: {
    name: "Dragonfly (compound eye + polarisation concept)",
    what: [
      "Facet mosaic (compound eye look).",
      "Top half is tuned toward sky-like colours (concept).",
      "Polarisation-like false colour appears strongest in the top half (concept).",
      "Fast motion is emphasised (concept)."
    ],
    why: [
      "Dragonflies are fast visual hunters.",
      "Many insects have UV sensitivity and can use polarisation cues."
    ],
    model: [
      "Facet mosaic sampling.",
      "Divided-eye tuning (top vs bottom).",
      "Polarisation proxy from gradient orientation (inferred).",
      "Motion emphasis from frame-to-frame change (concept)."
    ],
    limits: ["UV/polarisation are inferred proxies. Camera FPS is unchanged."],
    try: ["Point at sky vs ground; wave your hand quickly. Increase Strength and UV."]
  },
  5: {
    name: "Deep-sea fish (bioluminescence concept)",
    what: ["Scene becomes dark; bright points glow strongly; shifts toward blue/green."],
    why: ["Deep ocean is light-poor; small bright signals can dominate perception."],
    model: ["Darken + vignette + highlight bloom + blue/green bias."],
    limits: ["Not a physical underwater optics simulation."],
    try: ["Try tiny LEDs, reflections on metal/plastic, or shiny packaging."]
  },
  6: {
    name: "Shark (low-light / monochrome concept)",
    what: ["Grayscale with boosted contrast."],
    why: ["In low light, luminance/contrast matters more than hue."],
    model: ["Luminance + contrast curve."],
    limits: ["Not species-specific."],
    try: ["Try dim lighting and increase Strength."]
  },
  7: {
    name: "Snake (thermal concept)",
    what: ["Thermal-style overlay blended over the scene."],
    why: ["Some snakes sense IR via specialised organs."],
    model: ["Heat proxy → thermal colourmap; Strength=contrast, UV=intensity."],
    limits: ["Not real IR imaging."],
    try: ["Point at your hand/face (concept) and adjust sliders."]
  },
  8: {
    name: "Mantis shrimp (concept)",
    what: ["Colours become channelised into discrete hue bands."],
    why: ["Communicates ‘many channels’ conceptually."],
    model: ["Hue quantisation increases with Strength."],
    limits: ["Strongly conceptual."],
    try: ["Try gradients and colourful posters."]
  },
  10: {
    name: "Deuteranopia",
    what: ["Strong red–green confusion."],
    why: ["Reduced/absent M-cone contribution (concept)."],
    model: ["Collapse red/green toward shared channel."],
    limits: ["Educational approximation."],
    try: ["Try charts and labels with red/green."]
  },
  11: {
    name: "Protanopia",
    what: ["Reds darken/shift; red–green confusion."],
    why: ["Reduced/absent L-cone contribution (concept)."],
    model: ["Reduce red by mixing toward green."],
    limits: ["Educational approximation."],
    try: ["Try red text on dark backgrounds."]
  },
  12: {
    name: "Tritanopia",
    what: ["Blue–yellow separation decreases."],
    why: ["Reduced/absent S-cone contribution (concept)."],
    model: ["Reduce blue variation relative to luminance."],
    limits: ["Educational approximation."],
    try: ["Try blue vs yellow objects."]
  },
  13: {
    name: "Deuteranomaly",
    what: ["Milder red–green confusion."],
    why: ["Cone response shifted/overlap (concept)."],
    model: ["Gently pull green toward red."],
    limits: ["Educational approximation."],
    try: ["Try subtle red/green pastels."]
  },
  14: {
    name: "Protanomaly",
    what: ["Milder protanopia-like effect."],
    why: ["Cone response shifted/overlap (concept)."],
    model: ["Gently pull red toward green."],
    limits: ["Educational approximation."],
    try: ["Try reds/oranges/pinks."]
  },
  15: {
    name: "Achromatopsia (total colour blindness concept)",
    what: ["Near-complete grayscale; contrast adjustable."],
    why: ["Colour channels contribute little; luminance dominates."],
    model: ["Luminance + contrast curve."],
    limits: ["Educational approximation."],
    try: ["Try colourful scenes and adjust Strength."]
  }
};

function list(arr) {
  return `<ul>${(arr || []).map(x => `<li>${x}</li>`).join("")}</ul>`;
}

/* ---------- Modal helpers ---------- */

function openModal(title, html) {
  if (!modalBackdrop || !modalTitleEl || !modalBody) return;
  modalTitleEl.textContent = title;
  modalBody.innerHTML = html;

  document.body.classList.add("modalOpen");
  modalBackdrop.style.display = "block";
  modalBody.scrollTop = 0;
}

function closeModal() {
  if (!modalBackdrop) return;
  modalBackdrop.style.display = "none";
  document.body.classList.remove("modalOpen");
}

safeOn(modalClose, "click", closeModal);
safeOn(modalBackdrop, "click", (e) => {
  if (e.target === modalBackdrop) closeModal();
});

safeOn(colourBtn, "click", () => openModal("Colour 101", COLOUR_101_HTML));

safeOn(learnBtn, "click", () => {
  const m = parseInt(modeEl?.value ?? "0", 10);
  const info = MODE_INFO[m] || MODE_INFO[0];

  openModal("Learn", `
    <h2>${info.name}</h2>
    <h3>What you should notice</h3>${list(info.what)}
    <h3>Why this happens</h3>${list(info.why)}
    <h3>What the app does (model)</h3>${list(info.model)}
    <h3>Limits</h3>${list(info.limits)}
    <h3>Try this</h3>${list(info.try)}
    <div class="smallNote">
      Tip: turn on <b>Compare</b> and slide the split to directly see what changes.
    </div>
  `);
});

/* ---------- UI plumbing ---------- */

function resize() {
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  if (allocPrevTexture) allocPrevTexture();
}
window.addEventListener("resize", resize);

function updateCompareUI() {
  if (!splitRow || !compareEl) return;
  splitRow.style.display = compareEl.checked ? "grid" : "none";
}
safeOn(compareEl, "change", updateCompareUI);

function updateUIForMode() {
  const m = parseInt(modeEl?.value ?? "0", 10);
  const info = MODE_INFO[m] || MODE_INFO[0];
  if (modeTitle) modeTitle.textContent = info.name;

  if (thermalLegend) thermalLegend.style.display = "none";

  // defaults
  if (strengthEl) strengthEl.disabled = true;
  if (uvEl) uvEl.disabled = true;
  if (strengthLabel) strengthLabel.textContent = "Strength (n/a)";
  if (uvLabel) uvLabel.textContent = "UV / Overlay (n/a)";

  if (m === 1) {
    strengthEl.disabled = false;
    strengthLabel.textContent = "Strength";
  } else if (m === 2) {
    uvEl.disabled = false;
    uvLabel.textContent = "UV emphasis (inferred)";
  } else if (m === 3) {
    strengthEl.disabled = false;
    uvEl.disabled = false;
    strengthLabel.textContent = "Saturation boost";
    uvLabel.textContent = "UV layer (inferred)";
  } else if (m === 4) {
    strengthEl.disabled = false;
    uvEl.disabled = false;
    strengthLabel.textContent = "Facet / polarisation strength";
    uvLabel.textContent = "UV emphasis (concept)";
  } else if (m === 5) {
    strengthEl.disabled = false;
    strengthLabel.textContent = "Glow intensity";
  } else if (m === 6) {
    strengthEl.disabled = false;
    strengthLabel.textContent = "Contrast";
  } else if (m === 7) {
    strengthEl.disabled = false;
    uvEl.disabled = false;
    strengthLabel.textContent = "Thermal contrast";
    uvLabel.textContent = "Thermal intensity";
    if (thermalLegend) thermalLegend.style.display = "block";
  } else if (m === 8) {
    strengthEl.disabled = false;
    strengthLabel.textContent = "Channelisation";
  } else if (m === 15) {
    strengthEl.disabled = false;
    strengthLabel.textContent = "Contrast";
  }
}

safeOn(modeEl, "change", updateUIForMode);

/* ---------- WebGL ---------- */

if (!canvas) {
  setStatus("<b>Error:</b> canvas element missing.", true);
  throw new Error("Canvas missing");
}

const gl = canvas.getContext("webgl", { premultipliedAlpha: false });
if (!gl) {
  setStatus("<b>Error:</b> WebGL not available on this device/browser.", true);
  throw new Error("WebGL not available");
}

gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

// Shaders
const vertexShaderSource = `
attribute vec2 position;
varying vec2 uv;
void main() {
  uv = (position + 1.0) * 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragmentShaderSource = `
precision mediump float;

uniform sampler2D tex;
uniform sampler2D prevTex;
uniform vec2 texelSize;

uniform int mode;
uniform float strength;
uniform float uvIntensity;
uniform float split;
uniform int compareEnabled;

varying vec2 uv;

float luma(vec3 rgb) { return dot(rgb, vec3(0.299, 0.587, 0.114)); }

float uvProxy(vec3 rgb){
  return clamp(rgb.b - 0.5*rgb.r, 0.0, 1.0);
}

vec3 falseUV(float u){
  vec3 a = vec3(0.05, 0.00, 0.08);
  vec3 b = vec3(0.65, 0.10, 0.95);
  vec3 c = vec3(0.20, 0.95, 0.95);
  float t = clamp(u, 0.0, 1.0);
  float mid = smoothstep(0.0, 0.7, t);
  float hi  = smoothstep(0.6, 1.0, t);
  vec3 ab = mix(a, b, mid);
  return mix(ab, c, hi);
}

vec3 mammalDichromat(vec3 rgb){
  float rg = 0.55*rgb.g + 0.45*rgb.r;
  return vec3(rg, rg, rgb.b);
}

vec3 beeConcept(vec3 rgb, float uvi){
  vec3 base = vec3(0.60*rgb.r, rgb.g, rgb.b);
  float u = uvProxy(rgb);
  vec3 col = falseUV(u);
  return mix(base, col, clamp(uvi, 0.0, 1.0));
}

vec3 saturateBoost(vec3 rgb, float s){
  float y = luma(rgb);
  vec3 gray = vec3(y);
  return clamp(mix(gray, rgb, s), 0.0, 1.0);
}

vec3 birdConcept(vec3 rgb, float satBoost, float uvi){
  vec3 sat = saturateBoost(rgb, 1.0 + 1.2*satBoost);
  float u = uvProxy(rgb);
  vec3 uvCol = falseUV(u);
  float a = clamp(uvi, 0.0, 1.0) * 0.6;
  return mix(sat, uvCol, a);
}

vec3 monoContrast(vec3 rgb, float c){
  float y = luma(rgb);
  float cc = 1.0 + 1.8*c;
  float v = clamp((y - 0.5)*cc + 0.5, 0.0, 1.0);
  return vec3(v);
}

vec3 heatColor(float t){
  t = clamp(t, 0.0, 1.0);
  vec3 a = vec3(0.0, 0.0, 0.0);
  vec3 b = vec3(0.3, 0.0, 0.6);
  vec3 c = vec3(0.9, 0.1, 0.1);
  vec3 d = vec3(1.0, 0.9, 0.1);
  vec3 e = vec3(1.0, 1.0, 1.0);

  float t1 = smoothstep(0.0, 0.35, t);
  float t2 = smoothstep(0.25, 0.6, t);
  float t3 = smoothstep(0.55, 0.85, t);
  float t4 = smoothstep(0.8, 1.0, t);

  vec3 ab = mix(a, b, t1);
  vec3 bc = mix(b, c, t2);
  vec3 cd = mix(c, d, t3);
  vec3 de = mix(d, e, t4);

  vec3 mid = mix(ab, bc, smoothstep(0.2, 0.5, t));
  vec3 high = mix(cd, de, smoothstep(0.7, 1.0, t));
  return mix(mid, high, smoothstep(0.55, 0.9, t));
}

vec3 snakeThermal(vec3 rgb, float contrastAmt, float intensity){
  float y = luma(rgb);
  float heat = clamp(0.55*rgb.r + 0.45*y, 0.0, 1.0);
  float cc = 1.0 + 2.0*contrastAmt;
  heat = clamp((heat - 0.5)*cc + 0.5, 0.0, 1.0);

  vec3 col = heatColor(heat);
  float a = clamp(intensity, 0.0, 1.0);
  return mix(rgb, col, a);
}

vec3 rainbow(float t){
  float r = 0.5 + 0.5*cos(6.28318*(t + 0.00));
  float g = 0.5 + 0.5*cos(6.28318*(t + 0.33));
  float b = 0.5 + 0.5*cos(6.28318*(t + 0.67));
  return vec3(r,g,b);
}

float hueApprox(vec3 c) {
  float mx = max(c.r, max(c.g, c.b));
  float mn = min(c.r, min(c.g, c.b));
  float d = mx - mn;
  if (d < 1e-5) return 0.0;
  float h;
  if (mx == c.r) h = (c.g - c.b) / d;
  else if (mx == c.g) h = 2.0 + (c.b - c.r) / d;
  else h = 4.0 + (c.r - c.g) / d;
  h = h / 6.0;
  if (h < 0.0) h += 1.0;
  return h;
}

vec3 mantisConcept(vec3 rgb, float amt){
  float h = hueApprox(rgb);
  float n = mix(6.0, 16.0, clamp(amt, 0.0, 1.0));
  float band = floor(h * n) / n;
  vec3 pseudo = rainbow(band);
  return mix(rgb, pseudo, clamp(amt, 0.0, 1.0));
}

vec3 protanopia(vec3 rgb){ return vec3(0.15*rgb.r + 0.85*rgb.g, rgb.g, rgb.b); }
vec3 deuteranopia(vec3 rgb){ float rg = 0.5*(rgb.r + rgb.g); return vec3(rg, rg, rgb.b); }
vec3 tritanopia(vec3 rgb){ float y = 0.5*(rgb.r + rgb.g); return vec3(rgb.r, rgb.g, 0.2*rgb.b + 0.8*y); }
vec3 protanomaly(vec3 rgb){ float r = mix(rgb.r, rgb.g, 0.45); return vec3(r, rgb.g, rgb.b); }
vec3 deuteranomaly(vec3 rgb){ float g = mix(rgb.g, rgb.r, 0.35); return vec3(rgb.r, g, rgb.b); }
vec3 achromatopsia(vec3 rgb, float contrastAmt){ return monoContrast(rgb, contrastAmt); }

/* Dragonfly */
vec3 pixelateSample(sampler2D t, vec2 uv0, float cells){
  vec2 grid = vec2(cells, cells);
  vec2 uvp = (floor(uv0 * grid) + 0.5) / grid;
  return texture2D(t, uvp).rgb;
}

vec3 angleToColour(float a){
  return rainbow(a);
}

vec2 grad2(sampler2D t, vec2 uv0){
  vec3 c  = texture2D(t, uv0).rgb;
  vec3 cx = texture2D(t, uv0 + vec2(texelSize.x, 0.0)).rgb;
  vec3 cy = texture2D(t, uv0 + vec2(0.0, texelSize.y)).rgb;
  float gx = luma(cx) - luma(c);
  float gy = luma(cy) - luma(c);
  return vec2(gx, gy);
}

vec3 dragonflyConcept(sampler2D t, sampler2D prevT, vec2 uv0, float facetAmt, float uvAmt){
  float f = clamp(facetAmt, 0.0, 1.0);
  float uvi = clamp(uvAmt, 0.0, 1.0);

  float cells = mix(70.0, 260.0, f);
  vec3 fac = pixelateSample(t, uv0, cells);

  float top = step(0.52, uv0.y);
  vec3 skyTuned = vec3(0.50*fac.r, 0.95*fac.g, min(1.0, fac.b + 0.22));
  vec3 groundTuned = vec3(min(1.0, fac.r*1.05), fac.g, fac.b*0.95);
  vec3 tuned = mix(groundTuned, skyTuned, top);

  float u = uvProxy(fac);
  vec3 uvCol = falseUV(u);
  float uvBlend = uvi * (0.10 + 0.70*top);
  tuned = mix(tuned, uvCol, uvBlend);

  vec2 g = grad2(t, uv0);
  float mag = clamp(length(g) * (5.0 + 14.0*f), 0.0, 1.0);
  float ang = atan(g.y, g.x);
  float a01 = (ang + 3.14159) / 6.28318;
  vec3 pol = angleToColour(a01);

  float polBlend = mag * (0.10 + 0.55*f) * (0.25 + 0.75*top);
  tuned = mix(tuned, pol, polBlend);

  vec3 prev = texture2D(prevT, uv0).rgb;
  float motion = clamp(length(tuned - prev) * (3.0 + 10.0*f), 0.0, 1.0);

  float y = luma(tuned);
  float boosted = clamp(y + motion*(0.10 + 0.30*f), 0.0, 1.0);
  return mix(tuned, vec3(boosted), 0.20*motion);
}

/* Deep-sea fish */
vec3 blur9(sampler2D t, vec2 uv0){
  vec3 s = vec3(0.0);
  s += texture2D(t, uv0).rgb * 0.20;
  s += texture2D(t, uv0 + vec2(texelSize.x, 0.0)).rgb * 0.10;
  s += texture2D(t, uv0 - vec2(texelSize.x, 0.0)).rgb * 0.10;
  s += texture2D(t, uv0 + vec2(0.0, texelSize.y)).rgb * 0.10;
  s += texture2D(t, uv0 - vec2(0.0, texelSize.y)).rgb * 0.10;
  s += texture2D(t, uv0 + vec2(texelSize.x, texelSize.y)).rgb * 0.10;
  s += texture2D(t, uv0 + vec2(-texelSize.x, texelSize.y)).rgb * 0.10;
  s += texture2D(t, uv0 + vec2(texelSize.x, -texelSize.y)).rgb * 0.10;
  s += texture2D(t, uv0 + vec2(-texelSize.x, -texelSize.y)).rgb * 0.10;
  return s;
}

vec3 deepSeaFishConcept(sampler2D t, vec2 uv0, vec3 rgb, float amt){
  float a = clamp(amt, 0.0, 1.0);

  float y = luma(rgb);
  float dark = pow(y, mix(1.7, 2.6, a));
  vec3 base = rgb * mix(0.55, 0.25, a);
  base = mix(base, vec3(dark) * 0.65, 0.35);

  base.r *= mix(0.80, 0.35, a);
  base.g *= mix(1.00, 1.10, a);
  base.b *= mix(1.05, 1.35, a);

  float brightMask = smoothstep(mix(0.78, 0.62, a), 1.0, y);
  float blueMask = smoothstep(0.55, 0.95, rgb.b);
  float mask = clamp(0.65*brightMask + 0.35*blueMask, 0.0, 1.0);

  vec3 blur = blur9(t, uv0);
  float by = luma(blur);
  float bloomMask = smoothstep(mix(0.70, 0.50, a), 1.0, by) * mask;

  vec3 cyanTint = vec3(0.20, 0.95, 0.90);
  vec3 glow = blur * mix(1.2, 3.0, a);
  glow = mix(glow, cyanTint * by, 0.55);
  glow *= bloomMask;

  vec2 p = uv0 * 2.0 - 1.0;
  float r = dot(p, p);
  float vig = smoothstep(1.05, 0.25, r);
  base *= mix(0.55, 1.0, vig);

  vec3 outCol = base + glow * mix(0.6, 1.4, a);
  return clamp(outCol, 0.0, 1.0);
}

void main() {
  vec3 rgb = texture2D(tex, uv).rgb;

  bool isLeftHuman = (compareEnabled == 1) && (uv.x < split);
  vec3 result = rgb;

  if (!isLeftHuman) {
    if (mode == 0) result = rgb;
    else if (mode == 1) result = mix(rgb, mammalDichromat(rgb), clamp(strength, 0.0, 1.0));
    else if (mode == 2) result = beeConcept(rgb, uvIntensity);
    else if (mode == 3) result = birdConcept(rgb, strength, uvIntensity);
    else if (mode == 4) result = dragonflyConcept(tex, prevTex, uv, strength, uvIntensity);
    else if (mode == 5) result = deepSeaFishConcept(tex, uv, rgb, strength);
    else if (mode == 6) result = monoContrast(rgb, strength);
    else if (mode == 7) result = snakeThermal(rgb, strength, uvIntensity);
    else if (mode == 8) result = mantisConcept(rgb, strength);

    else if (mode == 10) result = deuteranopia(rgb);
    else if (mode == 11) result = protanopia(rgb);
    else if (mode == 12) result = tritanopia(rgb);
    else if (mode == 13) result = deuteranomaly(rgb);
    else if (mode == 14) result = protanomaly(rgb);
    else if (mode == 15) result = achromatopsia(rgb, strength);
  }

  gl_FragColor = vec4(result, 1.0);
}
`;

function compile(type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader);
    console.error("Shader compile error:", log);
    setStatus(`<b>Shader error:</b> ${log}`, true);
    throw new Error(log);
  }
  return shader;
}

const vs = compile(gl.VERTEX_SHADER, vertexShaderSource);
const fs = compile(gl.FRAGMENT_SHADER, fragmentShaderSource);

const program = gl.createProgram();
gl.attachShader(program, vs);
gl.attachShader(program, fs);
gl.linkProgram(program);

if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
  const log = gl.getProgramInfoLog(program);
  console.error("Program link error:", log);
  setStatus(`<b>WebGL link error:</b> ${log}`, true);
  throw new Error(log);
}

gl.useProgram(program);

// Fullscreen quad
const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,  1,-1,  -1,1,  1,1]), gl.STATIC_DRAW);

const posLoc = gl.getAttribLocation(program, "position");
gl.enableVertexAttribArray(posLoc);
gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

// Textures
const texture = gl.createTexture();
gl.activeTexture(gl.TEXTURE0);
gl.bindTexture(gl.TEXTURE_2D, texture);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

const prevTexture = gl.createTexture();
gl.activeTexture(gl.TEXTURE1);
gl.bindTexture(gl.TEXTURE_2D, prevTexture);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

function allocPrevTexture() {
  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, prevTexture);
  gl.texImage2D(
    gl.TEXTURE_2D, 0, gl.RGB,
    canvas.width, canvas.height,
    0, gl.RGB, gl.UNSIGNED_BYTE, null
  );
}
allocPrevTexture();

// Uniforms
const uTex = gl.getUniformLocation(program, "tex");
const uPrevTex = gl.getUniformLocation(program, "prevTex");
const uTexel = gl.getUniformLocation(program, "texelSize");

const uMode = gl.getUniformLocation(program, "mode");
const uStrength = gl.getUniformLocation(program, "strength");
const uUV = gl.getUniformLocation(program, "uvIntensity");
const uSplit = gl.getUniformLocation(program, "split");
const uCompare = gl.getUniformLocation(program, "compareEnabled");

gl.uniform1i(uTex, 0);
gl.uniform1i(uPrevTex, 1);

// Initial UI setup
resize();
updateCompareUI();
updateUIForMode();

/* ---------- Camera ---------- */

function isSecureEnoughForCamera() {
  // getUserMedia requires secure context: https OR localhost.
  const h = window.location.hostname;
  const isLocalhost = (h === "localhost" || h === "127.0.0.1");
  return window.isSecureContext || isLocalhost;
}

async function initCamera() {
  if (!navigator.mediaDevices?.getUserMedia) {
    setStatus("<b>Camera error:</b> getUserMedia not supported in this browser.", true);
    return;
  }

  if (!isSecureEnoughForCamera()) {
    setStatus(
      "<b>Camera blocked:</b> this page is not a secure context. Use <b>https</b> or <b>http://localhost</b>.",
      true
    );
    return;
  }

  try {
    setStatus("Requesting camera permission…", true);

    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" },
      audio: false
    });

    video.srcObject = stream;
    video.muted = true;
    video.playsInline = true;
    await video.play();

    setStatus("✅ Camera started. If the view is black, check permissions and reload.", true);
    // hide after a moment
    setTimeout(() => setStatus("", false), 1800);

  } catch (err) {
    console.error("getUserMedia error:", err);
    setStatus(
      `<b>Camera error:</b> ${err.name} — ${err.message}<br/>
       <span class="smallNote">Check site permissions and reload. On iPhone: Settings → Safari → Camera.</span>`,
      true
    );
  }
}
initCamera();

/* ---------- Render loop ---------- */

function render() {
  gl.viewport(0, 0, canvas.width, canvas.height);

  if (video.readyState >= 2) {
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, video);
  }

  gl.uniform2f(uTexel, 1.0 / canvas.width, 1.0 / canvas.height);

  gl.uniform1i(uMode, parseInt(modeEl?.value ?? "0", 10));
  gl.uniform1f(uStrength, parseFloat(strengthEl?.value ?? "0.85"));
  gl.uniform1f(uUV, parseFloat(uvEl?.value ?? "0.75"));
  gl.uniform1f(uSplit, parseFloat(splitEl?.value ?? "0.5"));
  gl.uniform1i(uCompare, compareEl?.checked ? 1 : 0);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

  // Save previous frame for dragonfly motion emphasis
  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, prevTexture);
  gl.copyTexImage2D(gl.TEXTURE_2D, 0, gl.RGB, 0, 0, canvas.width, canvas.height, 0);
  gl.activeTexture(gl.TEXTURE0);

  requestAnimationFrame(render);
}
render();
