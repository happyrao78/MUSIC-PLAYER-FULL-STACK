var express = require("express");
const app = express();
const cors = require("cors");
const expressSession = require("express-session");
const bodyparser = require("body-parser");
const { MongoClient,ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");
const path = require("path");
const cookieParser = require("cookie-parser");
const { uploadSong, addSong } = require("./songController");
const { uploadpodcast, addpodcast } = require("./podcastController");
const bcrypt = require("bcrypt");
const { uploadAlbum, addalbum } = require("./albumController");
const adminRoutes = require("./adminRoutes");
app.use(express.json());

const { app: adminLikedSongsApp } = require("./adminLikedsongs");
const { app1: admindeltebutton } = require("./deletelikedsongs");
const { app: adminalltracks} = require("./Alltracks");
const { app1: admindeletetrack} = require("./deletetrack");
const {app: edittrackinfo} = require("./Edittrack");
const {app: allpodcast} = require("./Allpodcasts");
const {app: updatepodcast} = require("./Editpodcast");
const {app: deletepodcast} = require('./deletepodcast');
const {app: allusers} = require("./Allusers");
const {app: updateuser} = require("./Edituser");
const {app: deleteuser} = require("./deleteuser");


const url = "mongodb+srv://sneha_becse:dL1XC7LyRZajCjqC@cluster0.1lxv4q8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const clientObj = new MongoClient(url);
const TOKEN_SECRET_KEY = "my_new_secret_key_123!";


app.use(cors("http://localhost:5173"));
app.use(express.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(
  expressSession({
    secret: "test123!@#",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(cookieParser());

app.use("/audios", express.static(path.join(__dirname, "public/audios")));
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));
app.use(
  "/albumimage",
  express.static(path.join(__dirname, "public/albumimage"))
);

app.get("/signupsubmit", function (req, res) {
  res.send("test");
});

app.post("/signupsubmit", async function (req, res) {
  const { fname, lname, email, password, gender, phnno } = req.body;

  try {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, async (err, hash) => {
        const db = clientObj.db("music_player");
        const userCollection = db.collection("User");

        const existingUser = await userCollection.findOne({ email: email });
        if (existingUser) {
          return res.status(409).send({ msg: "User already exists" });
        }

        const data = {
          firstname: fname,
          lastname: lname,
          email: email,
          password: hash,
          gender: gender,
          phone: phnno,
          status:1
        };
        const result = await userCollection.insertOne(data);

        if (result.acknowledged) {
          res
            .status(200)
            .send({ msg: "Data inserted", insertid: result.insertedId });

          let token = jwt.sign({ email }, TOKEN_SECRET_KEY);
        } else {
          res.status(500).send({ msg: "Cannot insert data" });
        }
      });
    });
  } catch (err) {
    res.status(500).send({ msg: "Cannot insert data" });
  }
});

// Signin route
app.post("/signinsubmit", async (req, res) => {
  const { email, password } = req.body;

  try {
    const db = clientObj.db("music_player");
    const userCollection = db.collection("User");

    const user = await userCollection.findOne({ email: email });
    if (!user) {
      return res.status(404).send({ msg: "First register to login" });
    } else {
      bcrypt.compare(req.body.password, user.password, function (err, result) {
        if (result) {
          const token = jwt.sign({ userid: user._id }, TOKEN_SECRET_KEY, {
            expiresIn: "3 days",
          });
          res.status(200).send({ msg: "Login successful", token: token });
        } else {
          return res.status(404).send({ msg: "something went wrong" });
        }
      });
    }
  } catch (err) {
    res.status(500).send({ msg: "Error during login" });
  }
});

// Token verification route
app.post("/verifytoken", (req, res) => {
  const token = req.headers["x-access-token"];

  jwt.verify(token, TOKEN_SECRET_KEY, (err, decoded) => {
    console.log(decoded.exp);
    console.log(Date.now() / 1000);
    if (err) {
      res.status(401).send({ msg: "Token expired" });
    } else if (decoded.exp > Date.now() / 1000) {
      res.status(200).send({ msg: "Token verified", email: decoded.email });
    }
  });
});

app.get("/api/albums", async (req, res) => {
  try {
    await clientObj.connect();
    const db = clientObj.db("music_player");
    const albums = await db.collection("Albums").find().toArray();
    const tracks = await db.collection("Track").find().toArray();

    const albumData = albums.map((album) => ({
      albumName: album.album,
      genre: album.genre,
      coverimage: album.coverimage,
      genreimage: album.genreimage,
      tracks: tracks.filter((track) => track.album === album.album),
    }));

    res.json(albumData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch albums and tracks" });
  }
});
app.get("/api/tracks", async (req, res) => {
  try {
    const database = clientObj.db("music_player");
    const tracksCollection = database.collection("Track");
    const tracks = await tracksCollection.find({}).toArray();
    res.json(tracks); // Send all tracks as the response
  } catch (error) {
    console.error("Error fetching tracks:", error);
    res.status(500).send("Error fetching tracks");
  }
});

app.get("/api/podcasts", async (req, res) => {
  try {
    await clientObj.connect();

    const db = clientObj.db("music_player");

    const podcasts = await db.collection("Podcast").find().toArray();

    if (podcasts.length === 0) {
      console.log("No podcasts found in the collection.");
    }

    const episodes = await db.collection("Podcast_Episodes").find().toArray();

    // Group tracks by podcast
    const podcastdata = podcasts.map((podcast) => ({
      podcastName: podcast.podcastName,
      coverimage: podcast.coverimage,
      tracks: episodes.filter(
        (episode) => episode.podcastName === podcast.podcastName
      ),
    }));

    res.json(podcastdata);
  } catch (err) {
    console.error("Error fetching podcasts and episodes:", err);
    res.status(500).json({ error: "Failed to fetch podcasts and episodes" });
  }
});

app.get("/api/episodes", async (req, res) => {
  try {
    const database = clientObj.db("music_player");
    const podcastCollection = database.collection("Podcast_Episodes");
    const episodes = await podcastCollection.find({}).toArray();
    res.json(episodes); // Send all tracks as the response
  } catch (error) {
    console.error("Error fetching tracks:", error);
    res.status(500).send("Error fetching tracks");
  }
});
app.post("/add_liked_song", function (req, res) {
  const trackid = req.body.trackid;
  const token = req.body.token;

  jwt.verify(token, TOKEN_SECRET_KEY, async (err, decoded) => {
    if (err) {
      console.log(err);
      return res.status(401).send({ msg: "unauthorized" });
    }

    try {
      if (decoded.exp > Date.now() / 1000) {
        const database = clientObj.db("music_player");
        const liked_songs = database.collection("liked_songs");

        // Check if the user has already liked the track
        const existingLike = await liked_songs.findOne({
          userid: decoded.userid,
          trackid: trackid,
        });

        if (existingLike) {
          // If track is already liked, remove it (unlike)
          const result = await liked_songs.deleteOne({
            userid: decoded.userid,
            trackid: trackid,
          });
          if (result.deletedCount > 0) {
            return res.status(200).send({ msg: "ok", action: "unliked" });
          } else {
            return res.status(500).send({ msg: "failed to unlike" });
          }
        } else {
          // If track is not liked, add it (like)
          const result = await liked_songs.insertOne({
            userid: decoded.userid,
            trackid: trackid,
          });

          if (result.acknowledged) {
            return res.status(200).send({ msg: "ok", action: "liked" });
          } else {
            return res.status(500).send({ msg: "failed to like" });
          }
        }
      } else {
        return res.status(401).send({ msg: "login again" });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).send({ msg: "server error" });
    }
  });
});

// Current user route
app.get("/api/current-user", (req, res) => {
  const token = req.headers["x-access-token"];  // Assuming the token is passed in the headers

  if (!token) {
    return res.status(401).send({ msg: "Token is required" });
  }

  jwt.verify(token, TOKEN_SECRET_KEY, async (err, decoded) => {
    if (err) {
      return res.status(401).send({ msg: "Token is invalid or expired" });
    }

    try {
      const db = clientObj.db("music_player");
      const userCollection = db.collection("User");

      // Fetch the current user's data from the database
      const user = await userCollection.findOne({ _id: new ObjectId(decoded.userid) });

      if (!user) {
        return res.status(404).send({ msg: "User not found" });
      }

      // Return the user's first name, last name, and email
      res.status(200).send({
        name: `${user.firstname} ${user.lastname}`,
        email: user.email,
      });
    } catch (err) {
      console.error("Error fetching user details:", err);
      res.status(500).send({ msg: "Error fetching user details" });
    }
  });
});




app.get("/liked_songs_with_details", async (req, res) => {
  const { token } = req.query;

  jwt.verify(token, TOKEN_SECRET_KEY, async (err, decoded) => {
    if (err || !decoded) {
      return res.status(401).send({ msg: "Unauthorized" });
    }

    try {
      const database = clientObj.db("music_player");
      const likedSongsCollection = database.collection("liked_songs");
      const trackCollection = database.collection("Track");
      
      const likedSongsExist = await likedSongsCollection
        .find({ userid: decoded.userid })
        .toArray();

      const trackIds = likedSongsExist.map((song) => song.trackid);
      

      const trackExists = await trackCollection
        .find({ _id: { $in: trackIds.map((id) => new ObjectId(id)) } })
        .toArray();

      console.log("Matching Tracks:", trackExists);
      if (trackExists.length === 0) {
        return res
          .status(404)
          .json({ msg: "No tracks found for the liked songs." });
      }
      // Fetch liked songs with track details
      const likedSongs = await likedSongsCollection.aggregate([
        {
          $match: { userid: decoded.userid },
        },
        {
          $lookup: {
            from: "Track", // Collection name for tracks
            let: { trackId: { $toObjectId: "$trackid" } }, // Convert trackid to ObjectId
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$_id", "$$trackId"] },
                },
              },
            ],
            as: "trackDetails",
          },
        },
        { $unwind: "$trackDetails" },
        {
          $project: {
            _id: 1,
            "trackDetails.title": 1,
            "trackDetails.artist": 1,
            "trackDetails.image": 1,
            "trackDetails.album": 1,
          },
        },
      ]).toArray();
      

      console.log("Liked Songs Aggregation Result:", likedSongs);

      // Send response
      if (likedSongs.length > 0) {
        res.status(200).json(likedSongs);
      } else {
        res.status(404).json({ msg: "No liked songs found" });
      }
    } catch (err) {
      console.error("Error fetching liked songs with details:", err);
      res.status(500).json({ msg: "Error occurred" });
    }
  });
});




app.post("/api/upload", uploadSong, addSong);
app.post("/api/uploadpodcast", uploadpodcast, addpodcast);
app.post("/api/addalbum",uploadAlbum,addalbum);
app.post("/adminlogin", adminRoutes);
app.get("/admin-liked-songs", adminLikedSongsApp);
app.get("/all-tracks", adminalltracks);
app.get("/all-podcasts",allpodcast);
app.get("/all-users",allusers);
app.post("/update-track",edittrackinfo);
app.post("/update-podcast",updatepodcast);
app.delete("/delete-podcast",deletepodcast);
app.delete("/delete-like",admindeltebutton);
app.delete("/delete-track",admindeletetrack);
app.post("/update-user",updateuser);
app.delete("/delete-user",deleteuser);
app.listen(8081, () => console.log("REST-API running at port no 8081"));


