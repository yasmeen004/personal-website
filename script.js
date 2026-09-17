(() => {
  const body = document.body;
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");
  const menuBtn = document.getElementById("menuBtn");
  const navLinks = document.getElementById("navLinks");
  const reveals = document.querySelectorAll(".reveal");
  const sections = document.querySelectorAll("main section[id]");
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
  const yearEl = document.getElementById("year");
  const cursorGlow = document.querySelector(".cursor-glow");
  const tiltCards = document.querySelectorAll(".tilt-card");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const precisePointer = window.matchMedia("(pointer: fine)").matches;

  function setYear() {
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  function applyTheme(theme) {
    const light = theme === "light";
    body.classList.toggle("light", light);
    if (themeIcon) themeIcon.textContent = light ? "☾" : "☼";
    if (themeToggle) themeToggle.setAttribute("aria-label", light ? "Switch to dark theme" : "Switch to light theme");
  }

  function initTheme() {
    const saved = localStorage.getItem("yasmeen-site-theme");
    if (saved === "light" || saved === "dark") {
      applyTheme(saved);
      return;
    }
    applyTheme(window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
  }

  function toggleTheme() {
    const nextTheme = body.classList.contains("light") ? "dark" : "light";
    localStorage.setItem("yasmeen-site-theme", nextTheme);
    applyTheme(nextTheme);
  }

  function toggleMenu(forceClose = false) {
    if (!navLinks || !menuBtn) return;
    const shouldOpen = forceClose ? false : !navLinks.classList.contains("open");
    navLinks.classList.toggle("open", shouldOpen);
    menuBtn.classList.toggle("open", shouldOpen);
    menuBtn.setAttribute("aria-expanded", String(shouldOpen));
  }

  function updateActiveNav() {
    let current = "";
    sections.forEach((section) => {
      const top = section.offsetTop - 160;
      if (window.scrollY >= top && window.scrollY < top + section.offsetHeight) current = section.id;
    });
    navAnchors.forEach((link) => {
      const target = link.getAttribute("href").replace("#", "");
      link.classList.toggle("active", target === current);
    });
  }

  function initRevealObserver() {
    if (reduceMotion || !("IntersectionObserver" in window)) {
      reveals.forEach((element) => element.classList.add("visible"));
      return;
    }
    const observer = new IntersectionObserver((entries, instance) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          instance.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach((element) => observer.observe(element));
  }

  function initCursorGlow() {
    if (!cursorGlow || !precisePointer || reduceMotion) return;
    window.addEventListener("pointermove", (event) => {
      cursorGlow.style.left = `${event.clientX}px`;
      cursorGlow.style.top = `${event.clientY}px`;
    }, { passive: true });
  }

  function initTiltCards() {
    if (!precisePointer || reduceMotion) return;
    tiltCards.forEach((card) => {
      card.addEventListener("mousemove", (event) => {
        const rect = card.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const rotateX = ((y / rect.height) - 0.5) * -5;
        const rotateY = ((x / rect.width) - 0.5) * 5;
        card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
      });
      card.addEventListener("mouseleave", () => { card.style.transform = ""; });
    });
  }

  function bindEvents() {
    if (themeToggle) themeToggle.addEventListener("click", toggleTheme);
    if (menuBtn) menuBtn.addEventListener("click", () => toggleMenu());
    navAnchors.forEach((anchor) => anchor.addEventListener("click", () => toggleMenu(true)));

    document.addEventListener("click", (event) => {
      if (!navLinks || !menuBtn) return;
      if (!navLinks.contains(event.target) && !menuBtn.contains(event.target)) toggleMenu(true);
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") toggleMenu(true);
    });
    window.addEventListener("scroll", updateActiveNav, { passive: true });
    window.addEventListener("resize", updateActiveNav);
    window.addEventListener("load", updateActiveNav);
  }

  setYear();
  initTheme();
  initRevealObserver();
  initCursorGlow();
  initTiltCards();
  bindEvents();
})();
