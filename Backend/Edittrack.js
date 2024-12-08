const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const bodyparser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(cors());

const uri = "mongodb+srv://sneha_becse:dL1XC7LyRZajCjqC@cluster0.1lxv4q8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const dbName = "music_player";
const collectionName = "Track";

// Update track information route
app.post("/update-track", async (req, res) => {
    const { _id, title, artist } = req.body;
  
    // Validate request data
    if (!_id || !title || !artist) {
      return res.status(400).json({ error: "Missing required fields (_id, title, artist)." });
    }
  
    const client = new MongoClient(uri);
  
    try {
      await client.connect();
      console.log("Connected to MongoDB successfully!");
  
      const db = client.db(dbName);
      const tracksCollection = db.collection(collectionName);
  
      // Convert _id to ObjectId if it's a valid string
      const trackId = new ObjectId(_id);
  
      // Update the track with the new title and artist
      const result = await tracksCollection.updateOne(
        { _id: trackId },
        { $set: { title, artist } }
      );
  
      // Check if the track was found and updated
      if (result.matchedCount === 0) {
        return res.status(404).json({ error: "Track not found." });
      }
  
      res.status(200).json({ message: "Track updated successfully!" });
    } catch (err) {
      console.error("Error updating track:", err);
      res.status(500).json({ error: "Failed to update track." });
    } finally {
      await client.close();
    }
  });
  

module.exports = { app };
