const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (HTML, CSS, JS, Images) from the project directory
app.use(express.static(path.join(__dirname)));

// In-memory Database for Books
const books = [
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

// In-memory Users store
const users = [
  { username: "student", password: "password123", name: "Student User", role: "student" },
  { username: "daneshwar", password: "123", name: "Daneshwar Munde", role: "admin" }
];

// --- HTML Pages Routes ---
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "login.html"));
});

// --- API Routes ---

// 1. Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString(), message: "Server is running smoothly 🚀" });
});

// 2. Get All Books with optional search & filter
app.get("/api/books", (req, res) => {
  const { category, search } = req.query;
  let results = [...books];

  if (category && category !== "all") {
    results = results.filter(b => b.category.toLowerCase() === category.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase();
    results = results.filter(b =>
      b.name.toLowerCase().includes(q) ||
      b.category.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q)
    );
  }

  res.json({
    success: true,
    count: results.length,
    data: results
  });
});

// 3. Get Single Book by ID
app.get("/api/books/:id", (req, res) => {
  const bookId = parseInt(req.params.id);
  const book = books.find(b => b.id === bookId);
  if (!book) {
    return res.status(404).json({ success: false, message: "Book not found" });
  }
  res.json({ success: true, data: book });
});

// 4. User Login
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, message: "Please provide username and password" });
  }

  const user = users.find(u => u.username.toLowerCase() === username.trim().toLowerCase() && u.password === password);
  if (!user) {
    return res.status(401).json({ success: false, message: "Invalid username or password" });
  }

  res.json({
    success: true,
    message: "Login successful!",
    user: {
      username: user.username,
      name: user.name,
      role: user.role
    }
  });
});

// 5. User Registration
app.post("/api/register", (req, res) => {
  const { username, password, name } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, message: "Username and password are required" });
  }

  const existing = users.find(u => u.username.toLowerCase() === username.trim().toLowerCase());
  if (existing) {
    return res.status(409).json({ success: false, message: "Username already exists" });
  }

  const newUser = {
    username: username.trim(),
    password: password,
    name: name || username.trim(),
    role: "student"
  };
  users.push(newUser);

  res.status(201).json({
    success: true,
    message: "Account created successfully!",
    user: {
      username: newUser.username,
      name: newUser.name,
      role: newUser.role
    }
  });
});

// 6. Place Order
app.post("/api/orders", (req, res) => {
  const { items, totalAmount, user } = req.body;
  if (!items || items.length === 0) {
    return res.status(400).json({ success: false, message: "Cart is empty" });
  }

  const order = {
    orderId: "ORD-" + Math.floor(100000 + Math.random() * 900000),
    items,
    totalAmount,
    user: user || "Guest",
    orderDate: new Date().toISOString(),
    status: "Confirmed"
  };

  res.status(201).json({
    success: true,
    message: "Order placed successfully! 🎉",
    order
  });
});

// Start Server
app.listen(PORT, () => {
  console.log("==========================================");
  console.log(`🚀 Student Book Store Server Running!`);
  console.log(`🌐 Local URL: http://localhost:${PORT}`);
  console.log(`🔑 Login Page: http://localhost:${PORT}/login`);
  console.log(`📚 Books API: http://localhost:${PORT}/api/books`);
  console.log("==========================================");
});