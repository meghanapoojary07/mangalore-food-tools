var placeSel = document.getElementById("place");
placeSel.innerHTML = '<option value="all">Any place</option>' +
  PLACES.map(function (p) { return '<option value="' + p.id + '">' + p.name + "</option>"; }).join("");

/* All combos of 1-3 dishes from one place containing at least one main,
   and at most one dish of any other single category beyond the main. */
function buildCombos(pool, budget) {
  var combos = [];
  var n = pool.length;
  function check(items) {
    var mains = items.filter(function (x) { return x.category === "main"; });
    if (mains.length !== 1) return;
    var cats = {};
    for (var i = 0; i < items.length; i++) {
      if (cats[items[i].category]) return;
      cats[items[i].category] = true;
    }
    var total = items.reduce(function (s, x) { return s + x.price; }, 0);
    if (total <= budget) combos.push({ items: items, total: total });
  }
  for (var a = 0; a < n; a++) {
    check([pool[a]]);
    for (var b = a + 1; b < n; b++) {
      if (pool[a].place !== pool[b].place) continue;
      check([pool[a], pool[b]]);
      for (var c = b + 1; c < n; c++) {
        if (pool[a].place !== pool[c].place) continue;
        check([pool[a], pool[b], pool[c]]);
      }
    }
  }
  return combos;
}

function suggest(budget, diet, place) {
  var pool = DISHES.filter(function (x) {
    if (diet === "veg" && !x.veg) return false;
    if (diet === "nonveg" && x.veg) return false;
    if (place !== "all" && x.place !== place) return false;
    return true;
  });
  var combos = buildCombos(pool, budget);
  /* Prefer combos that use more of the budget; limit repeats of the same main. */
  combos.sort(function (a, b) { return b.total - a.total || a.items.length - b.items.length; });
  var used = {}, picked = [];
  for (var i = 0; i < combos.length && picked.length < 6; i++) {
    var main = combos[i].items.filter(function (x) { return x.category === "main"; })[0];
    used[main.id] = (used[main.id] || 0) + 1;
    if (used[main.id] > 1) continue;
    picked.push(combos[i]);
  }
  return picked;
}

function run() {
  var budget = parseFloat(document.getElementById("budget").value);
  var msg = document.getElementById("msg");
  var out = document.getElementById("out");
  msg.innerHTML = ""; out.innerHTML = "";
  if (isNaN(budget) || budget <= 0) {
    msg.innerHTML = '<div class="msg err">Enter a budget greater than 0.</div>';
    return;
  }
  var res = suggest(budget, document.getElementById("diet").value, placeSel.value);
  if (!res.length) {
    msg.innerHTML = '<div class="msg err">No meal fits ' + rupee(budget) + ' with these choices. Try a higher budget or a different place.</div>';
    return;
  }
  out.innerHTML = res.map(function (c, i) {
    var kcal = c.items.reduce(function (s, x) { return s + x.kcal; }, 0);
    var p = placeById(c.items[0].place);
    return '<div class="combo"><strong>Option ' + (i + 1) + '</strong> <span class="muted">at ' + p.name + '</span><ul>' +
      c.items.map(function (x) { return "<li>" + dietDot(x.veg) + x.name + " &ndash; " + rupee(x.price) + "</li>"; }).join("") +
      '</ul><div class="total"><span>Total ' + rupee(c.total) + '</span><span>' + kcal + ' kcal</span></div>' +
      '<div class="muted">Left over: ' + rupee(budget - c.total) + '</div></div>';
  }).join("");
}

document.getElementById("go").addEventListener("click", run);
document.getElementById("budget").addEventListener("keydown", function (e) { if (e.key === "Enter") run(); });
run();
