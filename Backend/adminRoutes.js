const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { MongoClient } = require("mongodb");
const bodyparser = require("body-parser");

const app = express();
app.use(express.json());
app.use(bodyparser.urlencoded({ extended: true }));

// Database connection setup
const url = "mongodb+srv://sneha_becse:dL1XC7LyRZajCjqC@cluster0.1lxv4q8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const dbName = "music_player";
const TOKEN_SECRET_KEY = "G13_BATCH22_123!@#";

let db;

// Establish MongoDB connection
(async () => {
  try {
    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    console.log("Connected to MongoDB successfully!");
    db = client.db(dbName);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
})();

// Admin login route
app.post("/adminlogin", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: "Email and password are required" });
  }

  try {
    const adminCollection = db.collection("Admin");

    // Find the admin by email
    const admin = await adminCollection.findOne({ email });
    if (!admin) {
      return res.status(404).json({ msg: "Admin not found. Please contact support." });
    }

    // Verify the password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    // Generate a JWT token
    const token = jwt.sign({ adminId: admin._id }, TOKEN_SECRET_KEY, { expiresIn: "1d" });

    res.status(200).json({ msg: "Admin login successful", token });
  } catch (error) {
    console.error("Error during admin login:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
});

module.exports = app;
