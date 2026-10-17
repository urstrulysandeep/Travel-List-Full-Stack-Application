const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./Config/db");
const tripRoutes = require("./Routes/tripRoutes");
const authRoutes = require("./Routes/authRoutes");
const destinationRoutes = require("./Routes/destinationRoutes");

dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
app.use(express.json());

app.get("/", (req, res) => res.send("Travel Planner API Running"));
app.use("/api/auth", authRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/destinations", destinationRoutes);

const PORT = process.env.PORT || 5000;

async function startServer() {
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI is missing from Backend/.env");
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is missing from Backend/.env");
  await connectDB();
  app.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));
}

startServer().catch((error) => {
  console.error("Server startup failed:", error.message);
  process.exit(1);
});
