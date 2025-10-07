import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRouter from "./Router/userRouter.js";
import mongoose from "mongoose";

dotenv.config();

// Initialize app
const app = express();

// Middleware
app.use(express.json());

const allowedOrigins = [
  'http://localhost:5173', // local dev
  'https://blogging-website-1-semf.onrender.com' // deployed front-end
];

// Apply CORS middleware properly
app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // allow requests like Postman
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true // allow cookies/auth headers
}));

// Routes
app.use("/api/user", userRouter);

// MongoDB connection
const mongodbUrl = process.env.MONGODB_URL;
mongoose.connect(mongodbUrl)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Test route
app.get("/", (req, res) => {
  res.send("Server is up and running!");
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
