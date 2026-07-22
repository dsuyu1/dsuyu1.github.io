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

// The in-post section bar is sticky beneath the header, and it gets taller
// when its links wrap onto a second row. Anchor offsets have to track that
// real height: with the offset hardcoded for a single row, clicking a section
// in a post with enough sections lands the heading behind the bar.
(function () {
  var bar = document.querySelector(".hr-bottom");
  if (!bar) return;

  function sync() {
    document.documentElement.style.setProperty(
      "--section-nav-h",
      bar.offsetHeight + "px"
    );
  }

  // A post's section count is fixed in the HTML, so this first call already
  // has the right height. The rest cover the ways the bar can rewrap later.
  sync();

  // Resize is the case that actually rewraps the bar in a real browser.
  window.addEventListener("resize", sync);

  // Web fonts change the label widths, which can change the wrap point, and
  // they usually land after this script runs.
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(sync);
  }

  // Belt and braces for anything else that reflows the bar. Not relied on as
  // the only trigger: some embedded browsers never deliver these callbacks.
  if (window.ResizeObserver) {
    new ResizeObserver(sync).observe(bar);
  }
})();
