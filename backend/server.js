import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import listingRoutes from "./routes/listing.js";
import bookingRoutes from "./routes/booking.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB setup
const client = new MongoClient(process.env.MONGODB_URI);
let db;

async function connectDB() {
  if (!db) {
    await client.connect();
    db = client.db(process.env.DB_NAME);
    console.log("✅ Connected to MongoDB:", process.env.DB_NAME);
  }
  return db;
}

app.use(cors());
app.use(express.json());

// Inject db instance into routes via middleware
app.use(async (req, res, next) => {
  req.db = await connectDB();
  req.mongoClient = client;
  next();
});

// Register routes
app.use("/api", listingRoutes);
app.use("/api", bookingRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
