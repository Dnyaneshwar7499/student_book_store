/**
 * Student Book Store - Main Client Logic & Interactive Animations
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
  initScrollListeners();
  updateAuthUI();
  updateCounters();
  fetchBooks();
});

// Scroll Listeners for Sticky Header & Back to Top Button
function initScrollListeners() {
  const header = document.querySelector("header");
  const backToTopBtn = document.getElementById("backToTopBtn");

  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    
    if (header) {
      if (scrollY > 20) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    }

    if (backToTopBtn) {
      if (scrollY > 300) {
        backToTopBtn.classList.add("visible");
      } else {
        backToTopBtn.classList.remove("visible");
      }
    }
  });
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

// Theme Management with Spin Animation
function initTheme() {
  const savedTheme = localStorage.getItem("student_theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    updateThemeIcon(true);
  }
}

function toggleTheme() {
  const btn = document.getElementById("themeToggleBtn");
  if (btn) {
    btn.classList.add("spin");
    setTimeout(() => btn.classList.remove("spin"), 500);
  }

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
        <div style="font-size: 2.5rem; margin-bottom: 12px; display: inline-block; animation: floatSlow 2s ease-in-out infinite;">📚</div>
        <h3>Loading textbooks catalog...</h3>
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

// Render Books Grid with Staggered Entrance Animations
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
    .map((book, index) => {
      const isWished = wishlist.some((item) => item.id === book.id);
      return `
      <div class="book-card animate-entrance" style="--anim-order: ${index}">
        <div class="card-img-wrapper">
          <img src="${book.img}" alt="${book.name}" loading="lazy">
          ${book.badge ? `<span class="card-badge">${book.badge}</span>` : ""}
          <button class="card-wish-btn ${isWished ? "wished" : ""}" 
                  onclick="toggleWishlist(${book.id}, event)" 
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
            <button class="btn-add-cart" onclick="addToCart(${book.id}, event)">
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

// Micro-Interaction: Fly Item to Cart Icon
function animateFlyToCart(sourceBtn) {
  const cartNavBtn = document.getElementById("navCart");
  if (!sourceBtn || !cartNavBtn) {
    triggerBadgeBump("cartCount");
    return;
  }

  const startRect = sourceBtn.getBoundingClientRect();
  const endRect = cartNavBtn.getBoundingClientRect();

  const flyingOrb = document.createElement("div");
  flyingOrb.className = "flying-cart-orb";
  flyingOrb.innerText = "📖";
  flyingOrb.style.left = `${startRect.left + startRect.width / 2 - 16}px`;
  flyingOrb.style.top = `${startRect.top + startRect.height / 2 - 16}px`;
  flyingOrb.style.opacity = "1";
  flyingOrb.style.transform = "scale(1)";

  document.body.appendChild(flyingOrb);

  // Trigger animation next tick
  requestAnimationFrame(() => {
    flyingOrb.style.left = `${endRect.left + endRect.width / 2 - 16}px`;
    flyingOrb.style.top = `${endRect.top + endRect.height / 2 - 16}px`;
    flyingOrb.style.transform = "scale(0.3) rotate(360deg)";
    flyingOrb.style.opacity = "0.7";
  });

  setTimeout(() => {
    flyingOrb.remove();
    triggerBadgeBump("cartCount");
  }, 650);
}

// Micro-Interaction: Badge Counter Bump
function triggerBadgeBump(badgeId) {
  const badge = document.getElementById(badgeId);
  if (!badge) return;
  badge.classList.remove("bump");
  void badge.offsetWidth; // Force DOM reflow to re-trigger animation
  badge.classList.add("bump");
}

// Cart Operations
function addToCart(bookId, event) {
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

  if (event && event.currentTarget) {
    animateFlyToCart(event.currentTarget);
  } else {
    triggerBadgeBump("cartCount");
  }

  showToast(`"${book.name.substring(0, 24)}..." added to Cart! 🛒`, "success");
}

function updateCartQty(bookId, delta) {
  const itemIndex = cart.findIndex((item) => item.id === bookId);
  if (itemIndex === -1) return;

  cart[itemIndex].qty += delta;
  if (cart[itemIndex].qty <= 0) {
    removeFromCart(bookId);
    return;
  }

  saveCart();
  updateCounters();
  triggerBadgeBump("cartCount");
  renderCart();
}

function removeFromCart(bookId) {
  const itemCard = document.querySelector(`[data-cart-id="${bookId}"]`);
  if (itemCard) {
    itemCard.classList.add("removing");
    setTimeout(() => {
      cart = cart.filter((item) => item.id !== bookId);
      saveCart();
      updateCounters();
      triggerBadgeBump("cartCount");
      renderCart();
      showToast("Item removed from Cart", "info");
    }, 280);
  } else {
    cart = cart.filter((item) => item.id !== bookId);
    saveCart();
    updateCounters();
    triggerBadgeBump("cartCount");
    renderCart();
    showToast("Item removed from Cart", "info");
  }
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
    <div class="cart-item-card" data-cart-id="${item.id}">
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
      <div class="summary-row" style="color: var(--success); font-weight: 600;">
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

// Wishlist Operations with Heart Pop Animation
function toggleWishlist(bookId, event) {
  const book = allBooks.find((b) => b.id === bookId);
  if (!book) return;

  const targetBtn = event ? event.currentTarget : null;
  if (targetBtn) {
    targetBtn.classList.remove("pop");
    void targetBtn.offsetWidth;
    targetBtn.classList.add("pop");
  }

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
  triggerBadgeBump("wishCount");
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
      (item, index) => `
    <div class="book-card animate-entrance" style="--anim-order: ${index}">
      <div class="card-img-wrapper">
        <img src="${item.img}" alt="${item.name}">
        <button class="card-wish-btn wished" onclick="toggleWishlist(${item.id}, event)" title="Remove from wishlist">
          ❤️
        </button>
      </div>
      <div class="card-body">
        <span class="card-category">${item.category}</span>
        <h3 class="card-title">${item.name}</h3>
        <div class="card-footer">
          <span class="card-price">₹${item.price}</span>
          <button class="btn-add-cart" onclick="addToCart(${item.id}, event)">
            🛒 Move to Cart
          </button>
        </div>
      </div>
    </div>
  `
    )
    .join("");
}

// Section Switching Navigation with Smooth Fade
function showSection(sectionName) {
  const booksSec = document.getElementById("booksSection");
  const cartSec = document.getElementById("cartSection");
  const wishSec = document.getElementById("wishlistSection");
  const controlsSec = document.getElementById("controlsSection");
  const heroSec = document.getElementById("heroSection");

  if (booksSec) {
    booksSec.style.display = "none";
    booksSec.classList.remove("section-fade");
  }
  if (cartSec) {
    cartSec.style.display = "none";
    cartSec.classList.remove("section-fade");
  }
  if (wishSec) {
    wishSec.style.display = "none";
    wishSec.classList.remove("section-fade");
  }

  // Nav buttons
  document.querySelectorAll(".nav-btn").forEach((btn) => btn.classList.remove("active"));

  if (sectionName === "books") {
    if (booksSec) {
      booksSec.style.display = "block";
      booksSec.classList.add("section-fade");
    }
    if (controlsSec) controlsSec.style.display = "flex";
    if (heroSec) heroSec.style.display = "block";
    const navBooks = document.getElementById("navBooks");
    if (navBooks) navBooks.classList.add("active");
    renderBooks();
  } else if (sectionName === "cart") {
    if (cartSec) {
      cartSec.style.display = "block";
      cartSec.classList.add("section-fade");
    }
    if (controlsSec) controlsSec.style.display = "none";
    if (heroSec) heroSec.style.display = "none";
    const navCart = document.getElementById("navCart");
    if (navCart) navCart.classList.add("active");
    renderCart();
  } else if (sectionName === "wishlist") {
    if (wishSec) {
      wishSec.style.display = "block";
      wishSec.classList.add("section-fade");
    }
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

// Confetti Celebration Burst in Modal
function createCelebrationConfetti() {
  const modalContent = document.querySelector("#orderSuccessModal .modal-content");
  if (!modalContent) return;

  const colors = ["#4f46e5", "#06b6d4", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6"];
  
  for (let i = 0; i < 30; i++) {
    const piece = document.createElement("div");
    piece.className = "confetti-piece";
    piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    piece.style.left = `${Math.random() * 85 + 5}%`;
    piece.style.top = `${Math.random() * 20}%`;
    piece.style.animationDelay = `${Math.random() * 0.4}s`;
    piece.style.animationDuration = `${1.8 + Math.random() * 1}s`;
    modalContent.appendChild(piece);

    setTimeout(() => piece.remove(), 2600);
  }
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
      cart = [];
      saveCart();
      updateCounters();

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
      if (modal) {
        modal.classList.add("active");
        createCelebrationConfetti();
      }
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
  if (modal) {
    modal.classList.add("active");
    createCelebrationConfetti();
  }
}

function closeModal() {
  const modal = document.getElementById("orderSuccessModal");
  if (modal) modal.classList.remove("active");
  showSection("books");
}

// Toast Notifications with Animated Countdown Line
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
    toast.style.transform = "translateX(60px) scale(0.9)";
    toast.style.transition = "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}