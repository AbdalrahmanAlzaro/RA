const express = require("express");
const session = require("express-session");
const passport = require("passport");
const cors = require("cors");
const dotenv = require("dotenv");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const contactMessageRoutes = require("./routes/contactMessageRoutes");
const productRoutes = require("./routes/productRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const reportRoutes = require("./routes/reportRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");
const subscriptionUserRoutes = require("./routes/subscriptionUserRoutes");
const reviewBusinessRoutes = require("./routes/reviewBusinessRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const serviceReviewRoutes = require("./routes/serviceReviewRoutes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/auth", authRoutes);
app.use("/api", userRoutes);
app.use("/api", contactMessageRoutes);
app.use("/api", productRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api", reportRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/subscriptions/user", subscriptionUserRoutes);
app.use("/api", reviewBusinessRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api", serviceReviewRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
