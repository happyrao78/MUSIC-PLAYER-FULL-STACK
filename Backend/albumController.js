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
    } 
    else if (file.fieldname === "image") {
      const imageDir = path.join(__dirname, "/public/uploads");
      if (!fs.existsSync(imageDir)) {
        fs.mkdirSync(imageDir, { recursive: true });
      }
      cb(null, imageDir);
    } 
    else if (file.fieldname === "coverimage") {
        const imageDir = path.join(__dirname, "/public/albumimage");
        if (!fs.existsSync(imageDir)) {
          fs.mkdirSync(imageDir, { recursive: true });
        }
        cb(null, imageDir);
      } 
      else if (file.fieldname === "genreimage") {
        const imageDir = path.join(__dirname, "/public/albumimage");
        if (!fs.existsSync(imageDir)) {
          fs.mkdirSync(imageDir, { recursive: true });
        }
        cb(null, imageDir);
      } 
    else {
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

// Middleware for handling album uploads
const uploadAlbum = upload.fields([
  { name: "audio", maxCount: 1 },
  { name: "image", maxCount: 1 },
  { name: "coverimage", maxCount: 1 },
  { name: "genreimage", maxCount: 1 },
]);

// --------------------- album Upload Controller ---------------------

const addalbum = (req, res) => {
  try {
    console.log("Request Body:", req.body);

    if (!req.files || !req.files.audio || !req.files.image || !req.files.coverimage || !req.files.genreimage) {
      console.error("Missing files: audio or image not uploaded.");
      return res.status(400).json({ error: "Audio or Image file is missing." });
    }

    const { album, genre, title, artist, language, releaseYear,email } = req.body;

    if (!album || !genre || !title || !artist || !language || !releaseYear|| !email) {
      return res.status(400).json({ error: "Required fields missing: album, genre, title, artist, language, or release year" });
    }

    const audioFileName = req.files.audio[0].filename;
    const imageFileName = req.files.image[0].filename;
    const coverFileName = req.files.coverimage[0].filename;
    const genreFileName = req.files.genreimage[0].filename;

    const albumData = {
      album,
      genre,
      coverImage: coverFileName,
      genreImage: genreFileName,
    };
    const trackdata = {
      title,
      artist,
      album,
      genre,
      email,
      language,
      releaseYear,
      audio: audioFileName,
      image: imageFileName,
    };

    // Insert album data into MongoDB
    db.collection("Albums")
      .insertOne(albumData)
      .then((result) => {
        console.log("Album uploaded successfully:", result);
        db.collection("Track")
        .insertOne(trackdata)
        .then((result) => {
          console.log("track uploaded successfully:", result);
          // res.status(200).json({ message: "track uploaded successfully!" });
        })
        res.status(200).json({ message: "Album uploaded successfully!" });
      })
      .catch((error) => {
        console.error("Error inserting album data into MongoDB:", error);
        res.status(500).json({ error: "Failed to upload album." });
      });

      // db.collection("Track")
      // .insertOne(trackdata)
      // .then((result) => {
      //   console.log("track uploaded successfully:", result);
      //   res.status(200).json({ message: "track uploaded successfully!" });
      // })
      // .catch((error) => {
      //   console.error("Error inserting track data into MongoDB:", error);
      //   res.status(500).json({ error: "Failed to upload track." });
      // });
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

module.exports = { uploadAlbum, addalbum };