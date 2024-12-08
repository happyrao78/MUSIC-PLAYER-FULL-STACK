const express = require("express");
const { MongoClient } = require("mongodb");
const bodyparser = require("body-parser");
const app = express();
app.use(express.json());
app.use(bodyparser.urlencoded({ extended: true }));
const cors = require('cors');
app.use(cors());
const uri = "mongodb+srv://sneha_becse:dL1XC7LyRZajCjqC@cluster0.1lxv4q8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; 
const dbName = "music_player"; 
const collectionName = "Track";

app.get("/all-tracks", async (req, res) => {
  const client = new MongoClient(uri);

  try {

    await client.connect();
    console.log("Connected to MongoDB successfully!");
 
    const db = client.db(dbName);
    const tracksCollection = db.collection(collectionName);

    // Fetch all tracks
    const tracks = await tracksCollection.find({}).toArray();

    res.status(200).json(tracks);
  } catch (err) {
    console.error("Error fetching tracks:", err);
    res.status(500).json({ error: "Failed to fetch tracks." });
  } finally {

    await client.close();
  }
});

module.exports = { app };
