const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const bodyparser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(cors());

// MongoDB connection details
const uri = "mongodb+srv://sneha_becse:dL1XC7LyRZajCjqC@cluster0.1lxv4q8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const dbName = "music_player"; 

let db;
(async () => {
  try {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    console.log("Connected to MongoDB successfully!");
    db = client.db(dbName);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
})();

// Delete a podcast
app.delete("/delete-podcast", async (req, res) => {
  const { podcastId } = req.body;
  
  if (!podcastId) {
    return res.status(400).json({ error: "Podcast ID is required." });
  }

  try {
    const podcastsCollection = db.collection("Podcast_Episodes");

    // Delete the podcast by ID
    const result = await podcastsCollection.deleteOne({
      _id: new ObjectId(podcastId)
    });
    if (result.deletedCount === 0) {
      console.log(`No Podcast found with ID: ${podcastId}`);
      return res.status(404).json({ msg: "Podcast not found" });
    }

    console.log(`Successfully deleted Podcast with ID: ${podcastId}`);
    res.status(200).json({ success: true, message: "Liked song deleted" });

  } catch (err) {
    console.error("Error deleting podcast:", err);
    res.status(500).json({ success: false, error: "Failed to delete podcast." });
  }
});

module.exports = { app };
