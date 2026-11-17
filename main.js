import "@fontsource-variable/onest";
import "./style.css";
import {
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
  X,
  MoveRight,
  Play,
  Pause,
  Search,
  Sun,
  Moon,
} from "lucide";
import catalogue from "./catalogue.json";
import downloads from "./downloads.json";
const icons = {
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
  X,
  MoveRight,
  Play,
  Pause,
  Search,
  Sun,
  Moon,
};
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
const download = (kind) => downloads[kind]?.url;
const downloadAttrs = (kind) =>
  download(kind) ? `href="${download(kind)}"` : 'aria-disabled="true"';
function render() {
  document.documentElement.lang = lang === "pt" ? "pt-MZ" : "en";
  document.title = t(
    "Educare SimLab — A ciência nas tuas mãos",
    "Educare SimLab — Science in your hands",
  );
  document.querySelector("#app").innerHTML = `
 <a class="skip" href="#main">${t("Saltar para o conteúdo", "Skip to content")}</a>
 <header><a class="brand" href="#" aria-label="SimLab"><img src="/assets/mark.svg" width="40" height="40" alt=""><span>SimLab<small>EDUCARE</small></span></a><nav aria-label="${t("Navegação principal", "Main navigation")}"><a href="#explorar">${t("Explorar", "Explore")}</a><a href="#experiencia">${t("A experiência", "The experience")}</a><a href="#perguntas">${t("Perguntas", "Questions")}</a></nav><div class="header-actions"><button id="language" aria-label="${t("Switch to English", "Mudar para português")}" class="language">${icon("globe")} ${lang === "pt" ? "EN" : "PT"}</button><a class="button small" href="#download">${t("Obter o SimLab", "Get SimLab")} ${icon("arrow-up-right")}</a><button class="menu" aria-expanded="false" aria-label="${t("Abrir menu", "Open menu")}">${icon("menu")}</button></div></header>
 <main id="main"><section class="hero wrap"><div class="hero-copy"><div class="eyebrow"><span class="dot"></span> ${t("A CURIOSIDADE É O PONTO DE PARTIDA", "CURIOSITY IS THE STARTING POINT")}</div><h1>${t("A ciência<br>nas tuas <span>mãos.</span>", "Science.<br>In your <span>hands.</span>")}</h1><p>${t("E se pudesses ver uma ideia acontecer? Explora, altera, descobre. O teu laboratório de Física, Química, Matemática e Biologia — mesmo sem internet.", "What if you could watch an idea come to life? Explore, change, discover. Your Physics, Chemistry, Mathematics and Biology lab — even without internet.")}</p><div class="hero-buttons"><a class="button" href="#download">${icon("download")} ${t("Obter o SimLab", "Get SimLab")}</a><a class="text-link" href="#explorar">${t("Conhecer as simulações", "Explore the simulations")} ${icon("arrow-right")}</a></div><div class="hero-note">${icon("wifi-off")} ${t("Para Windows · Em português e inglês", "For Windows · In Portuguese and English")}</div></div>
 <div class="science-art" aria-label="${t("Ilustração de ondas e trajectórias", "Illustration of waves and trajectories")}" role="img"><div class="art-label">SIMLAB / ${t("CADERNO DE EXPLORAÇÃO", "EXPLORATION NOTEBOOK")}<span>01—∞</span></div><div class="orbit orbit-one"></div><div class="orbit orbit-two"></div><div class="nucleus">${icon("atom")}</div><span class="particle p1"></span><span class="particle p2"></span><span class="particle p3"></span><span class="formula f1">E = ½mv²</span><span class="formula f2">f(x) = sin(x)</span><svg class="wave" viewBox="0 0 500 130" aria-hidden="true"><path d="M-20 65 Q20 -30 60 65 T140 65 T220 65 T300 65 T380 65 T460 65 T540 65"/></svg><div class="art-footer"><span>${t("OBSERVAR. QUESTIONAR. EXPERIMENTAR.", "OBSERVE. QUESTION. EXPERIMENT.")}</span><span>↗</span></div></div></section>
 <div class="stats wrap"><div><strong>89<span>↗</span></strong><p>${t("experiências, incluindo o Estúdio", "experiences, including the Studio")}</p></div><div><strong>04</strong><p>${t("áreas para descobrir", "areas to discover")}</p></div><div><strong>2D <span>+ </span>3D</strong><p>${t("novas formas de observar", "new ways to observe")}</p></div><div><strong>Offline</strong><p>${t("a curiosidade não precisa de Wi-Fi", "curiosity needs no Wi-Fi")}</p></div></div>
 <section class="section wrap" id="explorar"><div class="section-top"><div><div class="eyebrow">01 / ${t("EXPLORAR", "EXPLORE")}</div><h2>${t("Uma pergunta.<br>Infinitas possibilidades.", "One question.<br>Endless possibilities.")}</h2></div><p>${t("Do movimento de uma bola à estrutura do ADN. Segue a tua curiosidade por quatro mundos ligados pela ciência.", "From a moving ball to the structure of DNA. Follow your curiosity through four worlds connected by science.")}</p></div><div class="subject-grid">${Object.entries(
   cats,
 )
   .map(
     ([key, c], i) =>
       `<button class="subject ${key}" data-subject="${key}"><span class="subject-top">${icon(c[2])}<span>0${i + 1}</span></span><h3>${t(c[0], c[1])}</h3><p>${[t("Movimento, energia e ondas.", "Motion, energy and waves."), t("Matéria que se transforma.", "Matter in transformation."), t("Ideias que ganham forma.", "Ideas taking shape."), t("A vida, vista de perto.", "Life, up close.")][i]}</p><span class="subject-bottom">${catalogue.filter((e) => e.cat === key).length} ${t("experiências", "experiences")} ${icon("arrow-up-right")}</span></button>`,
   )
   .join("")}</div>
 <div class="catalogue" id="catalogue"><div class="catalogue-head"><h3>${t("Encontra a tua próxima descoberta", "Find your next discovery")}</h3><label class="search">${icon("search")}<input id="search" type="search" placeholder="${t("Pesquisar experiências…", "Search experiences…")}" aria-label="${t("Pesquisar experiências", "Search experiences")}"></label></div><div class="filters" role="group" aria-label="${t("Filtrar por área", "Filter by area")}"><button data-filter="all" aria-pressed="true">${t("Todas", "All")}</button>${Object.entries(
   cats,
 )
   .map(
     ([k, c]) =>
       `<button data-filter="${k}" aria-pressed="false">${t(c[0], c[1])}</button>`,
   )
   .join(
     "",
   )}</div><p id="result-count" aria-live="polite"></p><div id="results"></div><button id="show-all" class="text-link">${t("Ver todo o catálogo", "View full catalogue")} ${icon("arrow-right")}</button><p class="catalogue-note">${t("Catálogo da aplicação para computador. As simulações abrem no SimLab.", "Desktop application catalogue. Simulations run inside SimLab.")}</p></div></section>
 <section class="experience" id="experiencia"><div class="wrap"><div class="section-top"><div><div class="eyebrow">02 / ${t("EXPERIMENTAR", "EXPERIMENT")}</div><h2>${t("Menos «imagina».<br>Mais «olha o que acontece».", "Less “imagine”.<br>More “watch this”.")}</h2></div><p>${t("Muda uma variável. Observa o resultado. Volta a tentar. Cada experiência é um convite para fazer novas perguntas.", "Change a variable. Observe the result. Try again. Every experiment invites a new question.")}</p></div><div class="gallery-controls" role="group" aria-label="${t("Imagens da aplicação", "Application images")}">${[
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
   )}</div><div class="preview-grid"><figure class="preview-main"><img src="/assets/molecule-3d-light.jpg" width="640" height="400" loading="lazy" alt="${t("Miniatura real da simulação de moléculas 3D", "Actual thumbnail of the 3D molecule simulation")}"><figcaption><span>${icon("flask-conical")} ${t("Moléculas em 3D", "Molecules in 3D")}</span><span>3D / ${t("QUÍMICA", "CHEMISTRY")}</span></figcaption></figure><div class="experience-features"><article>${icon("sliders-horizontal")}<h3>${t("Tu controlas a experiência.", "You control the experiment.")}</h3><p>${t("Ajusta parâmetros, pausa o movimento e avança passo a passo. Observa medições e gráficos nas experiências que os incluem.", "Adjust parameters, pause motion and advance step by step. Observe readings and graphs in experiments that include them.")}</p></article><article>${icon("wifi-off")}<h3>${t("Leva o laboratório contigo.", "Take your lab with you.")}</h3><p>${t("Depois de transferida, a aplicação funciona sem internet. Guarda configurações .simlab e imagens do palco para retomar uma ideia.", "Once downloaded, the application works offline. Save .simlab configurations and stage images to return to an idea.")}</p></article></div></div><p class="image-note">${t("Imagem real do catálogo da aplicação.", "Actual image from the application catalogue.")}</p></div></section>
 <section class="section wrap studio"><div><div class="eyebrow">03 / ${t("CRIAR", "CREATE")}</div><h2>${t("A próxima experiência<br>pode ser tua.", "The next experiment<br>could be yours.")}</h2><p>${t("No Estúdio de criação, constrói cenários e explora as tuas próprias ideias. Guarda o trabalho e continua a experimentar.", "Build scenes and explore your own ideas in the creation Studio. Save your work and keep experimenting.")}</p><a class="text-link" href="#download">${t("Descobrir o Estúdio no SimLab", "Discover the Studio in SimLab")} ${icon("arrow-right")}</a></div><figure><img src="/assets/studio-light.jpg" width="640" height="400" loading="lazy" alt="${t("Miniatura real do Estúdio de criação", "Actual creation Studio thumbnail")}"><figcaption>${t("ESTÚDIO DE CRIAÇÃO / IMAGEM DA APLICAÇÃO", "CREATION STUDIO / APPLICATION IMAGE")}</figcaption></figure></section>
 <section id="download" class="download-section"><div class="wrap download-inner"><div><div class="eyebrow">${t("O TEU LABORATÓRIO ESTÁ À ESPERA", "YOUR LAB IS WAITING")}</div><h2>${t("Vamos descobrir<br>o que acontece?", "Shall we see<br>what happens?")}</h2><p>${t("SimLab 1.0.1 para Windows. A transferência pública está em preparação.", "SimLab 1.0.1 for Windows. Public downloads are being prepared.")}</p><div class="release-note">${t("Publicado a 17 de Novembro de 2026", "Released 17 November 2026")}<br>${t("Em breve: instalador e versão portátil.", "Coming soon: installer and portable version.")}</div></div><div class="download-options"><a class="download-card" ${downloadAttrs("setup")}><span>${icon("download")}<strong>${t("Instalador Windows", "Windows installer")}</strong><small>${t("Disponível em breve · Instala no computador", "Coming soon · Install on your computer")} · 80.3 MB</small></span>${icon("arrow-up-right")}</a><a class="download-card secondary" ${downloadAttrs("portable")}><span>${icon("download")}<strong>${t("Versão portátil", "Portable version")}</strong><small>${t("Disponível em breve · Abre sem instalar", "Coming soon · Run without installing")} · 80.1 MB</small></span>${icon("arrow-up-right")}</a><p>${t("Estamos a preparar uma ligação pública para os ficheiros. Os executáveis da versão 1.0.1 não estão assinados digitalmente; o Windows pode mostrar um aviso.", "We are preparing a public link to the files. Version 1.0.1 executables are not digitally signed; Windows may show a warning.")}</p><details class="checksums"><summary>${t("Verificação SHA256 · v1.0.1", "SHA256 verification · v1.0.1")}</summary><p>Portable<br><code>${downloads.portable.sha256}</code><br>Setup<br><code>${downloads.setup.sha256}</code></p></details></div></div></section>
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
       "Este site adapta-se ao telemóvel, mas o SimLab é uma aplicação para computador. Os downloads aqui disponibilizados são para Windows.",
       "This website works on phones, but SimLab is a desktop application. The downloads provided here are for Windows.",
     ),
   ],
   [
     t(
       "Qual é a diferença entre as duas versões?",
       "What is the difference between the downloads?",
     ),
     t(
       "O instalador instala a aplicação no Windows. A versão portátil abre directamente, sem instalação. Ambas correspondem à versão 1.0.1.",
       "The installer installs the application on Windows. The portable version runs directly without installation. Both are version 1.0.1.",
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
 <footer class="wrap"><a class="brand" href="#"><img src="/assets/mark.svg" width="36" height="36" alt=""><span>SimLab<small>EDUCARE</small></span></a><p>${t("Uma criação de", "Created by")} <a href="https://github.com/danielcodemoz">Daniel Marcos · Danielpro</a></p><a href="https://github.com/danielcodemoz">${t("O autor", "The creator")} ↗</a><span>© 2026</span></footer>`;
  createIcons({ icons });
  document.querySelector("#language").onclick = () => {
    lang = lang === "pt" ? "en" : "pt";
    try {
      localStorage.setItem("simlab-language", lang);
    } catch {}
    render();
  };
  document.querySelector(".menu").onclick = (e) => {
    const b = e.currentTarget,
      open = b.getAttribute("aria-expanded") !== "true";
    b.setAttribute("aria-expanded", open);
    document.querySelector("header").classList.toggle("nav-open", open);
  };
  document.querySelectorAll("nav a").forEach(
    (a) =>
      (a.onclick = () => {
        document.querySelector("header").classList.remove("nav-open");
        document.querySelector(".menu").setAttribute("aria-expanded", "false");
      }),
  );
  document.querySelector("#search").value = query;
  document.querySelector("#search").oninput = (e) => {
    query = e.target.value;
    drawResults();
  };
  document.querySelectorAll("[data-filter]").forEach(
    (b) =>
      (b.onclick = () => {
        filter = b.dataset.filter;
        drawResults();
      }),
  );
  document.querySelectorAll("[data-subject]").forEach(
    (b) =>
      (b.onclick = () => {
        filter = b.dataset.subject;
        drawResults();
        document.querySelector("#catalogue").scrollIntoView({
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
  document.querySelectorAll("[data-preview]").forEach(
    (b) =>
      (b.onclick = () => {
        document
          .querySelectorAll("[data-preview]")
          .forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
        const img = document.querySelector(".preview-main img");
        img.src = `/assets/${b.dataset.preview}-light.jpg`;
        img.alt = t("Miniatura real: ", "Actual thumbnail: ") + b.textContent;
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
  const normal = (s) =>
    s
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  const items = catalogue.filter(
    (e) =>
      (filter === "all" || e.cat === filter) &&
      normal(e[lang]).includes(normal(query)),
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
            `<article class="result ${e.cat}"><span class="result-icon">${icon(cats[e.cat][2])}</span><div><h4>${e[lang]}</h4><p>${t(cats[e.cat][0], cats[e.cat][1])} <span>· ${e.dim}</span></p></div></article>`,
        )
        .join("")
    : `<p class="empty">${t("Nenhuma experiência encontrada. Tenta outro termo ou outra área.", "No experiences found. Try another term or subject.")}</p>`;
  const b = document.querySelector("#show-all");
  b.hidden = items.length <= 8;
  b.innerHTML =
    (expanded
      ? t("Mostrar menos", "Show less")
      : t("Ver todo o catálogo", "View full catalogue")) + icon("arrow-right");
  createIcons({ icons });
}
render();
