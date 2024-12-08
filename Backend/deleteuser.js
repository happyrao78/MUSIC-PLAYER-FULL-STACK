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
const collectionName = "User"; // Assuming the collection is named 'Users'

// Delete user route
app.delete("/delete-user", async (req, res) => {
    const { userId } = req.body;
  
    // Validate request data
    if (!userId) {
      return res.status(400).json({ error: "Missing required field: userId." });
    }
  
    const client = new MongoClient(uri);
  
    try {
      await client.connect();
      console.log("Connected to MongoDB successfully!");
  
      const db = client.db(dbName);
      const usersCollection = db.collection(collectionName);
  
      // Convert userId to ObjectId if it's a valid string
      const objectId = new ObjectId(userId);
  
      // Delete the user with the specified userId
      const result = await usersCollection.deleteOne({ _id: objectId });
  
      // Check if a user was deleted
      if (result.deletedCount === 0) {
        return res.status(404).json({ error: "User not found." });
      }
  
      // Send success response
      res.status(200).json({ success: true, message: "User deleted successfully!" });
    } catch (err) {
      console.error("Error deleting user:", err);
      res.status(500).json({ error: "Failed to delete user." });
    } finally {
      await client.close();
    }
  });
  
module.exports = { app };
