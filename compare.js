var selA = document.getElementById("a");
var selB = document.getElementById("b");

var options = DISHES.map(function (x) {
  return '<option value="' + x.id + '">' + x.name + " (" + placeById(x.place).name + ")</option>";
}).join("");
selA.innerHTML = options;
selB.innerHTML = options;
selA.value = 0;
selB.value = 3;

/* better: "low" means smaller number wins, "high" means bigger wins */
var ROWS = [
  { label: "Price",              get: function (x) { return x.price; },                     fmt: rupee,                                   better: "low" },
  { label: "Portion size",       get: function (x) { return x.grams; },                     fmt: function (v) { return v + " g"; },       better: "high" },
  { label: "Calories",           get: function (x) { return x.kcal; },                      fmt: function (v) { return v + " kcal"; },    better: "low" },
  { label: "Price per 100 g",    get: function (x) { return x.price / x.grams * 100; },     fmt: function (v) { return rupee(v.toFixed(1)); }, better: "low" },
  { label: "Calories per 100 g", get: function (x) { return x.kcal / x.grams * 100; },      fmt: function (v) { return Math.round(v) + " kcal"; }, better: "low" }
];

function cls(row, mine, other) {
  if (mine === other) return "";
  var win = row.better === "low" ? mine < other : mine > other;
  return win ? "win" : "";
}

function render() {
  var x = dishById(+selA.value);
  var y = dishById(+selB.value);
  var res = document.getElementById("result");

  if (x.id === y.id) {
    res.innerHTML = '<div class="msg err" style="margin:0">Choose two different dishes to compare.</div>';
    return;
  }

  var html = '<table><thead><tr><th></th><th>' + dietDot(x.veg) + x.name + '</th><th>' + dietDot(y.veg) + y.name + '</th></tr></thead><tbody>';
  html += '<tr><td>Place</td><td>' + placeById(x.place).name + '</td><td>' + placeById(y.place).name + '</td></tr>';
  html += '<tr><td>Cuisine</td><td>' + x.cuisine + '</td><td>' + y.cuisine + '</td></tr>';
  ROWS.forEach(function (r) {
    var va = r.get(x), vb = r.get(y);
    html += '<tr><td>' + r.label + '</td><td class="' + cls(r, va, vb) + '">' + r.fmt(va) +
            '</td><td class="' + cls(r, vb, va) + '">' + r.fmt(vb) + '</td></tr>';
  });
  html += "</tbody></table>";

  var diff = x.price - y.price;
  var cheaper = diff === 0 ? "Both cost the same." :
    (diff < 0 ? x.name : y.name) + " is " + rupee(Math.abs(diff)) + " cheaper.";
  var kd = x.kcal - y.kcal;
  var lighter = kd === 0 ? "Both have the same calories." :
    (kd < 0 ? x.name : y.name) + " has " + Math.abs(kd) + " fewer kcal.";
  html += '<p class="muted" style="margin-bottom:0">' + cheaper + " " + lighter + "</p>";

  res.innerHTML = html;
}

selA.addEventListener("change", render);
selB.addEventListener("change", render);
render();
