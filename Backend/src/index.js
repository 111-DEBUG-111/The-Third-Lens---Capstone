const path = require("path");
const dotenv = require("dotenv");
// load .env from the Backend project root (one level up from src)
dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

// Fail fast with a clear message if DATABASE_URL is not set
if (!process.env.DATABASE_URL) {
  console.error(
    "FATAL: Missing DATABASE_URL. Create a .env file in the Backend/ folder with DATABASE_URL=\"mysql://USER:PASS@HOST:PORT/DB_NAME\""
  );
  process.exit(1);
}

const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
const newsRoutes = require("./routes/newsRoutes");
app.use("/api/news", newsRoutes);

const adminRoutes = require("./routes/adminRoutes");
app.use("/api/admin", adminRoutes);

const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT} http://localhost:${PORT}`));
