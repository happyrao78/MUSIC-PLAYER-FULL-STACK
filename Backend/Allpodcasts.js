const express = require("express");
const { MongoClient } = require("mongodb");
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

// Fetch all podcasts
app.get("/all-podcasts", async (req, res) => {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to MongoDB successfully!");
    const db = client.db(dbName);
    const podcastsCollection = db.collection(podcastsCollectionName);

    // Fetch all podcasts
    const podcasts = await podcastsCollection.find({}).toArray();

    res.status(200).json(podcasts);
  } catch (err) {
    console.error("Error fetching podcasts:", err);
    res.status(500).json({ error: "Failed to fetch podcasts." });
  } finally {
    await client.close();
  }
});


module.exports = { app };
