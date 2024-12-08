const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const uri = "mongodb+srv://sneha_becse:dL1XC7LyRZajCjqC@cluster0.1lxv4q8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const dbName = "music_player";
const collectionName = "User"; // Assuming the collection is named 'User'

// Update user information route
app.post("/update-user", async (req, res) => {
    const { _id, firstname, lastname, email, phone } = req.body;
    console.log("Received data:", req.body);
  
    // Validate required fields
    if (!_id || !firstname || !lastname || !email || !phone) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields (_id, firstname, lastname, email, phone).",
      });
    }
  
    const client = new MongoClient(uri);
  
    try {
      await client.connect();
      console.log("Connected to MongoDB successfully!");
  
      const db = client.db(dbName);
      const usersCollection = db.collection(collectionName);
  
      // Ensure _id is a valid ObjectId
      let userId;
      try {
        userId = new ObjectId(_id);
      } catch (error) {
        return res.status(400).json({ success: false, error: "Invalid user ID format." });
      }
  
      // Update the user information
      const result = await usersCollection.updateOne(
        { _id: userId }, // Find the user by _id
        {
          $set: {
            firstname,
            lastname,
            email,
            phone,
          },
        }
      );
  
      // Check if the update was successful
      if (result.matchedCount === 0) {
        return res.status(404).json({ success: false, error: "User not found." });
      }
  
      if (result.modifiedCount === 0) {
        return res.status(200).json({
          success: true,
          message: "No changes made. User information is up to date.",
        });
      }
  
      res.status(200).json({ success: true, message: "User updated successfully!" });
    } catch (err) {
      console.error("Error updating user:", err);
      res.status(500).json({ success: false, error: "Failed to update user." });
    } finally {
      await client.close();
    }
  });
  

module.exports = { app };
