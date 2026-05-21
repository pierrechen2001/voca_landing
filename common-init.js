(function () {
  function initLucide() {
    if (typeof lucide !== "undefined") {
      lucide.createIcons({
        attrs: {
          "stroke-width": 2,
          "aria-hidden": "true",
        },
      });
    }
  }

  function setNavOpen(nav, open) {
    nav.classList.toggle("nav-open", open);
    document.body.classList.toggle("nav-menu-open", open);
    var toggle = nav.querySelector(".nav-toggle");
    if (toggle) {
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "關閉選單" : "開啟選單");
    }
  }

  function initMobileNav() {
    var navs = document.querySelectorAll("nav");
    for (var n = 0; n < navs.length; n++) {
      var nav = navs[n];
      if (nav.dataset.navReady === "true") continue;

      var links = nav.querySelector(".nav-links");
      if (!links) continue;

      var actions = nav.querySelector(".nav-actions");
      if (!actions) {
        actions = document.createElement("div");
        actions.className = "nav-actions";
        actions.id = "site-nav-menu";
        nav.insertBefore(actions, links);
        actions.appendChild(links);
      }

      var langWrap = nav.querySelector(".voca-lang-wrap");
      if (langWrap && langWrap.parentElement !== actions) {
        actions.appendChild(langWrap);
      }

      if (!nav.querySelector(".nav-toggle")) {
        var toggle = document.createElement("button");
        toggle.type = "button";
        toggle.className = "nav-toggle";
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-controls", actions.id);
        toggle.setAttribute("aria-label", "開啟選單");
        toggle.innerHTML =
          '<span class="nav-toggle-icon" aria-hidden="true"><span class="nav-toggle-bar"></span></span>';
        nav.appendChild(toggle);

        toggle.addEventListener("click", function () {
          setNavOpen(nav, !nav.classList.contains("nav-open"));
        });
      }

      actions.addEventListener("click", function (event) {
        if (event.target.closest("a")) setNavOpen(nav, false);
      });

      nav.dataset.navReady = "true";
    }

    if (!window.__vocaNavGlobalBound) {
      window.__vocaNavGlobalBound = true;

      document.addEventListener("keydown", function (event) {
        if (event.key !== "Escape") return;
        var openNav = document.querySelector("nav.nav-open");
        if (openNav) setNavOpen(openNav, false);
      });

      window.addEventListener("resize", function () {
        if (window.innerWidth > 768) {
          var openNavs = document.querySelectorAll("nav.nav-open");
          for (var i = 0; i < openNavs.length; i++) {
            setNavOpen(openNavs[i], false);
          }
        }
      });
    }
  }

  function boot() {
    initMobileNav();
    initLucide();
    if (typeof window.VocaLandingI18n !== "undefined") {
      window.VocaLandingI18n.apply(window.VocaLandingI18n.getLocale());
      initMobileNav();
      initLucide();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
