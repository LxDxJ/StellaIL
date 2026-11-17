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
    // Support buttons: Buy Me a Coffee. A link that isn't set yet shows "Coming soon".
    document.querySelectorAll("[data-support]").forEach(function (a) {
      var v = C.support && C.support[a.getAttribute("data-support")];
      if (v) { a.href = v; a.target = "_blank"; a.rel = "noopener"; return; }
      a.textContent = "Coming soon"; a.classList.add("soon"); a.setAttribute("aria-disabled", "true");
      a.addEventListener("click", function (e) { e.preventDefault(); });
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

  // Home page widgets: live numbers from the bot's public API. Everything stays hidden if it can't be reached.
  (function () {
    var C = window.STELLA || {};
    var live = document.getElementById("liveStats");
    var base = (C.appBase || "").replace(/\/$/, "");
    if (!live || !base) return;
    var $ = function (id) { return document.getElementById(id); };
    var mk = function (tag, text, cls) { var e = document.createElement(tag); if (cls) e.className = cls; e.textContent = text; return e; };
    var num = function (n) { return Number(n || 0).toLocaleString(); };
    fetch(base + "/api/overview").then(function (r) { if (!r.ok) throw 0; return r.json(); }).then(function (d) {
      var t = $("liveTiles");
      [["servers", "Servers"], ["players", "Players"], ["cards", "Cards collected"], ["characters", "Characters"], ["series", "Series"], ["clans", "Clans"]].forEach(function (p) {
        var tile = document.createElement("div"); tile.className = "tile";
        tile.appendChild(mk("b", num(d[p[0]]))); tile.appendChild(mk("span", p[1])); t.appendChild(tile);
      });
      live.classList.remove("hidden");
      var mo = $("mosaic");
      (d.featured || []).slice(0, 9).forEach(function (c) {
        var img = document.createElement("img");
        img.alt = ""; img.loading = "lazy"; img.src = base + "/api/pub/art/" + c.id + "/" + c.edition;
        img.addEventListener("error", function () { img.remove(); });
        mo.appendChild(img);
      });
      if (mo.children.length) mo.classList.remove("hidden");
      var any = false;
      if (d.event) {
        any = true;
        var eb = $("eventBody");
        eb.appendChild(mk("p", (d.event.emoji || "") + " " + d.event.name));
        var bits = [];
        if (d.event.ends_at) bits.push("Ends " + new Date(d.event.ends_at * 1000).toLocaleDateString());
        if (d.event.boost) bits.push(d.event.boost + "% boost");
        if (bits.length) eb.appendChild(mk("p", bits.join(" · "), "evline"));
        var a = mk("a", "See the event cards →"); a.href = base + "/events.html"; a.style.display = "inline-block"; a.style.marginTop = "10px"; eb.appendChild(a);
      } else { $("eventBox").classList.add("hidden"); }
      if (d.top_clans && d.top_clans.length) {
        any = true;
        d.top_clans.forEach(function (c) {
          var tr = document.createElement("tr"), name = document.createElement("td"), a2 = mk("a", (c.emoji ? c.emoji + " " : "") + c.name + (c.tag ? " [" + c.tag + "]" : ""));
          a2.href = base + "/clans.html?id=" + c.id; name.appendChild(a2);
          tr.appendChild(mk("td", "#" + c.rank)); tr.appendChild(name); tr.appendChild(mk("td", num(c.score) + " pts"));
          $("clanRows").appendChild(tr);
        });
      } else { $("clanBox").classList.add("hidden"); }
      if (any) $("widgets").classList.remove("hidden");
    }).catch(function () {});
  })();
})();
