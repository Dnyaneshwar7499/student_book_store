/**
 * Student Book Store - Main Client Logic
 */

// Default / Fallback Books Database
const defaultBooks = [
  {
    id: 1,
    name: "Java Programming (Complete Masterclass)",
    author: "Herbert Schildt",
    price: 299,
    originalPrice: 599,
    category: "Programming",
    rating: 4.8,
    reviews: 142,
    badge: "Bestseller",
    img: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80",
    description: "Comprehensive guide to Core & Advanced Java, OOP principles, Streams, and Spring Boot basics."
  },
  {
    id: 2,
    name: "Python Crash Course & Data Science",
    author: "Eric Matthes",
    price: 250,
    originalPrice: 499,
    category: "Programming",
    rating: 4.9,
    reviews: 210,
    badge: "Popular",
    img: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=600&auto=format&fit=crop&q=80",
    description: "Hands-on project-based introduction to programming in Python, Pandas, Numpy, and automation."
  },
  {
    id: 3,
    name: "Artificial Intelligence: Modern Approach",
    author: "Stuart Russell & Peter Norvig",
    price: 500,
    originalPrice: 899,
    category: "AI",
    rating: 4.7,
    reviews: 98,
    badge: "Must Read",
    img: "https://images.unsplash.com/photo-1677442136019-21780efad99a?w=600&auto=format&fit=crop&q=80",
    description: "The definitive reference text on Artificial Intelligence concepts, heuristic search, logic, and agents."
  },
  {
    id: 4,
    name: "Machine Learning & Neural Networks",
    author: "Andrew Ng & Aurélien Géron",
    price: 550,
    originalPrice: 950,
    category: "AI",
    rating: 4.9,
    reviews: 185,
    badge: "Top Rated",
    img: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=600&auto=format&fit=crop&q=80",
    description: "Practical Machine Learning with Scikit-Learn, Keras, TensorFlow, and Deep Neural Networks."
  },
  {
    id: 5,
    name: "Computer Networking: Top-Down Approach",
    author: "James Kurose & Keith Ross",
    price: 420,
    originalPrice: 750,
    category: "Networking",
    rating: 4.6,
    reviews: 87,
    badge: "College Essential",
    img: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&auto=format&fit=crop&q=80",
    description: "Learn TCP/IP layers, routing protocols, DNS, socket programming, and wireless network design."
  },
  {
    id: 6,
    name: "Cyber Security & Ethical Hacking",
    author: "Kevin Mitnick",
    price: 450,
    originalPrice: 800,
    category: "Security",
    rating: 4.8,
    reviews: 130,
    badge: "Trending",
    img: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&auto=format&fit=crop&q=80",
    description: "Fundamental network security, penetration testing, cryptography, and defense mechanisms."
  },
  {
    id: 7,
    name: "Database System Concepts (SQL & NoSQL)",
    author: "Abraham Silberschatz",
    price: 380,
    originalPrice: 650,
    category: "Database",
    rating: 4.7,
    reviews: 92,
    badge: "Core Subject",
    img: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&auto=format&fit=crop&q=80",
    description: "Relational database design, SQL queries, Normalization, indexing, ACID properties, and MongoDB."
  },
  {
    id: 8,
    name: "Full Stack Web Development (MERN)",
    author: "Robin Wieruch",
    price: 490,
    originalPrice: 850,
    category: "Programming",
    rating: 4.9,
    reviews: 164,
    badge: "Career Ready",
    img: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=600&auto=format&fit=crop&q=80",
    description: "Build modern web applications with React, Node.js, Express, and MongoDB from scratch."
  }
];

// Determine Base API URL
const API_BASE = (window.location.protocol === "http:" || window.location.protocol === "https:")
  ? ""
  : "http://localhost:5000";

// Application State
let allBooks = [];
let cart = JSON.parse(localStorage.getItem("student_cart")) || [];
let wishlist = JSON.parse(localStorage.getItem("student_wishlist")) || [];
let currentCategory = "all";
let currentSearch = "";

// Initialize App on DOM Load
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  updateAuthUI();
  updateCounters();
  fetchBooks();
});

// Theme Management
function initTheme() {
  const savedTheme = localStorage.getItem("student_theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    updateThemeIcon(true);
  }
}

function toggleTheme() {
  const isDark = document.body.classList.toggle("dark");
  localStorage.setItem("student_theme", isDark ? "dark" : "light");
  updateThemeIcon(isDark);
}

function updateThemeIcon(isDark) {
  const btn = document.getElementById("themeToggleBtn");
  if (btn) {
    btn.innerHTML = isDark ? "☀️" : "🌙";
  }
}

// User Authentication State
function updateAuthUI() {
  const user = JSON.parse(localStorage.getItem("student_user"));
  const authContainer = document.getElementById("navAuthContainer");
  if (!authContainer) return;

  if (user && user.username) {
    authContainer.innerHTML = `
      <div class="user-badge">
        <span>👤 ${user.name || user.username}</span>
      </div>
      <button class="nav-btn" onclick="logoutUser()" title="Logout" style="color: var(--danger); background: var(--bg-subtle);">
        🚪 Logout
      </button>
    `;
  } else {
    authContainer.innerHTML = `
      <a href="login.html" class="btn-login-nav">
        🔑 Student Login
      </a>
    `;
  }
}

function logoutUser() {
  localStorage.removeItem("student_user");
  showToast("Logged out successfully", "info");
  updateAuthUI();
}

// Fetch Books from Backend API with Fallback
async function fetchBooks() {
  const container = document.getElementById("booksGrid");
  if (container && allBooks.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align:center; padding: 40px;">
        <h3>⏳ Loading textbooks...</h3>
      </div>
    `;
  }

  try {
    const res = await fetch(`${API_BASE}/api/books`);
    const result = await res.json();

    if (result.success && Array.isArray(result.data)) {
      allBooks = result.data;
      renderBooks();
      return;
    }
  } catch (error) {
    console.warn("Could not reach backend API, loading local catalog:", error.message);
  }

  // Fallback to default books list
  allBooks = defaultBooks;
  renderBooks();
}

// Render Books Grid
function renderBooks() {
  const container = document.getElementById("booksGrid");
  if (!container) return;

  let filtered = allBooks;

  // Filter by Category
  if (currentCategory !== "all") {
    filtered = filtered.filter(
      (b) => b.category.toLowerCase() === currentCategory.toLowerCase()
    );
  }

  // Filter by Search Query
  if (currentSearch.trim() !== "") {
    const q = currentSearch.toLowerCase();
    filtered = filtered.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q) ||
        (b.author && b.author.toLowerCase().includes(q))
    );
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column: 1/-1;">
        <div class="empty-icon">🔍</div>
        <h3>No books found</h3>
        <p>Try searching for a different keyword or category.</p>
        <button class="btn-primary" onclick="resetFilters()">Show All Books</button>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered
    .map((book) => {
      const isWished = wishlist.some((item) => item.id === book.id);
      return `
      <div class="book-card">
        <div class="card-img-wrapper">
          <img src="${book.img}" alt="${book.name}" loading="lazy">
          ${book.badge ? `<span class="card-badge">${book.badge}</span>` : ""}
          <button class="card-wish-btn ${isWished ? "wished" : ""}" 
                  onclick="toggleWishlist(${book.id})" 
                  title="${isWished ? "Remove from wishlist" : "Add to wishlist"}">
            ${isWished ? "❤️" : "🤍"}
          </button>
        </div>
        
        <div class="card-body">
          <span class="card-category">${book.category}</span>
          <h3 class="card-title" title="${book.name}">${book.name}</h3>
          <p class="card-author">By ${book.author || "Standard Edition"}</p>
          
          <div class="card-rating">
            <span class="stars">★ ${book.rating || "4.8"}</span>
            <span class="rating-count">(${book.reviews || 120} reviews)</span>
          </div>

          <div class="card-footer">
            <div class="card-price-group">
              <span class="card-price">₹${book.price}</span>
              ${book.originalPrice ? `<span class="card-original-price">₹${book.originalPrice}</span>` : ""}
            </div>
            <button class="btn-add-cart" onclick="addToCart(${book.id})">
              🛒 Add to Cart
            </button>
          </div>
        </div>
      </div>
    `;
    })
    .join("");
}

// Category Filter Handling
function filterCategory(category, btnElement) {
  currentCategory = category;
  
  // Update active pill styling
  document.querySelectorAll(".cat-btn").forEach((btn) => btn.classList.remove("active"));
  if (btnElement) {
    btnElement.classList.add("active");
  }

  renderBooks();
}

// Search Filter Handling
function handleSearch(query) {
  currentSearch = query;
  renderBooks();
}

function resetFilters() {
  currentCategory = "all";
  currentSearch = "";
  const searchInput = document.getElementById("searchInput");
  if (searchInput) searchInput.value = "";
  
  document.querySelectorAll(".cat-btn").forEach((btn, idx) => {
    btn.classList.toggle("active", idx === 0);
  });
  
  renderBooks();
}

// Cart Operations
function addToCart(bookId) {
  const book = allBooks.find((b) => b.id === bookId);
  if (!book) return;

  const existingIndex = cart.findIndex((item) => item.id === bookId);
  if (existingIndex > -1) {
    cart[existingIndex].qty += 1;
  } else {
    cart.push({
      id: book.id,
      name: book.name,
      price: book.price,
      img: book.img,
      qty: 1,
    });
  }

  saveCart();
  updateCounters();
  showToast(`"${book.name.substring(0, 24)}..." added to Cart! 🛒`, "success");
}

function updateCartQty(bookId, delta) {
  const itemIndex = cart.findIndex((item) => item.id === bookId);
  if (itemIndex === -1) return;

  cart[itemIndex].qty += delta;
  if (cart[itemIndex].qty <= 0) {
    cart.splice(itemIndex, 1);
  }

  saveCart();
  updateCounters();
  renderCart();
}

function removeFromCart(bookId) {
  cart = cart.filter((item) => item.id !== bookId);
  saveCart();
  updateCounters();
  renderCart();
  showToast("Item removed from Cart", "info");
}

function saveCart() {
  localStorage.setItem("student_cart", JSON.stringify(cart));
}

function renderCart() {
  const container = document.getElementById("cartItemsList");
  const summaryContainer = document.getElementById("cartSummary");
  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column: 1/-1;">
        <div class="empty-icon">🛒</div>
        <h3>Your Cart is Empty</h3>
        <p>Looks like you haven't added any textbooks to your cart yet.</p>
        <button class="btn-primary" onclick="showSection('books')">Browse Books</button>
      </div>
    `;
    if (summaryContainer) summaryContainer.style.display = "none";
    return;
  }

  if (summaryContainer) summaryContainer.style.display = "block";

  // Render items
  container.innerHTML = cart
    .map(
      (item) => `
    <div class="cart-item-card">
      <img src="${item.img}" alt="${item.name}" class="cart-item-img">
      <div class="cart-item-info">
        <h4 class="cart-item-title">${item.name}</h4>
        <div class="cart-item-price">₹${item.price} each</div>
      </div>
      <div class="cart-qty-controls">
        <button class="qty-btn" onclick="updateCartQty(${item.id}, -1)">-</button>
        <span class="cart-item-qty">${item.qty}</span>
        <button class="qty-btn" onclick="updateCartQty(${item.id}, 1)">+</button>
      </div>
      <div style="font-weight: 700; min-width: 70px; text-align: right;">
        ₹${item.price * item.qty}
      </div>
      <button class="cart-remove-btn" onclick="removeFromCart(${item.id})" title="Remove item">
        🗑️
      </button>
    </div>
  `
    )
    .join("");

  // Calculate Summary
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discount = Math.round(subtotal * 0.1); // 10% student discount
  const finalTotal = subtotal - discount;

  const summaryValues = document.getElementById("summaryValues");
  if (summaryValues) {
    summaryValues.innerHTML = `
      <div class="summary-row">
        <span>Items Subtotal (${cart.reduce((s, i) => s + i.qty, 0)})</span>
        <span>₹${subtotal}</span>
      </div>
      <div class="summary-row" style="color: var(--success);">
        <span>Student Discount (10%)</span>
        <span>-₹${discount}</span>
      </div>
      <div class="summary-row">
        <span>Campus Delivery</span>
        <span style="color: var(--success); font-weight: 600;">FREE</span>
      </div>
      <div class="summary-row summary-total">
        <span>Total Payable</span>
        <span style="color: var(--primary);">₹${finalTotal}</span>
      </div>
    `;
  }
}

// Wishlist Operations
function toggleWishlist(bookId) {
  const book = allBooks.find((b) => b.id === bookId);
  if (!book) return;

  const existingIndex = wishlist.findIndex((item) => item.id === bookId);
  if (existingIndex > -1) {
    wishlist.splice(existingIndex, 1);
    showToast(`Removed from Wishlist`, "info");
  } else {
    wishlist.push({
      id: book.id,
      name: book.name,
      price: book.price,
      img: book.img,
      category: book.category,
    });
    showToast(`Saved to Wishlist! ❤️`, "success");
  }

  localStorage.setItem("student_wishlist", JSON.stringify(wishlist));
  updateCounters();
  renderBooks();
  if (document.getElementById("wishlistSection").style.display !== "none") {
    renderWishlist();
  }
}

function renderWishlist() {
  const container = document.getElementById("wishlistGrid");
  if (!container) return;

  if (wishlist.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column: 1/-1;">
        <div class="empty-icon">❤️</div>
        <h3>Your Wishlist is Empty</h3>
        <p>Save textbooks you want to buy later by clicking the heart icon.</p>
        <button class="btn-primary" onclick="showSection('books')">Explore Books</button>
      </div>
    `;
    return;
  }

  container.innerHTML = wishlist
    .map(
      (item) => `
    <div class="book-card">
      <div class="card-img-wrapper">
        <img src="${item.img}" alt="${item.name}">
        <button class="card-wish-btn wished" onclick="toggleWishlist(${item.id})" title="Remove from wishlist">
          ❤️
        </button>
      </div>
      <div class="card-body">
        <span class="card-category">${item.category}</span>
        <h3 class="card-title">${item.name}</h3>
        <div class="card-footer">
          <span class="card-price">₹${item.price}</span>
          <button class="btn-add-cart" onclick="addToCart(${item.id})">
            🛒 Move to Cart
          </button>
        </div>
      </div>
    </div>
  `
    )
    .join("");
}

// Section Switching Navigation
function showSection(sectionName) {
  const booksSec = document.getElementById("booksSection");
  const cartSec = document.getElementById("cartSection");
  const wishSec = document.getElementById("wishlistSection");
  const controlsSec = document.getElementById("controlsSection");
  const heroSec = document.getElementById("heroSection");

  if (booksSec) booksSec.style.display = "none";
  if (cartSec) cartSec.style.display = "none";
  if (wishSec) wishSec.style.display = "none";

  // Nav buttons
  document.querySelectorAll(".nav-btn").forEach((btn) => btn.classList.remove("active"));

  if (sectionName === "books") {
    if (booksSec) booksSec.style.display = "block";
    if (controlsSec) controlsSec.style.display = "flex";
    if (heroSec) heroSec.style.display = "block";
    const navBooks = document.getElementById("navBooks");
    if (navBooks) navBooks.classList.add("active");
    renderBooks();
  } else if (sectionName === "cart") {
    if (cartSec) cartSec.style.display = "block";
    if (controlsSec) controlsSec.style.display = "none";
    if (heroSec) heroSec.style.display = "none";
    const navCart = document.getElementById("navCart");
    if (navCart) navCart.classList.add("active");
    renderCart();
  } else if (sectionName === "wishlist") {
    if (wishSec) wishSec.style.display = "block";
    if (controlsSec) controlsSec.style.display = "none";
    if (heroSec) heroSec.style.display = "none";
    const navWish = document.getElementById("navWish");
    if (navWish) navWish.classList.add("active");
    renderWishlist();
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Update Badges Counters
function updateCounters() {
  const cartCountEl = document.getElementById("cartCount");
  const wishCountEl = document.getElementById("wishCount");

  const totalCartQty = cart.reduce((sum, item) => sum + item.qty, 0);
  if (cartCountEl) cartCountEl.innerText = totalCartQty;
  if (wishCountEl) wishCountEl.innerText = wishlist.length;
}

// Checkout & Order Placement
async function proceedCheckout() {
  if (cart.length === 0) {
    showToast("Cart is empty!", "error");
    return;
  }

  const user = JSON.parse(localStorage.getItem("student_user"));
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discount = Math.round(subtotal * 0.1);
  const totalAmount = subtotal - discount;

  try {
    const res = await fetch(`${API_BASE}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: cart,
        totalAmount,
        user: user ? user.name || user.username : "Guest Student",
      }),
    });

    const result = await res.json();
    if (result.success) {
      // Clear Cart
      cart = [];
      saveCart();
      updateCounters();

      // Show modal
      const modal = document.getElementById("orderSuccessModal");
      const orderDetails = document.getElementById("modalOrderDetails");
      if (orderDetails) {
        orderDetails.innerHTML = `
          <p><strong>Order ID:</strong> ${result.order.orderId}</p>
          <p><strong>Total Amount:</strong> ₹${result.order.totalAmount}</p>
          <p><strong>Student:</strong> ${result.order.user}</p>
          <p style="color: var(--success); font-weight:600; margin-top:10px;">
            ✅ Confirmation SMS sent. Your books will arrive in 2 business days!
          </p>
        `;
      }
      if (modal) modal.classList.add("active");
      return;
    }
  } catch (err) {
    console.warn("Order API fallback:", err);
  }

  // Fallback offline order placement
  cart = [];
  saveCart();
  updateCounters();
  const orderId = "ORD-" + Math.floor(100000 + Math.random() * 900000);
  const modal = document.getElementById("orderSuccessModal");
  const orderDetails = document.getElementById("modalOrderDetails");
  if (orderDetails) {
    orderDetails.innerHTML = `
      <p><strong>Order ID:</strong> ${orderId}</p>
      <p><strong>Total Amount:</strong> ₹${totalAmount}</p>
      <p><strong>Student:</strong> ${user ? user.name || user.username : "Guest Student"}</p>
      <p style="color: var(--success); font-weight:600; margin-top:10px;">
        ✅ Confirmation saved! Your books will arrive in 2 business days.
      </p>
    `;
  }
  if (modal) modal.classList.add("active");
}

function closeModal() {
  const modal = document.getElementById("orderSuccessModal");
  if (modal) modal.classList.remove("active");
  showSection("books");
}

// Toast Notifications
function showToast(message, type = "info") {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(50px)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}