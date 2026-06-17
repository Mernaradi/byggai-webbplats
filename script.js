// main.js
(function () {
  "use strict";

  // ====== Navbar: hamburgermeny (mobil) ======
  const toggleBtn = document.querySelector("[data-menu-toggle]");
  const drawer = document.querySelector("[data-mobile-drawer]");
  if (toggleBtn && drawer) {
    toggleBtn.addEventListener("click", () => {
      const isExpanded = toggleBtn.getAttribute("aria-expanded") === "true";
      toggleBtn.setAttribute("aria-expanded", String(!isExpanded));
      drawer.hidden = isExpanded; // if expanded -> hide, else show
    });

    // Stäng när man klickar på en länk i menyn
    drawer.addEventListener("click", (e) => {
      const link = e.target.closest("a");
      if (!link) return;
      toggleBtn.setAttribute("aria-expanded", "false");
      drawer.hidden = true;
    });

    // Stäng vid ESC
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      if (toggleBtn.getAttribute("aria-expanded") === "true") {
        toggleBtn.setAttribute("aria-expanded", "false");
        drawer.hidden = true;
      }
    });

    // Startläge: stängd
    toggleBtn.setAttribute("aria-expanded", "false");
    drawer.hidden = true;
  }

  // ====== Markera aktiv sida i navbar (aria-current) ======
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll("a[data-navlink]");
  navLinks.forEach((a) => {
    const href = a.getAttribute("href");
    // hantera både /index.html och index.html
    const normalized = href.split("/").pop();
    if (normalized === currentPath) a.setAttribute("aria-current", "page");
  });

  // ====== FAQ accordion ======
  const accItems = document.querySelectorAll(".acc-item");
  accItems.forEach((item) => {
    const btn = item.querySelector(".acc-btn");
    const panel = item.querySelector(".acc-panel");
    if (!btn || !panel) return;

    btn.setAttribute("aria-expanded", "false");
    panel.setAttribute("aria-hidden", "true");
    item.dataset.open = "false";

    btn.addEventListener("click", () => {
      const isOpen = item.dataset.open === "true";
      // stäng alla andra
      accItems.forEach((other) => {
        if (other === item) return;
        other.dataset.open = "false";
        const otherBtn = other.querySelector(".acc-btn");
        const otherPanel = other.querySelector(".acc-panel");
        if (otherBtn) otherBtn.setAttribute("aria-expanded", "false");
        if (otherPanel) {
          otherPanel.style.maxHeight = null;
          otherPanel.setAttribute("aria-hidden", "true");
        }
      });

      // toggle nuvarande
      if (isOpen) {
        item.dataset.open = "false";
        btn.setAttribute("aria-expanded", "false");
        panel.style.maxHeight = null;
        panel.setAttribute("aria-hidden", "true");
      } else {
        item.dataset.open = "true";
        btn.setAttribute("aria-expanded", "true");
        panel.setAttribute("aria-hidden", "false");

        // sätt max-height så att contenten syns smidigt
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });

    // initial: stängda panels
    panel.style.maxHeight = null;
  });

  // ====== Kontaktform: formulärvalidering ======
  const form = document.querySelector("[data-demo-form]");
  if (!form) return;

  const fields = {
    name: form.querySelector("[name='name']"),
    company: form.querySelector("[name='company']"),
    email: form.querySelector("[name='email']"),
    phone: form.querySelector("[name='phone']"),
    topic: form.querySelector("[name='topic']"),
    message: form.querySelector("[name='message']")
  };

  const setInvalid = (input, msgEl, isInvalid) => {
    if (!input || !msgEl) return;
    input.setAttribute("aria-invalid", String(isInvalid));
    msgEl.textContent = msgEl.textContent; // msgEl ska redan ha sin text
    msgEl.style.display = isInvalid ? "block" : "none";
  };

  const getErrorEl = (input) => form.querySelector(`[data-error-for='${input.name}']`);

  const validators = {
    name: (v) => v.trim().length >= 2 ? "" : "Ange ditt namn (minst 2 tecken).",
    company: (v) => v.trim().length >= 2 ? "" : "Ange företagets namn (minst 2 tecken).",
    email: (v) => {
      const s = v.trim();
      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
      return ok ? "" : "Ange en giltig e-postadress.";
    },
    phone: (v) => {
      const s = v.trim();
      if (!s) return ""; // valfri
      const ok = /^[0-9+\s()-]{6,}$/.test(s);
      return ok ? "" : "Ange ett giltigt telefonnummer (minst 6 tecken).";
    },
    topic: (v) => v ? "" : "Välj ett ämne för din förfrågan.",
    message: (v) => v.trim().length >= 10 ? "" : "Skriv ett meddelande (minst 10 tecken)."
  };

  const validateField = (input) => {
    const value = input.value;
    const errorEl = getErrorEl(input);
    const errMsg = validators[input.name] ? validators[input.name](value) : "";

    input.setAttribute("aria-invalid", String(!!errMsg));
    if (errorEl) {
      errorEl.textContent = errMsg;
      errorEl.style.display = errMsg ? "block" : "none";
    }
    return !errMsg;
  };

  Object.values(fields).forEach((input) => {
    if (!input) return;
    // Live-validering när användaren lämnar fältet
    input.addEventListener("blur", () => validateField(input));
    // Rensa error när användaren skriver
    input.addEventListener("input", () => validateField(input));
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    let ok = true;
    Object.values(fields).forEach((input) => {
      if (!input) return;
      // validera endast de vi har regler för
      if (validators[input.name]) ok = validateField(input) && ok;
    });

    const status = form.querySelector("[data-form-status]");
    if (status) {
      status.textContent = ok
        ? "Tack! Vi återkommer inom kort med förslag på nästa steg."
        : "Kolla så att alla obligatoriska fält är ifyllda korrekt.";
      status.style.color = ok ? "rgba(57,217,138,0.95)" : "rgba(255,209,213,0.95)";
    }

    if (ok) form.reset();
  });
})();