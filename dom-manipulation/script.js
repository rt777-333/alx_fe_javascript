  <input type="file" id="importFile" accept=".json" onchange="importFromJsonFile(event)" />

  function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
      const importedQuotes = JSON.parse(event.target.result);
      quotes.push(...importedQuotes);
      saveQuotes();
      alert('Quotes imported successfully!');
    };
    fileReader.readAsText(event.target.files[0]);
  }
// Initial dummy data
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "The only limit is your mind.", category: "Motivation" },
  { text: "Stay positive, work hard.", category: "Inspiration" },
  { text: "Every moment matters.", category: "Life" }
];

let categories = [];

document.addEventListener('DOMContentLoaded', () => {
  populateCategories();
  restoreSelectedCategory();
  filterQuotes(); // Initially render
});

// Step 2.1: Populate dropdown dynamically
function populateCategories() {
  const select = document.getElementById('categoryFilter');
  select.innerHTML = `<option value="all">All Categories</option>`;

  categories = [...new Set(quotes.map(q => q.category))];

  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    select.appendChild(option);
  });
}

// Step 2.2: Filter quotes based on selected category
function filterQuotes() {
  const selectedCategory = document.getElementById('categoryFilter').value;
  localStorage.setItem('selectedCategory', selectedCategory); // Step 2.3

  const filtered = selectedCategory === 'all'
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);

  renderQuotes(filtered);
}

// Helper: Render quotes in DOM
function renderQuotes(quotesToShow) {
  const container = document.getElementById('quotesContainer');
  container.innerHTML = '';

  quotesToShow.forEach(quote => {
    const p = document.createElement('p');
    p.textContent = `"${quote.text}" - [${quote.category}]`;
    container.appendChild(p);
  });
}

// Step 2.3: Restore last selected category
function restoreSelectedCategory() {
  const saved = localStorage.getItem('selectedCategory');
  if (saved) {
    document.getElementById('categoryFilter').value = saved;
  }
}

// Step 3: Add new quote and update storage/categories
function addRandomQuote() {
  const newQuotes = [
    { text: "Dream big, dare bigger.", category: "Dream" },
    { text: "Health is wealth.", category: "Wellness" },
    { text: "Courage is grace under pressure.", category: "Courage" }
  ];

  const newQuote = newQuotes[Math.floor(Math.random() * newQuotes.length)];
  quotes.push(newQuote);

  localStorage.setItem('quotes', JSON.stringify(quotes));
  populateCategories();
  filterQuotes();
}
