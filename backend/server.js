const express = require("express");
const cors = require("cors");
const path = require("path");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const connectDB = require("./config/db");

const decisionRoutes = require("./routes/decisionRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const chatRoutes = require("./routes/chatRoutes");
const contactRoutes = require("./routes/contactRoutes");
const adminRoutes = require("./routes/adminRoutes");

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));


// ─────────────────────────────────────────────────────
// PUBLIC API ROUTES
// ─────────────────────────────────────────────────────

app.use("/api", decisionRoutes);
app.use("/api", categoryRoutes);
app.use("/api", chatRoutes);
app.use("/api", contactRoutes);


// ─────────────────────────────────────────────────────
// ADMIN AUTH MIDDLEWARE
// ─────────────────────────────────────────────────────

function adminAuth(req, res, next) {

  if (req.method === "GET" && (req.path === "/admin" || req.path === "/login")) {
    return next();
  }

  if (req.path === "/login" && req.method === "POST") {
    return next();
  }

  const authHeader = req.headers["authorization"];
  const token =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      throw new Error();
    }

    req.admin = decoded;
    next();

  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}


// ─────────────────────────────────────────────────────
// ADMIN LOGIN API
// ─────────────────────────────────────────────────────

app.post("/login", (req, res) => {

  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ error: "Password required" });
  }

  if (password !== process.env.ADMIN_PASSWORD) {
    return setTimeout(() => {
      res.status(401).json({ error: "Incorrect password" });
    }, 600);
  }

  const token = jwt.sign(
    { role: "admin" },
    process.env.JWT_SECRET,
    { expiresIn: "8h" }
  );

  res.json({ token, expiresIn: "8h" });
});


// Protect admin routes
app.use("/admin-api", adminAuth, adminRoutes);


// ─────────────────────────────────────────────────────
// PAGE ROUTES
// ─────────────────────────────────────────────────────

app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "../frontend/home.html"))
);

app.get("/home", (req, res) =>
  res.sendFile(path.join(__dirname, "../frontend/home.html"))
);

app.get("/welcome", (req, res) =>
  res.sendFile(path.join(__dirname, "../frontend/welcome.html"))
);

app.get("/about", (req, res) =>
  res.sendFile(path.join(__dirname, "../frontend/about.html"))
);

app.get("/categories", (req, res) =>
  res.sendFile(path.join(__dirname, "../frontend/categories.html"))
);

app.get("/faq", (req, res) =>
  res.sendFile(path.join(__dirname, "../frontend/faq.html"))
);

app.get("/contact", (req, res) =>
  res.sendFile(path.join(__dirname, "../frontend/contact.html"))
);


// ─────────────────────────────────────────────────────
// ADMIN PAGES
// ─────────────────────────────────────────────────────

app.get("/login", (req, res) =>
  res.sendFile(path.join(__dirname, "../frontend/admin-login.html"))
);

app.get("/admin", (req, res) =>
  res.sendFile(path.join(__dirname, "../frontend/admin.html"))
);


// ─────────────────────────────────────────────────────
// 404
// ─────────────────────────────────────────────────────

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "../frontend/404.html"));
});


// ─────────────────────────────────────────────────────
// SERVER START
// ─────────────────────────────────────────────────────

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);