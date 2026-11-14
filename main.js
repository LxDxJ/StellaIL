(function () {
  var C = window.STELLA || {};

  // Fill in links from config
  document.querySelectorAll("[data-link]").forEach(function (el) {
    var v = C[el.getAttribute("data-link")];
    el.href = v || "#";
  });
  var mail = document.querySelector("[data-email]");
  if (mail) {
    if (C.contactEmail) { mail.href = "mailto:" + C.contactEmail; mail.textContent = C.contactEmail; }
    else { var box = mail.closest(".card"); if (box) box.classList.add("hidden"); }
  }

  // Support page: toggle + payment links
  var tabs = document.querySelectorAll(".toggle button");
  if (tabs.length) {
    tabs.forEach(function (b) {
      b.addEventListener("click", function () {
        tabs.forEach(function (x) { x.classList.remove("on"); });
        b.classList.add("on");
        var m = b.getAttribute("data-mode");
        document.getElementById("monthly").classList.toggle("hidden", m !== "monthly");
        document.getElementById("onetime").classList.toggle("hidden", m !== "onetime");
      });
    });
    document.querySelectorAll("[data-pay]").forEach(function (a) {
      var path = a.getAttribute("data-pay").split(".");
      var v = C.pay && C.pay[path[0]] && C.pay[path[0]][path[1]];
      a.href = v || "#";
      if (v && v !== "#") { a.target = "_blank"; a.rel = "noopener"; }
    });
    if (location.hash === "#monthly" || location.hash === "#onetime") {
      var t = document.querySelector('.toggle button[data-mode="' + location.hash.slice(1) + '"]');
      if (t) t.click();
    }
  }
})();
