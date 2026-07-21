// Theme toggle. The initial value is set by the inline script in head.html;
// this only handles clicks and keeps localStorage in sync.
(function () {
  var root = document.documentElement;
  var button = document.getElementById("theme-toggle");
  if (!button) return;

  function sync() {
    button.setAttribute("aria-pressed", root.dataset.theme === "dark");
  }

  button.addEventListener("click", function () {
    root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
    try {
      localStorage.setItem("theme", root.dataset.theme);
    } catch (e) {}
    sync();
  });

  // Follow the OS until the visitor makes an explicit choice.
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", function (event) {
      var stored = null;
      try {
        stored = localStorage.getItem("theme");
      } catch (e) {}
      if (stored) return;
      root.dataset.theme = event.matches ? "dark" : "light";
      sync();
    });

  sync();
})();
