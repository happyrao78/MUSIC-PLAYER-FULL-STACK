const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { MongoClient, ObjectId } = require("mongodb");
const bodyparser = require("body-parser");
const app1 = express();
app1.use(express.json());
app1.use(bodyparser.urlencoded({ extended: true }));
const cors = require('cors');
app1.use(cors());

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
    db = client.db(dbName);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
})();

app1.delete("/delete-track", async (req, res) => {
    const { likeId } = req.body;
  
    if (!likeId) {
      return res.status(400).json({ msg: "Like ID is required" });
    }
  
  
    try {
      const likedSongsCollection = db.collection("Track");
      const deleteResult = await likedSongsCollection.deleteOne({ _id: new ObjectId(likeId) });
  
      if (deleteResult.deletedCount === 0) {
        console.log(`No liked song found with ID: ${likeId}`);
        return res.status(404).json({ msg: "Liked song not found" });
      }
  
      console.log(`Successfully deleted liked song with ID: ${likeId}`);
      res.status(200).json({ success: true, message: "Liked song deleted" });
    } catch (error) {
      console.error("Error deleting liked song:", error);
      res.status(500).json({ success: false, error: "Error deleting liked song" });
    }
  });
  
  module.exports = { app1 };
  