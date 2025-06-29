let quotes = [];
const quoteDisplay = document.getElementById("quoteDisplay");
const categoryFilter = document.getElementById("categoryFilter");

// Load from localStorage
window.onload = () => {
  const stored = localStorage.getItem("quotes");
  quotes = stored ? JSON.parse(stored) : defaultQuotes();
  const savedCategory = localStorage.getItem("selectedCategory") || "all";
  categoryFilter.value = savedCategory;
  populateCategories();
  filterQuotes();
};

// Default quote set
function defaultQuotes() {
  return [
    { text: "Stay hungry, stay foolish.", category: "Motivation" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" }
  ];
}

// Show a random quote
function showRandomQuote() {
  const category = categoryFilter.value;
  const filtered = category === "all" ? quotes : quotes.filter(q => q.category === category);
  if (filtered.length === 0) {
    quoteDisplay.innerText = "No quotes available for this category.";
    return;
  }
  const random = filtered[Math.floor(Math.random() * filtered.length)];
  quoteDisplay.innerText = `"${random.text}" - ${random.category}`;
}
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// Add a new quote
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();
  if (!text || !category) return alert("Both fields are required.");

  quotes.push({ text, category });
  saveQuotes();
  populateCategories();
  filterQuotes();

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
}

// Save to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Populate dropdown
function populateCategories() {
  const categories = ["all", ...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = categories.map(cat => `<option value="${cat}">${cat}</option>`).join("");
  categoryFilter.value = localStorage.getItem("selectedCategory") || "all";
}

// Filter quotes
function filterQuotes() {
  localStorage.setItem("selectedCategory", categoryFilter.value);
  showRandomQuote();
}

// Export to JSON
function exportToJson() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

// Import from JSON
function importFromJsonFile(event) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const imported = JSON.parse(e.target.result);
      if (Array.isArray(imported)) {
        quotes.push(...imported);
        saveQuotes();
        populateCategories();
        filterQuotes();
        alert("Quotes imported successfully!");
      } else {
        throw new Error("Invalid file format.");
      }
    } catch (err) {
      alert("Failed to import quotes: " + err.message);
    }
  };
  reader.readAsText(event.target.files[0]);
}

// Simulated sync (you can trigger this every X seconds)
function syncWithServer() {
  fetch("https://jsonplaceholder.typicode.com/posts")
    .then(res => res.json())
    .then(serverQuotes => {
      // Just simulate syncing
      alert("Synced with server (mocked)");
      // Imagine we received fresh quotes and merged them:
      const newQuote = { text: serverQuotes[0].title, category: "Server" };
      quotes.push(newQuote);
      saveQuotes();
      populateCategories();
      filterQuotes();
    });
}
setInterval(syncWithServer, 30000); // Sync every 30 seconds
function resolveConflict(localQuote, serverQuote) {
  // Example strategy: Server wins
  return serverQuote;
}

