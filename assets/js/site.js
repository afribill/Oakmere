/* =========================================================================
   OAKMERE SETTINGS: the only lines you need to edit.
   ========================================================================= */
var OAKMERE_SETTINGS = {
  // MailerLite: paste your form's action URL here (see README, step 7).
  // Leave it empty and the sign-up button opens the visitor's email app
  // with a pre-filled sign-up message to CONTACT_EMAIL, so no sign-up is lost.
  MAILERLITE_FORM_URL: "",

  // Where sign-up emails go while MAILERLITE_FORM_URL is empty.
  CONTACT_EMAIL: "hello@oakmerewoodcare.com",

  // Your Pinterest profile. Used by the "Follow Oakmere on Pinterest" buttons.
  // (The latest-pins strip reads the username set in functions/api/pins.js.)
  PINTEREST_PROFILE_URL: "https://www.pinterest.com/oakmerewoodcare/",

  // Seconds before the 10% pop-up appears.
  POPUP_DELAY_SECONDS: 6
};
/* ========================================================================= */

(function () {
  "use strict";
  var S = OAKMERE_SETTINGS;
  var doc = document.documentElement;
  var store = function (k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } };

  /* Always open a new page at the top (keeps back/forward and #links working) */
  try {
    var navType = (performance.getEntriesByType && performance.getEntriesByType("navigation")[0] || {}).type;
    if (!location.hash && navType !== "back_forward") {
      if ("scrollRestoration" in history) history.scrollRestoration = "manual";
      window.scrollTo(0, 0);
      window.addEventListener("load", function () {
        if (location.hash) return;
        window.scrollTo(0, 0);
        if (window.parent !== window) { try { document.body.scrollIntoView({ block: "start" }); } catch (e) {} }
        var userMoved = false;
        ["wheel", "touchstart", "keydown"].forEach(function (t) { window.addEventListener(t, function () { userMoved = true; }, { once: true, passive: true }); });
        [60, 250, 600].forEach(function (ms) { setTimeout(function () { if (!userMoved && !location.hash) window.scrollTo(0, 0); }, ms); });
      });
    }
  } catch (e) {}

  /* Footer groups: collapsed on phones, open on larger screens */
  var mqFoot = window.matchMedia("(max-width:640px)");
  function setFooter() { document.querySelectorAll(".fcol").forEach(function (d) { d.open = !mqFoot.matches; }); }
  setFooter();
  if (mqFoot.addEventListener) mqFoot.addEventListener("change", setFooter);

  /* Year */
  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* Amazon store: Canadian visitors see Amazon.ca first, everyone else Amazon.com */
  (function () {
    var tz = "";
    try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ""; } catch (e) {}
    var langs = (navigator.languages || [navigator.language || ""]).join(",");
    var ca = /^America\/(Toronto|Montreal|Vancouver|Edmonton|Winnipeg|Regina|Halifax|St_Johns|Moncton|Glace_Bay|Goose_Bay|Whitehorse|Yellowknife|Iqaluit|Dawson_Creek|Dawson|Swift_Current|Rankin_Inlet|Cambridge_Bay|Inuvik|Atikokan|Creston|Fort_Nelson|Thunder_Bay|Nipigon|Rainy_River|Pangnirtung|Resolute|Coral_Harbour|Blanc-Sablon)$/;
    var isCA = ca.test(tz) || /-CA\b/i.test(langs);
    doc.classList.add(isCA ? "store-ca" : "store-us");
  })();

  /* Navigation */
  var menuBtn = document.querySelector(".menu-btn");
  var nav = document.getElementById("nav");
  var header = document.querySelector(".site-header");
  function closeMenu() {
    if (!nav) return;
    nav.classList.remove("open"); document.body.classList.remove("nav-open");
    if (menuBtn) menuBtn.setAttribute("aria-expanded", "false");
  }
  if (menuBtn && nav) {
    menuBtn.addEventListener("click", function () {
      var open = !nav.classList.contains("open");
      if (open) doc.style.setProperty("--navtop", header.getBoundingClientRect().bottom + "px");
      nav.classList.toggle("open", open); document.body.classList.toggle("nav-open", open);
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }
  document.querySelectorAll(".has-sub > .nav-top").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var li = btn.parentElement, open = !li.classList.contains("open");
      document.querySelectorAll(".has-sub.open").forEach(function (o) { if (o !== li) { o.classList.remove("open"); o.firstElementChild.setAttribute("aria-expanded", "false"); } });
      li.classList.toggle("open", open); btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });
  document.addEventListener("click", function (ev) {
    if (window.matchMedia("(min-width:1101px)").matches && !ev.target.closest(".has-sub")) {
      document.querySelectorAll(".has-sub.open").forEach(function (o) { o.classList.remove("open"); o.firstElementChild.setAttribute("aria-expanded", "false"); });
    }
  });
  document.addEventListener("keydown", function (ev) {
    if (ev.key !== "Escape") return;
    document.querySelectorAll(".has-sub.open").forEach(function (o) { o.classList.remove("open"); o.firstElementChild.setAttribute("aria-expanded", "false"); });
    if (nav && nav.classList.contains("open")) { closeMenu(); menuBtn.focus(); }
  });
  window.addEventListener("resize", function () { if (window.innerWidth > 1100) closeMenu(); });

  /* Tabs */
  document.querySelectorAll("[role=tablist]").forEach(function (list) {
    var tabs = Array.prototype.slice.call(list.querySelectorAll("[role=tab]"));
    function sel(t, focus) {
      tabs.forEach(function (b) {
        var on = b === t; b.setAttribute("aria-selected", on); b.tabIndex = on ? 0 : -1;
        document.getElementById(b.getAttribute("aria-controls")).hidden = !on;
      });
      if (focus) t.focus();
    }
    tabs.forEach(function (b, i) {
      b.addEventListener("click", function () { sel(b); });
      b.addEventListener("keydown", function (e) {
        if (e.key === "ArrowRight") sel(tabs[(i + 1) % tabs.length], true);
        if (e.key === "ArrowLeft") sel(tabs[(i - 1 + tabs.length) % tabs.length], true);
      });
    });
  });

  /* Product gallery */
  document.querySelectorAll("[data-gallery]").forEach(function (g) {
    var main = g.querySelector(".gallery-main");
    g.querySelectorAll(".thumbs button").forEach(function (b) {
      b.addEventListener("click", function () {
        var tpl = b.querySelector("template");
        var pin = main.querySelector(".pin-save");
        main.innerHTML = tpl.innerHTML; if (pin) main.appendChild(pin);
        g.querySelectorAll(".thumbs button").forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
      });
    });
  });

  /* Pinterest strip: Oakmere's latest pins, moving slowly from left to right.
     /api/pins (a small Cloudflare function in /functions) reads the public Pinterest feed.
     If it returns nothing, the strip keeps showing the pins built into the page. */
  var marquees = document.querySelectorAll("[data-pin-marquee]");
  function fillTrack(track) {
    // Repeat the cards until the strip is wider than two screens, then double it for a seamless loop.
    var cards = Array.prototype.slice.call(track.children);
    if (!cards.length) return;
    var guard = 0;
    while (track.scrollWidth < window.innerWidth * 2 && guard++ < 6) {
      cards.forEach(function (c) { track.appendChild(c.cloneNode(true)); });
    }
    Array.prototype.slice.call(track.children).forEach(function (c) {
      var d = c.cloneNode(true); d.setAttribute("aria-hidden", "true"); d.tabIndex = -1; track.appendChild(d);
    });
    track.style.setProperty("--pin-dur", Math.max(40, Math.round(track.scrollWidth / 2 / 28)) + "s");
  }
  function showPins(pins) {
    marquees.forEach(function (m) {
      var track = m.querySelector(".pin-track");
      track.innerHTML = "";
      pins.forEach(function (p) {
        var a = document.createElement("a");
        a.className = "pin-card"; a.href = p.link; a.target = "_blank"; a.rel = "noopener";
        var img = document.createElement("img");
        img.src = p.image; img.alt = p.title; img.loading = "lazy"; img.decoding = "async"; img.width = 236; img.height = 354;
        a.appendChild(img); track.appendChild(a);
      });
      fillTrack(track);
    });
  }
  if (marquees.length) {
    marquees.forEach(function (m) {
      fillTrack(m.querySelector(".pin-track"));
      m.addEventListener("touchstart", function () { m.classList.add("paused"); }, { passive: true });
      m.addEventListener("touchend", function () { setTimeout(function () { m.classList.remove("paused"); }, 2500); });
    });
    if (window.fetch && /^https?:$/.test(location.protocol)) {
      fetch("/api/pins", { headers: { Accept: "application/json" } })
        .then(function (r) { return r.ok && /json/.test(r.headers.get("content-type") || "") ? r.json() : null; })
        .then(function (d) {
          var ok = d && Array.isArray(d.pins) ? d.pins.filter(function (p) {
            return p && /^https:\/\/([a-z]+\.)?pinterest\.[a-z.]+\/pin\//i.test(p.link) && /^https:\/\/i\.pinimg\.com\//i.test(p.image);
          }) : [];
          if (ok.length >= 4) showPins(ok);
        })
        .catch(function () {});
    }
  }
  var pinFollow = /^https:\/\/(([a-z]+\.)?pinterest\.[a-z.]+|pin\.it)\//i.test(S.PINTEREST_PROFILE_URL) ? S.PINTEREST_PROFILE_URL : "";
  if (pinFollow) document.querySelectorAll("[data-pin-follow]").forEach(function (a) { a.href = pinFollow; });

  /* Email sign-up */
  var DONE_KEY = "oakmere_signup_done";
  function validEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); }
  document.querySelectorAll("form[data-signup]").forEach(function (form) {
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var input = form.querySelector("input[type=email]");
      var msg = form.querySelector(".form-msg");
      var email = (input.value || "").trim();
      if (!validEmail(email)) { msg.textContent = "Please enter a valid email address."; input.focus(); return; }
      var finish = function (text) {
        msg.textContent = text; store(DONE_KEY, "1"); input.value = "";
        var dlg = form.closest("dialog"); if (dlg) setTimeout(function () { dlg.close(); }, 2200);
      };
      if (S.MAILERLITE_FORM_URL && S.MAILERLITE_FORM_URL.indexOf("http") === 0) {
        var fd = new FormData();
        fd.append("fields[email]", email); fd.append("ml-submit", "1"); fd.append("anticsrf", "true");
        fetch(S.MAILERLITE_FORM_URL, { method: "POST", body: fd, mode: "no-cors" })
          .then(function () { finish("Thanks! Check your inbox to confirm and get your 10% code."); })
          .catch(function () { msg.textContent = "Something went wrong. Please try again."; });
      } else if (S.CONTACT_EMAIL && S.CONTACT_EMAIL.indexOf("@") > 0) {
        var subject = "Oakmere email sign-up: 10% off + wood care tips";
        var body = "Please add me to the Oakmere Wood Care email list.\n\nEmail: " + email +
          "\n\nI agree to receive emails from Oakmere Wood Care (Denejo Inc.) with offers and wood care tips. I can unsubscribe anytime.";
        window.location.href = "mailto:" + S.CONTACT_EMAIL + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
        finish("Your email app opened with your sign-up. Press send to finish.");
      } else {
        msg.textContent = "Sign-up is not available yet. Please check back soon.";
      }
    });
  });

  /* Pop-up: once per visitor, closes for good when dismissed or submitted */
  var dlg = document.getElementById("signup-popup");
  var path = location.pathname;
  var skip = /^\/(privacy|contact)\/?$/.test(path) || store(DONE_KEY) === "1";
  if (dlg && typeof dlg.showModal === "function") {
    dlg.querySelectorAll("[data-close]").forEach(function (b) { b.addEventListener("click", function () { dlg.close(); }); });
    dlg.addEventListener("close", function () { store(DONE_KEY, "1"); });
    dlg.addEventListener("click", function (ev) { if (ev.target === dlg) dlg.close(); });
    if (!skip) {
      setTimeout(function () {
        if (store(DONE_KEY) === "1" || document.querySelector("dialog[open]") || (nav && nav.classList.contains("open"))) return;
        dlg.showModal();
      }, (S.POPUP_DELAY_SECONDS || 6) * 1000);
    }
  }
})();
