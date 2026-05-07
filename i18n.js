/**
 * VOCA landing — locale detection, persistence, DOM apply, language switcher.
 */
(function () {
  var STORAGE_KEY = "voca_landing_locale";
  var SUPPORTED = ["zh-TW", "zh-CN", "ja", "ko", "id", "vi", "th", "es", "pt"];
  var FALLBACK = "zh-TW";

  var LABELS = {
    "zh-TW": "繁體中文",
    "zh-CN": "简体中文",
    ja: "日本語",
    ko: "한국어",
    id: "Bahasa Indonesia",
    vi: "Tiếng Việt",
    th: "ภาษาไทย",
    es: "Español",
    pt: "Português",
  };

  function canonicalize(raw) {
    if (!raw || typeof raw !== "string") return null;
    var r = raw.toLowerCase().replace(/_/g, "-");
    if (r === "zh-tw" || r === "zh-hk" || r === "zho-hant" || r === "zh-hant") return "zh-TW";
    if (r === "zh-cn" || r === "zh-hans" || r === "zho-hans" || r === "zh-sg") return "zh-CN";
    if (r === "zh") return "zh-TW";
    if (r.indexOf("zh-") === 0) {
      if (r.indexOf("hant") !== -1 || r.indexOf("tw") !== -1 || r.indexOf("hk") !== -1) return "zh-TW";
      return "zh-CN";
    }
    if (r.indexOf("ja") === 0 || r === "jp") return "ja";
    if (r.indexOf("ko") === 0) return "ko";
    if (r.indexOf("id") === 0 || r === "in-id") return "id";
    if (r.indexOf("vi") === 0) return "vi";
    if (r.indexOf("th") === 0) return "th";
    if (r.indexOf("es") === 0) return "es";
    if (r.indexOf("pt") === 0) return "pt";
    return null;
  }

  function detectFromNavigator() {
    var list = [];
    if (typeof navigator !== "undefined") {
      if (navigator.languages && navigator.languages.length) {
        for (var i = 0; i < navigator.languages.length; i++) list.push(navigator.languages[i]);
      }
      if (navigator.language) list.push(navigator.language);
    }
    for (var j = 0; j < list.length; j++) {
      var c = canonicalize(list[j]);
      if (c && SUPPORTED.indexOf(c) !== -1) return c;
    }
    return FALLBACK;
  }

  function getStored() {
    try {
      var s = localStorage.getItem(STORAGE_KEY);
      if (s && SUPPORTED.indexOf(s) !== -1) return s;
    } catch (e) {}
    return null;
  }

  function getLocale() {
    return getStored() || detectFromNavigator();
  }

  function setLocale(loc) {
    if (SUPPORTED.indexOf(loc) === -1) return;
    try {
      localStorage.setItem(STORAGE_KEY, loc);
    } catch (e) {}
    apply(loc);
  }

  function t(loc, key) {
    var bag = window.VOCA_LANDING_I18N && window.VOCA_LANDING_I18N[loc];
    var fb = window.VOCA_LANDING_I18N && window.VOCA_LANDING_I18N[FALLBACK];
    if (bag && Object.prototype.hasOwnProperty.call(bag, key) && bag[key] != null && bag[key] !== "") {
      return bag[key];
    }
    if (fb && fb[key] != null) return fb[key];
    return key;
  }

  function apply(loc) {
    if (SUPPORTED.indexOf(loc) === -1) loc = FALLBACK;

    document.documentElement.setAttribute("lang", loc);

    var nodes = document.querySelectorAll("[data-i18n]");
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var k = el.getAttribute("data-i18n");
      if (!k) continue;
      el.textContent = t(loc, k);
    }

    var htmlNodes = document.querySelectorAll("[data-i18n-html]");
    for (var h = 0; h < htmlNodes.length; h++) {
      var hel = htmlNodes[h];
      var hk = hel.getAttribute("data-i18n-html");
      if (!hk) continue;
      hel.innerHTML = t(loc, hk);
    }

    var titleEl = document.querySelector("title");
    if (titleEl) {
      var titleKey = titleEl.getAttribute("data-i18n");
      if (titleKey) document.title = t(loc, titleKey);
    }

    var metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      var dk = metaDesc.getAttribute("data-i18n-key");
      if (dk) metaDesc.setAttribute("content", t(loc, dk));
    }

    var selects = document.querySelectorAll(".voca-lang-select");
    for (var s = 0; s < selects.length; s++) {
      selects[s].value = loc;
    }
  }

  function injectLangSelect() {
    var navs = document.querySelectorAll("nav");
    for (var n = 0; n < navs.length; n++) {
      var nav = navs[n];
      if (nav.querySelector(".voca-lang-wrap")) continue;
      var wrap = document.createElement("div");
      wrap.className = "voca-lang-wrap";
      wrap.setAttribute("lang", FALLBACK);
      var sel = document.createElement("select");
      sel.className = "voca-lang-select";
      sel.setAttribute("aria-label", "Language");
      for (var i = 0; i < SUPPORTED.length; i++) {
        var code = SUPPORTED[i];
        var opt = document.createElement("option");
        opt.value = code;
        opt.textContent = LABELS[code];
        sel.appendChild(opt);
      }
      sel.addEventListener("change", function () {
        setLocale(this.value);
        if (typeof lucide !== "undefined") {
          lucide.createIcons({
            attrs: { "stroke-width": 2, "aria-hidden": "true" },
          });
        }
      });
      wrap.appendChild(sel);
      nav.appendChild(wrap);
    }
  }

  function init() {
    injectLangSelect();
    apply(getLocale());
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.VocaLandingI18n = {
    getLocale: getLocale,
    setLocale: setLocale,
    apply: apply,
    init: init,
    SUPPORTED: SUPPORTED.slice(),
    t: function (key) {
      return t(getLocale(), key);
    },
  };
})();
