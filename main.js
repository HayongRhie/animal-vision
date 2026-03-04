const video = document.getElementById("video");
const canvas = document.getElementById("canvas");

// Controls
const modeEl = document.getElementById("mode");
const strengthEl = document.getElementById("strength");
const uvEl = document.getElementById("uv");
const compareEl = document.getElementById("compare");
const splitEl = document.getElementById("split");
const splitRow = document.getElementById("splitRow");
const strengthLabel = document.getElementById("strengthLabel");
const uvLabel = document.getElementById("uvLabel");
const modeTitle = document.getElementById("modeTitle");

// Thermal legend only
const thermalLegend = document.getElementById("thermalLegend");

// Modal
const learnBtn = document.getElementById("learnBtn");
const colourBtn = document.getElementById("colourBtn");
const modalBackdrop = document.getElementById("modalBackdrop");
const modalTitleEl = document.getElementById("modalTitle");
const modalBody = document.getElementById("modalBody");
const modalClose = document.getElementById("modalClose");

/* ---------- Tiny inline graphics (SVG) ---------- */

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
      A phone camera measures RGB in the visible range only.
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
      <text x="462.5" y="75" text-anchor="middle" fill="rgba(255,255,255,0.88)" font-size="16" font-family="system-ui" font-weight="700">Rods</text>
      <text x="462.5" y="100" text-anchor="middle" fill="rgba(255,255,255,0.65)" font-size="12" font-family="system-ui">low-light</text>
    </g>

    <text x="10" y="145" fill="rgba(255,255,255,0.65)" font-size="12" font-family="system-ui">
      Colour comes from comparing cone responses; rods mainly encode brightness in dim light.
    </text>
  </svg>
  `;
}

/* ---------- Colour 101 content (replaces repeated background in Learn) ---------- */

const COLOUR_101_HTML = `
<h2>What is colour?</h2>

<p>
<b>Colour</b> isn’t a property stored inside objects — it’s a <b>perception</b> your brain builds from how light interacts with surfaces
and how your eyes measure that light.
</p>

<div class="learnGrid">
  <div class="learnCard">
    <div class="learnCardTitle">Wavelengths (simplified)</div>
    ${wavelengthScaleSVG()}
  </div>
  <div class="learnCard">
    <div class="learnCardTitle">Human vision channels</div>
    ${coneDiagramSVG()}
  </div>
</div>

<h3>Three key steps</h3>
<ul>
  <li><b>Illumination:</b> a light source provides a spectrum of wavelengths.</li>
  <li><b>Interaction:</b> surfaces absorb and reflect different wavelengths.</li>
  <li><b>Sensing:</b> your eye samples the result using photoreceptors (cones/rods), then your brain interprets it.</li>
</ul>

<h3>Why animals “see differently”</h3>
<ul>
  <li>Different species can have <b>different sets of photoreceptors</b> (fewer, more, or shifted sensitivities).</li>
  <li>Some can use <b>polarisation</b> cues or have special optics/retina structures.</li>
  <li>Some prioritise <b>motion</b> or <b>contrast</b> over colour (especially in low light).</li>
</ul>

<h3>What this app can and cannot do</h3>
<ul>
  <li>Your phone camera measures only <b>three channels (RGB)</b> in visible light.</li>
  <li>So, UV/IR/polarisation modes here are <b>visualisations</b>: we infer a proxy from RGB and map it into a display.</li>
  <li>Even when biology is real, the display is still an RGB screen — some animal colour spaces can’t be perfectly shown.</li>
</ul>

<div class="smallNote">
If you want the strongest effect: turn on <b>Compare</b>, set the split near the middle, and change modes while pointing at something colourful or shiny.
</div>
`;

/* ---------- Mode-specific Learn content ---------- */

const MODE_INFO = {
  0: {
    name: "Human (baseline)",
    what: ["No transform. This is your reference."],
    why: ["Used as the baseline for comparison."],
    model: ["None."],
    limits: ["None."],
    try: ["Turn on Compare and slide the split to compare with other modes."]
  },

  1: {
    name: "Mammal (dichromat: dog/cat/horse concept)",
    what: [
      "Some red–green differences compress (warm hues can look more similar).",
      "Blues often stand out more."
    ],
    why: [
      "With fewer cone channels, many hues map to similar receptor responses."
    ],
    model: [
      "We mix red and green into a shared channel (educational transform).",
      "Strength blends between human RGB and the dichromat transform."
    ],
    limits: [
      "Approximation: camera RGB ≠ exact animal cone sensitivities.",
      "An RGB display can’t reproduce an animal’s colour space perfectly."
    ],
    try: ["Try red vs green objects (fruit, labels). Watch them become more similar."]
  },

  2: {
    name: "Bee (concept: UV inferred)",
    what: ["An inferred UV layer appears as false colour (especially in bright regions)."],
    why: ["Many insects have UV-sensitive photoreceptors; UV patterns can carry information."],
    model: [
      "We compute a UV proxy from RGB and blend a false-colour UV map.",
      "UV slider controls the blend strength."
    ],
    limits: ["Not real UV. A phone camera cannot measure UV here."],
    try: ["Try glossy packaging, bright whites, printed pages."]
  },

  3: {
    name: "Bird (tetrachromat concept)",
    what: ["A more saturated look with a subtle inferred UV contribution."],
    why: ["Many birds have an extra cone channel (often UV) and spectral filtering effects."],
    model: [
      "We boost saturation and add a light UV proxy layer.",
      "Strength controls saturation; UV controls the inferred UV layer."
    ],
    limits: ["A 4D cone space cannot be perfectly displayed on an RGB screen."],
    try: ["Try colourful posters or clothing; increase saturation and compare."]
  },

  4: {
    name: "Dragonfly (compound eye + polarisation concept)",
    what: [
      "Compound eye facets (mosaic look).",
      "Top-half is biased toward sky-like colours and UV emphasis (concept).",
      "A polarisation-like false-colour overlay appears strongest in the “sky” half (concept).",
      "Fast motion stands out more (concept)."
    ],
    why: [
      "Dragonflies are fast visual hunters.",
      "Some insects use polarisation cues; many have UV sensitivity.",
      "High flicker fusion relates to better temporal discrimination."
    ],
    model: [
      "Facet mosaic (pixelated sampling).",
      "Divided-eye tuning (top vs bottom).",
      "Polarisation proxy: gradient orientation → false-colour overlay (inferred).",
      "Speed proxy: compare current vs previous frame to emphasise motion."
    ],
    limits: [
      "UV/polarisation are inferred proxies (not measured).",
      "Your camera FPS is unchanged — we only emphasise change/motion."
    ],
    try: ["Point at sky vs ground, then wave your hand quickly. Increase Strength and UV."]
  },

  5: {
    name: "Deep-sea fish (bioluminescence concept)",
    what: [
      "The scene darkens strongly.",
      "Small bright regions get a strong glow/bloom.",
      "Overall shifts toward blue/green; reds are reduced."
    ],
    why: [
      "In deep water, light is scarce; bright points (bioluminescence/specular glints) can be extremely salient."
    ],
    model: [
      "Crush mid-tones + vignette (deep darkness).",
      "Highlight extraction + small blur bloom (glow).",
      "Blue/green bias."
    ],
    limits: ["Not a physical underwater optics simulation."],
    try: ["Try tiny LEDs, reflections on metal/plastic, or the phone flashlight reflected off shiny objects."]
  },

  6: {
    name: "Shark (low-light / monochrome concept)",
    what: ["Grayscale with boosted contrast."],
    why: ["In low light, luminance/contrast dominates over hue."],
    model: ["Convert to luminance and apply a contrast curve."],
    limits: ["Not species-specific."],
    try: ["Try dim lighting and increase contrast."]
  },

  7: {
    name: "Snake (thermal concept)",
    what: ["A thermal-style heatmap overlay."],
    why: ["Some snakes sense IR via specialised organs (not via a phone camera)."],
    model: ["Heat proxy from brightness/red weighting → thermal colourmap blend."],
    limits: ["Not real IR imaging. True thermal requires an IR sensor."],
    try: ["Point at your hand/face (concept). Adjust contrast and intensity."]
  },

  8: {
    name: "Mantis shrimp (concept)",
    what: ["Colours become “channelised” into discrete bands."],
    why: ["This communicates ‘many channels’ conceptually (not accuracy)."],
    model: ["Hue quantisation into more bands as Strength increases."],
    limits: ["Strongly conceptual."],
    try: ["Try rainbow gradients and colourful posters; increase Strength."]
  },

  10: {
    name: "Deuteranopia",
    what: ["Strong red–green confusion."],
    why: ["Reduced/absent M-cone contribution (concept)."],
    model: ["Collapse red and green toward a shared channel."],
    limits: ["Educational approximation."],
    try: ["Try charts and labels with red/green differences."]
  },

  11: {
    name: "Protanopia",
    what: ["Reds can darken/shift; red–green confusion."],
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
    what: ["Milder red–green confusion than deuteranopia."],
    why: ["Cone response shifted/overlapping more strongly (concept)."],
    model: ["Gently pull green toward red."],
    limits: ["Educational approximation."],
    try: ["Try subtle red/green pastels."]
  },

  14: {
    name: "Protanomaly",
    what: ["Milder protanopia-like effect."],
    why: ["Cone response shifted/overlapping more strongly (concept)."],
    model: ["Gently pull red toward green."],
    limits: ["Educational approximation."],
    try: ["Try red/orange/pink objects."]
  },

  15: {
    name: "Achromatopsia (total colour blindness concept)",
    what: ["Near-complete grayscale; contrast adjustable."],
    why: ["Colour channels contribute little; luminance dominates."],
    model: ["Convert to luminance and adjust contrast."],
    limits: ["Educational approximation."],
    try: ["Try colourful scenes and adjust contrast."]
  }
};

/* ---------- UI plumbing ---------- */

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  if (allocPrevTexture) allocPrevTexture();
}
window.addEventListener("resize", resize);
resize();

function updateCompareUI() {
  splitRow.style.display = compareEl.checked ? "grid" : "none";
}
compareEl.addEventListener("change", updateCompareUI);
updateCompareUI();

function updateUIForMode() {
  const m = parseInt(modeEl.value, 10);
  const info = MODE_INFO[m] || { name: "Mode" };
  modeTitle.textContent = info.name;

  thermalLegend.style.display = "none";

  // Defaults
  strengthEl.disabled = true;
  uvEl.disabled = true;
  strengthLabel.textContent = "Strength (n/a)";
  uvLabel.textContent = "UV / Overlay (n/a)";

  // Mammal dichromat
  if (m === 1) {
    strengthEl.disabled = false;
    strengthLabel.textContent = "Strength";
  }

  // Bee
  if (m === 2) {
    uvEl.disabled = false;
    uvLabel.textContent = "UV emphasis (inferred)";
  }

  // Bird
  if (m === 3) {
    strengthEl.disabled = false;
    uvEl.disabled = false;
    strengthLabel.textContent = "Saturation boost";
    uvLabel.textContent = "UV layer (inferred)";
  }

  // Dragonfly
  if (m === 4) {
    strengthEl.disabled = false;
    uvEl.disabled = false;
    strengthLabel.textContent = "Facet / polarisation strength";
    uvLabel.textContent = "UV emphasis (concept)";
  }

  // Deep-sea fish
  if (m === 5) {
    strengthEl.disabled = false;
    strengthLabel.textContent = "Glow intensity";
  }

  // Shark
  if (m === 6) {
    strengthEl.disabled = false;
    strengthLabel.textContent = "Contrast";
  }

  // Snake thermal
  if (m === 7) {
    strengthEl.disabled = false;
    uvEl.disabled = false;
    strengthLabel.textContent = "Thermal contrast";
    uvLabel.textContent = "Thermal intensity";
    thermalLegend.style.display = "block";
  }

  // Mantis shrimp
  if (m === 8) {
    strengthEl.disabled = false;
    strengthLabel.textContent = "Channelisation";
  }

  // Achromatopsia
  if (m === 15) {
    strengthEl.disabled = false;
    strengthLabel.textContent = "Contrast";
  }
}
modeEl.addEventListener("change", updateUIForMode);
updateUIForMode();

/* ---------- Modal helpers ---------- */

function openModal(title, html) {
  modalTitleEl.textContent = title;
  modalBody.innerHTML = html;

  document.body.classList.add("modalOpen");
  modalBackdrop.style.display = "block";
  modalBody.scrollTop = 0;
}

function closeModal() {
  modalBackdrop.style.display = "none";
  document.body.classList.remove("modalOpen");
}

modalClose.addEventListener("click", closeModal);
modalBackdrop.addEventListener("click", (e) => {
  if (e.target === modalBackdrop) closeModal();
});

colourBtn.addEventListener("click", () => {
  openModal("Colour 101", COLOUR_101_HTML);
});

learnBtn.addEventListener("click", () => {
  const m = parseInt(modeEl.value, 10);
  const info = MODE_INFO[m] || { name: "Learn", what:[], why:[], model:[], limits:[], try:[] };

  const list = (arr) => `<ul>${(arr || []).map(x => `<li>${x}</li>`).join("")}</ul>`;

  const html = `
    <h2>${info.name}</h2>

    <h3>What you should notice</h3>
    ${list(info.what)}

    <h3>Why this happens</h3>
    ${list(info.why)}

    <h3>What the app does (model)</h3>
    ${list(info.model)}

    <h3>Limits</h3>
    ${list(info.limits)}

    <h3>Try this</h3>
    ${list(info.try)}

    <div class="smallNote">
      Tip: turn on <b>Compare</b> and slide the split to directly see what changes.
    </div>
  `;

  openModal("Learn", html);
});

/* ---------- WebGL ---------- */

const gl = canvas.getContext("webgl", { premultipliedAlpha: false });
if (!gl) {
  alert("WebGL not available.");
  throw new Error("WebGL not available");
}

// Fix upside-down video textures
gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

// Camera
async function initCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" },
      audio: false
    });

    video.srcObject = stream;
    video.muted = true;
    video.playsInline = true;
    await video.play();
    console.log("✅ Camera started:", stream.getVideoTracks()[0].getSettings());
  } catch (err) {
    console.error("❌ getUserMedia error:", err);
    alert(`Camera error: ${err.name}\n${err.message}\n\nCheck camera permissions for this site.`);
  }
}
initCamera();

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

float luma(vec3 rgb) {
  return dot(rgb, vec3(0.299, 0.587, 0.114));
}

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

/* --- Mammal dichromat concept (dog/cat/horse merged) --- */
vec3 mammalDichromat(vec3 rgb){
  float rg = 0.55*rgb.g + 0.45*rgb.r;
  return vec3(rg, rg, rgb.b);
}

/* --- Bee: inferred UV overlay --- */
vec3 beeConcept(vec3 rgb, float uvi){
  vec3 base = vec3(0.60*rgb.r, rgb.g, rgb.b);
  float u = uvProxy(rgb);
  vec3 col = falseUV(u);
  return mix(base, col, clamp(uvi, 0.0, 1.0));
}

/* --- Saturation boost helper --- */
vec3 saturateBoost(vec3 rgb, float s){
  float y = luma(rgb);
  vec3 gray = vec3(y);
  return clamp(mix(gray, rgb, s), 0.0, 1.0);
}

/* --- Bird concept --- */
vec3 birdConcept(vec3 rgb, float satBoost, float uvi){
  vec3 sat = saturateBoost(rgb, 1.0 + 1.2*satBoost);
  float u = uvProxy(rgb);
  vec3 uvCol = falseUV(u);
  float a = clamp(uvi, 0.0, 1.0) * 0.6;
  return mix(sat, uvCol, a);
}

/* --- Monochrome + contrast --- */
vec3 monoContrast(vec3 rgb, float c){
  float y = luma(rgb);
  float cc = 1.0 + 1.8*c;
  float v = clamp((y - 0.5)*cc + 0.5, 0.0, 1.0);
  return vec3(v);
}

/* --- Thermal colourmap --- */
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

/* --- Snake thermal concept --- */
vec3 snakeThermal(vec3 rgb, float contrastAmt, float intensity){
  float y = luma(rgb);
  float heat = clamp(0.55*rgb.r + 0.45*y, 0.0, 1.0);
  float cc = 1.0 + 2.0*contrastAmt;
  heat = clamp((heat - 0.5)*cc + 0.5, 0.0, 1.0);

  vec3 col = heatColor(heat);
  float a = clamp(intensity, 0.0, 1.0);
  return mix(rgb, col, a);
}

/* --- Mantis shrimp: channelised hues --- */
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

/* --- Human colour-vision differences (concept) --- */
vec3 protanopia(vec3 rgb){
  return vec3(0.15*rgb.r + 0.85*rgb.g, rgb.g, rgb.b);
}
vec3 deuteranopia(vec3 rgb){
  float rg = 0.5*(rgb.r + rgb.g);
  return vec3(rg, rg, rgb.b);
}
vec3 tritanopia(vec3 rgb){
  float y = 0.5*(rgb.r + rgb.g);
  return vec3(rgb.r, rgb.g, 0.2*rgb.b + 0.8*y);
}
vec3 protanomaly(vec3 rgb){
  float r = mix(rgb.r, rgb.g, 0.45);
  return vec3(r, rgb.g, rgb.b);
}
vec3 deuteranomaly(vec3 rgb){
  float g = mix(rgb.g, rgb.r, 0.35);
  return vec3(rgb.r, g, rgb.b);
}
vec3 achromatopsia(vec3 rgb, float contrastAmt){
  return monoContrast(rgb, contrastAmt);
}

/* ---------- Dragonfly: facets + divided eye + polarisation proxy + motion emphasis ---------- */

vec3 pixelateSample(sampler2D t, vec2 uv0, float cells){
  vec2 grid = vec2(cells, cells);
  vec2 uvp = (floor(uv0 * grid) + 0.5) / grid;
  return texture2D(t, uvp).rgb;
}

vec3 angleToColour(float a){
  float r = 0.5 + 0.5*cos(6.28318*(a + 0.00));
  float g = 0.5 + 0.5*cos(6.28318*(a + 0.33));
  float b = 0.5 + 0.5*cos(6.28318*(a + 0.67));
  return vec3(r,g,b);
}

vec2 grad2(sampler2D t, vec2 uv0){
  vec3 c  = texture2D(t, uv0).rgb;
  vec3 cx = texture2D(t, uv0 + vec2(texelSize.x, 0.0)).rgb;
  vec3 cy = texture2D(t, uv0 + vec2(0.0, texelSize.y)).rgb;
  float gx = luma(cx) - luma(c);
  float gy = luma(cy) - luma(c);
  return vec2(gx, gy);
}

vec3 dragonflyConcept(sampler2D t, sampler2D prevT, vec2 uv0, vec3 rgb, float facetAmt, float uvAmt){
  float f = clamp(facetAmt, 0.0, 1.0);
  float uvi = clamp(uvAmt, 0.0, 1.0);

  // Facets
  float cells = mix(70.0, 260.0, f);
  vec3 fac = pixelateSample(t, uv0, cells);

  // Divided eye (top half sky-tuned)
  float top = step(0.52, uv0.y);
  vec3 skyTuned = vec3(0.50*fac.r, 0.95*fac.g, min(1.0, fac.b + 0.22));
  vec3 groundTuned = vec3(min(1.0, fac.r*1.05), fac.g, fac.b*0.95);
  vec3 tuned = mix(groundTuned, skyTuned, top);

  // UV emphasis (inferred proxy), stronger in sky region
  float u = uvProxy(fac);
  vec3 uvCol = falseUV(u);
  float uvBlend = uvi * (0.10 + 0.70*top);
  tuned = mix(tuned, uvCol, uvBlend);

  // Polarisation proxy: gradient orientation -> false-colour overlay, stronger in sky
  vec2 g = grad2(t, uv0);
  float mag = clamp(length(g) * (5.0 + 14.0*f), 0.0, 1.0);
  float ang = atan(g.y, g.x);
  float a01 = (ang + 3.14159) / 6.28318;
  vec3 pol = angleToColour(a01);

  float polBlend = mag * (0.10 + 0.55*f) * (0.25 + 0.75*top);
  tuned = mix(tuned, pol, polBlend);

  // Speed of sight concept: motion emphasis (current vs previous frame)
  vec3 prev = texture2D(prevT, uv0).rgb;
  float motion = clamp(length(tuned - prev) * (3.0 + 10.0*f), 0.0, 1.0);

  float y = luma(tuned);
  float boosted = clamp(y + motion*(0.10 + 0.30*f), 0.0, 1.0);
  vec3 outCol = mix(tuned, vec3(boosted), 0.20*motion);

  return clamp(outCol, 0.0, 1.0);
}

/* ---------- Deep-sea fish: strong dark + bright-point bloom + blue/green bias ---------- */

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

  // Darken heavily (deep water feel)
  float y = luma(rgb);
  float dark = pow(y, mix(1.7, 2.6, a));
  vec3 base = rgb * mix(0.55, 0.25, a);
  base = mix(base, vec3(dark) * 0.65, 0.35);

  // Blue/green bias, suppress reds
  base.r *= mix(0.80, 0.35, a);
  base.g *= mix(1.00, 1.10, a);
  base.b *= mix(1.05, 1.35, a);

  // Bright candidates
  float brightMask = smoothstep(mix(0.78, 0.62, a), 1.0, y);
  float blueMask = smoothstep(0.55, 0.95, rgb.b);
  float mask = clamp(0.65*brightMask + 0.35*blueMask, 0.0, 1.0);

  // Bloom/glow from blur + cyan tint
  vec3 blur = blur9(t, uv0);
  float by = luma(blur);
  float bloomMask = smoothstep(mix(0.70, 0.50, a), 1.0, by) * mask;

  vec3 cyanTint = vec3(0.20, 0.95, 0.90);
  vec3 glow = blur * mix(1.2, 3.0, a);
  glow = mix(glow, cyanTint * by, 0.55);
  glow *= bloomMask;

  // Vignette
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

    else if (mode == 4) result = dragonflyConcept(tex, prevTex, uv, rgb, strength, uvIntensity);
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

// Main texture (camera)
const texture = gl.createTexture();
gl.activeTexture(gl.TEXTURE0);
gl.bindTexture(gl.TEXTURE_2D, texture);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

// Previous-frame texture (for dragonfly motion emphasis)
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
    gl.TEXTURE_2D,
    0,
    gl.RGB,
    canvas.width,
    canvas.height,
    0,
    gl.RGB,
    gl.UNSIGNED_BYTE,
    null
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

// Camera init
async function initCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" },
      audio: false
    });
    video.srcObject = stream;
    video.muted = true;
    video.playsInline = true;
    await video.play();
  } catch (err) {
    console.error("❌ getUserMedia error:", err);
    alert(`Camera error: ${err.name}\n${err.message}\n\nCheck camera permissions for this site.`);
  }
}
initCamera();

function render() {
  gl.viewport(0, 0, canvas.width, canvas.height);

  // Upload camera frame
  if (video.readyState >= 2) {
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, video);
  }

  // Per-frame uniforms
  gl.uniform2f(uTexel, 1.0 / canvas.width, 1.0 / canvas.height);

  gl.uniform1i(uMode, parseInt(modeEl.value, 10));
  gl.uniform1f(uStrength, parseFloat(strengthEl.value));
  gl.uniform1f(uUV, parseFloat(uvEl.value));
  gl.uniform1f(uSplit, parseFloat(splitEl.value));
  gl.uniform1i(uCompare, compareEl.checked ? 1 : 0);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

  // Copy rendered output to prevTexture (for next-frame motion emphasis)
  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, prevTexture);
  gl.copyTexImage2D(gl.TEXTURE_2D, 0, gl.RGB, 0, 0, canvas.width, canvas.height, 0);

  // Restore
  gl.activeTexture(gl.TEXTURE0);

  requestAnimationFrame(render);
}

render();
