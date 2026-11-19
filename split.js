function money(n) {
  return "₹" + n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/* Pure calculation so it is easy to test. Works in paise to avoid float drift. */
function calcSplit(bill, people, tipPct) {
  var billP = Math.round(bill * 100);
  var tipP = Math.round(billP * tipPct / 100);
  var totalP = billP + tipP;
  var each = Math.ceil(totalP / people);          /* round up to the next paisa */
  return { bill: billP / 100, tip: tipP / 100, total: totalP / 100, each: each / 100 };
}

var billEl = document.getElementById("bill");
var peopleEl = document.getElementById("people");
var tipOn = document.getElementById("tipOn");
var tipEl = document.getElementById("tip");
var tipBox = document.getElementById("tipBox");
var chips = document.getElementById("tipChips");

function render() {
  var res = document.getElementById("result");
  var bill = parseFloat(billEl.value);
  var people = parseInt(peopleEl.value, 10);
  var tipPct = tipOn.checked ? parseFloat(tipEl.value) : 0;

  tipBox.style.display = tipOn.checked ? "block" : "none";

  if (isNaN(bill) || bill < 0) { res.innerHTML = '<p class="muted">Enter the bill amount to see the split.</p>'; return; }
  if (isNaN(people) || people < 1) { res.innerHTML = '<div class="msg err" style="margin:0">Number of people must be at least 1.</div>'; return; }
  if (isNaN(tipPct) || tipPct < 0) tipPct = 0;

  var r = calcSplit(bill, people, tipPct);
  res.innerHTML =
    '<div class="muted">Each person pays</div>' +
    '<div class="big">' + money(r.each) + '</div>' +
    '<div class="row"><span>Bill</span><span>' + money(r.bill) + '</span></div>' +
    '<div class="row"><span>Tip' + (tipOn.checked ? " (" + tipPct + "%)" : "") + '</span><span>' + money(r.tip) + '</span></div>' +
    '<div class="row"><strong>Grand total</strong><strong>' + money(r.total) + '</strong></div>' +
    '<div class="row"><span>People</span><span>' + people + '</span></div>';
}

billEl.addEventListener("input", render);
peopleEl.addEventListener("input", render);
tipOn.addEventListener("change", render);
tipEl.addEventListener("input", function () {
  Array.prototype.forEach.call(chips.children, function (b) { b.classList.toggle("on", parseFloat(b.dataset.t) === parseFloat(tipEl.value)); });
  render();
});
chips.addEventListener("click", function (e) {
  if (!e.target.dataset.t) return;
  tipEl.value = e.target.dataset.t;
  Array.prototype.forEach.call(chips.children, function (b) { b.classList.toggle("on", b === e.target); });
  render();
});

render();
