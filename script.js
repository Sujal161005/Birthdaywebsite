/**
 * Cinematic Romantic Site
 * Edit the CONFIG block to personalize names, date, photos, and letter.
 */

const CONFIG = {
  herName: "Simran",
  yourName: "Sujal",
  // Use: "2026-06-25T00:00:00" (local time) or include timezone like "2026-06-25T00:00:00+05:30"
  birthdayISO: "2026-03-12T00:00:00",
  // Put your song file in /assets and set the filename here.
  // Example: "assets/song.mp3"
  songSrc: "assets/song.mp3",
  songVolume: 0.65,
  storyLines: [
    "Our story didn’t begin with fireworks…",
    "It started with a simple flirtings.",
    "Somewhere along the way… you became my favorite person.",
    "These two years with you have been the most beautiful chapter of my life.Thank you for being there for me.",
    "Thank you for being my best friend, my partner in crime, and my soulmate.",
    "Thank you for making me laugh, for making me smile, and for making me feel loved.",
    "Thank you for being my support system, my confidant, and my rock.",
    "Thank you for being my everything. there is no one else i would rather be with.I love you so much.",
    "Happy Birthday baby ❤️"
  ],
  letter: [
    "Happy Birthday, mera bacchaa.",
    "",
    "If the universe ever asked me what I’m grateful for, I’d say your laugh, your kindness, your strength , your smile, your eyes, your hair, your voice, your personality, your everything.",
    "and the way you turned ordinary days into my favorite memories.",
    "",
    "These two years with you feel like a story I never want to stop reading.There were many ups and downs, but we always managed to come out on top.And no matter what, I will always be with you by your side.",
    "I’m proud of you. I’m with you. Always.Happy Birthday baby ❤️",
    "",
    "I love you."
  ].join("\n"),
  // Optional photos: add file paths like "assets/first-date.jpg" (create the assets folder if needed)
  photos: {
    // Used by the Memory Map (keys must match `data-place` values in `index.html`)
    firstTalk: "assets/photo1.jpg",
    firstDate: "assets/photo3.jpg",
    hangout: "assets/photo1.jpeg",
    bestMemory: "assets/photo9.jpeg"
  },
  // 10–12 photos for the gallery (put your images in /assets and list them here)
  gallery: [
    { src: "assets/photo1.jpg", title: "Photo 1", text: "A little piece of us." },
    { src: "assets/photo1.jpeg", title: "Photo 2", text: "My favorite kind of moment." },
    { src: "assets/photo3.jpeg", title: "Photo 3", text: "Where love looks effortless." },
    { src: "assets/photo3.jpg", title: "Photo 4", text: "I’d relive this day forever." },
    { src: "assets/photo4.jpeg", title: "Photo 5", text: "Proof that happiness is real." },
    { src: "assets/photofive.jpeg", title: "Photo 6", text: "You + me = my peace." },
    { src: "assets/photosix.jpeg", title: "Photo 7", text: "The smile I protect." },
    { src: "assets/photo7.jpeg", title: "Photo 8", text: "Soft hearts, loud laughs." },
    { src: "assets/photo8.jpeg", title: "Photo 9", text: "My favorite memory loop." },
    { src: "assets/photo9.jpeg", title: "Photo 10", text: "Us, exactly as we are." },
    { src: "assets/photo10.jpeg", title: "Photo 11", text: "A moment I keep close." },
    { src: "assets/photo2.jpeg", title: "Photo 12", text: "Still choosing you. Always." }
  ]
};

// ---------- Tiny helpers ----------
const $ = (sel, root=document) => root.querySelector(sel)
const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel))
const clamp = (v, a, b) => Math.max(a, Math.min(b, v))
const lerp = (a, b, t) => a + (b - a) * t

// ---------- Personalize UI ----------
const herNameEl = $("#herName")
if (herNameEl) herNameEl.textContent = `❤️ ${CONFIG.herName}`
const letterNameEl = $("#letterName")
if (letterNameEl) letterNameEl.textContent = CONFIG.herName
const sigNameEl = $("#sigName")
if (sigNameEl) sigNameEl.textContent = CONFIG.yourName
const letterBodyEl = $("#letterBody")
if (letterBodyEl) letterBodyEl.textContent = CONFIG.letter

// ---------- Smooth cinematic section reveals ----------
gsap.registerPlugin(ScrollTrigger)
const scrollRoot = $("#scrollRoot")
$$("[data-scene]").forEach((scene) => {
  gsap.fromTo(scene, { opacity: 0, y: 18 }, {
    opacity: 1, y: 0, duration: 0.8, ease: "power2.out",
    scrollTrigger: { trigger: scene, scroller: scrollRoot, start: "top 82%", end: "top 40%", scrub: false }
  })
})

// Bottom nav active dot
const navDots = $$(".navDot")
const scenes = $$("[data-scene]")
function setActiveDot(id){
  navDots.forEach(d => d.classList.toggle("isActive", d.dataset.jump === `#${id}`))
}
scenes.forEach((s) => {
  ScrollTrigger.create({
    trigger: s,
    scroller: scrollRoot,
    start: "top 55%",
    end: "bottom 55%",
    onEnter: () => setActiveDot(s.id),
    onEnterBack: () => setActiveDot(s.id),
  })
})
navDots.forEach((d) => {
  d.addEventListener("click", () => {
    const target = $(d.dataset.jump)
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" })
  })
})

// ---------- Background music ----------
const bgm = $("#bgm")
let musicOn = false
function syncMusicUI(){
  const btn = $("#musicBtn")
  if (!btn) return
  btn.setAttribute("aria-pressed", musicOn ? "true" : "false")
  btn.textContent = musicOn ? "🔊 Music: On" : "🔇 Music: Off"
}
async function setMusic(on){
  musicOn = !!on
  syncMusicUI()
  if (!bgm) return

  if (typeof CONFIG.songSrc === "string" && CONFIG.songSrc.trim().length > 0){
    if (!bgm.getAttribute("src")) bgm.setAttribute("src", CONFIG.songSrc)
  }
  bgm.volume = clamp(Number(CONFIG.songVolume ?? 0.65), 0, 1)

  if (!musicOn){
    bgm.pause()
    return
  }
  try{
    await bgm.play()
  } catch {
    // Autoplay blocked until user gesture; keep toggle on and user can tap again.
  }
}
$("#musicBtn")?.addEventListener("click", async () => {
  await setMusic(!musicOn)
})
syncMusicUI()

// Start + Skip
$("#startBtn")?.addEventListener("click", async () => {
  // User gesture: safe time to start music
  if (!musicOn) await setMusic(true)
  $("#timeline")?.scrollIntoView({ behavior:"smooth", block:"start" })
})
$("#skipBtn")?.addEventListener("click", () => $("#timeline")?.scrollIntoView({ behavior:"smooth", block:"start" }))

// ---------- Countdown ----------
const cd = {
  days: $("#cdDays"),
  hours: $("#cdHours"),
  mins: $("#cdMins")
}
function updateCountdown(){
  const target = new Date(CONFIG.birthdayISO).getTime()
  const now = Date.now()
  let diff = Math.max(0, target - now)
  const days = Math.floor(diff / (1000*60*60*24))
  diff -= days * (1000*60*60*24)
  const hours = Math.floor(diff / (1000*60*60))
  diff -= hours * (1000*60*60)
  const mins = Math.floor(diff / (1000*60))
  if (cd.days) cd.days.textContent = String(days)
  if (cd.hours) cd.hours.textContent = String(hours).padStart(2,"0")
  if (cd.mins) cd.mins.textContent = String(mins).padStart(2,"0")
}
updateCountdown()
setInterval(updateCountdown, 1000)

// ---------- Modal: Secret Love Letter ----------
const letterModal = $("#letterModal")
let uiCooldownUntil = 0
// Ensure modal is closed on initial load
if (letterModal){
  letterModal.hidden = true
  letterModal.style.display = "none"
}
function openLetter(){
  if (!letterModal) return
  letterModal.hidden = false
  letterModal.style.display = "grid"
}
function closeLetter(){
  if (!letterModal) return
  // Small cooldown to prevent any background gesture from triggering easter eggs
  uiCooldownUntil = Date.now() + 650
  letterModal.hidden = true
  letterModal.style.display = "none"
}
$("#letterBtn")?.addEventListener("click", openLetter)
$$("[data-close]").forEach((el) => el.addEventListener("click", (e) => {
  e.stopPropagation()
  closeLetter()
}))
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape"){
    if (letterModal && !letterModal.hidden) closeLetter()
    if (overlay && !overlay.hidden) closeStoryOverlay()
  }
})

// ---------- Timeline interactions ----------
const milestoneCopy = {
  firstTalk: {
    title: "First Talk (After Physics Lab)",
    text: "It was our 1st talk and for the 1st time we exchanged our numbers."
  },
  firstDate: {
    title: "10th Jan 2024",
    text: "Our first flirtious endless conversation after which we both decided to meet again and I started liking you more and more."
  },
  memories: {
    title: "2nd Feb 2024",
    text: "After lots of ruthna manana, haa naa haa naa krte krte I finally confessed my feelings to you....and that was ny best decision ever."
  },
  year1: {
    title: "2nd Feb 2024 - 2nd Feb 2025 (1 Year Together)",
    text: "One year down, and my love for you only grows deeper each day. In your arms, I found peace I never knew I needed. Every memory we make feels like a new page of a beautiful story. Thank you for turning ordinary days into moments I cherish forever."
  },
  year2: {
    title: "2nd Feb 2025 - 2nd Feb 2026 (2 Years Together)",
    text: "Two whole years… and I still fall a little more for you every single day. With you, love has become poetry and every moment feels like a dream I never want to wake up from. You’re not just my favorite chapter—you are my whole story, my happiest place, and the reason my heart beats a little faster. I love you, endlessly.",
  }
}

function toastCard(title, text){
  const card = document.createElement("div")
  card.className = "glassCard"
  card.style.position = "fixed"
  card.style.left = "50%"
  card.style.bottom = "110px"
  card.style.transform = "translateX(-50%)"
  card.style.width = "min(420px, 92vw)"
  card.style.zIndex = "30"
  card.innerHTML = `<div class="cardTitle">${title}</div><div class="cardText">${text}</div>`
  document.body.appendChild(card)
  gsap.fromTo(card, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.25, ease: "power2.out" })
  gsap.to(card, { y: 10, opacity: 0, duration: 0.25, delay: 2.6, ease: "power2.in", onComplete: () => card.remove() })
}

$$(".milestone").forEach((btn) => {
  btn.addEventListener("click", () => {
    const key = btn.dataset.m
    const m = milestoneCopy[key]
    if (m) toastCard(m.title, m.text)
  })
})

// ---------- Memory Map ----------
const mapTitle = $("#mapTitle")
const mapText = $("#mapText")
const mapPhoto = $("#mapPhoto")
const mapImg = $("#mapImg")
const placeCopy = {
  firstTalk: { title: "📍 Cutiee Simran", text: "A small moment that opened a whole universe for us." },
  firstDate: { title: "📍 Happy Simran", text: "The day I realized I wanted more of you—more days, more laughs, more us." },
  hangout: { title: "📍 Meri Simran", text: "Where time always felt softer, and love felt easy." },
  bestMemory: { title: "📍 Angry Simran", text: "Not one moment—many. But all of them have you in the center." }
}
function showPlace(key){
  const p = placeCopy[key]
  if (!p) return
  if (mapTitle) mapTitle.textContent = p.title
  if (mapText) mapText.textContent = p.text

  const src = CONFIG.photos[key] || ""
  if (mapPhoto && mapImg){
    if (src){
      mapImg.src = src
      mapPhoto.hidden = false
    } else {
      mapPhoto.hidden = true
      mapImg.removeAttribute("src")
    }
  }
}
$$(".marker").forEach((m) => {
  const key = m.dataset.place
  m.addEventListener("click", () => showPlace(key))
  m.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " "){
      e.preventDefault()
      showPlace(key)
    }
  })
})

// ---------- Heart Rain (occasional, cinematic) ----------
function spawnHeart(){
  const el = document.createElement("div")
  el.textContent = "❤"
  el.style.position = "fixed"
  el.style.left = `${Math.random()*100}vw`
  el.style.top = "-20px"
  el.style.zIndex = "5"
  el.style.pointerEvents = "none"
  const size = lerp(12, 20, Math.random())
  el.style.fontSize = `${size}px`
  el.style.opacity = String(lerp(0.25, 0.6, Math.random()))
  el.style.filter = "drop-shadow(0 0 12px rgba(255,75,168,0.25))"
  document.body.appendChild(el)
  const drift = lerp(-30, 30, Math.random())
  gsap.to(el, {
    y: window.innerHeight + 40,
    x: drift,
    duration: lerp(6.0, 10.0, Math.random()),
    ease: "none",
    onComplete: () => el.remove()
  })
}
setInterval(() => {
  if (Math.random() < 0.55) spawnHeart()
}, 900)

// ---------- Starfield + parallax + hidden star + constellation heart ----------
const sky = $("#sky")
const sctx = sky?.getContext("2d")
let W = 0, H = 0, DPR = 1

function resizeSky(){
  if (!sky || !sctx) return
  DPR = Math.max(1, Math.min(2, window.devicePixelRatio || 1))
  W = Math.floor(window.innerWidth * DPR)
  H = Math.floor(window.innerHeight * DPR)
  sky.width = W
  sky.height = H
  sky.style.width = "100%"
  sky.style.height = "100%"
}
resizeSky()
window.addEventListener("resize", resizeSky)

const STAR_COUNT = 420
const stars = []
for (let i=0;i<STAR_COUNT;i++){
  const z = Math.random() // depth
  stars.push({
    x: Math.random(),
    y: Math.random(),
    z,
    r: lerp(0.45, 1.9, Math.pow(1 - z, 2)),
    tw: Math.random()*Math.PI*2,
    twSpd: lerp(0.002, 0.01, Math.random()),
    drift: lerp(0.00002, 0.00009, Math.random()) * (Math.random() < 0.5 ? -1 : 1),
  })
}

let pointerX = 0, pointerY = 0
window.addEventListener("pointermove", (e) => {
  pointerX = (e.clientX / window.innerWidth) * 2 - 1
  pointerY = (e.clientY / window.innerHeight) * 2 - 1
}, { passive:true })

// Hidden easter egg star (screen-space, but rendered in sky canvas)
const hiddenStar = {
  x: Math.random()*0.62 + 0.18,
  y: Math.random()*0.50 + 0.18,
  r: 3.2,
  found:false
}

// Constellation mode state
let constellationOn = false
let constellationT = 0 // 0..1 progress
let constellationHold = 0
const constellationText = () => `${CONFIG.yourName} ❤️ ${CONFIG.herName}`

function heartPoint(t){
  // param t in [0..1]
  const a = t * Math.PI * 2
  // classic heart curve (scaled)
  const x = 16 * Math.pow(Math.sin(a), 3)
  const y = 13 * Math.cos(a) - 5 * Math.cos(2*a) - 2 * Math.cos(3*a) - Math.cos(4*a)
  return { x, y }
}

function drawSky(now){
  if (!sky || !sctx) return
  sctx.clearRect(0,0,W,H)

  // background wash
  const g = sctx.createRadialGradient(W*0.3, H*0.2, 0, W*0.5, H*0.6, Math.max(W,H)*0.8)
  g.addColorStop(0, "rgba(255,75,168,0.12)")
  g.addColorStop(0.45, "rgba(154,99,255,0.10)")
  g.addColorStop(1, "rgba(11,8,32,0.0)")
  sctx.fillStyle = g
  sctx.fillRect(0,0,W,H)

  const px = pointerX * 0.012
  const py = pointerY * 0.012

  // stars
  for (const s of stars){
    s.tw += s.twSpd
    s.y = (s.y + s.drift + 1) % 1
    const tw = 0.55 + 0.45*Math.sin(s.tw)
    const sx = (s.x + px*(1 - s.z)) * W
    const sy = (s.y + py*(1 - s.z)) * H
    const r = s.r * DPR
    const alpha = lerp(0.22, 0.95, (1 - s.z)) * tw

    // color tint
    const tint = (1 - s.z)
    const cr = 255
    const cg = Math.floor(lerp(215, 255, tint))
    const cb = Math.floor(lerp(245, 255, tint))
    sctx.fillStyle = `rgba(${cr},${cg},${cb},${alpha})`
    sctx.beginPath()
    sctx.arc(sx, sy, r, 0, Math.PI*2)
    sctx.fill()
  }

  // hidden star (glow)
  if (!hiddenStar.found){
    const hx = hiddenStar.x * W
    const hy = hiddenStar.y * H
    const grd = sctx.createRadialGradient(hx,hy,0,hx,hy,38*DPR)
    grd.addColorStop(0, "rgba(255,255,255,0.95)")
    grd.addColorStop(0.2, "rgba(255,75,168,0.55)")
    grd.addColorStop(1, "rgba(255,75,168,0)")
    sctx.fillStyle = grd
    sctx.beginPath()
    sctx.arc(hx, hy, 38*DPR, 0, Math.PI*2)
    sctx.fill()
    sctx.fillStyle = "rgba(255,255,255,0.95)"
    sctx.beginPath()
    sctx.arc(hx, hy, hiddenStar.r*DPR, 0, Math.PI*2)
    sctx.fill()
  }

  // constellation heart mode
  if (constellationOn){
    constellationT = clamp(constellationT + 0.012, 0, 1)
  } else {
    constellationT = clamp(constellationT - 0.02, 0, 1)
  }

  if (constellationT > 0){
    const alpha = constellationT
    const cx = W*0.5
    const cy = H*0.48
    const scale = Math.min(W,H) * 0.018
    const pts = []
    const N = 64
    for (let i=0;i<N;i++){
      const p = heartPoint(i/(N-1))
      pts.push({ x: cx + p.x*scale, y: cy - p.y*scale })
    }

    // connect lines (brighter for visibility)
    sctx.lineWidth = 2.1*DPR
    sctx.strokeStyle = `rgba(255,120,200,${0.85*alpha})`
    sctx.beginPath()
    for (let i=0;i<pts.length;i++){
      const p = pts[i]
      if (i===0) sctx.moveTo(p.x,p.y)
      else sctx.lineTo(p.x,p.y)
    }
    sctx.stroke()

    // glowing nodes
    for (let i=0;i<pts.length;i+=3){
      const p = pts[i]
      const rg = sctx.createRadialGradient(p.x,p.y,0,p.x,p.y,26*DPR)
      rg.addColorStop(0, `rgba(255,255,255,${0.80*alpha})`)
      rg.addColorStop(0.3, `rgba(255,120,200,${0.55*alpha})`)
      rg.addColorStop(1, "rgba(0,0,0,0)")
      sctx.fillStyle = rg
      sctx.beginPath()
      sctx.arc(p.x,p.y,26*DPR,0,Math.PI*2)
      sctx.fill()
    }

    if (constellationT >= 1){
      constellationHold = Math.min(1, constellationHold + 0.02)
    } else {
      constellationHold = Math.max(0, constellationHold - 0.04)
    }

    if (constellationHold > 0){
      sctx.save()
      sctx.globalAlpha = 0.85 * constellationHold
      sctx.font = `${Math.floor(28*DPR)}px "Playfair Display", serif`
      sctx.fillStyle = "rgba(255,255,255,0.92)"
      sctx.textAlign = "center"
      sctx.shadowColor = "rgba(255,75,168,0.45)"
      sctx.shadowBlur = 22*DPR
      sctx.fillText(constellationText(), W*0.5, H*0.70)
      sctx.restore()
    }
  } else {
    constellationHold = 0
  }

  requestAnimationFrame(drawSky)
}
requestAnimationFrame(drawSky)

// Easter-egg secret scene is now triggered explicitly via the hero button (no accidental sky clicks)
$("#secretStarBtn")?.addEventListener("click", () => {
  if ((letterModal && !letterModal.hidden) || (!overlay?.hidden)) return
  if (Date.now() < uiCooldownUntil) return
  openStoryOverlay()
})

// ---------- Gallery + Lightbox ----------
const galleryGrid = $("#galleryGrid")
const lightbox = $("#lightbox")
// Ensure lightbox is closed on initial load
if (lightbox){
  lightbox.hidden = true
  lightbox.style.display = "none"
}
const lbImg = $("#lbImg")
const lbTitle = $("#lbTitle")
const lbText = $("#lbText")
let galleryIndex = 0

function validGalleryItems(){
  return (CONFIG.gallery || []).filter(it => it && typeof it.src === "string" && it.src.trim().length > 0)
}

function renderGallery(){
  if (!galleryGrid) return
  const items = validGalleryItems()
  if (items.length === 0){
    galleryGrid.innerHTML = `<div class="glassCard" style="grid-column:1/-1;">
      <div class="cardTitle">Add your photos ✨</div>
      <div class="cardText">Put 10–12 images in the <b>assets</b> folder and paste their filenames into <b>CONFIG.gallery</b> in <b>script.js</b>.</div>
    </div>`
    return
  }
  galleryGrid.innerHTML = items.map((it, i) => `
    <button class="polaroid" type="button" data-g="${i}" aria-label="Open photo ${i+1}">
      <div class="polaroidBadge">💞</div>
      <div class="polaroidMedia"><img src="${it.src}" alt="${(it.title || "Memory").replaceAll('"','&quot;')}"></div>
      <div class="polaroidMeta">
        <div class="polaroidTitle">${it.title || "Memory"}</div>
        <div class="polaroidText">${it.text || ""}</div>
      </div>
    </button>
  `).join("")

  $$(".polaroid", galleryGrid).forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = Number(btn.dataset.g || "0")
      openLightbox(idx)
    })
  })
}

function openLightbox(idx){
  const items = validGalleryItems()
  if (!lightbox || items.length === 0) return
  galleryIndex = ((idx % items.length) + items.length) % items.length
  const it = items[galleryIndex]
  if (lbImg) lbImg.src = it.src
  if (lbTitle) lbTitle.textContent = it.title || ""
  if (lbText) lbText.textContent = it.text || ""
  lightbox.hidden = false
  lightbox.style.display = "grid"
}

function closeLightbox(){
  if (!lightbox) return
  lightbox.hidden = true
  lightbox.style.display = "none"
}

function lbStep(dir){
  const items = validGalleryItems()
  if (items.length === 0) return
  openLightbox(galleryIndex + dir)
}

$$("[data-lb-close]").forEach((el) => el.addEventListener("click", (e) => {
  e.stopPropagation()
  closeLightbox()
}))
$("#lbPrev")?.addEventListener("click", (e) => { e.stopPropagation(); lbStep(-1) })
$("#lbNext")?.addEventListener("click", (e) => { e.stopPropagation(); lbStep(1) })

// Keyboard navigation for lightbox
document.addEventListener("keydown", (e) => {
  if (!lightbox || lightbox.hidden) return
  if (e.key === "Escape") closeLightbox()
  if (e.key === "ArrowLeft") lbStep(-1)
  if (e.key === "ArrowRight") lbStep(1)
})

// Swipe navigation (mobile)
let swipeStartX = 0
let swipeStartY = 0
lbImg?.addEventListener("pointerdown", (e) => {
  swipeStartX = e.clientX
  swipeStartY = e.clientY
})
lbImg?.addEventListener("pointerup", (e) => {
  const dx = e.clientX - swipeStartX
  const dy = e.clientY - swipeStartY
  if (Math.abs(dx) < 30 || Math.abs(dx) < Math.abs(dy)) return
  if (dx > 0) lbStep(-1)
  else lbStep(1)
})

renderGallery()

// Constellation button
$("#constellationBtn")?.addEventListener("click", () => {
  constellationOn = !constellationOn
  const btn = $("#constellationBtn")
  if (btn){
    btn.textContent = constellationOn ? "✨ Constellation Mode: ON" : "✨ Constellation Mode"
  }
   if (constellationOn){
     toastCard("Constellation Mode", "Look at the middle of the sky — the stars are drawing our heart.")
   }
})

// ---------- Hidden cinematic overlay + typewriter ----------
const overlay = $("#storyOverlay")
// Ensure hidden scene is closed on initial load
if (overlay){
  overlay.hidden = true
  overlay.style.display = "none"
}
const typeText = $("#typeText")
const typeCursor = $("#typeCursor")
let typingAbort = { abort:false }

function openStoryOverlay(){
  if (!overlay) return
  overlay.hidden = false
  overlay.style.display = "grid"
  if (typeText) typeText.textContent = ""
  typingAbort.abort = true
  typingAbort = { abort:false }
  runTypewriter(CONFIG.storyLines, typingAbort)
}

function closeStoryOverlay(){
  if (!overlay) return
  typingAbort.abort = true
  uiCooldownUntil = Date.now() + 450
  overlay.hidden = true
  overlay.style.display = "none"
}
$("#closeOverlay")?.addEventListener("click", closeStoryOverlay)

async function sleep(ms){ return new Promise(r => setTimeout(r, ms)) }
async function runTypewriter(lines, abortToken){
  if (!typeText) return
  const speed = 18
  const gap = 520
  const softPause = 850
  for (let li=0; li<lines.length; li++){
    if (abortToken.abort) return
    const line = lines[li]
    for (let i=0;i<=line.length;i++){
      if (abortToken.abort) return
      typeText.textContent = lines.slice(0, li).join("\n\n") + (li>0 ? "\n\n" : "") + line.slice(0,i)
      await sleep(speed)
    }
    await sleep(li === lines.length-1 ? softPause : gap)
  }
  if (typeCursor) typeCursor.style.opacity = "0"
}

// ---------- Catch the Hearts (falling hearts, click to score) ----------
const gameCanvas = $("#gameCanvas")
const gctx = gameCanvas?.getContext("2d")
let gameRunning = false
let score = 0
let timeLeft = 30
let lastSpawn = 0
const falling = []

function resetGame(){
  score = 0
  timeLeft = 30
  falling.length = 0
  $("#score").textContent = "0"
  $("#timeLeft").textContent = "30"
}

function spawnFalling(){
  const x = Math.random() * (gameCanvas.width - 30) + 15
  const y = -20
  const spd = lerp(0.8, 1.9, Math.random())
  const size = lerp(18, 28, Math.random())
  falling.push({ x, y, spd, size, alive:true })
}

function drawGame(){
  if (!gameCanvas || !gctx) return
  gctx.clearRect(0,0,gameCanvas.width, gameCanvas.height)

  // subtle gradient
  const gg = gctx.createLinearGradient(0,0,0,gameCanvas.height)
  gg.addColorStop(0,"rgba(255,255,255,0.08)")
  gg.addColorStop(1,"rgba(0,0,0,0.10)")
  gctx.fillStyle = gg
  gctx.fillRect(0,0,gameCanvas.width, gameCanvas.height)

  for (const h of falling){
    if (!h.alive) continue
    h.y += h.spd * 2.2
    gctx.font = `${Math.floor(h.size)}px Inter, sans-serif`
    gctx.fillStyle = "rgba(255,255,255,0.92)"
    gctx.shadowColor = "rgba(255,75,168,0.35)"
    gctx.shadowBlur = 14
    gctx.fillText("❤️", h.x - h.size*0.45, h.y)
    gctx.shadowBlur = 0
    if (h.y > gameCanvas.height + 40) h.alive = false
  }

  if (gameRunning) requestAnimationFrame(drawGame)
}

function startGameLoop(){
  if (!gameCanvas || !gctx) return
  resetGame()
  gameRunning = true
  const btn = $("#gameBtn")
  if (btn) btn.textContent = "Running…"

  const tick = setInterval(() => {
    timeLeft -= 1
    $("#timeLeft").textContent = String(timeLeft)
    if (timeLeft <= 0){
      clearInterval(tick)
      gameRunning = false
      if (btn) btn.textContent = "Play Again"
      toastCard("Game Over", `You caught ${score} hearts.`)
    }
  }, 1000)

  const spawnLoop = (t) => {
    if (!gameRunning) return
    if (t - lastSpawn > 420){
      lastSpawn = t
      if (Math.random() < 0.92) spawnFalling()
    }
    requestAnimationFrame(spawnLoop)
  }
  requestAnimationFrame(spawnLoop)
  requestAnimationFrame(drawGame)
}

$("#gameBtn")?.addEventListener("click", () => {
  if (!gameRunning) startGameLoop()
})

gameCanvas?.addEventListener("pointerdown", (e) => {
  if (!gameRunning) return
  const rect = gameCanvas.getBoundingClientRect()
  const x = (e.clientX - rect.left) * (gameCanvas.width / rect.width)
  const y = (e.clientY - rect.top) * (gameCanvas.height / rect.height)
  for (const h of falling){
    if (!h.alive) continue
    const dx = x - h.x
    const dy = y - h.y
    if (Math.hypot(dx,dy) < h.size){
      h.alive = false
      score += 1
      $("#score").textContent = String(score)
      break
    }
  }
})

// ---------- Fireworks + confetti finale ----------
const fxCanvas = $("#fxCanvas")
const fctx = fxCanvas?.getContext("2d")
let fxRunning = false
const sparks = []
const confetti = []

function fxResize(){
  if (!fxCanvas) return
  const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1))
  fxCanvas.width = Math.floor(320 * dpr)
  fxCanvas.height = Math.floor(420 * dpr)
}
fxResize()
window.addEventListener("resize", fxResize)

function launchFirework(x, y){
  for (let i=0;i<64;i++){
    const a = (i/64) * Math.PI*2
    const sp = lerp(1.2, 3.6, Math.random())
    sparks.push({
      x, y,
      vx: Math.cos(a)*sp,
      vy: Math.sin(a)*sp,
      life: lerp(40, 80, Math.random()),
      hue: Math.random() < 0.5 ? "rgba(255,75,168," : "rgba(154,99,255,"
    })
  }
}

function burstConfetti(){
  for (let i=0;i<90;i++){
    confetti.push({
      x: Math.random(),
      y: -0.1,
      vx: lerp(-0.006, 0.006, Math.random()),
      vy: lerp(0.006, 0.014, Math.random()),
      r: lerp(2, 4, Math.random()),
      a: Math.random()*Math.PI*2,
      av: lerp(-0.12, 0.12, Math.random()),
      col: Math.random() < 0.5 ? "rgba(75,214,255,0.9)" : "rgba(255,75,168,0.85)"
    })
  }
}

function drawFX(){
  if (!fxCanvas || !fctx) return
  const w = fxCanvas.width
  const h = fxCanvas.height
  fctx.clearRect(0,0,w,h)

  // background
  const bg = fctx.createRadialGradient(w*0.5, h*0.3, 0, w*0.5, h*0.6, w*0.8)
  bg.addColorStop(0, "rgba(255,255,255,0.10)")
  bg.addColorStop(1, "rgba(0,0,0,0.18)")
  fctx.fillStyle = bg
  fctx.fillRect(0,0,w,h)

  // sparks
  for (const s of sparks){
    s.x += s.vx
    s.y += s.vy
    s.vy += 0.03
    s.life -= 1
    const alpha = clamp(s.life / 80, 0, 1)
    fctx.fillStyle = `${s.hue}${0.55*alpha})`
    fctx.beginPath()
    fctx.arc(s.x, s.y, 2.2, 0, Math.PI*2)
    fctx.fill()
  }
  for (let i=sparks.length-1;i>=0;i--){
    if (sparks[i].life <= 0) sparks.splice(i,1)
  }

  // confetti
  for (const c of confetti){
    c.x += c.vx
    c.y += c.vy
    c.a += c.av
    c.vy += 0.0008
    const px = c.x * w
    const py = c.y * h
    fctx.save()
    fctx.translate(px, py)
    fctx.rotate(c.a)
    fctx.fillStyle = c.col
    fctx.fillRect(-c.r, -c.r, c.r*2, c.r*2)
    fctx.restore()
  }
  for (let i=confetti.length-1;i>=0;i--){
    if (confetti[i].y > 1.2) confetti.splice(i,1)
  }

  if (fxRunning) requestAnimationFrame(drawFX)
}

function startFX(){
  if (fxRunning) return
  fxRunning = true
  requestAnimationFrame(drawFX)
}

$("#celebrateBtn")?.addEventListener("click", () => {
  // Another user gesture: start music if still off
  if (!musicOn) setMusic(true)
  startFX()
  burstConfetti()
  const w = fxCanvas?.width || 320
  const h = fxCanvas?.height || 420
  launchFirework(w*0.5, h*0.45)
  launchFirework(w*0.25, h*0.55)
  launchFirework(w*0.75, h*0.55)
  toastCard("🎆", "Make a wish, my love.")
})

fxCanvas?.addEventListener("pointerdown", (e) => {
  startFX()
  const rect = fxCanvas.getBoundingClientRect()
  const dpr = fxCanvas.width / rect.width
  const x = (e.clientX - rect.left) * dpr
  const y = (e.clientY - rect.top) * dpr
  launchFirework(x,y)
})