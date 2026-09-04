let listings = [
  { category: "rural", type: "Rice husk", weight: 300, location: "Nadia, WB", seller: "Ashok M.", score: 8.4, payout: 2400 },
  { category: "urban", type: "PET bottles", weight: 60, location: "Pune", seller: "Ritika S.", score: 7.1, payout: 720 },
  { category: "industrial", type: "Steel offcuts", weight: 500, location: "Howrah", seller: "Bimal Ind.", score: 6.0, payout: 7500 },
  { category: "urban", type: "E-waste (old phones)", weight: 12, location: "Bengaluru", seller: "Rahul D.", score: 9.0, payout: 960 }
];
 
// Category price-per-kg — used to estimate payout. Edit these to change economics.
const PRICE_PER_KG = { rural: 8, urban: 12, industrial: 15 };
 
// Base "Nature Score" (out of 10) per category before adjustments.
const BASE_SCORE = { rural: 7, urban: 6, industrial: 4 };
 
/* ---------- 2. Nature Score + payout calculation ---------- */
function computeScore(category, type, weight) {
  let score = BASE_SCORE[category] || 5;
  const t = type.toLowerCase();
 
  // Keyword-based adjustments — extend this list as needed.
  const goodKeywords = ["plastic", "e-waste", "ewaste", "electronic", "organic", "husk", "crop", "paper", "glass", "metal", "steel"];
  const badKeywords = ["chemical", "hazard", "toxic", "medical", "battery acid"];
 
  if (goodKeywords.some(k => t.includes(k))) score += 1.2;
  if (badKeywords.some(k => t.includes(k))) score -= 2;
 
  // Larger bulk contributions save proportionally more — small bonus, capped.
  score += Math.min(weight / 500, 1.5);
 
  // Clamp to 0–10, one decimal place.
  score = Math.max(0, Math.min(10, score));
  return Math.round(score * 10) / 10;
}
 
function computePayout(category, weight, score) {
  const base = (PRICE_PER_KG[category] || 10) * weight;
  const scoreBonus = base * (score / 10) * 0.1; // up to +10% for a perfect score
  return Math.round(base + scoreBonus);
}
 
/* ---------- 3. Rendering the live board ---------- */
const boardList = document.getElementById("boardList");
const companyListingCount = document.getElementById("companyListingCount");
let activeFilter = "all";
 
function renderBoard() {
  const filtered = activeFilter === "all"
    ? listings
    : listings.filter(l => l.category === activeFilter);
 
  boardList.innerHTML = "";
 
  if (filtered.length === 0) {
    const empty = document.createElement("div");
    empty.className = "board-empty";
    empty.textContent = "No listings in this category yet.";
    boardList.appendChild(empty);
  } else {
    filtered.slice().reverse().forEach(l => {
      const row = document.createElement("div");
      row.className = "board-row";
      row.innerHTML = `
        <span class="board-row-tag tag-${l.category}">${l.category}</span>
        <span class="board-row-type">${l.type}</span>
        <span class="board-row-meta">${l.weight} kg</span>
        <span class="board-row-meta">${l.location} — ${l.seller}</span>
        <span class="board-row-score">${l.score}/10</span>
        <span class="board-row-meta">₹${l.payout.toLocaleString("en-IN")}</span>
      `;
      boardList.appendChild(row);
    });
  }
 
  companyListingCount.textContent = listings.length;
}
 
document.getElementById("boardFilters").addEventListener("click", (e) => {
  const btn = e.target.closest(".filter-chip");
  if (!btn) return;
  activeFilter = btn.dataset.filter;
  document.querySelectorAll(".filter-chip").forEach(c => c.classList.toggle("is-active", c === btn));
  renderBoard();
});
 
/* ---------- 4. Category buttons (top of page) ---------- */
const catButtons = document.querySelectorAll(".cat-stub");
const fCategory = document.getElementById("fCategory");
 
catButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    catButtons.forEach(b => b.classList.remove("is-active"));
    btn.classList.add("is-active");
 
    const category = btn.dataset.category;
    fCategory.value = category; // prefill the sell form
 
    document.getElementById("sell").scrollIntoView({ behavior: "smooth" });
  });
});
 
/* ---------- 5. Sell form submit handler ---------- */
const sellForm = document.getElementById("sellForm");
const scoreValue = document.getElementById("scoreValue");
const scoreSub = document.getElementById("scoreSub");
const scoreBarFill = document.getElementById("scoreBarFill");
const scoreBreakdown = document.getElementById("scoreBreakdown");
const rewardValue = document.getElementById("rewardValue");
const rewardNote = document.getElementById("rewardNote");
 
sellForm.addEventListener("submit", (e) => {
  e.preventDefault();
 
  const category = document.getElementById("fCategory").value;
  const type = document.getElementById("fType").value.trim();
  const weight = parseFloat(document.getElementById("fWeight").value);
  const location = document.getElementById("fLocation").value.trim();
  const seller = document.getElementById("fSeller").value.trim();
 
  if (!category || !type || !weight || !location || !seller) return;
 
  const score = computeScore(category, type, weight);
  const payout = computePayout(category, weight, score);
 
  // Update the score card
  scoreValue.textContent = score;
  scoreSub.textContent = `${type} · ${weight} kg · ${category}`;
  scoreBarFill.style.width = `${score * 10}%`;
  scoreBreakdown.innerHTML = `
    <span>Base score for ${category} waste: ${BASE_SCORE[category]}/10</span>
    <span>Adjusted for waste type and weight listed</span>
  `;
 
  // Update the reward card
  rewardValue.textContent = `₹${payout.toLocaleString("en-IN")}`;
  rewardNote.textContent = `${weight} kg × ₹${PRICE_PER_KG[category]}/kg, plus Nature Score bonus`;
 
  // Add to listings + board
  listings.push({ category, type, weight, location, seller, score, payout });
  renderBoard();
  updateHeroCounter();
 
  sellForm.reset();
});
 
/* ---------- 6. Hero counter animation ---------- */
const heroCounter = document.getElementById("heroCounter");
 
function totalWeight() {
  return listings.reduce((sum, l) => sum + l.weight, 0);
}
 
function animateCounterTo(target) {
  const start = parseInt(heroCounter.textContent.replace(/,/g, ""), 10) || 0;
  const duration = 600;
  const startTime = performance.now();
 
  function step(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const current = Math.round(start + (target - start) * progress);
    heroCounter.textContent = current.toLocaleString("en-IN");
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
 
function updateHeroCounter() {
  animateCounterTo(totalWeight());
}
 
/* ---------- Init ---------- */
renderBoard();
updateHeroCounter();
 
