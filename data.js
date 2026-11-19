/* Shared sample menu data for all tools.
   NOTE: prices, portions and calories are approximate sample values.
   Edit this file to match real menus. */

const PLACES = [
  { id: "giri",   name: "Giri Manja's",         type: "Restaurant" },
  { id: "machali", name: "Machali",              type: "Restaurant" },
  { id: "pabbas", name: "Pabbas",               type: "Cafe" },
  { id: "sagar",  name: "Hotel Sagar Residency", type: "Hotel" },
  { id: "brew",   name: "Beach Brew Cafe",       type: "Cafe" }
];

/* d(place, name, cuisine, veg, category, price Rs, portion g, calories kcal) */
const DISHES = [];
function d(place, name, cuisine, veg, category, price, grams, kcal) {
  DISHES.push({ id: DISHES.length, place, name, cuisine, veg, category, price, grams, kcal });
}

/* Giri Manja's */
d("giri", "Chicken Ghee Roast with Neer Dosa", "Mangalorean", false, "main", 320, 350, 620);
d("giri", "Fish Curry Meals", "Seafood", false, "main", 280, 450, 640);
d("giri", "Kori Rotti", "Mangalorean", false, "main", 260, 380, 580);
d("giri", "Prawn Sukka", "Seafood", false, "snack", 380, 220, 380);
d("giri", "Mangalorean Veg Thali", "Mangalorean", true, "main", 180, 500, 700);
d("giri", "Neer Dosa with Coconut Chutney", "Mangalorean", true, "snack", 90, 200, 280);

/* Machali */
d("machali", "Pomfret Tawa Fry", "Seafood", false, "snack", 450, 250, 420);
d("machali", "Anjal (Surmai) Fish Fry", "Seafood", false, "snack", 420, 220, 390);
d("machali", "Crab Masala", "Seafood", false, "main", 480, 300, 450);
d("machali", "Prawn Biryani", "Seafood", false, "main", 340, 400, 620);
d("machali", "Bangude Fish Curry Meals", "Seafood", false, "main", 250, 450, 600);
d("machali", "Veg Pulao with Raita", "North Indian", true, "main", 160, 350, 480);

/* Pabbas */
d("pabbas", "Gadbad Ice Cream", "Desserts", true, "dessert", 140, 300, 520);
d("pabbas", "Fruit Salad with Ice Cream", "Desserts", true, "dessert", 110, 280, 380);
d("pabbas", "Veg Sandwich", "Cafe Snacks", true, "snack", 90, 180, 290);
d("pabbas", "Chicken Sandwich", "Cafe Snacks", false, "snack", 130, 200, 350);
d("pabbas", "Cold Coffee", "Beverages", true, "drink", 80, 250, 210);
d("pabbas", "Mango Milkshake", "Beverages", true, "drink", 100, 300, 280);

/* Hotel Sagar Residency */
d("sagar", "Masala Dosa", "South Indian", true, "main", 90, 220, 350);
d("sagar", "Idli Vada Combo", "South Indian", true, "main", 70, 250, 330);
d("sagar", "Mangalore Buns", "Mangalorean", true, "snack", 50, 100, 230);
d("sagar", "Goli Baje", "Mangalorean", true, "snack", 60, 120, 260);
d("sagar", "Paneer Butter Masala with Ghee Rice", "North Indian", true, "main", 240, 450, 720);
d("sagar", "Filter Coffee", "Beverages", true, "drink", 30, 150, 80);

/* Beach Brew Cafe */
d("brew", "Chicken Fried Rice", "Chinese", false, "main", 190, 400, 640);
d("brew", "Veg Hakka Noodles", "Chinese", true, "main", 150, 350, 520);
d("brew", "Gobi Manchurian", "Chinese", true, "snack", 140, 200, 380);
d("brew", "Chilli Chicken", "Chinese", false, "snack", 210, 250, 450);
d("brew", "Paneer Tikka", "North Indian", true, "snack", 210, 200, 340);
d("brew", "Butter Chicken with Naan", "North Indian", false, "main", 320, 450, 780);
d("brew", "Dal Tadka with Jeera Rice", "North Indian", true, "main", 170, 450, 560);
d("brew", "Tender Coconut Water", "Beverages", true, "drink", 40, 300, 60);

/* Helpers */
function placeById(id) { return PLACES.find(function (p) { return p.id === id; }); }
function dishById(id) { return DISHES[id]; }
function rupee(n) { return "₹" + Number(n).toLocaleString("en-IN", { maximumFractionDigits: 2 }); }
function dietDot(veg) {
  return '<span class="dot ' + (veg ? "veg" : "nonveg") + '" title="' + (veg ? "Vegetarian" : "Non-vegetarian") + '"></span>';
}
