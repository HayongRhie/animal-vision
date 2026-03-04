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
  // A compact wavelength bar: UV | Visible | IR with ~400–700 nm highlighted
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

    <!-- Main bar outline -->
    <rect x="10" y="38" width="500" height="18" rx="9" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.12)"/>

    <!-- UV block -->
    <rect x="10" y="38" width="130" height="18" rx="9" fill="rgba(155,80,255,0.25)"/>
    <text x="18" y="52" fill="rgba(255,255,255,0.8)" font-size="12" font-family="system-ui">UV</text>

    <!-- Visible gradient block -->
    <rect x="140" y="38" width="220" height="18" rx="9" fill="url(#visGrad)"/>
    <text x="150" y="52" fill="rgba(0,0,0,0.8)" font-size="12" font-family="system-ui">Visible (≈400–700 nm)</text>

    <!-- IR block -->
    <rect x="360" y="38" width="150" height="18" rx="9" fill="rgba(255,120,80,0.22)"/>
    <text x="370" y="52" fill="rgba(255,255,255,0.8)" font-size="12" font-family="system-ui">IR</text>

    <!-- Tick labels -->
    <text x="10" y="80" fill="rgba(255,255,255,0.72)" font-size="12" font-family="system-ui">~300 nm</text>
    <text x="140" y="80" fill="rgba(255,255,255,0.72)" font-size="12" font-family="system-ui">400</text>
    <text x="250" y="80" fill="rgba(255,255,255,0.72)" font-size="12" font-family="system-ui">550</text>
    <text x="350" y="80" fill="rgba(255,255,255,0.72)" font-size="12" font-family="system-ui">700</text>
    <text x="470" y="80" fill="rgba(255,255,255,0.72)" font-size="12" font-family="system-ui">~1000+ nm</text>

    <text x="10" y="105" fill="rgba(255,255,255,0.65)" font-size="12" font-family="system-ui">
      Phone camera here measures RGB in the visible range, not UV or IR.
    </text>
  </svg>
  `;
}

function coneDiagramSVG(modeId) {
  // Simple “channel” diagram, not anatomically perfect — just communicative.
  // We choose which receptors to highlight depending on mode category.
  const m = parseInt(modeId, 10);

  // Determine highlighted groups
  let label = "Human (baseline): 3 cones + rods";
  let cones = ["S", "M", "L"];
  let extra = ""; // UV cone etc
  let note = "Cones encode colour; rods dominate low-light vision.";

  if ([1,4,8].includes(m)) {
    label = "Mammal dichromat (concept): 2 cones + rods";
    cones = ["S", "M/L"];
    note = "Two cone channels compress some hue differences.";
  } else if (m === 2) {
    label = "Bee (concept): UV + Blue + Green";
    cones = ["UV", "B", "G"];
    note = "UV is visualized via an inferred proxy (not measured UV).";
  } else if (m === 9) {
    label = "Bird (concept): 4 cones (incl. UV)";
    cones = ["UV", "S", "M", "L"];
    note = "A 4D cone space cannot be fully displayed on an RGB screen.";
  } else if (m === 10) {
    label = "Low-light concept: rod-dominant";
    cones = ["Rod"];
    note = "We show a grayscale/contrast mode to represent luminance emphasis.";
  } else if (m === 11) {
    label = "Thermal concept: IR sense (not camera)";
    cones = ["Visible RGB", "IR (concept)"];
    note = "Overlay is computed from visible cues; not real infrared imaging.";
  } else if (m === 12) {
    label = "Many-channel concept (mantis shrimp)";
    cones = ["Many channels (concept)"];
    note = "We use banded colour to communicate ‘channel richness,’ not accuracy.";
  } else if ([5,6,7,13,14].includes(m)) {
    label = "Human colour-vision difference (concept)";
    cones = ["S", "M", "L"];
    note = "We modify channel mixing to mimic reduced separability (educational).";
  } else if (m === 15) {
    label = "Achromatopsia concept: cone-limited, luminance-driven";
    cones = ["Rod / Luminance"];
    note = "Displayed as grayscale with adjustable contrast.";
  }

  // Build cone “icons”
  const items = cones.map((c, i) => {
    const x = 55 + i * 95;
    const w = 72;
    const h = 58;
    const fill = "rgba(255,255,255,0.10)";
    const stroke = "rgba(255,255,255,0.18)";
    const text = "rgba(255,255,255,0.88)";
    return `
      <g>
        <rect x="${x}" y="38" width="${w}" height="${h}" rx="14" fill="${fill}" stroke="${stroke}"/>
        <text x="${x + w/2}" y="73" text-anchor="middle" fill="${text}" font-size="16" font-family="system-ui" font-weight="600">${c}</text>
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

/* ---------- Scientific background blocks used in Learn panel ---------- */

const SCIENCE_BG = `
<h3>Core idea: colour is biology + physics</h3>
<ul>
  <li><b>Light</b> is electromagnetic radiation. Humans call ~<b>400–700 nm</b> “visible.”</li>
  <li><b>Photoreceptors</b> convert photons to neural signals. Humans use <b>cones</b> for colour and <b>rods</b> for low-light.</li>
  <li>Human cones are often summarized as <b>S/M/L</b> (short/medium/long wavelength sensitive). Many animals have different sets.</li>
</ul>

<h3>What this visualization is doing</h3>
<ul>
  <li>Your phone camera measures only <b>three channels (RGB)</b> in the visible range.</li>
  <li>Some modes apply a <b>channel-mixing transform</b> to mimic fewer or altered cone channels (e.g., dichromacy).</li>
  <li>“UV” / “thermal” modes here are <b>visualizations</b>: we compute an <b>inferred proxy</b> from RGB and map it to a colour overlay.</li>
</ul>

<div class="smallNote">
<b>Key limitation:</b> A true UV or IR camera measures different photons. This project communicates perception and modeling, not direct measurement.
</div>
`;

/* ---------- Mode info + Try-this prompts ---------- */

const MODE_INFO = {
  0: {
    name: "Human (baseline)",
    photoreceptors: ["Humans: 3 cone classes (S/M/L) + rods (low-light)."],
    what: ["Normal camera view (reference)."],
    why: ["Used as the baseline for comparison."],
    model: ["No transform applied."],
    limits: ["None—this is just the camera feed."],
    try: ["Turn on Compare and slide the split—this is your reference side."]
  },

  1: {
    name: "Dog (dichromat)",
    photoreceptors: ["Often modeled as dichromats (2 cone classes) + rods."],
    what: ["Red–green differences compress; blues tend to stand out more."],
    why: ["With two cone channels, many hues collapse toward similar responses."],
    model: ["We blend R and G into a shared channel; slider blends toward that transform."],
    limits: ["Approximation: camera RGB ≠ dog cone responses; RGB display can’t recreate dog colour space exactly."],
    try: ["Point at: red vs green objects (fruit, packaging).", "Notice they become more similar on the right side."]
  },

  4: {
    name: "Cat (dichromat)",
    photoreceptors: ["Commonly treated as dichromat-like for educational models."],
    what: ["Reduced red–green discrimination (similar to dog)."],
    why: ["Many mammals have fewer colour channels than humans."],
    model: ["A slightly different R/G weighting than dog; slider controls strength."],
    limits: ["Stylized visualization."],
    try: ["Point at: colourful clothing or books.", "Look for reduced separation between warm hues."]
  },

  8: {
    name: "Horse (dichromat)",
    photoreceptors: ["Often modeled as dichromats (2 cone classes)."],
    what: ["Dichromat-like compression with slightly different weighting."],
    why: ["Two-channel colour coding limits separability of certain hues."],
    model: ["R/G blended; blue partly tied to blended channel; slider controls strength."],
    limits: ["Approximation from RGB camera feed."],
    try: ["Point at: outdoor scenes (grass/trees/sky).", "Compare sky/foliage separation."]
  },

  2: {
    name: "Bee (concept: UV inferred)",
    photoreceptors: ["Many insects: UV/Blue/Green sensitivity (no human-like ‘red’ cone)."],
    what: ["Red is reduced; an inferred ‘UV layer’ appears as false colour."],
    why: ["UV can reveal patterns (e.g., nectar guides on flowers)."],
    model: [
      "We suppress the red contribution (concept of no red cone).",
      "Compute an inferred proxy from RGB and map it into false colour.",
      "Slider controls UV blend."
    ],
    limits: ["Phones can’t measure UV here—this is inferred from visible cues."],
    try: [
      "Try: printed magazines, glossy packaging, certain fabrics.",
      "Try: bright whites / laundry detergent packaging (often fluoresces under UV in real life).",
      "Use Compare to show the added ‘extra channel’ concept."
    ]
  },

  3: {
    name: "UV False Colour (inferred)",
    photoreceptors: ["Not an animal mode by itself—this is a visualization layer."],
    what: ["A false-colour overlay highlights ‘UV-like’ contrast."],
    why: ["False colour is common in science to display invisible channels (e.g., thermal maps)."],
    model: [
      "Compute a proxy value from RGB: <code>uvProxy = clamp(B − 0.5·R, 0..1)</code>.",
      "Map the proxy to a colour ramp and blend it over the image."
    ],
    limits: ["Not real UV-proxy derived from visible light only."],
    try: ["Try: blue/purple objects vs red objects.", "Look for regions that ‘light up’ due to the proxy heuristic."]
  },

  9: {
    name: "Bird (tetrachromat concept)",
    photoreceptors: ["Many birds: 4 cone classes (often including UV) + oil droplets affecting spectra."],
    what: ["More saturated look + subtle inferred UV layer."],
    why: ["An extra channel can increase discriminability between colours."],
    model: ["Boost saturation + optional UV proxy layer; sliders control both."],
    limits: ["4D cone response space can’t be perfectly displayed on RGB screens."],
    try: ["Try: colourful scenes (posters, signs).", "Boost saturation and compare with baseline."]
  },

  10: {
    name: "Shark (low-light / monochrome)",
    photoreceptors: ["Low-light vision is often rod-dominant (luminance heavy)."],
    what: ["Grayscale with adjustable contrast."],
    why: ["In dim conditions, luminance/contrast dominates over hue."],
    model: ["Convert to luminance and apply a contrast curve; slider controls contrast."],
    limits: ["Not species-specific; communicates the low-light idea."],
    try: ["Dim the room slightly and point at a scene.", "Increase contrast to see edge emphasis."]
  },

  11: {
    name: "Snake (thermal concept)",
    photoreceptors: ["Some snakes sense IR via specialized organs (not via phone camera)."],
    what: ["Thermal-style heatmap overlay blended over the scene."],
    why: ["Shows the idea of a non-visible channel adding information."],
    model: [
      "Compute a heat-like proxy from visible cues (brightness + red weighting).",
      "Map to thermal colourmap and blend.",
      "Sliders: thermal contrast + intensity."
    ],
    limits: ["Not real IR imaging. True thermal requires an IR sensor."],
    try: ["Point at: your hand/face near the camera (conceptual).", "Use Compare to emphasize it’s not real thermal."]
  },

  12: {
    name: "Mantis Shrimp (concept)",
    photoreceptors: ["Very complex receptor system; perception isn’t simply ‘more colours.’"],
    what: ["Scene is ‘channelized’ into discrete hue bands."],
    why: ["Communicates the idea of many channels without claiming accuracy."],
    model: ["Quantize hue into N bands and remap colours; slider increases banding."],
    limits: ["Strongly conceptual."],
    try: ["Point at: rainbow gradients / colourful posters.", "Increase Channelization to see banding."]
  },

  5: {
    name: "Deuteranopia",
    photoreceptors: ["Reduced/absent M-cone contribution (concept)."],
    what: ["Strong red–green confusion."],
    why: ["One cone channel is missing/ineffective."],
    model: ["Collapse R and G toward a shared channel."],
    limits: ["Educational approximation; real experiences vary."],
    try: ["Try: traffic lights, fruit, coloured charts.", "Look for red/green merging."]
  },

  6: {
    name: "Protanopia",
    photoreceptors: ["Reduced/absent L-cone contribution (concept)."],
    what: ["Reds may appear darker/shifted; red–green confusion."],
    why: ["Long-wavelength channel is missing/ineffective."],
    model: ["Reduce red contribution by mixing it toward green."],
    limits: ["Educational approximation; real experiences vary."],
    try: ["Try: red text on dark background.", "Watch red lose brightness."]
  },

  7: {
    name: "Tritanopia",
    photoreceptors: ["Reduced/absent S-cone contribution (concept)."],
    what: ["Blue–yellow discrimination decreases."],
    why: ["Short-wavelength channel is missing/ineffective."],
    model: ["Reduce blue variation relative to (R+G) luminance."],
    limits: ["Educational approximation; real experiences vary."],
    try: ["Try: blue vs yellow objects.", "Watch separation decrease."]
  },

  13: {
    name: "Deuteranomaly",
    photoreceptors: ["M-cone response shifted (anomalous trichromacy concept)."],
    what: ["Milder red–green confusion vs deuteranopia."],
    why: ["Channels exist but overlap more strongly."],
    model: ["Gently pull green toward red."],
    limits: ["Educational approximation; not clinical."],
    try: ["Try: subtle red/green differences (pastels).", "Compare with baseline to see mild effect."]
  },

  14: {
    name: "Protanomaly",
    photoreceptors: ["L-cone response shifted (anomalous trichromacy concept)."],
    what: ["Milder version of protanopia."],
    why: ["Channels exist but are less separable."],
    model: ["Gently pull red toward green."],
    limits: ["Educational approximation; not clinical."],
    try: ["Try: red/orange/pink objects.", "Look for reduced saturation in reds."]
  },

  15: {
    name: "Achromatopsia (total colour blindness concept)",
    photoreceptors: ["Cone function absent/limited (concept); luminance dominates."],
    what: ["Near-complete grayscale; contrast adjustable."],
    why: ["Color channels contribute little; luminance dominates."],
    model: ["Convert to luminance and adjust contrast; slider controls contrast."],
    limits: ["Educational concept; real experiences vary."],
    try: ["Try: colourful scenes.", "Use contrast slider to emphasize edges/forms."]
  }
};

/* ---------- App plumbing ---------- */

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
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

  if ([1,4,8].includes(m)) {
    strengthEl.disabled = false;
    strengthLabel.textContent = "Strength";
  }
  if (m === 2) {
    uvEl.disabled = false;
    uvLabel.textContent = "UV Emphasis";
  }
  if (m === 3) {
    uvEl.disabled = false;
    uvLabel.textContent = "Overlay Intensity";
  }
  if (m === 9) {
    strengthEl.disabled = false;
    uvEl.disabled = false;
    strengthLabel.textContent = "Saturation Boost";
    uvLabel.textContent = "UV Layer (inferred)";
  }
  if (m === 10) {
    strengthEl.disabled = false;
    strengthLabel.textContent = "Contrast";
  }
  if (m === 11) {
    strengthEl.disabled = false;
    uvEl.disabled = false;
    strengthLabel.textContent = "Thermal Contrast";
    uvLabel.textContent = "Thermal Intensity";
    thermalLegend.style.display = "block";
  }
  if (m === 12) {
    strengthEl.disabled = false;
    strengthLabel.textContent = "Channelization";
  }
  if (m === 15) {
    strengthEl.disabled = false;
    strengthLabel.textContent = "Contrast";
  }
}
modeEl.addEventListener("change", updateUIForMode);
updateUIForMode();

// Learn modal
function openLearn() {
  const m = parseInt(modeEl.value, 10);
  const info = MODE_INFO[m] || { name: "Learn", photoreceptors: [], what: [], why: [], model: [], limits: [], try: [] };

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

    <h3>Photoreceptors / channels</h3>
    ${list(info.photoreceptors)}
    <h3>What you should notice</h3>
    ${list(info.what)}
    <h3>Why this happens</h3>
    ${list(info.why)}
    <h3>What the app does (model)</h3>
    ${list(info.model)}
    <h3>Limits / what it is NOT</h3>
    ${list(info.limits)}

    <h3>Try this</h3>
    ${list(info.try)}

    <div class="smallNote">
      Tip: turn on <b>Compare</b> and slide the split to directly see what changes.
    </div>
  `;

  modalBackdrop.style.display = "flex";
}
function closeLearn() { modalBackdrop.style.display = "none"; }
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

// Bee & UV
vec3 beeConcept(vec3 rgb, float uvi){
  vec3 base = vec3(0.60*rgb.r, rgb.g, rgb.b);
  float u = uvProxy(rgb);
  vec3 col = falseUV(u);
  return mix(base, col, clamp(uvi, 0.0, 1.0));
}
vec3 uvOverlay(vec3 rgb, float uvi){
  float u = uvProxy(rgb);
  vec3 col = falseUV(u);
  return mix(rgb, col, clamp(uvi, 0.0, 1.0));
}

// Saturation boost helper
vec3 saturateBoost(vec3 rgb, float s){
  float y = luma(rgb);
  vec3 gray = vec3(y);
  return clamp(mix(gray, rgb, s), 0.0, 1.0);
}

// Bird concept
vec3 birdConcept(vec3 rgb, float satBoost, float uvi){
  vec3 sat = saturateBoost(rgb, 1.0 + 1.2*satBoost);
  float u = uvProxy(rgb);
  vec3 uvCol = falseUV(u);
  float a = clamp(uvi, 0.0, 1.0) * 0.6;
  return mix(sat, uvCol, a);
}

// Shark: monochrome + contrast
vec3 sharkLowLight(vec3 rgb, float c){
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

// Human color vision differences (educational approximations)
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
  float y = luma(rgb);
  float cc = 1.0 + 1.8*contrastAmt;
  float v = clamp((y - 0.5)*cc + 0.5, 0.0, 1.0);
  return vec3(v);
}

void main() {
  vec3 rgb = texture2D(tex, uv).rgb;

  bool isLeftHuman = (compareEnabled == 1) && (uv.x < split);
  vec3 result = rgb;

  if (!isLeftHuman) {
    if (mode == 0) result = rgb;
    else if (mode == 1) result = mix(rgb, dogView(rgb), clamp(strength, 0.0, 1.0));
    else if (mode == 2) result = beeConcept(rgb, uvIntensity);
    else if (mode == 3) result = uvOverlay(rgb, uvIntensity);
    else if (mode == 4) result = mix(rgb, catView(rgb), clamp(strength, 0.0, 1.0));
    else if (mode == 8) result = mix(rgb, horseView(rgb), clamp(strength, 0.0, 1.0));
    else if (mode == 9) result = birdConcept(rgb, strength, uvIntensity);
    else if (mode == 10) result = sharkLowLight(rgb, strength);
    else if (mode == 11) result = snakeThermal(rgb, strength, uvIntensity);
    else if (mode == 12) result = mantisConcept(rgb, strength);

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

// Texture
const texture = gl.createTexture();
gl.activeTexture(gl.TEXTURE0);
gl.bindTexture(gl.TEXTURE_2D, texture);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

// Uniforms
const uTex = gl.getUniformLocation(program, "tex");
const uMode = gl.getUniformLocation(program, "mode");
const uStrength = gl.getUniformLocation(program, "strength");
const uUV = gl.getUniformLocation(program, "uvIntensity");
const uSplit = gl.getUniformLocation(program, "split");
const uCompare = gl.getUniformLocation(program, "compareEnabled");
gl.uniform1i(uTex, 0);

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

function render() {
  gl.viewport(0, 0, canvas.width, canvas.height);

  if (video.readyState >= 2) {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, video);
  }

  gl.uniform1i(uMode, parseInt(modeEl.value, 10));
  gl.uniform1f(uStrength, parseFloat(strengthEl.value));
  gl.uniform1f(uUV, parseFloat(uvEl.value));
  gl.uniform1f(uSplit, parseFloat(splitEl.value));
  gl.uniform1i(uCompare, compareEl.checked ? 1 : 0);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  requestAnimationFrame(render);
}

render();