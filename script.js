// ===== FitZone - Main Script =====

document.addEventListener("DOMContentLoaded", () => {
  initLoader();
  initTheme();
  initNavbar();
  initMobileMenu();
  initSmoothScroll();
  initReveal();
  initCounters();
  initFaq();
  initBmi();
  initContactForm();
  initBackToTop();
  setYear();
});

// ----- Loading Screen -----
function initLoader() {
  const loader = document.getElementById("loader");
  if (!loader) return;
  window.addEventListener("load", () => {
    setTimeout(() => loader.classList.add("hidden"), 600);
  });
  setTimeout(() => loader.classList.add("hidden"), 2500);
}

// ----- Dark / Light Mode -----
function initTheme() {
  const toggle = document.getElementById("themeToggle");
  const icon = toggle ? toggle.querySelector("i") : null;
  if (!toggle) return;

  const stored = localStorage.getItem("fitzone-theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const theme = stored || (prefersDark ? "dark" : "light");
  applyTheme(theme);

  toggle.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme") || "light";
    applyTheme(current === "dark" ? "light" : "dark");
  });

  function applyTheme(t) {
    document.documentElement.setAttribute("data-theme", t);
    localStorage.setItem("fitzone-theme", t);
    if (icon) {
      icon.className = t === "dark" ? "fa-solid fa-sun" : "fa-solid fa-moon";
    }
  }
}

// ----- Navbar scroll state -----
function initNavbar() {
  const navbar = document.getElementById("navbar");
  if (!navbar) return;
  const onScroll = () => {
    if (window.scrollY > 30) navbar.classList.add("scrolled");
    else navbar.classList.remove("scrolled");
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

// ----- Mobile menu -----
function initMobileMenu() {
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");
  if (!hamburger || !navLinks) return;

  const toggleMenu = () => {
    hamburger.classList.toggle("active");
    navLinks.classList.toggle("open");
  };

  hamburger.addEventListener("click", toggleMenu);
  navLinks.querySelectorAll("a").forEach((link) =>
    link.addEventListener("click", () => {
      hamburger.classList.remove("active");
      navLinks.classList.remove("open");
    })
  );
}

// ----- Smooth scrolling (native fallback + active highlight) -----
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const id = anchor.getAttribute("href");
      if (id === "#" || id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

// ----- Scroll reveal -----
function initReveal() {
  const els = document.querySelectorAll(".reveal");
  if (!els.length) return;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -50px 0px" }
  );
  els.forEach((el) => observer.observe(el));
}

// ----- Animated counters -----
function initCounters() {
  const stats = document.querySelectorAll(".stat-num");
  if (!stats.length) return;
  let started = false;

  const run = () => {
    stats.forEach((el) => {
      const target = parseInt(el.dataset.target, 10);
      const duration = 1800;
      const startTime = performance.now();
      const tick = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target);
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = target;
      };
      requestAnimationFrame(tick);
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !started) {
          started = true;
          run();
          observer.disconnect();
        }
      });
    },
    { threshold: 0.5 }
  );
  const heroStats = document.querySelector(".hero-stats");
  if (heroStats) observer.observe(heroStats);
}

// ----- FAQ accordion -----
function initFaq() {
  const items = document.querySelectorAll(".faq-item");
  if (!items.length) return;

  items.forEach((item) => {
    const question = item.querySelector(".faq-question");
    question.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");
      items.forEach((i) => i.classList.remove("open"));
      if (!isOpen) item.classList.add("open");
    });
  });
}

// ----- BMI Calculator -----
function initBmi() {
  const calcBtn = document.getElementById("calcBmi");
  if (!calcBtn) return;

  const heightInput = document.getElementById("height");
  const weightInput = document.getElementById("weight");
  const errorEl = document.getElementById("bmiError");
  const resultEl = document.getElementById("bmiResult");
  const valueEl = document.getElementById("bmiValue");
  const categoryEl = document.getElementById("bmiCategory");
  const barFill = document.getElementById("bmiBarFill");
  const cats = document.querySelectorAll(".bmi-cat");

  calcBtn.addEventListener("click", () => {
    const h = parseFloat(heightInput.value);
    const w = parseFloat(weightInput.value);

    if (!h || !w || h <= 0 || w <= 0) {
      errorEl.textContent = "Please enter valid height and weight.";
      resultEl.hidden = true;
      return;
    }
    errorEl.textContent = "";

    const m = h / 100;
    const bmi = Math.round((w / (m * m)) * 10) / 10;

    let category, cls, percent;
    if (bmi < 18.5) { category = "Underweight"; cls = "underweight"; percent = 25; }
    else if (bmi < 25) { category = "Normal"; cls = "normal"; percent = 50; }
    else if (bmi < 30) { category = "Overweight"; cls = "overweight"; percent = 75; }
    else { category = "Obese"; cls = "obese"; percent = 100; }

    valueEl.textContent = bmi;
    categoryEl.textContent = category;
    resultEl.hidden = false;
    resultEl.className = "bmi-result " + cls;

    cats.forEach((c) => {
      c.classList.toggle("active", c.dataset.cat === category);
    });

    barFill.style.width = Math.min((bmi / 40) * 100, 100) + "%";
  });
}

// ----- Contact form validation -----
function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const fields = {
    name: { el: document.getElementById("name"), validate: (v) => v.trim() !== "" || "Please enter your name." },
    email: {
      el: document.getElementById("email"),
      validate: (v) =>
        (v.trim() !== "" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) ||
        "Please enter a valid email.",
    },
    phone: {
      el: document.getElementById("phone"),
      validate: (v) =>
        (v.trim() !== "" && /^[0-9+\-\s()]{7,15}$/.test(v)) ||
        "Please enter a valid phone number.",
    },
    message: { el: document.getElementById("message"), validate: (v) => v.trim() !== "" || "Please enter a message." },
  };

  const successMsg = document.getElementById("successMsg");

  Object.keys(fields).forEach((key) => {
    fields[key].el.addEventListener("input", () => {
      const err = form.querySelector(`[data-error="${key}"]`);
      if (err.textContent) err.textContent = "";
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let valid = true;

    Object.keys(fields).forEach((key) => {
      const { el, validate } = fields[key];
      const err = form.querySelector(`[data-error="${key}"]`);
      const result = validate(el.value);
      if (result !== true) {
        err.textContent = result;
        valid = false;
      } else {
        err.textContent = "";
      }
    });

    if (!valid) return;

    successMsg.hidden = false;
    form.reset();
    setTimeout(() => (successMsg.hidden = true), 5000);
  });
}

// ----- Back to top -----
function initBackToTop() {
  const btn = document.getElementById("backToTop");
  if (!btn) return;
  window.addEventListener("scroll", () => {
    btn.classList.toggle("show", window.scrollY > 500);
  }, { passive: true });
  btn.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" })
  );
}

// ----- Footer year -----
function setYear() {
  const el = document.getElementById("year");
  if (el) el.textContent = new Date().getFullYear();
}
