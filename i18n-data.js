/**
 * VOCA landing i18n — bootstrap + merge helper.
 * Locale chunks are loaded via i18n-data-*.js (see index / support / legal).
 */
(function (g) {
  var L = ["zh-TW", "zh-CN", "ja", "ko", "id", "vi", "th", "es", "pt"];
  g.VOCA_LANDING_I18N = {};
  L.forEach(function (l) {
    g.VOCA_LANDING_I18N[l] = {};
  });
  /** @param {Record<string, Record<string, string>>} bundle */
  g.VOCA_LANDING_MERGE = function (bundle) {
    L.forEach(function (l) {
      if (bundle[l]) {
        Object.assign(g.VOCA_LANDING_I18N[l], bundle[l]);
      }
    });
  };
})(window);
