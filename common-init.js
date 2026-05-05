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

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initLucide);
  } else {
    initLucide();
  }
})();
