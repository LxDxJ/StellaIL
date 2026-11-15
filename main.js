(function () {
  var C = window.STELLA || {};

  // Fill in links from config
  document.querySelectorAll("[data-link]").forEach(function (el) {
    var v = C[el.getAttribute("data-link")];
    el.href = v || "#";
  });
  // Links between the public site and the logged-in pages on the bot host
  document.querySelectorAll("[data-app]").forEach(function (a) {
    if (C.appBase) a.href = C.appBase.replace(/\/$/, "") + "/" + a.getAttribute("data-app");
  });
  document.querySelectorAll("[data-site]").forEach(function (a) {
    if (C.publicSite) a.href = C.publicSite.replace(/\/$/, "") + "/" + a.getAttribute("data-site");
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
      else {                                   // no payment link yet: show a disabled "Coming soon" button
        a.textContent = "Coming soon"; a.classList.add("soon"); a.setAttribute("aria-disabled", "true");
        a.addEventListener("click", function (e) { e.preventDefault(); });
      }
    });
    if (location.hash === "#monthly" || location.hash === "#onetime") {
      var t = document.querySelector('.toggle button[data-mode="' + location.hash.slice(1) + '"]');
      if (t) t.click();
    }
  }
})();

(function () {                                  // My Stella dropdown: hover on desktop, the little arrow on touch screens
  var all = function () { return document.querySelectorAll(".nav li.dd"); };
  all().forEach(function (dd) {
    var b = dd.querySelector(".caret");
    b.addEventListener("click", function (e) {
      e.stopPropagation();
      var open = dd.classList.toggle("open"); b.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });
  var closeAll = function () { all().forEach(function (d) { d.classList.remove("open"); var b = d.querySelector(".caret"); if (b) b.setAttribute("aria-expanded", "false"); }); };
  document.addEventListener("click", closeAll);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeAll(); });
})();
