/* Preview runtime: plain-script ports of the site's client behaviour (header, menu, accordions,
   segmented controls, form validation, the ident) plus a hash router that shows one page at a
   time. Forms send nothing from the preview. */
(function () {
  "use strict";
  var cfg = JSON.parse(document.getElementById("preview-config").textContent);
  var root = document.documentElement;
  root.classList.add("site");
  if (!root.lang) root.lang = "en";
  // The host may stamp its own theme choice on the root; the site themes its sections itself.
  var untheme = function () { if (root.hasAttribute("data-theme")) root.removeAttribute("data-theme"); };
  untheme();
  if (window.MutationObserver) new MutationObserver(untheme).observe(root, { attributes: true, attributeFilter: ["data-theme"] });

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = function () { return window.matchMedia("(hover: hover) and (pointer: fine)").matches; };
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  // ---- pages -------------------------------------------------------------------------------
  var mains = $$("main[data-page]");
  var bySlug = {};
  mains.forEach(function (m) { bySlug[m.getAttribute("data-page")] = m; });
  var titles = {};
  cfg.pages.forEach(function (p) { titles[p.slug] = p.title; });
  var current = null;
  var header = $(".c-header");
  var menu = $(".c-menu");
  var burger = $(".c-header__burger", header);

  function parseHash() {
    var h = (location.hash || "").replace(/^#/, "");
    if (!h || h === "main") return { slug: "home", section: null };
    var i = h.indexOf(".");
    var slug = i === -1 ? h : h.slice(0, i);
    var section = i === -1 ? null : h.slice(i + 1);
    if (!bySlug[slug]) return { slug: "home", section: null };
    return { slug: slug, section: section };
  }
  function engine() { return window.ScrollCraft && window.ScrollCraft.instances && window.ScrollCraft.instances[0]; }
  function relayout() { var e = engine(); if (e) e.layout(); }
  function setActive(slug) {
    var parent = slug === "engine-360" ? "engines" : slug;
    $$(".c-header a[href^='#'], .c-menu a[href^='#']").forEach(function (a) {
      var h = a.getAttribute("href").slice(1);
      var page = h.split(".")[0];
      var hasSection = h.indexOf(".") !== -1;
      var isCurrent = page === "home" ? slug === "home" : page === slug || page === parent;
      if (isCurrent && !hasSection) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
      if (a.classList.contains("c-navlink")) a.classList.toggle("is-active", isCurrent);
    });
  }
  function scrollTarget(slug, section, changed) {
    var target = section ? document.getElementById(slug + "." + section) : null;
    if (target) target.scrollIntoView({ block: "start", behavior: "instant" });
    else if (changed) window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }
  function show(slug, section, opts) {
    opts = opts || {};
    var changed = current !== slug;
    if (changed) { closeMenu(); closeDropdown(); }
    var swap = function () {
      mains.forEach(function (m) { m.hidden = m.getAttribute("data-page") !== slug; });
      current = slug;
      document.title = titles[slug] || document.title;
      setActive(slug);
      relayout();
      if (!opts.noScroll) { scrollTarget(slug, section, changed); headerReset(); }
      if (changed && !section && !opts.first) bySlug[slug].focus({ preventScroll: true });
      segmentedAll();
      headerUpdate();
      footerMeasure();
    };
    if (changed && !reduce && !opts.first && document.startViewTransition) {
      var vt = document.startViewTransition(swap);
      vt.finished.then(relayout, relayout);
    } else {
      swap();
    }
  }

  // ---- header: scroll state and section theme -----------------------------------------------
  var headerUpdate = function () {};
  var headerReset = function () {};
  (function () {
    var lastY = window.scrollY, ticking = false;
    var logo = $(".c-header__logo", header);
    var update = function () {
      ticking = false;
      var y = window.scrollY;
      header.classList.toggle("is-scrolled", y > 16);
      var goingDown = y > lastY + 4, goingUp = y < lastY - 4;
      if (!header.classList.contains("is-menu-open") && !header.classList.contains("has-dropdown")) {
        if (goingDown && y > 360) header.classList.add("is-hidden");
        else if (goingUp || y < 120) header.classList.remove("is-hidden");
      }
      lastY = y;
      // What is under the logo decides (a navy board on a light section still gets the white
      // logo); a photograph in a light section counts as dark. Same rule as SiteHeader.tsx.
      var r = logo ? logo.getBoundingClientRect() : null;
      var px = r ? Math.min(Math.max(r.left + r.width / 2, 0), window.innerWidth - 1) : 24;
      var py = r ? Math.max(1, r.top + r.height / 2) : 40;
      var els = document.elementsFromPoint(px, py);
      var beneath = null;
      for (var i = 0; i < els.length; i++) {
        if (!header.contains(els[i]) && !els[i].closest(".c-menu")) { beneath = els[i]; break; }
      }
      var themedEl = beneath && beneath.closest("[data-theme]");
      var themed = (themedEl && themedEl.getAttribute("data-theme")) || "light";
      var theme = themed === "light" && beneath && beneath.closest("img, video, .c-media") ? "dark" : themed;
      if (header.getAttribute("data-theme") !== theme) header.setAttribute("data-theme", theme);
    };
    var onScroll = function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    headerUpdate = update;
    headerReset = function () { lastY = window.scrollY; header.classList.remove("is-hidden"); };
  })();

  // ---- header: dropdowns ------------------------------------------------------------------------
  var dropdownOpen = null, closingTimer = null;
  function openDropdown(group) {
    if (closingTimer) { clearTimeout(closingTimer); closingTimer = null; }
    if (dropdownOpen && dropdownOpen !== group) closeDropdown();
    dropdownOpen = group;
    var panel = $(".t-dropdown", group), toggle = $(".c-navgroup__toggle", group);
    panel.classList.remove("is-closing");
    panel.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    $$(".c-dropdown__link", panel).forEach(function (a) { a.tabIndex = 0; });
    header.classList.add("has-dropdown");
  }
  function closeDropdown() {
    var group = dropdownOpen;
    if (!group) return;
    dropdownOpen = null;
    var panel = $(".t-dropdown", group), toggle = $(".c-navgroup__toggle", group);
    panel.classList.remove("is-open");
    panel.classList.add("is-closing");
    setTimeout(function () { panel.classList.remove("is-closing"); }, 160);
    toggle.setAttribute("aria-expanded", "false");
    $$(".c-dropdown__link", panel).forEach(function (a) { a.tabIndex = -1; });
    header.classList.remove("has-dropdown");
  }
  $$(".c-navgroup", header).forEach(function (group) {
    group.addEventListener("pointerenter", function () { if (fine()) openDropdown(group); });
    group.addEventListener("pointerleave", function () { if (fine()) closingTimer = setTimeout(closeDropdown, 120); });
    group.addEventListener("focusout", function (e) { if (!group.contains(e.relatedTarget)) closeDropdown(); });
    $(".c-navgroup__toggle", group).addEventListener("click", function () {
      if (dropdownOpen === group) closeDropdown(); else openDropdown(group);
    });
  });
  header.addEventListener("click", function (e) { if (e.target.closest(".c-dropdown__link")) closeDropdown(); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && dropdownOpen) { var g = dropdownOpen; closeDropdown(); $(".c-navgroup__toggle", g).focus(); }
  });
  document.addEventListener("pointerdown", function (e) { if (dropdownOpen && !e.target.closest(".c-navgroup")) closeDropdown(); });

  // ---- header: mobile panel ---------------------------------------------------------------------
  var menuOpen = false;
  var menuHideTimer = 0;
  function focusables() { return $$('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])', menu); }
  function onMenuKey(e) {
    if (e.key === "Escape") { closeMenu(); burger.focus(); }
    if (e.key === "Tab") {
      var all = [burger].concat(focusables());
      var idx = all.indexOf(document.activeElement);
      if (e.shiftKey && idx <= 0) { e.preventDefault(); all[all.length - 1].focus(); }
      else if (!e.shiftKey && idx === all.length - 1) { e.preventDefault(); all[0].focus(); }
    }
  }
  function setMenu(open) {
    menuOpen = open;
    root.classList.toggle("is-menu-open", open);
    header.classList.toggle("is-menu-open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    $(".t-icon-swap", burger).setAttribute("data-state", open ? "b" : "a");
    menu.setAttribute("data-open", String(open));
    clearTimeout(menuHideTimer);
    if (open) menu.hidden = false;
    else menuHideTimer = setTimeout(function () { if (!menuOpen) menu.hidden = true; }, 420);
    if (open) {
      menu.setAttribute("aria-modal", "true");
      header.classList.remove("is-hidden");
      var f = focusables()[0];
      if (f) f.focus({ preventScroll: true });
      document.addEventListener("keydown", onMenuKey);
    } else {
      menu.removeAttribute("aria-modal");
      document.removeEventListener("keydown", onMenuKey);
    }
  }
  function closeMenu() { if (menuOpen) setMenu(false); }
  burger.addEventListener("click", function () { setMenu(!menuOpen); });
  menu.addEventListener("click", function (e) { if (e.target.closest("a[href]")) closeMenu(); });

  // ---- accordions (menu groups and page disclosures) ------------------------------------------
  document.addEventListener("click", function (e) {
    var btn = e.target.closest(".c-menu__toggle, .c-acc__button");
    if (!btn) return;
    var acc = btn.closest(".t-acc");
    var open = acc.getAttribute("data-open") !== "true";
    acc.setAttribute("data-open", String(open));
    btn.setAttribute("aria-expanded", String(open));
    if (btn.classList.contains("c-menu__toggle")) $$(".c-menu__sub a", acc).forEach(function (a) { a.tabIndex = open ? 0 : -1; });
  });

  // ---- skip link ------------------------------------------------------------------------------
  $(".c-skip").addEventListener("click", function (e) {
    e.preventDefault();
    var m = bySlug[current];
    m.scrollIntoView({ block: "start", behavior: "instant" });
    m.focus({ preventScroll: true });
  });

  // ---- segmented controls -----------------------------------------------------------------------
  function segmented(bar, animate) {
    var pill = $(".t-tabs-pill", bar);
    if (!pill) return;
    var active = null;
    $$(".t-tab", bar).forEach(function (t) { var i = $("input", t); if (i && i.checked) active = t; });
    if (!active) { pill.style.width = "0px"; return; }
    var prev = pill.style.transition;
    if (!animate) pill.style.transition = "none";
    pill.style.transform = "translateX(" + active.offsetLeft + "px)";
    pill.style.width = active.offsetWidth + "px";
    if (!animate) { void pill.offsetWidth; pill.style.transition = prev; }
  }
  function segmentedAll() { $$("main:not([hidden]) .c-segmented").forEach(function (b) { segmented(b, false); }); }
  window.addEventListener("resize", segmentedAll);

  // ---- forms ----------------------------------------------------------------------------------------
  var EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  function valueOf(form, name) {
    var els = form.elements[name];
    if (!els) return "";
    if (typeof RadioNodeList !== "undefined" && els instanceof RadioNodeList) return els.value || "";
    return String(els.value || "").trim();
  }
  function conditional(form) {
    $$("[data-show-when]", form).forEach(function (wrap) {
      var on = valueOf(form, wrap.getAttribute("data-show-when")) === wrap.getAttribute("data-show-equals");
      wrap.hidden = !on;
    });
  }
  function setError(wrap, msg) {
    wrap.classList.toggle("is-error", !!msg);
    var errP = $(".c-field__error", wrap), hintP = $(".c-field__hint", wrap);
    if (errP) errP.textContent = msg;
    var control = $(".c-segmented", wrap) || $("input, select, textarea", wrap);
    if (!control) return;
    if (msg) control.setAttribute("aria-invalid", "true"); else control.removeAttribute("aria-invalid");
    if (control.classList.contains("c-segmented")) control.classList.toggle("is-invalid", !!msg);
    var described = [msg && errP ? errP.id : "", hintP ? hintP.id : ""].filter(Boolean).join(" ");
    if (described) control.setAttribute("aria-describedby", described); else control.removeAttribute("aria-describedby");
  }
  function shake(wrap) {
    var el = $(".t-input, .c-segmented, .c-check", wrap);
    if (!el) return;
    el.classList.remove("is-shaking");
    void el.offsetWidth;
    el.classList.add("is-shaking");
    setTimeout(function () { el.classList.remove("is-shaking"); }, 320);
  }
  document.addEventListener("change", function (e) {
    var bar = e.target.closest(".c-segmented");
    if (bar) segmented(bar, true);
    var form = e.target.closest("form.c-form");
    if (form) conditional(form);
  });
  $$("form.c-form").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var errors = [];
      $$(".c-field[data-field]", form).forEach(function (wrap) {
        if (wrap.hidden) return;
        var name = wrap.getAttribute("data-field");
        var msg = "";
        if (name === "consent") {
          var cb = form.elements.consent;
          if (!cb || !cb.checked) msg = "Please tick the consent box so that we may reply.";
        } else {
          var labelText = ($(".c-field__label", wrap) || {}).textContent || "";
          var label = labelText.replace(/\(optional\)/, "").replace(/\s+/g, " ").trim().toLowerCase();
          var required = !/\(optional\)/.test(labelText);
          var seg = $(".c-segmented", wrap);
          var control = seg ? null : $("input, select, textarea", wrap);
          var type = seg ? "segmented" : control && control.tagName === "SELECT" ? "select" : control ? control.type : "text";
          var val = valueOf(form, name);
          if (required && !val) msg = (type === "select" || type === "segmented" ? "Please choose " : "Please fill in ") + label + ".";
          else if (type === "email" && val && !EMAIL.test(val)) msg = "Please enter a valid email address.";
        }
        setError(wrap, msg);
        if (msg) errors.push(wrap);
      });
      var status = $(".c-form__status", form);
      if (errors.length) {
        if (status) status.remove();
        shake(errors[0]);
        var f = $("input, select, textarea", errors[0]);
        if (f) f.focus();
        return;
      }
      var slug = form.closest("main[data-page]").getAttribute("data-page");
      var inbox = cfg.inbox[slug] || "hello@flighthoursolution.com";
      if (!status) { status = document.createElement("div"); status.className = "c-form__status"; status.setAttribute("role", "status"); form.appendChild(status); }
      status.innerHTML = "";
      var p = document.createElement("p");
      p.textContent = "This is a preview, so nothing was sent. On the live site this request goes to " + inbox + ".";
      status.appendChild(p);
    });
  });

  // ---- ident ------------------------------------------------------------------------------------------
  var N = 240;
  $$(".c-ident").forEach(function (svg) {
    var plane = $(".c-ident__plane", svg), centre = $(".c-ident__centre", svg), act = svg.closest("[data-sc-act]");
    if (!plane || !centre) return;
    if (reduce || !act) { svg.style.setProperty("--ident-p", "1"); return; }
    var ax = cfg.identEnd[0], ay = cfg.identEnd[1];
    var pts = null, ang = null, rest = 0, last = -1, raf = 0, visible = true;
    var build = function () {
      var L = centre.getTotalLength();
      if (!L) return false;
      pts = [];
      for (var i = 0; i <= N; i++) { var q = centre.getPointAtLength((L * i) / N); pts.push([q.x, q.y]); }
      ang = pts.map(function (_, i) {
        var a = pts[Math.max(0, i - 1)], b = pts[Math.min(N, i + 1)];
        return (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI;
      });
      rest = ang[N];
      return true;
    };
    var place = function (p) {
      var f = Math.max(0, Math.min(1, p)) * N, i = Math.floor(f), j = Math.min(N, i + 1), t = f - i;
      var x = pts[i][0] + (pts[j][0] - pts[i][0]) * t, y = pts[i][1] + (pts[j][1] - pts[i][1]) * t;
      var a = ang[i] + (ang[j] - ang[i]) * t;
      plane.setAttribute("transform", "translate(" + (x - ax).toFixed(2) + " " + (y - ay).toFixed(2) + ") rotate(" + (a - rest).toFixed(2) + " " + ax + " " + ay + ")");
    };
    var tick = function () {
      raf = 0;
      if (!pts && !build()) { if (visible) raf = requestAnimationFrame(tick); return; }
      var v = parseFloat(act.style.getPropertyValue("--sc-p"));
      var p = isFinite(v) ? v : 0;
      if (p !== last) {
        last = p;
        var eff = 0.1 + 0.9 * Math.max(0, Math.min(1, p));
        svg.style.setProperty("--ident-p", eff.toFixed(4));
        place(eff);
      }
      if (visible) raf = requestAnimationFrame(tick);
    };
    var io = new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(tick);
    });
    io.observe(svg);
    svg.style.setProperty("--ident-p", "0.1");
    raf = requestAnimationFrame(tick);
  });

  // ---- footer: parallax (--fp) and the curtain (ports SiteFooter.tsx) -----------------------------------
  var footerMeasure = function () {};
  (function () {
    var f = $(".c-footer");
    if (!f) return;
    if (reduce) { f.style.setProperty("--fp", "1"); return; }
    var raf = 0;
    var update = function () {
      raf = 0;
      var h = f.offsetHeight;
      var start = root.scrollHeight - h;
      var p = Math.min(1, Math.max(0, (window.scrollY + window.innerHeight - start) / Math.max(h, 1)));
      f.style.setProperty("--fp", p.toFixed(4));
    };
    var onScroll = function () { if (!raf) raf = requestAnimationFrame(update); };
    footerMeasure = function () {
      root.classList.toggle("has-curtain", window.innerWidth >= 1000 && f.offsetHeight <= window.innerHeight - 24);
      onScroll();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", footerMeasure);
  })();

  // ---- door board: the kinetic list (ports DoorBoard.tsx; CSS hover stands in without GSAP) ------------
  (function () {
    var g = window.gsap, CE = window.CustomEase;
    if (!g || !CE || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    g.registerPlugin(CE);
    var EASE = "fhs-board";
    if (!g.parseEase(EASE)) CE.create(EASE, "0.65, 0.01, 0.05, 0.99");
    var t = function (s) { return reduce ? 0 : s; };
    $$(".c-board").forEach(function (board) {
      board.classList.add("is-kinetic");
      $$(".c-board__item", board).forEach(function (item) {
        var fill = $(".c-board__fill", item), els = $$(".c-board__el", item), rolls = $$(".c-roll__line", item);
        var enter = function () {
          item.classList.add("is-active");
          g.set(fill, { transformOrigin: "left center" });
          g.to(fill, { scaleX: 1, duration: t(0.5), ease: EASE, overwrite: "auto" });
          g.to(rolls, { yPercent: -100, duration: t(0.45), ease: EASE, overwrite: "auto" });
          g.fromTo(els, { scale: 0.6, opacity: 0, rotation: -8, transformOrigin: "50% 50%" }, { scale: 1, opacity: 1, rotation: 0, duration: t(0.5), stagger: t(0.06), delay: t(0.08), ease: "power3.out", overwrite: "auto" });
        };
        var leave = function () {
          item.classList.remove("is-active");
          g.set(fill, { transformOrigin: "right center" });
          g.to(fill, { scaleX: 0, duration: t(0.4), ease: EASE, overwrite: "auto" });
          g.to(rolls, { yPercent: 0, duration: t(0.35), ease: EASE, overwrite: "auto" });
          g.to(els, { scale: 0.85, opacity: 0, duration: t(0.25), ease: "power2.in", overwrite: "auto" });
        };
        item.addEventListener("pointerenter", enter);
        item.addEventListener("pointerleave", leave);
        item.addEventListener("focusin", function (e) { if (e.target.matches(":focus-visible")) enter(); });
        item.addEventListener("focusout", leave);
      });
    });
  })();

  // ---- start ------------------------------------------------------------------------------------------
  if (reduce) {
    root.classList.add("sc-reduce");
    $$('[data-sc-act="pin"], [data-sc-act="scrub"], [data-sc-act="pan"]').forEach(function (el) {
      el.setAttribute("data-sc-act", "flow");
      el.removeAttribute("data-sc-span");
      el.removeAttribute("data-sc-dwell");
    });
  }
  var start = parseHash();
  show(start.slug, start.section, { first: true, noScroll: true });
  if (window.ScrollCraft) window.ScrollCraft.mount(document.body);
  scrollTarget(start.slug, start.section, false);
  headerReset();
  segmentedAll();
  headerUpdate();
  $$("form.c-form").forEach(conditional);
  window.addEventListener("hashchange", function () { var h = parseHash(); show(h.slug, h.section); });
  footerMeasure();
  window.addEventListener("load", function () { relayout(); segmentedAll(); footerMeasure(); });
})();
