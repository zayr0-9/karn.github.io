(function () {
  var storageKey = "theme-preference";
  var root = document.documentElement;

  function getSystemTheme() {
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  }

  function getStoredTheme() {
    try {
      var saved = localStorage.getItem(storageKey);
      return saved === "light" || saved === "dark" ? saved : null;
    } catch (error) {
      return null;
    }
  }

  function getActiveTheme() {
    return getStoredTheme() || root.dataset.theme || getSystemTheme();
  }

  function applyTheme(theme) {
    root.dataset.theme = theme;
    root.style.colorScheme = theme;

    var buttons = document.querySelectorAll("[data-theme-toggle]");
    var nextTheme = theme === "light" ? "dark" : "light";
    var icon = theme === "light" ? "☀" : "☾";
    var label = theme === "light" ? "Light" : "Dark";

    buttons.forEach(function (button) {
      var text = button.querySelector(".theme-toggle-text");
      var iconNode = button.querySelector(".theme-toggle-icon");

      button.setAttribute("aria-pressed", theme === "light" ? "true" : "false");
      button.setAttribute("aria-label", "Switch to " + nextTheme + " theme");
      button.setAttribute("title", "Switch to " + nextTheme + " theme");

      if (text) text.textContent = label;
      if (iconNode) iconNode.textContent = icon;
    });
  }

  function persistTheme(theme) {
    try {
      localStorage.setItem(storageKey, theme);
    } catch (error) {}
  }

  document.addEventListener("DOMContentLoaded", function () {
    applyTheme(getActiveTheme());

    document.querySelectorAll("[data-theme-toggle]").forEach(function (button) {
      button.addEventListener("click", function () {
        var nextTheme = getActiveTheme() === "light" ? "dark" : "light";
        persistTheme(nextTheme);
        applyTheme(nextTheme);
      });
    });

    var mediaQuery = window.matchMedia("(prefers-color-scheme: light)");
    var handleSystemThemeChange = function (event) {
      if (!getStoredTheme()) {
        applyTheme(event.matches ? "light" : "dark");
      }
    };

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleSystemThemeChange);
    } else if (typeof mediaQuery.addListener === "function") {
      mediaQuery.addListener(handleSystemThemeChange);
    }
  });
})();
