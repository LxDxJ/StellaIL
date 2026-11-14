// Stats + "My Stella" pages. Talks to Stella's website API (see apiBase in config.js).
(function () {
  var C = window.STELLA || {};
  var API = (C.apiBase || "").replace(/\/$/, "");
  var $ = function (id) { return document.getElementById(id); };

  // Build elements with textContent only: names come from Discord, so never put them in innerHTML.
  function h(tag, attrs, kids) {
    var e = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) { e.setAttribute(k, attrs[k]); });
    (kids || []).forEach(function (k) { e.appendChild(typeof k === "string" ? document.createTextNode(k) : k); });
    return e;
  }
  function show(el, on) { if (el) el.classList.toggle("hidden", !on); }
  function num(n) { return Number(n || 0).toLocaleString(); }

  function api(path) {
    return fetch(API + path, { credentials: "include" }).then(function (r) {
      if (!r.ok) { var e = new Error("HTTP " + r.status); e.status = r.status; throw e; }
      return r.json();
    });
  }
  function tile(value, label) { return h("div", { "class": "tile" }, [h("b", {}, [num(value)]), h("span", {}, [label])]); }

  // ---------- stats page (logged-in players only, for now) ----------
  if ($("tiles")) {
    var startStats = function (s) {
      show($("statsData"), true);
      var t = $("tiles");
      t.appendChild(tile(s.servers, "Servers"));
      t.appendChild(tile(s.players, "Players"));
      t.appendChild(tile(s.cards, "Cards collected"));
      t.appendChild(tile(s.characters, "Characters"));

      var loadBoard = function (by) {
        api("/api/leaderboard?by=" + by).then(function (d) {
          var tb = $("board"); tb.textContent = "";
          if (!d.rows.length) tb.appendChild(h("tr", {}, [h("td", { colspan: 3 }, ["Nobody here yet."])]));
          d.rows.forEach(function (r) {
            tb.appendChild(h("tr", {}, [h("td", {}, ["#" + r.rank]), h("td", {}, [r.name]), h("td", {}, [num(r.score)])]));
          });
        }).catch(function () { $("board").textContent = ""; });
      };
      document.querySelectorAll("#boardTabs button").forEach(function (b) {
        b.addEventListener("click", function () {
          document.querySelectorAll("#boardTabs button").forEach(function (x) { x.classList.remove("on"); });
          b.classList.add("on"); loadBoard(b.getAttribute("data-by"));
        });
      });
      loadBoard("cards");

      $("lookup").addEventListener("submit", function (ev) {
        ev.preventDefault();
        var box = $("cardResult"); box.textContent = ""; show(box, true);
        api("/api/card/" + encodeURIComponent($("code").value.trim())).then(function (c) {
          box.appendChild(h("h3", {}, [c.name]));
          box.appendChild(h("p", {}, [c.series]));
          box.appendChild(h("p", {}, ["Print #" + c.print + " · " + c.rarity + (c.owner ? " · owned by " + c.owner : " · destroyed")]));
        }).catch(function (e) {
          box.appendChild(h("p", {}, [e.status === 404 ? "No card with that code." : "Couldn't look that up right now."]));
        });
      });
    };
    if (!API) { show($("offline"), true); } else {
      $("loginBtn").href = API + "/auth/login";
      api("/api/stats").then(startStats).catch(function (e) {
        if (e.status === 401) show($("loginBox"), true); else show($("offline"), true);
      });
    }
  }

  // ---------- account page ----------
  if ($("account")) {
    var page = 1, query = "";
    if (/[?&]error=login/.test(location.search)) { var m = $("msg"); m.textContent = "Login didn't work. Please try again."; show(m, true); }
    if (!API) {
      var m2 = $("msg"); m2.textContent = "Logging in isn't available yet. Check back soon."; show(m2, true);
    } else {
      $("loginBtn").href = API + "/auth/login";
      $("logout").href = API + "/auth/logout";
      var loadCards = function () {
        api("/api/me/collection?page=" + page + "&q=" + encodeURIComponent(query)).then(function (d) {
          var g = $("cards"); g.textContent = "";
          d.cards.forEach(function (c) {
            var img = h("img", { src: API + "/api/art/" + c.character_id, alt: "", loading: "lazy" });
            img.addEventListener("error", function () { img.style.visibility = "hidden"; });
            g.appendChild(h("div", { "class": "mc" }, [img, h("div", {}, [c.name, h("small", {}, [c.series]), h("small", {}, ["#" + c.print + " · " + c.rarity])])]));
          });
          if (!d.cards.length) g.appendChild(h("p", { "class": "sub" }, ["No cards found."]));
          $("pageInfo").textContent = "Page " + d.page + " of " + d.pages + " · " + num(d.total) + " cards";
          $("prev").disabled = d.page <= 1; $("next").disabled = d.page >= d.pages;
        });
      };
      api("/api/me").then(function (me) {
        show($("account"), true);
        $("avatar").src = me.avatar; $("who").textContent = me.name;
        var t = $("mine");
        if (!me.played) { t.appendChild(h("p", { "class": "sub" }, ["You haven't played Stella yet. Add her to a server and try /drop!"])); return; }
        var s = me.stats;
        t.appendChild(tile(s.cards, "Cards")); t.appendChild(tile(s.albums, "Albums done"));
        t.appendChild(tile(s.dollars, "Dollars")); t.appendChild(tile(s.gold, "Gold"));
        t.appendChild(tile(s.gems, "Gems")); t.appendChild(tile(s.votes, "Votes"));
        loadCards();
      }).catch(function (e) {
        if (e.status === 401) show($("loginBox"), true);
        else { var m3 = $("msg"); m3.textContent = "Couldn't reach Stella right now. Please try again in a bit."; show(m3, true); }
      });
      $("prev").addEventListener("click", function () { page = Math.max(1, page - 1); loadCards(); });
      $("next").addEventListener("click", function () { page += 1; loadCards(); });
      $("search").addEventListener("submit", function (ev) { ev.preventDefault(); query = $("q").value.trim(); page = 1; loadCards(); });
    }
  }
})();
