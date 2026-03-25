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

  function setYear() {
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }
  }

  function applyTheme(theme) {
    const light = theme === "light";
    body.classList.toggle("light", light);
    themeIcon.textContent = light ? "☾" : "☼";
  }

  function initTheme() {
    const saved = localStorage.getItem("yasmeen-site-theme");
    if (saved === "light" || saved === "dark") {
      applyTheme(saved);
      return;
    }

    const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
    applyTheme(prefersLight ? "light" : "dark");
  }

  function toggleTheme() {
    const nextTheme = body.classList.contains("light") ? "dark" : "light";
    localStorage.setItem("yasmeen-site-theme", nextTheme);
    applyTheme(nextTheme);
  }

  function toggleMenu(forceClose = false) {
    const shouldOpen = forceClose ? false : !navLinks.classList.contains("open");
    navLinks.classList.toggle("open", shouldOpen);
    menuBtn.classList.toggle("open", shouldOpen);
    menuBtn.setAttribute("aria-expanded", String(shouldOpen));
  }

  function updateActiveNav() {
    let current = "";

    sections.forEach((section) => {
      const top = section.offsetTop - 140;
      const height = section.offsetHeight;
      if (window.scrollY >= top && window.scrollY < top + height) {
        current = section.id;
      }
    });

    navAnchors.forEach((link) => {
      const target = link.getAttribute("href").replace("#", "");
      link.classList.toggle("active", target === current);
    });
  }

  function initRevealObserver() {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    reveals.forEach((el) => observer.observe(el));
  }

  function initCursorGlow() {
    if (!cursorGlow) return;

    window.addEventListener("pointermove", (event) => {
      cursorGlow.style.left = `${event.clientX}px`;
      cursorGlow.style.top = `${event.clientY}px`;
    });
  }

  function initTiltCards() {
    tiltCards.forEach((card) => {
      card.addEventListener("mousemove", (event) => {
        const rect = card.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const rotateX = ((y / rect.height) - 0.5) * -7;
        const rotateY = ((x / rect.width) - 0.5) * 7;

        card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
      });
    });
  }

  function bindEvents() {
    themeToggle.addEventListener("click", toggleTheme);

    menuBtn.addEventListener("click", () => toggleMenu());

    navAnchors.forEach((anchor) => {
      anchor.addEventListener("click", () => toggleMenu(true));
    });

    document.addEventListener("click", (event) => {
      const insideMenu = navLinks.contains(event.target);
      const clickedButton = menuBtn.contains(event.target);
      if (!insideMenu && !clickedButton) {
        toggleMenu(true);
      }
    });

    window.addEventListener("scroll", updateActiveNav);
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