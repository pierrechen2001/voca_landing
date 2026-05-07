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

  function boot() {
    initLucide();
    if (typeof window.VocaLandingI18n !== "undefined") {
      window.VocaLandingI18n.apply(window.VocaLandingI18n.getLocale());
      initLucide();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
