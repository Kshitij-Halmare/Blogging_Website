import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRouter from "./Router/userRouter.js";
import mongoose from "mongoose";

// Initialize app
const app = express();

// Middleware
app.use(express.json());
const allowedOrigins = [
  'http://localhost:5173', // for local development
  'https://blogging-website-1-semf.onrender.com' // deployed front-end
];
dotenv.config();

// Routes
app.use("/api/user", userRouter);

// Set up MongoDB connection
const mongodbUrl = process.env.MONGODB_URL;
mongoose.connect(mongodbUrl)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Server configuration
const PORT = 8080;
app.get("/", (req, res) => {
  res.send("Server is up and running!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
