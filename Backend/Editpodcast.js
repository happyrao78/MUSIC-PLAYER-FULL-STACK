const express = require("express");
const { MongoClient,ObjectId } = require("mongodb");
const bodyparser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(cors());

// MongoDB connection details
const uri = "mongodb+srv://sneha_becse:dL1XC7LyRZajCjqC@cluster0.1lxv4q8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const dbName = "music_player";
const podcastsCollectionName = "Podcast_Episodes"; // Podcast collection


// Edit a podcast
// Edit a podcast
app.post("/update-podcast", async (req, res) => {
    const { _id, title, podcastName } = req.body;
    const client = new MongoClient(uri);
  
    if (!_id || !title || !podcastName) {
      return res.status(400).json({ error: "Missing required fields." });
    }
  
    try {
      await client.connect();
      const db = client.db(dbName);
      const podcastsCollection = db.collection(podcastsCollectionName);
  
      const podcastid = new ObjectId(_id);
      // Update podcast with new title and podcast name
      const result = await podcastsCollection.updateOne(
        { _id: podcastid },
        { $set: { title, podcastName } }
      );
  
      if (result.modifiedCount > 0) {
        res.status(200).json({ message: "Podcast updated successfully!" });
      } else {
        res.status(404).json({ message: "No changes made to the podcast." });
      }
    } catch (err) {
      console.error("Error updating podcast:", err);
      res.status(500).json({ error: "Failed to update podcast." });
    } finally {
      await client.close();
    }
  });
  
module.exports = { app };