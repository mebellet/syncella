// SyncElla – kleine Interaktionen (Menü, Header, Abschnittspunkte, Einblenden)
(function () {
  "use strict";

  var body = document.body;
  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".menu-toggle");
  var menu = document.getElementById("menu");

  // ---------- Menü ----------
  function setMenu(open) {
    body.classList.toggle("menu-open", open);
    if (!toggle || !menu) return;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.querySelector(".label").textContent = open ? "Schließen" : "Menü";
    menu.setAttribute("aria-hidden", String(!open));
    document.documentElement.style.overflow = open ? "hidden" : "";
    if (open) {
      var first = menu.querySelector("a");
      if (first) setTimeout(function () { first.focus(); }, 300);
    }
  }
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      setMenu(!body.classList.contains("menu-open"));
    });
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMenu(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && body.classList.contains("menu-open")) {
        setMenu(false);
        toggle.focus();
      }
    });
  }

  // ---------- Header-Hintergrund beim Scrollen ----------
  function onScroll() {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 24);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // ---------- Jahr im Footer ----------
  var y = document.querySelector("[data-year]");
  if (y) y.textContent = new Date().getFullYear();

  if (!("IntersectionObserver" in window)) {
    document.querySelectorAll(".reveal, .panel").forEach(function (el) {
      el.classList.add("is-visible");
    });
    return;
  }

  // ---------- Einblenden der Felder ----------
  var revealObs = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );
  document.querySelectorAll(".panel").forEach(function (p) {
    revealObs.observe(p);
  });

  // ---------- Aktiver Abschnitt (Punkte, Menü, Header-Farbe) ----------
  var panels = Array.prototype.slice.call(document.querySelectorAll(".panel[id]"));
  var dotLinks = document.querySelectorAll(".dots a, .nav-inline a");

  function setActive(id, dark) {
    dotLinks.forEach(function (a) {
      a.setAttribute("aria-current", a.getAttribute("href") === "#" + id ? "true" : "false");
    });
    body.classList.toggle("on-dark-dots", dark);
    if (header) header.classList.toggle("on-dark", dark);
  }

  var activeObs = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          setActive(entry.target.id, entry.target.hasAttribute("data-dark"));
        }
      });
    },
    { rootMargin: "-50% 0px -50% 0px", threshold: 0 }
  );
  panels.forEach(function (p) {
    activeObs.observe(p);
  });

  // Über dem hellen Footer wieder dunkle Punkte zeigen
  var footer = document.querySelector(".site-footer");
  if (footer) {
    new IntersectionObserver(
      function (entries) {
        if (entries[0].isIntersecting) {
          body.classList.remove("on-dark-dots");
          if (header) header.classList.remove("on-dark");
        }
      },
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 }
    ).observe(footer);
  }
})();
