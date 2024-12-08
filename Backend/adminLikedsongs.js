const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { MongoClient, ObjectId } = require("mongodb");
const bodyparser = require("body-parser");
const app = express();
app.use(express.json());
app.use(bodyparser.urlencoded({ extended: true }));
const cors = require('cors');
app.use(cors());

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

// Fetch all liked songs for all users
app.get("/admin-liked-songs", async (req, res) => {
  try {
    const likedSongsCollection = db.collection("liked_songs");

    // Aggregate query to fetch liked songs for all users
    const likedSongs = await likedSongsCollection.aggregate([
        {
          $lookup: {
            from: "Track", // Collection name for tracks
            let: { trackId: { $toObjectId: "$trackid" } }, // Convert string `trackid` to ObjectId
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$_id", "$$trackId"] }, // Match the track _id
                },
              },
            ],
            as: "trackDetails", // Add track details
          },
        },
        { $unwind: "$trackDetails" }, // Unwind the trackDetails array
        {
          $lookup: {
            from: "User", // Collection name for users
            let: { userIdString: "$userid" }, // The string `userid` from liked_songs
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: [{ $toString: "$_id" }, "$$userIdString"], // Convert ObjectId to string to match `userid`
                  },
                },
              },
            ],
            as: "userDetails", // Add user details
          },
        },
        { $unwind: "$userDetails" }, // Unwind the userDetails array
        {
          $project: {
            "userDetails.email": 1, // Only include email from userDetails
            "trackDetails.title": 1, // Track title
            "trackDetails.artist": 1, // Track artist
            _id: 1, // Keep the liked song ID
          },
        },
      ]).toArray();

    // If no liked songs are found
    if (likedSongs.length === 0) {
      console.log("No liked songs found.");
    }

    res.status(200).json(likedSongs); // Return all liked songs
  } catch (error) {
    console.error("Error fetching liked songs:", error);
    res.status(500).json({ error: "Error fetching liked songs" });
  }
});



module.exports = { app };
