var KEY = "mangalore_reservations";
var placeEl = document.getElementById("place");
var dateEl = document.getElementById("date");
var timeEl = document.getElementById("time");
var msg = document.getElementById("msg");

placeEl.innerHTML = PLACES.map(function (p) {
  return '<option value="' + p.id + '">' + p.name + " (" + p.type + ")</option>";
}).join("");

var pre = new URLSearchParams(location.search).get("place");
if (pre && placeById(pre)) placeEl.value = pre;

/* Time slots 11:00 to 22:00, every 30 minutes */
var slots = [];
for (var h = 11; h <= 22; h++) {
  slots.push(pad(h) + ":00");
  if (h < 22) slots.push(pad(h) + ":30");
}
function pad(n) { return n < 10 ? "0" + n : "" + n; }
function label(t) {
  var p = t.split(":"), h = +p[0];
  return (h % 12 || 12) + ":" + p[1] + (h < 12 ? " AM" : " PM");
}
timeEl.innerHTML = slots.map(function (t) { return '<option value="' + t + '">' + label(t) + "</option>"; }).join("");

function todayStr() {
  var n = new Date();
  return n.getFullYear() + "-" + pad(n.getMonth() + 1) + "-" + pad(n.getDate());
}
dateEl.min = todayStr();
dateEl.value = todayStr();

function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; }
}
function save(arr) {
  try { localStorage.setItem(KEY, JSON.stringify(arr)); return true; } catch (e) { return false; }
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}

function showMsg(text, ok) {
  msg.innerHTML = '<div class="msg ' + (ok ? "ok" : "err") + '">' + text + "</div>";
}

function renderList() {
  var list = document.getElementById("list");
  var all = load().sort(function (a, b) { return (a.date + a.time).localeCompare(b.date + b.time); });
  if (!all.length) { list.innerHTML = '<div class="card muted">No reservations yet.</div>'; return; }
  list.innerHTML = all.map(function (r) {
    var p = placeById(r.place);
    var dt = new Date(r.date + "T00:00:00").toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
    return '<div class="card"><h3>' + esc(p ? p.name : r.place) + '</h3>' +
      '<div>' + dt + ' &middot; ' + label(r.time) + '</div>' +
      '<div class="muted">' + r.guests + ' guest' + (r.guests > 1 ? "s" : "") + ' &middot; ' + esc(r.name) + ' &middot; ' + esc(r.phone) + '</div>' +
      (r.notes ? '<div class="muted">Note: ' + esc(r.notes) + '</div>' : "") +
      '<div class="actions"><button type="button" class="light small" data-cancel="' + r.id + '">Cancel</button></div></div>';
  }).join("");
}

document.getElementById("form").addEventListener("submit", function (e) {
  e.preventDefault();
  var name = document.getElementById("name").value.trim();
  var phone = document.getElementById("phone").value.replace(/\D/g, "");
  var guests = parseInt(document.getElementById("guests").value, 10);
  var date = dateEl.value;
  var time = timeEl.value;

  if (!date) return showMsg("Pick a date.", false);
  if (date < todayStr()) return showMsg("The date cannot be in the past.", false);
  if (date === todayStr()) {
    var now = new Date();
    if (time <= pad(now.getHours()) + ":" + pad(now.getMinutes())) return showMsg("That time has passed. Pick a later slot.", false);
  }
  if (isNaN(guests) || guests < 1 || guests > 20) return showMsg("Guests must be between 1 and 20.", false);
  if (!name) return showMsg("Enter your name.", false);
  if (phone.length !== 10) return showMsg("Enter a 10-digit phone number.", false);

  var all = load();
  var dup = all.some(function (r) { return r.place === placeEl.value && r.date === date && r.time === time && r.phone === phone; });
  if (dup) return showMsg("You already have a reservation for that place and time.", false);

  all.push({
    id: Date.now(),
    place: placeEl.value, date: date, time: time, guests: guests,
    name: name, phone: phone, notes: document.getElementById("notes").value.trim()
  });
  if (!save(all)) return showMsg("Could not save the reservation in this browser.", false);

  showMsg("Table reserved at " + esc(placeById(placeEl.value).name) + " on " + date + " at " + label(time) + ".", true);
  renderList();
});

document.getElementById("list").addEventListener("click", function (e) {
  var id = e.target.getAttribute("data-cancel");
  if (!id) return;
  save(load().filter(function (r) { return String(r.id) !== id; }));
  renderList();
});

renderList();
