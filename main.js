import "@fontsource-variable/onest";
import "./style.css";
import {
  Clock,
  ShieldCheck,
  createIcons,
  Atom,
  FlaskConical,
  Sigma,
  Dna,
  ArrowUpRight,
  ArrowRight,
  Download,
  WifiOff,
  SlidersHorizontal,
  Globe,
  Menu,
  Play,
  Search,
  Sun,
  Moon,
} from "lucide";
import catalogue from "./catalogue.json";
import downloads from "./downloads.json";
const icons = {
  ShieldCheck,
  Clock,
  Atom,
  FlaskConical,
  Sigma,
  Dna,
  ArrowUpRight,
  ArrowRight,
  Download,
  WifiOff,
  SlidersHorizontal,
  Globe,
  Menu,
  Play,
  Search,
  Sun,
  Moon,
};
const colorPreference = matchMedia("(prefers-color-scheme: dark)");
let theme = colorPreference.matches ? "dark" : "light";
let explicitTheme = false;
try {
  const saved = localStorage.getItem("simlab-theme");
  if (saved === "light" || saved === "dark") {
    theme = saved;
    explicitTheme = true;
  }
} catch {}
document.documentElement.dataset.theme = theme;
colorPreference.addEventListener("change", ({ matches }) => {
  if (explicitTheme) return;
  theme = matches ? "dark" : "light";
  applyTheme();
});
let cardObserver;
let motionCleanup = () => {};
let galleryPaused = false;
let updateGalleryToggle = () => {};
const manuallyPausedVideos = new WeakSet();
const motionPreference = matchMedia("(prefers-reduced-motion: reduce)");
motionPreference.addEventListener("change", () => setupMotion());
function platformIcon(key) {
  return key === "appimage"
    ? '<svg viewBox="0 0 32 32" aria-hidden="true" class="os-icon"><ellipse cx="16" cy="18" rx="9" ry="12" fill="currentColor"/><ellipse cx="16" cy="20" rx="6" ry="8" fill="var(--os-belly, #fff)"/><circle cx="13" cy="10" r="2" fill="white"/><circle cx="19" cy="10" r="2" fill="white"/><circle cx="13" cy="10" r=".8" fill="#14213d"/><circle cx="19" cy="10" r=".8" fill="#14213d"/><path d="m12 14 4-3 4 3-4 3ZM5 29l7-4 3 5H5Zm22 0-7-4-3 5h10Z" fill="#f3b828"/></svg>'
    : '<svg viewBox="0 0 32 32" aria-hidden="true" class="os-icon"><path fill="currentColor" d="M2 5 14 3v12H2Zm14-2 14-2v14H16ZM2 17h12v12L2 27Zm14 0h14v14l-14-2Z"/></svg>';
}
function setupMotion() {
  motionCleanup();
  const gallery = document.querySelector(".preview-grid");
  const toggle = document.querySelector("#gallery-motion");
  if (!gallery || !toggle) return;
  let visible = false;
  let hovering = false;
  const reduced = motionPreference.matches;
  const buttons = [...document.querySelectorAll("[data-preview]")];
  updateGalleryToggle = () => {
    toggle.textContent =
      galleryPaused || reduced
        ? t("Reproduzir galeria", "Play gallery")
        : t("Pausar galeria", "Pause gallery");
    if (reduced)
      toggle.textContent = t(
        "Galeria manual · movimento reduzido",
        "Manual gallery · reduced motion",
      );
    toggle.disabled = reduced;
    toggle.setAttribute("aria-pressed", String(!galleryPaused && !reduced));
  };
  updateGalleryToggle();
  toggle.onclick = () => {
    galleryPaused = !galleryPaused;
    updateGalleryToggle();
  };
  const enter = () => {
    hovering = true;
  };
  const leave = () => {
    hovering = false;
  };
  gallery.addEventListener("mouseenter", enter);
  gallery.addEventListener("mouseleave", leave);
  const galleryObserver = new IntersectionObserver(
    (entries) => {
      visible =
        entries[0].isIntersecting && entries[0].intersectionRatio >= 0.3;
    },
    { threshold: 0.3 },
  );
  galleryObserver.observe(gallery);
  const timer = setInterval(() => {
    if (
      !visible ||
      reduced ||
      galleryPaused ||
      hovering ||
      document.hidden ||
      gallery.contains(document.activeElement) ||
      document.activeElement.matches(
        ".gallery-controls :focus-visible, #gallery-motion:focus-visible",
      )
    )
      return;
    const index = buttons.findIndex(
      (b) => b.getAttribute("aria-pressed") === "true",
    );
    buttons[(index + 1) % buttons.length].onclick();
  }, 1000);
  const video = document.querySelector(".studio video");
  let videoVisible = false;
  let autoPausing = false;
  const onPause = () => {
    if (!autoPausing) manuallyPausedVideos.add(video);
    autoPausing = false;
  };
  const pauseOffscreen = () => {
    if (!video.paused) {
      autoPausing = true;
      video.pause();
    }
  };
  const onPlay = () => manuallyPausedVideos.delete(video);
  video.addEventListener("pause", onPause);
  video.addEventListener("play", onPlay);
  const resumeVisibleVideo = () => {
    if (
      !videoVisible ||
      reduced ||
      manuallyPausedVideos.has(video) ||
      document.hidden
    )
      return;
    if (video.hasAttribute("src")) {
      video.play().catch(() => {});
    } else {
      video.parentElement.querySelector(".demo-play").click();
    }
  };
  const videoObserver = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      videoVisible = entry.isIntersecting && entry.intersectionRatio >= 0.35;
      if (!videoVisible) pauseOffscreen();
      else resumeVisibleVideo();
    },
    { threshold: 0.35 },
  );
  if (reduced) pauseOffscreen();
  videoObserver.observe(video);
  const hide = () => {
    if (document.hidden) pauseOffscreen();
    else resumeVisibleVideo();
  };
  document.addEventListener("visibilitychange", hide);
  motionCleanup = () => {
    clearInterval(timer);
    galleryObserver.disconnect();
    videoObserver.disconnect();
    video.removeEventListener("pause", onPause);
    video.removeEventListener("play", onPlay);
    gallery.removeEventListener("mouseenter", enter);
    gallery.removeEventListener("mouseleave", leave);
    document.removeEventListener("visibilitychange", hide);
  };
}

function captureSrc(id) {
  return `/assets/captures/${id}-${lang}-${theme}.png`;
}
function applyTheme() {
  motionCleanup();
  document.documentElement.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]').content =
    theme === "dark" ? "#14213d" : "#f5f7fc";
  document.querySelectorAll("img[data-capture]").forEach((img) => {
    img.src = captureSrc(img.dataset.capture);
    img.closest("a").href = img.src;
  });
  document.querySelectorAll("video[data-demo]").forEach((video) => {
    manuallyPausedVideos.delete(video);
    video.pause();
    video.poster = captureSrc(video.dataset.demo);
    video.removeAttribute("src");
    video.dataset.src = `/assets/video/${video.dataset.demo}-${lang}-${theme}.mp4`;
    video.controls = false;
    video.load();
    video.nextElementSibling.hidden = false;
  });
  const button = document.querySelector("#theme");
  if (button) {
    button.innerHTML = icon(theme === "dark" ? "sun" : "moon");
    button.setAttribute(
      "aria-label",
      theme === "dark"
        ? t("Activar tema claro", "Switch to light theme")
        : t("Activar tema escuro", "Switch to dark theme"),
    );
  }
  createIcons({ icons, root: button });
  setupMotion();
}
let lang = "pt",
  filter = "all",
  query = "";
try {
  lang = localStorage.getItem("simlab-language") === "en" ? "en" : "pt";
} catch {}
const t = (pt, en) => (lang === "pt" ? pt : en);
const icon = (name) => `<i data-lucide="${name}" aria-hidden="true"></i>`;
const cats = {
  physics: ["Física", "Physics", "atom"],
  chemistry: ["Química", "Chemistry", "flask-conical"],
  maths: ["Matemática", "Mathematics", "sigma"],
  biology: ["Biologia", "Biology", "dna"],
};
const htmlEntities = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};
const escapeHtml = (value) =>
  String(value ?? "").replace(/[&<>"']/g, (char) => htmlEntities[char]);

function downloadUrl(value) {
  if (typeof value !== "string") return null;
  try {
    const url = new URL(value);
    if (url.protocol === "https:" && !url.username && !url.password)
      return url.href;
  } catch {}
  return null;
}

const normalizeSearch = (value) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
const searchIndex = catalogue
  .filter(({ cat }) => Object.hasOwn(cats, cat))
  .map((entry) => ({
    ...entry,
    search: { pt: normalizeSearch(entry.pt), en: normalizeSearch(entry.en) },
  }));

function renderDownloads() {
  const cards = [
    [
      "setup",
      t("Instalador Windows", "Windows installer"),
      t(
        "Para instalar no teu computador.",
        "For installation on your computer.",
      ),
      t(
        "A opção habitual para usar o SimLab neste computador.",
        "The usual choice for using SimLab on this computer.",
      ),
      ".exe",
    ],
    [
      "portable",
      t("Windows portátil", "Windows portable"),
      t("Abre sem instalação.", "Run without installation."),
      t(
        "A mesma aplicação, num ficheiro que podes levar contigo.",
        "The same application, in a file you can take with you.",
      ),
      ".exe",
    ],
    [
      "appimage",
      "Linux AppImage",
      t("Um executável para Linux.", "One executable for Linux."),
      t(
        "Transfere o AppImage, permite a execução nas propriedades do ficheiro e abre-o.",
        "Download the AppImage, allow execution in the file properties, then open it.",
      ),
      ".AppImage",
    ],
  ];
  return cards
    .map(([key, title, lead, detail, extension]) => {
      const file = downloads[key] ?? {};
      const url = downloadUrl(file.url);
      const ready = file.status === "available" && url;
      const status = ready
        ? t("Disponível", "Available")
        : key === "appimage"
          ? t("Em preparação", "In preparation")
          : t("Ligação pública pendente", "Public link pending");
      const label = ready
        ? t("Transferir", "Download")
        : key === "appimage"
          ? t("AppImage em preparação", "AppImage in preparation")
          : t("Transferência ainda indisponível", "Download not yet available");
      return `<article class="platform-card ${key}" data-download="${key}"><div class="platform-top"><span class="platform-icon">${platformIcon(key)}</span><span class="format-tag">${extension}</span></div><div class="availability">${icon(ready ? "shield-check" : "clock")} ${status}</div><h3>${title}</h3><p class="download-lead">${lead}</p><p class="download-detail">${detail}</p><div class="file-meta">${file.bytes ? `<span>v${escapeHtml(downloads.version)}</span><span>${new Intl.NumberFormat(lang === "pt" ? "pt-MZ" : "en", { maximumFractionDigits: 1 }).format(file.bytes / 1e6)} MB</span>` : `<span>v${escapeHtml(downloads.version)}</span>`}</div>${ready ? `<a class="download-action" href="${escapeHtml(url)}">${icon("download")} ${label}</a>` : `<button class="download-action" disabled>${icon("clock")} ${label}</button>`}${file.sha256 ? `<details class="file-verification"><summary>${t("Detalhes do ficheiro e SHA256", "File details and SHA256")}</summary><p>${escapeHtml(file.filename)}</p><code>${escapeHtml(file.sha256)}</code><small>${t("SHA256 de referência, para comparares com o ficheiro transferido.", "Reference SHA256, for comparison with your downloaded file.")}</small></details>` : `<p class="linux-note">${t("Não há download Linux disponível nesta página.", "No Linux download is available on this page.")}</p>`}</article>`;
    })
    .join("");
}
function render() {
  motionCleanup();
  cardObserver?.disconnect();
  document.documentElement.lang = lang === "pt" ? "pt-MZ" : "en";
  document.title = t(
    "SimLab — A ciência nas tuas mãos",
    "SimLab — Science in your hands",
  );
  document.querySelector('meta[name="description"]').content = t(
    "Explora Física, Química, Matemática e Biologia com o SimLab. 89 experiências, incluindo o Estúdio de criação. Disponível para Windows e Linux. Funciona sem internet.",
    "Explore Physics, Chemistry, Mathematics and Biology with SimLab. 89 experiences, including the creation Studio. Available for Windows and Linux. Works offline.",
  );
  document.querySelector("#app").innerHTML = `
 <a class="skip" href="#main">${t("Saltar para o conteúdo", "Skip to content")}</a>
 <header><a class="brand" href="#" aria-label="SimLab"><img src="/assets/mark.svg" width="40" height="40" alt=""><span>SimLab</span></a><nav id="primary-nav" aria-label="${t("Navegação principal", "Main navigation")}"><a href="#explorar">${t("Explorar", "Explore")}</a><a href="#experiencia">${t("A experiência", "The experience")}</a><a href="#perguntas">${t("Perguntas", "Questions")}</a></nav><div class="header-actions"><button id="language" aria-label="${t("Switch to English", "Mudar para português")}" class="language">${icon("globe")} ${lang === "pt" ? "EN" : "PT"}</button><button id="theme" class="language" type="button"></button><a class="button small" href="#download">${t("Obter o SimLab", "Get SimLab")} ${icon("arrow-up-right")}</a><button class="menu" type="button" aria-controls="primary-nav" aria-expanded="false" aria-label="${t("Abrir menu", "Open menu")}">${icon("menu")}</button></div></header>
 <main id="main" tabindex="-1"><section class="hero wrap"><div class="hero-copy"><div class="eyebrow"><span class="dot"></span> ${t("A CURIOSIDADE É O PONTO DE PARTIDA", "CURIOSITY IS THE STARTING POINT")}</div><h1>${t("A ciência<br>nas tuas <span>mãos.</span>", "Science.<br>In your <span>hands.</span>")}</h1><p>${t("E se pudesses ver uma ideia acontecer? Explora, altera, descobre. O teu laboratório de Física, Química, Matemática e Biologia — mesmo sem internet.", "What if you could watch an idea come to life? Explore, change, discover. Your Physics, Chemistry, Mathematics and Biology lab — even without internet.")}</p><div class="hero-buttons"><a class="button" href="#download">${icon("download")} ${t("Obter o SimLab", "Get SimLab")}</a><a class="text-link" href="#explorar">${t("Conhecer as simulações", "Explore the simulations")} ${icon("arrow-right")}</a></div><div class="hero-note">${icon("wifi-off")} ${t("Windows e Linux · Português e inglês", "Windows and Linux · Portuguese and English")}</div></div>
 <div class="hero-lab"><div class="lab-heading"><span class="live-dot"></span>${t("UM OLHAR DENTRO DO SIMLAB", "A LOOK INSIDE SIMLAB")}<span>2D + 3D</span></div><figure class="lab-feature"><img data-capture="cell-3d" src="${captureSrc("cell-3d")}" width="2512" height="1774" fetchpriority="high" alt="${t("Simulação real de uma célula em 3D com organelos identificados", "Actual 3D cell simulation with labelled organelles")}"><figcaption><span>${icon("dna")} ${t("Explorador da célula", "Cell explorer")}</span><span>${t("BIOLOGIA", "BIOLOGY")} / 3D</span></figcaption></figure><div class="lab-pair"><figure><img data-capture="dna-3d" loading="lazy" decoding="async" src="${captureSrc("dna-3d")}" width="2512" height="1774" alt="${t("Dupla hélice de ADN na aplicação real", "DNA double helix in the actual application")}"><figcaption>${t("A estrutura da vida", "The structure of life")}<span>ADN / DNA</span></figcaption></figure><figure><img data-capture="molecule-3d" loading="lazy" decoding="async" src="${captureSrc("molecule-3d")}" width="2512" height="1774" alt="${t("Molécula de água na simulação real", "Water molecule in the actual simulation")}"><figcaption>${t("O mundo molecular", "The molecular world")}<span>H₂O</span></figcaption></figure></div><p class="lab-caption">${t("Simulações executadas no renderizador oficial. Clica para ampliar.", "Simulations running in the official renderer. Click to enlarge.")}</p></div></section>
 <div class="stats wrap"><div><strong>89<span>↗</span></strong><p>${t("experiências, incluindo o Estúdio", "experiences, including the Studio")}</p></div><div><strong>04</strong><p>${t("áreas para descobrir", "areas to discover")}</p></div><div><strong>2D <span>+ </span>3D</strong><p>${t("novas formas de observar", "new ways to observe")}</p></div><div><strong>Offline</strong><p>${t("a curiosidade não precisa de Wi-Fi", "curiosity needs no Wi-Fi")}</p></div></div>
 <section class="section wrap" id="explorar"><div class="section-top"><div><div class="eyebrow">01 / ${t("EXPLORAR", "EXPLORE")}</div><h2>${t("Uma pergunta.<br>Infinitas possibilidades.", "One question.<br>Endless possibilities.")}</h2></div><p>${t("Do movimento de uma bola à estrutura do ADN. Segue a tua curiosidade por quatro mundos ligados pela ciência.", "From a moving ball to the structure of DNA. Follow your curiosity through four worlds connected by science.")}</p></div><div class="subject-grid">${Object.entries(
   cats,
 )
   .map(
     ([key, c], i) =>
       `<button class="subject ${key}" data-subject="${key}"><span class="subject-top">${icon(c[2])}<span>0${i + 1}</span></span><h3>${t(c[0], c[1])}</h3><p>${[t("Movimento, energia e ondas.", "Motion, energy and waves."), t("Matéria que se transforma.", "Matter in transformation."), t("Ideias que ganham forma.", "Ideas taking shape."), t("A vida, vista de perto.", "Life, up close.")][i]}</p><span class="subject-bottom">${catalogue.filter((e) => e.cat === key).length} ${t("experiências", "experiences")} ${icon("arrow-up-right")}</span></button>`,
   )
   .join("")}</div>
 <div class="catalogue" id="catalogue" tabindex="-1"><div class="catalogue-head"><h3>${t("Encontra a tua próxima descoberta", "Find your next discovery")}</h3><label class="search">${icon("search")}<input id="search" type="search" placeholder="${t("Pesquisar experiências…", "Search experiences…")}" aria-label="${t("Pesquisar experiências", "Search experiences")}"></label></div><div class="filters" role="group" aria-label="${t("Filtrar por área", "Filter by area")}"><button data-filter="all" aria-pressed="true">${t("Todas", "All")}</button>${Object.entries(
   cats,
 )
   .map(
     ([k, c]) =>
       `<button data-filter="${k}" aria-pressed="false">${t(c[0], c[1])}</button>`,
   )
   .join(
     "",
   )}</div><p id="result-count" aria-live="polite"></p><div id="results"></div><button id="show-all" aria-controls="results" aria-expanded="false" class="text-link">${t("Ver todo o catálogo", "View full catalogue")} ${icon("arrow-right")}</button><p class="catalogue-note">${t("Catálogo da aplicação para computador. As simulações abrem no SimLab.", "Desktop application catalogue. Simulations run inside SimLab.")}</p></div></section>
 <section class="experience" id="experiencia"><div class="wrap"><div class="section-top"><div><div class="eyebrow">02 / ${t("EXPERIMENTAR", "EXPERIMENT")}</div><h2>${t("Menos «imagina».<br>Mais «olha o que acontece».", "Less “imagine”.<br>More “watch this”.")}</h2></div><p>${t("Muda uma variável. Observa o resultado. Volta a tentar. Cada experiência é um convite para fazer novas perguntas.", "Change a variable. Observe the result. Try again. Every experiment invites a new question.")}</p></div><div class="gallery-controls" role="group" aria-label="${t("Imagens da aplicação", "Application images")}">${[
   ["cell-3d", "Explorador da célula", "Cell explorer"],
   ["molecule-3d", "Moléculas em 3D", "Molecules in 3D"],
   ["projectile", "Lançamento de projécteis", "Projectile motion"],
   ["function-grapher", "Gráficos de funções", "Function graphs"],
   ["dna-3d", "Dupla hélice de ADN", "DNA double helix"],
 ]
   .map(
     ([id, pt, en], i) =>
       `<button data-preview="${id}" aria-pressed="${i === 0}">${t(pt, en)}</button>`,
   )
   .join(
     "",
   )}</div><div class="gallery-playback"><button id="gallery-motion" type="button"></button><span>${t("Uma experiência por segundo · pausa ao apontar ou usar o teclado", "One experience per second · pauses on hover or keyboard focus")}</span></div><div class="preview-grid"><figure class="preview-main"><img data-capture="cell-3d" src="${captureSrc("cell-3d")}" width="2512" height="1774" loading="lazy" decoding="async" alt="${t("Captura real do explorador da célula em 3D", "Actual capture of the 3D cell explorer")}"><figcaption><span>${icon("dna")} ${t("Explorador da célula", "Cell explorer")}</span><span>3D / ${t("BIOLOGIA", "BIOLOGY")}</span></figcaption></figure><div class="experience-features"><article>${icon("sliders-horizontal")}<h3>${t("Tu controlas a experiência.", "You control the experiment.")}</h3><p>${t("Ajusta parâmetros, pausa o movimento e avança passo a passo. Observa medições e gráficos nas experiências que os incluem.", "Adjust parameters, pause motion and advance step by step. Observe readings and graphs in experiments that include them.")}</p></article><article>${icon("wifi-off")}<h3>${t("Leva o laboratório contigo.", "Take your lab with you.")}</h3><p>${t("Depois de transferida, a aplicação funciona sem internet. Guarda configurações .simlab e imagens do palco para retomar uma ideia.", "Once downloaded, the application works offline. Save .simlab configurations and stage images to return to an idea.")}</p></article></div></div><details class="motion-demo"><summary>${t("Ver o ADN em movimento", "Watch DNA in motion")}</summary><video data-demo="dna-3d" controls playsinline preload="none" poster="${captureSrc("dna-3d")}" aria-label="${t("Rotação real da dupla hélice de ADN", "Actual rotation of the DNA double helix")}"></video><p>${t("Rotação por arrasto no renderizador oficial da aplicação. Sem som.", "Drag rotation in the official application renderer. No audio.")}</p></details><p class="image-note">${t("Captura real em alta resolução. Clica na imagem para ver os pormenores.", "Actual high-resolution capture. Click the image to see the details.")}</p></div></section>
 <section class="section wrap studio"><div><div class="eyebrow">03 / ${t("CRIAR", "CREATE")}</div><h2>${t("A próxima experiência<br>pode ser tua.", "The next experiment<br>could be yours.")}</h2><p>${t("No Estúdio de criação, constrói cenários e explora as tuas próprias ideias. Guarda o trabalho e continua a experimentar.", "Build scenes and explore your own ideas in the creation Studio. Save your work and keep experimenting.")}</p><a class="text-link" href="#download">${t("Descobrir o Estúdio no SimLab", "Discover the Studio in SimLab")} ${icon("arrow-right")}</a></div><figure><video data-demo="studio" muted loop controls playsinline preload="none" poster="${captureSrc("studio")}" aria-label="${t("Cinco exemplos reais do Estúdio: circuito, química, função quadrática, fotossíntese e movimento lunar", "Five real Studio examples: circuit, chemistry, quadratic function, photosynthesis and lunar motion")}"></video><figcaption>${t("ESTÚDIO EM ACÇÃO · REPRODUZIR DEMONSTRAÇÃO", "STUDIO IN ACTION · PLAY DEMONSTRATION")}</figcaption><p class="demo-description">${t("Cinco ideias no Estúdio: circuito, neutralização, parábola, fotossíntese e movimento na Lua. Gravação real, sem som. Reproduz ao entrar no ecrã; usa os controlos para pausar. Com movimento reduzido, começa apenas quando escolhes reproduzir.", "Five Studio ideas: circuit, neutralisation, parabola, photosynthesis and motion on the Moon. Actual recording, without audio. Plays when it enters the screen; use the controls to pause. With reduced motion, playback starts only when you choose.")}</p></figure></section>
 <section id="download" class="download-section"><div class="wrap download-hub"><div class="download-heading"><div><div class="eyebrow">${t("O TEU PRÓXIMO PASSO", "YOUR NEXT STEP")}</div><h2>${t("O teu laboratório.<br>À tua maneira.", "Your laboratory.<br>Your way.")}</h2></div><p>${t("Escolhe o formato para o teu computador: instalador ou versão portátil para Windows, AppImage para Linux.", "Choose the format for your computer: installer or portable version for Windows, AppImage for Linux.")}</p></div><div class="download-platforms">${renderDownloads()}</div><div class="download-footnote">${icon("shield-check")}<p>${t("Windows 1.0.2: instalador e versão portátil disponíveis. Os executáveis não estão assinados digitalmente e o Windows pode mostrar um aviso. O AppImage para Linux também está disponível na versão 1.0.2.", "Windows 1.0.2: installer and portable version available. The executables are not digitally signed and Windows may show a warning. The Linux AppImage is also available in version 1.0.2.")}</p></div></div></section>
 <section class="section wrap faq" id="perguntas"><div><div class="eyebrow">04 / ${t("BOM SABER", "GOOD TO KNOW")}</div><h2>${t("Antes de começar.", "Before you begin.")}</h2></div><div>${[
   [
     t("Preciso de internet?", "Do I need internet?"),
     t(
       "Só para transferir a aplicação. Depois, as simulações funcionam sem ligação à internet.",
       "Only to download the application. After that, the simulations work without an internet connection.",
     ),
   ],
   [
     t("Posso usar no telemóvel?", "Can I use it on my phone?"),
     t(
       "Este site adapta-se ao telemóvel, mas o SimLab é uma aplicação para computador. Estão disponíveis o instalador e a versão portátil para Windows, e o AppImage para Linux.",
       "This website works on phones, but SimLab is a desktop application. The Windows installer and portable version, and the Linux AppImage, are available.",
     ),
   ],
   [
     t(
       "Qual é a diferença entre as duas versões?",
       "What is the difference between the downloads?",
     ),
     t(
       "O instalador instala a aplicação no Windows. A versão portátil abre directamente, sem instalação. Ambas correspondem à versão 1.0.2.",
       "The installer installs the application on Windows. The portable version runs directly without installation. Both are version 1.0.2.",
     ),
   ],
   [
     t(
       "A aplicação também está em inglês?",
       "Is the application also available in English?",
     ),
     t(
       "Sim. A interface e o catálogo estão disponíveis em português e inglês. Podes mudar o idioma na aplicação.",
       "Yes. The interface and catalogue are available in Portuguese and English. You can change the language in the application.",
     ),
   ],
   [
     t("Como posso comunicar um problema?", "How can I report a problem?"),
     t(
       "Contacta o autor através do seu perfil público. Indica a versão, a simulação e os passos que levaram ao problema.",
       "Contact the author through his public profile. Include the version, simulation and steps that led to the problem.",
     ) + ` <a href="https://github.com/danielcodemoz">Danielpro ↗</a>`,
   ],
 ]
   .map(
     ([q, a]) =>
       `<details><summary>${q}<span aria-hidden="true">+</span></summary><p>${a}</p></details>`,
   )
   .join("")}</div></section></main>
 <footer class="wrap"><a class="brand" href="#"><img src="/assets/mark.svg" width="36" height="36" alt=""><span>SimLab</span></a><p>${t("Uma criação de", "Created by")} <a href="https://github.com/danielcodemoz">Daniel Marcos · Danielpro</a></p><a href="https://github.com/danielcodemoz">${t("O autor", "The creator")} ↗</a><span>© 2026</span></footer>`;
  document.querySelectorAll("img[data-capture]").forEach((img) => {
    if (img.closest("a")) return;
    const link = document.createElement("a");
    link.className = "capture-link";
    link.target = "_blank";
    link.rel = "noopener";
    link.setAttribute(
      "aria-label",
      t("Abrir captura original: ", "Open original capture: ") + img.alt,
    );
    img.before(link);
    link.append(img);
  });
  document.querySelectorAll("video[data-demo]").forEach((video) => {
    const wrapper = document.createElement("div");
    wrapper.className = "video-player";
    video.before(wrapper);
    wrapper.append(video);
    const play = document.createElement("button");
    play.className = "demo-play";
    play.type = "button";
    play.innerHTML = `${icon("play")} ${t("Reproduzir demonstração", "Play demonstration")}`;
    play.onclick = async (event) => {
      if (!video.hasAttribute("src")) video.src = video.dataset.src;
      video.controls = true;
      if (event.isTrusted && document.activeElement === play) video.focus();
      play.hidden = true;
      try {
        await video.play();
      } catch {
        play.hidden = false;
        if (document.activeElement === video) play.focus();
      }
    };
    wrapper.append(play);
  });
  const dnaDemo = document.querySelector(".motion-demo");
  dnaDemo.addEventListener("toggle", () => {
    if (!dnaDemo.open) dnaDemo.querySelector("video").pause();
  });
  createIcons({ icons });
  applyTheme();
  document.querySelector("#theme").onclick = () => {
    theme = theme === "light" ? "dark" : "light";
    explicitTheme = true;
    try {
      localStorage.setItem("simlab-theme", theme);
    } catch {}
    applyTheme();
  };
  document.querySelector("#language").onclick = () => {
    lang = lang === "pt" ? "en" : "pt";
    try {
      localStorage.setItem("simlab-language", lang);
    } catch {}
    render();
    document.querySelector("#language").focus({ preventScroll: true });
  };
  const header = document.querySelector("header");
  const nav = header.querySelector("nav");
  const menu = header.querySelector(".menu");
  const setMenuOpen = (open) => {
    menu.setAttribute("aria-expanded", String(open));
    menu.setAttribute(
      "aria-label",
      open ? t("Fechar menu", "Close menu") : t("Abrir menu", "Open menu"),
    );
    header.classList.toggle("nav-open", open);
  };
  menu.onclick = () => {
    const open = menu.getAttribute("aria-expanded") !== "true";
    setMenuOpen(open);
    if (open) nav.querySelector("a").focus();
  };
  header.onkeydown = (event) => {
    if (
      event.key === "Escape" &&
      menu.getAttribute("aria-expanded") === "true"
    ) {
      setMenuOpen(false);
      menu.focus();
    }
  };
  nav.onclick = (event) => {
    const link = event.target.closest("a");
    if (!link || menu.getAttribute("aria-expanded") !== "true") return;
    const target = document.getElementById(link.hash.slice(1));
    target.tabIndex = -1;
    setMenuOpen(false);
    target.focus({ preventScroll: true });
  };
  document.querySelector("#search").value = query;
  document.querySelector("#search").oninput = (e) => {
    query = e.target.value;
    drawResults();
  };
  document.querySelectorAll("[data-filter]").forEach(
    (b) =>
      (b.onclick = (event) => {
        if (event) {
          galleryPaused = true;
          updateGalleryToggle();
        }
        filter = b.dataset.filter;
        drawResults();
      }),
  );
  document.querySelectorAll("[data-subject]").forEach(
    (b) =>
      (b.onclick = (event) => {
        if (event) {
          galleryPaused = true;
          updateGalleryToggle();
        }
        filter = b.dataset.subject;
        drawResults();
        const catalogueSection = document.querySelector("#catalogue");
        catalogueSection.focus({ preventScroll: true });
        catalogueSection.scrollIntoView({
          behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "instant"
            : "smooth",
        });
      }),
  );
  document.querySelector("#show-all").onclick = () => {
    expanded = !expanded;
    drawResults();
  };
  drawResults();
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const cards = (cardObserver = new IntersectionObserver(
      (entries, observer) => {
        for (const entry of entries)
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-card");
            observer.unobserve(entry.target);
          }
      },
      { threshold: 0.12 },
    ));
    document
      .querySelectorAll(".platform-card")
      .forEach((card) => cards.observe(card));
  }
  document.querySelectorAll("[data-preview]").forEach(
    (b) =>
      (b.onclick = (event) => {
        if (event) {
          galleryPaused = true;
          updateGalleryToggle();
        }
        document
          .querySelectorAll("[data-preview]")
          .forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
        const img = document.querySelector(".preview-main img");
        img.dataset.capture = b.dataset.preview;
        img.src = captureSrc(b.dataset.preview);
        img.closest("a").href = img.src;
        img.alt = t("Captura real: ", "Actual capture: ") + b.textContent;
        img
          .closest("a")
          .setAttribute(
            "aria-label",
            t("Abrir captura original: ", "Open original capture: ") + img.alt,
          );
        document.querySelector(
          ".preview-main figcaption span:first-child",
        ).textContent = b.textContent;
        document.querySelector(
          ".preview-main figcaption span:last-child",
        ).textContent = t("IMAGEM DA APLICAÇÃO", "APPLICATION IMAGE");
      }),
  );
}
let expanded = false;
function drawResults() {
  const term = normalizeSearch(query);
  const items = searchIndex.filter(
    (entry) =>
      (filter === "all" || entry.cat === filter) &&
      entry.search[lang].includes(term),
  );
  document
    .querySelectorAll("[data-filter]")
    .forEach((b) =>
      b.setAttribute("aria-pressed", String(b.dataset.filter === filter)),
    );
  document.querySelector("#result-count").textContent =
    `${items.length} ${t("experiências encontradas", "experiences found")}`;
  document.querySelector("#results").innerHTML = items.length
    ? (expanded ? items : items.slice(0, 8))
        .map(
          (e) =>
            `<article class="result ${e.cat}"><span class="result-icon">${icon(cats[e.cat][2])}</span><div><h4>${escapeHtml(e[lang])}</h4><p>${t(cats[e.cat][0], cats[e.cat][1])} <span>· ${escapeHtml(e.dim)}</span></p></div></article>`,
        )
        .join("")
    : `<p class="empty">${t("Nenhuma experiência encontrada. Tenta outro termo ou outra área.", "No experiences found. Try another term or subject.")}</p>`;
  const b = document.querySelector("#show-all");
  b.hidden = items.length <= 8;
  b.setAttribute("aria-expanded", String(expanded && !b.hidden));
  b.innerHTML =
    (expanded
      ? t("Mostrar menos", "Show less")
      : t("Ver todo o catálogo", "View full catalogue")) + icon("arrow-right");
  createIcons({ icons, root: document.querySelector("#catalogue") });
}
render();
