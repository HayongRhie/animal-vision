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

// Learn modal
const learnBtn = document.getElementById("learnBtn");
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
      This phone camera measures RGB in the visible range — not UV or polarization.
    </text>
  </svg>
  `;
}

function coneDiagramSVG(modeId) {
  const m = parseInt(modeId, 10);

  let label = "Human (baseline): 3 cones + rods";
  let cones = ["S", "M", "L"];
  let note = "Cones encode colour; rods dominate low-light vision.";

  if ([1, 4, 8].includes(m)) {
    label = "Mammal dichromat (concept): 2 cones + rods";
    cones = ["S", "M/L"];
    note = "Two cone channels compress some hue differences.";
  } else if (m === 2) {
    label = "Bee (concept): UV + Blue + Green";
    cones = ["UV", "B", "G"];
    note = "UV is inferred here (not measured).";
  } else if (m === 9) {
    label = "Bird (concept): 4 cones (incl. UV)";
    cones = ["UV", "S", "M", "L"];
    note = "4D cone responses can’t be displayed perfectly on an RGB screen.";
  } else if (m === 11) {
    label = "Thermal concept: IR sense (not camera)";
    cones = ["Visible RGB", "IR (concept)"];
    note = "Thermal overlay is inferred from RGB; not real infrared.";
  } else if (m === 12) {
    label = "Many-channel concept (mantis shrimp)";
    cones = ["Many channels (concept)"];
    note = "Shows ‘channel richness’ without claiming accuracy.";
  } else if (m === 16) {
    label = "Dragonfly (compound eye + polarization concept)";
    cones = ["Facets", "UV/blue bias", "Polarization (concept)"];
    note = "Polarization/UV are visualized proxies, not direct measurements.";
  } else if (m === 20) {
    label = "Deep-sea fish (bioluminescence concept)";
    cones = ["Luminance", "Blue/green bias"];
    note = "Emphasises bright points in dark scenes (concept).";
  }

  const items = cones.map((c, i) => {
    const x = 35 + i * 155;
    const w = 140;
    const h = 58;
    return `
      <g>
        <rect x="${x}" y="38" width="${w}" height="${h}" rx="14" fill="rgba(255,255,255,0.10)" stroke="rgba(255,255,255,0.18)"/>
        <text x="${x + w/2}" y="73" text-anchor="middle" fill="rgba(255,255,255,0.88)" font-size="14" font-family="system-ui" font-weight="600">${c}</text>
        <text x="${x + w/2}" y="95" text-anchor="middle" fill="rgba(255,255,255,0.65)" font-size="11" font-family="system-ui">channel</text>
      </g>
    `;
  }).join("");

  return `
  <svg class="learnSvg" viewBox="0 0 520 140" xmlns="http://www.w3.org/2000/svg" aria-label="Photoreceptor channel diagram">
    <text x="10" y="20" fill="rgba(255,255,255,0.85)" font-size="14" font-family="system-ui">${label}</text>
    ${items}
    <text x="10" y="130" fill="rgba(255,255,255,0.65)" font-size="12" font-family="system-ui">${note}</text>
  </svg>
  `;
}

/* ---------- Learn text ---------- */

const SCIENCE_BG = `
<h3>Core idea: colour is biology + physics</h3>
<ul>
  <li><b>Light</b> is electromagnetic radiation. Humans call ~<b>400–700 nm</b> “visible.”</li>
  <li><b>Photoreceptors</b> convert photons to neural signals. Humans use <b>cones</b> for colour and <b>rods</b> for low-light.</li>
  <li>This app uses a phone camera (RGB only), so UV/IR/polarization modes are <b>concept visualizations</b>.</li>
</ul>

<div class="smallNote">
<b>Key limitation:</b> UV and polarization require different sensing than standard phone RGB cameras.
</div>
`;

/* ---------- Mode info (short + practical) ---------- */

const MODE_INFO = {
  0: { name: "Human (baseline)", photoreceptors:["RGB camera feed (reference)."], what:["No transform."], why:["Baseline."], model:["None."], limits:["None."], try:["Compare with any mode."] },

  1: { name: "Dog (dichromat)", photoreceptors:["2 cone channels (concept)."], what:["Red–green compresses."], why:["Fewer channels."], model:["R/G mixed."], limits:["Approximation."], try:["Try red vs green objects."] },
  4: { name: "Cat (dichromat)", photoreceptors:["2 cone channels (concept)."], what:["Warm hues compress."], why:["Fewer channels."], model:["R/G weighted mix."], limits:["Stylised."], try:["Try colourful books/clothes."] },
  8: { name: "Horse (dichromat)", photoreceptors:["2 cone channels (concept)."], what:["Hue compression."], why:["Fewer channels."], model:["R/G blended + blue tie."], limits:["Approximation."], try:["Try outdoor scenes."] },

  2: { name: "Bee (concept: UV inferred)", photoreceptors:["UV/Blue/Green (concept)."], what:["UV overlay."], why:["UV patterns can matter."], model:["UV proxy from RGB."], limits:["Not real UV."], try:["Try glossy packaging."] },
  9: { name: "Bird (tetrachromat concept)", photoreceptors:["4 cones incl. UV (concept)."], what:["More saturation + UV layer."], why:["Extra channel."], model:["Saturation boost + UV proxy."], limits:["RGB screen limits."], try:["Try colourful posters."] },

  10:{ name:"Shark (low-light / monochrome)", photoreceptors:["Rod-dominant (concept)."], what:["Grayscale + contrast."], why:["Luminance dominates."], model:["Luma + contrast curve."], limits:["Not species-specific."], try:["Try dim lighting."] },
  11:{ name:"Snake (thermal concept)", photoreceptors:["IR sense (concept)."], what:["Thermal overlay."], why:["Non-visible channel."], model:["Heat proxy from RGB."], limits:["Not real IR."], try:["Try your hand/face."] },
  12:{ name:"Mantis shrimp (concept)", photoreceptors:["Many channels (concept)."], what:["Banded colours."], why:["Channel richness idea."], model:["Hue quantisation."], limits:["Strongly conceptual."], try:["Try gradients."] },

  16:{
    name:"Dragonfly (compound eye + polarization concept)",
    photoreceptors:[
      "Compound eye facets (ommatidia).",
      "UV/blue sky bias (concept).",
      "Polarization sensitivity (concept overlay).",
      "High ‘speed of sight’ (concept: motion emphasis)."
    ],
    what:["Facet mosaic + top-half sky tuning + polarization-like false colours + motion emphasis."],
    why:["Dragonflies are fast visual hunters; sky vs ground tuning is common in concept descriptions."],
    model:["Facets + sky/ground split + gradient-orientation overlay + previous-frame motion emphasis."],
    limits:["UV/polarization are inferred proxies; phone camera FPS is unchanged."],
    try:["Try looking at the sky vs ground, and wave your hand quickly."]
  },

  20:{
    name:"Deep-sea fish (bioluminescence concept)",
    photoreceptors:["Dark environment + bright-point emphasis (concept)."],
    what:["Scene darkens; bright bits glow strongly; blue/green bias."],
    why:["In deep sea, small bright points carry lots of information."],
    model:["Darkening + highlight extraction + bloom/glow + cyan tint."],
    limits:["Not a physical underwater light model."],
    try:["Try small LEDs, phone flashlight reflections, or shiny objects."]
  },

  5:{ name:"Deuteranopia", photoreceptors:["M-cone missing (concept)."], what:["Red–green confusion."], why:["Missing channel."], model:["R/G collapsed."], limits:["Approximation."], try:["Try charts/labels."] },
  6:{ name:"Protanopia", photoreceptors:["L-cone missing (concept)."], what:["Reds darken/shift."], why:["Missing channel."], model:["Reduce red channel."], limits:["Approximation."], try:["Try red text on dark."] },
  7:{ name:"Tritanopia", photoreceptors:["S-cone missing (concept)."], what:["Blue–yellow confusion."], why:["Missing channel."], model:["Reduce blue variation."], limits:["Approximation."], try:["Try blue vs yellow."] },
  13:{ name:"Deuteranomaly", photoreceptors:["M shifted (concept)."], what:["Mild red–green."], why:["Overlap."], model:["Green pulled toward red."], limits:["Approximation."], try:["Try pastels."] },
  14:{ name:"Protanomaly", photoreceptors:["L shifted (concept)."], what:["Mild protanopia."], why:["Overlap."], model:["Red pulled toward green."], limits:["Approximation."], try:["Try red/orange/pink."] },
  15:{ name:"Achromatopsia (total colour blindness concept)", photoreceptors:["Luminance dominates."], what:["Grayscale."], why:["Cones limited."], model:["Luma + contrast."], limits:["Approximation."], try:["Try colourful scenes."] }
};

/* ---------- App plumbing ---------- */

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

  if ([1, 4, 8].includes(m)) {
    strengthEl.disabled = false;
    strengthLabel.textContent = "Strength";
  }

  if (m === 2) {
    uvEl.disabled = false;
    uvLabel.textContent = "UV emphasis (inferred)";
  }

  if (m === 9) {
    strengthEl.disabled = false;
    uvEl.disabled = false;
    strengthLabel.textContent = "Saturation boost";
    uvLabel.textContent = "UV layer (inferred)";
  }

  if (m === 10) {
    strengthEl.disabled = false;
    strengthLabel.textContent = "Contrast";
  }

  if (m === 11) {
    strengthEl.disabled = false;
    uvEl.disabled = false;
    strengthLabel.textContent = "Thermal contrast";
    uvLabel.textContent = "Thermal intensity";
    thermalLegend.style.display = "block";
  }

  if (m === 12) {
    strengthEl.disabled = false;
    strengthLabel.textContent = "Channelisation";
  }

  if (m === 15) {
    strengthEl.disabled = false;
    strengthLabel.textContent = "Contrast";
  }

  if (m === 16) {
    strengthEl.disabled = false;
    uvEl.disabled = false;
    strengthLabel.textContent = "Facet / polarization strength";
    uvLabel.textContent = "UV emphasis (concept)";
  }

  if (m === 20) {
    strengthEl.disabled = false;
    strengthLabel.textContent = "Glow intensity";
  }
}
modeEl.addEventListener("change", updateUIForMode);
updateUIForMode();

/* ---------- Learn modal ---------- */

function openLearn() {
  const m = parseInt(modeEl.value, 10);
  const info = MODE_INFO[m] || { name:"Learn", photoreceptors:[], what:[], why:[], model:[], limits:[], try:[] };

  const list = (arr) => `<ul>${(arr || []).map(x => `<li>${x}</li>`).join("")}</ul>`;

  modalTitleEl.textContent = info.name;

  modalBody.innerHTML = `
    ${SCIENCE_BG}

    <div class="learnGrid">
      <div class="learnCard">
        <div class="learnCardTitle">Wavelength scale</div>
        ${wavelengthScaleSVG()}
      </div>
      <div class="learnCard">
        <div class="learnCardTitle">Photoreceptor channels (concept)</div>
        ${coneDiagramSVG(m)}
      </div>
    </div>

    <h3>Photoreceptors / channels</h3>${list(info.photoreceptors)}
    <h3>What you should notice</h3>${list(info.what)}
    <h3>Why this happens</h3>${list(info.why)}
    <h3>What the model does</h3>${list(info.model)}
    <h3>Limits</h3>${list(info.limits)}
    <h3>Try this</h3>${list(info.try)}

    <div class="smallNote">
      Tip: turn on <b>Compare</b> and slide the split to directly see what changes.
    </div>
  `;

  document.body.classList.add("modalOpen");
  modalBackdrop.style.display = "block";
  modalBody.scrollTop = 0;
}

function closeLearn() {
  modalBackdrop.style.display = "none";
  document.body.classList.remove("modalOpen");
}

learnBtn.addEventListener("click", openLearn);
modalClose.addEventListener("click", closeLearn);
modalBackdrop.addEventListener("click", (e) => {
  if (e.target === modalBackdrop) closeLearn();
});

/* ---------- WebGL ---------- */

const gl = canvas.getContext("webgl", { premultipliedAlpha: false });
if (!gl) {
  alert("WebGL not available.");
  throw new Error("WebGL not available");
}

// Fix upside-down video textures
gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

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

// Mammal dichromat-ish models
vec3 dogView(vec3 rgb){
  float rg = 0.5*(rgb.r + rgb.g);
  return vec3(rg, rg, rgb.b);
}
vec3 catView(vec3 rgb){
  float rg = 0.55*rgb.g + 0.45*rgb.r;
  return vec3(rg, rg, rgb.b);
}
vec3 horseView(vec3 rgb){
  float rg = 0.65*rgb.g + 0.35*rgb.r;
  float b  = 0.85*rgb.b + 0.15*rg;
  return vec3(rg, rg, b);
}

// Bee: inferred UV overlay
vec3 beeConcept(vec3 rgb, float uvi){
  vec3 base = vec3(0.60*rgb.r, rgb.g, rgb.b);
  float u = uvProxy(rgb);
  vec3 col = falseUV(u);
  return mix(base, col, clamp(uvi, 0.0, 1.0));
}

// Saturation boost helper
vec3 saturateBoost(vec3 rgb, float s){
  float y = luma(rgb);
  vec3 gray = vec3(y);
  return clamp(mix(gray, rgb, s), 0.0, 1.0);
}

// Bird concept: saturation + inferred UV layer
vec3 birdConcept(vec3 rgb, float satBoost, float uvi){
  vec3 sat = saturateBoost(rgb, 1.0 + 1.2*satBoost);
  float u = uvProxy(rgb);
  vec3 uvCol = falseUV(u);
  float a = clamp(uvi, 0.0, 1.0) * 0.6;
  return mix(sat, uvCol, a);
}

// Monochrome + contrast (generic)
vec3 monoContrast(vec3 rgb, float c){
  float y = luma(rgb);
  float cc = 1.0 + 1.8*c;
  float v = clamp((y - 0.5)*cc + 0.5, 0.0, 1.0);
  return vec3(v);
}

// Thermal colormap
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

// Snake thermal concept
vec3 snakeThermal(vec3 rgb, float contrastAmt, float intensity){
  float y = luma(rgb);
  float heat = clamp(0.55*rgb.r + 0.45*y, 0.0, 1.0);
  float cc = 1.0 + 2.0*contrastAmt;
  heat = clamp((heat - 0.5)*cc + 0.5, 0.0, 1.0);

  vec3 col = heatColor(heat);
  float a = clamp(intensity, 0.0, 1.0);
  return mix(rgb, col, a);
}

// Mantis shrimp concept: discrete hue bands
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

// Human colour vision differences (educational approximations)
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

/* ---------- Dragonfly: facets + divided eye + polarization proxy + motion emphasis ---------- */

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

  // 1) Facets (compound eye)
  float cells = mix(70.0, 260.0, f);
  vec3 fac = pixelateSample(t, uv0, cells);

  // 2) Divided eye: top half sky-tuned (cooler + more UV overlay), bottom more ground-balanced
  float top = step(0.52, uv0.y);

  vec3 skyTuned = vec3(0.50*fac.r, 0.95*fac.g, min(1.0, fac.b + 0.22));
  vec3 groundTuned = vec3(min(1.0, fac.r*1.05), fac.g, fac.b*0.95);
  vec3 tuned = mix(groundTuned, skyTuned, top);

  // UV mastery (inferred): stronger in sky region
  float u = uvProxy(fac);
  vec3 uvCol = falseUV(u);
  float uvBlend = uvi * (0.10 + 0.70*top);
  tuned = mix(tuned, uvCol, uvBlend);

  // Polarized light (concept proxy): gradient orientation -> false colour angle overlay
  vec2 g = grad2(t, uv0);
  float mag = clamp(length(g) * (5.0 + 14.0*f), 0.0, 1.0);

  float ang = atan(g.y, g.x);                 // -pi..pi
  float a01 = (ang + 3.14159) / 6.28318;      // 0..1
  vec3 pol = angleToColour(a01);

  float polBlend = mag * (0.10 + 0.55*f) * (0.25 + 0.75*top);
  tuned = mix(tuned, pol, polBlend);

  // Speed of sight (concept): motion emphasis using previous frame
  vec3 prev = texture2D(prevT, uv0).rgb;
  float motion = clamp(length(tuned - prev) * (3.0 + 10.0*f), 0.0, 1.0);

  // Make motion “pop” as brightness/contrast
  float y = luma(tuned);
  float boosted = clamp(y + motion*(0.10 + 0.30*f), 0.0, 1.0);
  vec3 outCol = mix(tuned, vec3(boosted), 0.20*motion);

  return clamp(outCol, 0.0, 1.0);
}

/* ---------- Deep-sea fish: strong dark + bright-point bloom + blue/green bias ---------- */

vec3 blur9(sampler2D t, vec2 uv0){
  // A small 9-tap blur
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

  // 1) Darken the world strongly (deep water)
  float y = luma(rgb);
  float dark = pow(y, mix(1.7, 2.6, a));            // crush midtones as a increases
  vec3 base = rgb * mix(0.55, 0.25, a);
  base = mix(base, vec3(dark) * 0.65, 0.35);

  // 2) Blue/green bias, suppress reds
  base.r *= mix(0.80, 0.35, a);
  base.g *= mix(1.00, 1.10, a);
  base.b *= mix(1.05, 1.35, a);

  // 3) Extract “bioluminescent” candidates (bright points)
  float brightMask = smoothstep(mix(0.78, 0.62, a), 1.0, y);
  float blueMask   = smoothstep(0.55, 0.95, rgb.b); // blue-ish light pops
  float mask = clamp(0.65*brightMask + 0.35*blueMask, 0.0, 1.0);

  // 4) Bloom/glow from blurred image (stronger & tinted cyan)
  vec3 blur = blur9(t, uv0);
  float by = luma(blur);
  float bloomMask = smoothstep(mix(0.70, 0.50, a), 1.0, by) * mask;

  vec3 cyanTint = vec3(0.20, 0.95, 0.90);
  vec3 glow = blur * mix(1.2, 3.0, a);
  glow = mix(glow, cyanTint * by, 0.55);
  glow *= bloomMask;

  // 5) Vignette for “deep” feeling
  vec2 p = uv0 * 2.0 - 1.0;
  float r = dot(p, p);
  float vig = smoothstep(1.05, 0.25, r);            // centre bright, edges darker
  base *= mix(0.55, 1.0, vig);

  // Final blend: add glow on top
  vec3 outCol = base + glow * mix(0.6, 1.4, a);

  return clamp(outCol, 0.0, 1.0);
}

void main() {
  vec3 rgb = texture2D(tex, uv).rgb;

  bool isLeftHuman = (compareEnabled == 1) && (uv.x < split);
  vec3 result = rgb;

  if (!isLeftHuman) {
    if (mode == 0) result = rgb;

    else if (mode == 1) result = mix(rgb, dogView(rgb), clamp(strength, 0.0, 1.0));
    else if (mode == 2) result = beeConcept(rgb, uvIntensity);
    else if (mode == 4) result = mix(rgb, catView(rgb), clamp(strength, 0.0, 1.0));
    else if (mode == 8) result = mix(rgb, horseView(rgb), clamp(strength, 0.0, 1.0));
    else if (mode == 9) result = birdConcept(rgb, strength, uvIntensity);

    else if (mode == 10) result = monoContrast(rgb, strength);
    else if (mode == 11) result = snakeThermal(rgb, strength, uvIntensity);
    else if (mode == 12) result = mantisConcept(rgb, strength);

    // Updated dragonfly
    else if (mode == 16) result = dragonflyConcept(tex, prevTex, uv, rgb, strength, uvIntensity);

    // Updated deep sea fish
    else if (mode == 20) result = deepSeaFishConcept(tex, uv, rgb, strength);

    else if (mode == 5) result = deuteranopia(rgb);
    else if (mode == 6) result = protanopia(rgb);
    else if (mode == 7) result = tritanopia(rgb);
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

// Previous-frame texture (for motion emphasis)
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

  // Copy rendered result into prevTexture for next-frame motion emphasis
  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, prevTexture);
  gl.copyTexImage2D(gl.TEXTURE_2D, 0, gl.RGB, 0, 0, canvas.width, canvas.height, 0);

  // Restore active texture to 0 for next loop
  gl.activeTexture(gl.TEXTURE0);

  requestAnimationFrame(render);
}

render();
