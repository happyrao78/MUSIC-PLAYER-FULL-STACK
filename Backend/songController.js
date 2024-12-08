const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { MongoClient } = require("mongodb");

// --------------------- MongoDB Connection Setup ---------------------
const uri = "mongodb+srv://sneha_becse:dL1XC7LyRZajCjqC@cluster0.1lxv4q8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const dbName = "music_player";
let db;

// Connect to MongoDB
MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((client) => {
    db = client.db(dbName);
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB", error);
  });

// --------------------- File Upload Configuration ---------------------

// Configure Multer for handling file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "audio") {
      const audioDir = path.join(__dirname, "/public/audios");
      if (!fs.existsSync(audioDir)) {
        fs.mkdirSync(audioDir, { recursive: true });
      }
      cb(null, audioDir);
    } else if (file.fieldname === "image") {
      const imageDir = path.join(__dirname, "/public/uploads");
      if (!fs.existsSync(imageDir)) {
        fs.mkdirSync(imageDir, { recursive: true });
      }
      cb(null, imageDir);
    } else {
      cb(new Error("Invalid field name for file upload"), false);
    }
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

// Define a file filter to restrict allowed file types
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["audio/mpeg", "audio/mp3", "image/jpg", "image/png", "image/webp","image/jpeg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    console.error("Invalid file type:", file.mimetype);
    cb(new Error("Invalid file type. Only MP3, JPEG, and PNG are allowed."), false);
  }
};

// Configure Multer with storage and file filter settings
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter,
});

// Middleware for handling song uploads
const uploadSong = upload.fields([
  { name: "audio", maxCount: 1 },
  { name: "image", maxCount: 1 },
]);

// --------------------- Song Upload Controller ---------------------

const addSong = (req, res) => {
  try {
    console.log("Request Body:", req.body);

    if (!req.files || !req.files.audio || !req.files.image) {
      console.error("Missing files: audio or image not uploaded.");
      return res.status(400).json({ error: "Audio or Image file is missing." });
    }

    const { title, artist, album, genre, language, releaseYear } = req.body;

    if (!title || !artist || !req.files.audio || !req.files.image) {
      return res.status(400).json({ error: "Required fields missing: songName, artistName, audio, or image" });
    }

    const audioFileName = req.files.audio[0].filename;
    const imageFileName = req.files.image[0].filename;

    const songData = {
      title,
      artist,
      album: album || "Unknown",
      genre: genre || "Unknown",
      language: language || "Unknown",
      releaseYear: releaseYear || "Unknown",
      audio: audioFileName,
      image: imageFileName,
    };

    const songsCollection = db.collection("Track");
    songsCollection
      .insertOne(songData)
      .then((result) => {
        console.log("Song Data Saved to MongoDB:", result);
        res.status(200).json({ message: "Song uploaded successfully", songData });
      })
      .catch((error) => {
        console.error("Error saving song data to MongoDB:", error);
        res.status(500).json({ error: "Failed to save song data to MongoDB" });
      });
  } catch (error) {
    console.error("Error in addSong controller:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { uploadSong, addSong };
