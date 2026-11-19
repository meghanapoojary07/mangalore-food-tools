var diet = "all";

var cuisineSel = document.getElementById("cuisine");
var cuisines = [];
DISHES.forEach(function (x) { if (cuisines.indexOf(x.cuisine) === -1) cuisines.push(x.cuisine); });
cuisines.sort();
cuisineSel.innerHTML = '<option value="all">All cuisines</option>' +
  cuisines.map(function (c) { return "<option>" + c + "</option>"; }).join("");

function render() {
  var q = document.getElementById("search").value.trim().toLowerCase();
  var cu = cuisineSel.value;
  var pt = document.getElementById("ptype").value;
  var mp = parseFloat(document.getElementById("maxprice").value);

  var res = DISHES.filter(function (x) {
    var p = placeById(x.place);
    if (q && x.name.toLowerCase().indexOf(q) === -1 && p.name.toLowerCase().indexOf(q) === -1) return false;
    if (cu !== "all" && x.cuisine !== cu) return false;
    if (pt !== "all" && p.type !== pt) return false;
    if (diet === "veg" && !x.veg) return false;
    if (diet === "nonveg" && x.veg) return false;
    if (!isNaN(mp) && x.price > mp) return false;
    return true;
  });

  document.getElementById("count").textContent = res.length + " dish" + (res.length === 1 ? "" : "es") + " found";

  var list = document.getElementById("list");
  if (!res.length) {
    list.innerHTML = '<div class="card">No dishes match these filters.</div>';
    return;
  }
  list.innerHTML = res.map(function (x) {
    var p = placeById(x.place);
    return '<div class="card">' +
      '<h3>' + dietDot(x.veg) + x.name + '</h3>' +
      '<div class="muted">' + p.name + ' &middot; ' + p.type + '</div>' +
      '<div><span class="tag">' + x.cuisine + '</span></div>' +
      '<div class="price">' + rupee(x.price) + '</div>' +
      '<div class="facts"><span>' + x.grams + ' g</span><span>' + x.kcal + ' kcal</span></div>' +
      '<div class="actions"><a class="btn small light" href="reserve.html?place=' + p.id + '">Reserve table</a></div>' +
      '</div>';
  }).join("");
}

document.getElementById("search").addEventListener("input", render);
document.getElementById("maxprice").addEventListener("input", render);
cuisineSel.addEventListener("change", render);
document.getElementById("ptype").addEventListener("change", render);
document.getElementById("diet").addEventListener("click", function (e) {
  if (!e.target.dataset.v) return;
  diet = e.target.dataset.v;
  Array.prototype.forEach.call(this.children, function (b) { b.classList.toggle("on", b === e.target); });
  render();
});

render();
