import React, { useState, useEffect, useRef, useContext } from "react";
import {
  FaBars,
  FaMoon,
  FaSun,
  FaSearch,
  FaBackward,
  FaForward,
  FaPlay,
  FaPause,
  FaThumbsUp,
  FaComment,
} from "react-icons/fa"; // For icons
import logo from "../assets/logo.png";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

const Home1 = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [lightMode, setLightMode] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackProgress, setTrackProgress] = useState(0);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [currentAlbum, setCurrentAlbum] = useState(null);
  const [albums, setAlbums] = useState([]);
  const [podcasts, setPodcasts] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [likedSongs, setLikedSongs] = useState([]);
  const [history, setHistory] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [comments, setComments] = useState([]); // To store the comments for the current track
  const [newComment, setNewComment] = useState(""); // To handle the input for new comments
  const [editCommentId, setEditCommentId] = useState(null);
const [editCommentText, setEditCommentText] = useState("");
const [isModalOpen, setIsModalOpen] = useState(false); // Manage modal visibility

const handleAddCommentClick = (commentId = null, commentText = "") => {
  if (commentId) {
    setEditCommentId(commentId); // Set the comment being edited
    setEditCommentText(commentText); // Pre-fill the comment in the input field
  }
  setIsModalOpen(true);
};
const handleCloseModal = () => {
  setIsModalOpen(false);
  setNewComment(""); // Clear the new comment input
  setEditCommentId(null); // Reset the edit state
  setEditCommentText(""); // Reset the edited comment text
};

// Submit new or edited comment
const handleCommentSubmit = () => {
  if (!newComment.trim() && !editCommentText.trim()) return; // Prevent empty comments

  const commentData = {
    trackId: currentTrack._id,
    user: "User Name", // Replace with actual user data
    text: editCommentId ? editCommentText : newComment.trim(), // If editing, use edited text
  };

  if (editCommentId) {
    // Update existing comment
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment.id === editCommentId ? { ...comment, text: commentData.text } : comment
      )
    );
  } else {
    // Add new comment
    setComments((prevComments) => [
      ...prevComments,
      { ...commentData, id: Date.now() }, // Use timestamp as unique ID
    ]);
  }

  handleCloseModal(); // Close the modal after submission
};

// Delete a comment
const handleDeleteComment = (commentId) => {
  setComments((prevComments) => prevComments.filter((comment) => comment.id !== commentId));
};

// Close the modal


const handleEditComment = (commentId, currentText) => {
  setEditCommentId(commentId);
  setEditCommentText(currentText); // Set the comment text in the edit input field
};

const handleSaveEdit = () => {
  setComments((prevComments) =>
    prevComments.map((comment) =>
      comment.id === editCommentId
        ? { ...comment, text: editCommentText }
        : comment
    )
  );
  setEditCommentId(null);
  setEditCommentText("");
};



  const audioRef = useRef(null);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const toggleLightMode = () => setLightMode(!lightMode);

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };
 
  const handleAddComment = () => {
    if (!newComment.trim()) return; // To prevent empty comments
    const comment = {
      trackId: currentTrack._id,  // Link the comment to the current track
      user: 'User Name',  // Or fetch from logged-in user data
      text: newComment.trim(),
    };
    // Add the comment to the appropriate track
    setComments((prevComments) => [...prevComments, comment]);
    setNewComment('');  // Clear the comment input field after submission
  };
  
  

  const togglePlayPause = () => {
    setIsPlaying((prevIsPlaying) => {
      const newIsPlaying = !prevIsPlaying;
      if (audioRef.current) {
        if (newIsPlaying) {
          audioRef.current.play();
        } else {
          audioRef.current.pause();
        }
      }
      return newIsPlaying;
    });
  };
  const handleTrackProgress = (e) => setTrackProgress(e.target.value);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAlbums = async () => {
      const response = await fetch("http://localhost:8081/api/albums");
      const data = await response.json();
      setAlbums(data);
    };

    const fetchPodcasts = async () => {
      const response = await fetch("http://localhost:8081/api/podcasts");
      const data = await response.json();
      console.log("Fetched Podcasts:", data);
      setPodcasts(data);
    };
    fetchAlbums();
    fetchPodcasts();
  }, []);

  const handleLikeClick = (track) => {
    // Prepare the payload
    const payload = {
      token: localStorage.getItem("token"),
      trackid: track._id,
    };

    // Send request to toggle like/unlike
    axios
      .post("http://localhost:8081/add_liked_song", payload)
      .then((response) => {
        if (response.data?.msg === "ok") {
          const action = response.data?.action; // Action (liked or unliked)

          if (action === "unliked") {
            // If the track was unliked, remove it from the liked songs list
            setLikedSongs((prevLikedSongs) =>
              prevLikedSongs.filter((t) => t._id !== track._id)
            );
            setSnackbarMessage("Song unliked!");
            setSnackbarSeverity("info");
          } else if (action === "liked") {
            // If the track was liked, add it to the liked songs list
            setLikedSongs((prevLikedSongs) => [...prevLikedSongs, track]);
            setSnackbarMessage("Song liked!");
            setSnackbarSeverity("success");
          }
          setSnackbarOpen(true);
        } else {
          setSnackbarMessage("Error processing your request.");
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setSnackbarMessage("Network error.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      });
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  const handleAlbumClick = (album) => {
    setCurrentAlbum(album);
    setCurrentTrack(null);
    // Reset track on album change
  };
  const addToHistory = (track) => {
    setHistory((prevHistory) => {
      // Avoid duplicates
      if (prevHistory.some((t) => t._id === track._id)) return prevHistory;
      return [...prevHistory, track];
    });
  };

  const handleTrackClick = (track) => {
    if (audioRef.current) {
      audioRef.current.pause(); // Stop the currently playing track
      audioRef.current.currentTime = 0; // Reset the current time
    }
    setCurrentTrack(track);
    const trackIndex = currentAlbum.tracks.findIndex(
      (t) => t._id === track._id
    );
    setCurrentTrackIndex(trackIndex);
    setIsPlaying(true);
    addToHistory(track);
  };
  const handleTracksClick = (track) => {
     if (audioRef.current) {
    audioRef.current.pause(); // Stop the currently playing track
    audioRef.current.currentTime = 0; // Reset the current time
  }
    setCurrentTrack(track);
    setIsPlaying(true);
    addToHistory(track);
    // playTrack(track);
  };
  const handlePreviousTrack = () => {
    if (currentAlbum) {
      const prevIndex =
        (currentTrackIndex - 1 + currentAlbum.tracks.length) %
        currentAlbum.tracks.length;
      setCurrentTrackIndex(prevIndex);
      setCurrentTrack(currentAlbum.tracks[prevIndex]);
    }
  };
  const handleNextTrack = () => {
    if (currentAlbum) {
      const nextIndex = (currentTrackIndex + 1) % currentAlbum.tracks.length;
      setCurrentTrackIndex(nextIndex);
      setCurrentTrack(currentAlbum.tracks[nextIndex]);
    }
  };

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        // Fetch all tracks from the API
        const response = await axios.get("http://localhost:8081/api/tracks");
        const allTracks = response.data;

        // Select a random subset of tracks (e.g., 5 random tracks)
        const randomTracks = [];
        while (randomTracks.length < 5 && allTracks.length > 0) {
          const randomIndex = Math.floor(Math.random() * allTracks.length);
          randomTracks.push(allTracks[randomIndex]);
          allTracks.splice(randomIndex, 1); // Remove the track to prevent duplicate selection
        }

        // Set the random tracks to the state
        setNewReleases(randomTracks);
      } catch (error) {
        console.error("Error fetching tracks:", error);
      }
    };

    fetchTracks();
  }, []);

  useEffect(() => {
    if (audioRef.current && currentTrack) {
      audioRef.current.src = `http://localhost:8081/audios/${currentTrack.audio}`; // Update audio source
      audioRef.current.play(); // Play the new track
    }
  }, [currentTrack]);

  useEffect(() => {
    if (audioRef.current) {
      const interval = setInterval(() => {
        setTrackProgress(audioRef.current.currentTime);
      }, 500);
      return () => clearInterval(interval);
    }
  }, [currentTrack]);

  const handleProgressChange = (e) => {
    const value = e.target.value;
    if (audioRef.current) {
      audioRef.current.currentTime = value;
      setTrackProgress(value);
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    // Perform logout logic
    console.log("Logging out...");
    localStorage.removeItem("token"); // Remove token from local storage
    setUser(null); // Clear user state on logout
    navigate("/"); // Redirect to the landing page
  };

  //FOR PROFILE DISPLAY
  if (user) {
    return <div>{error}</div>; // Show loading while user data is being fetched
  }

  return (
    <div
    className={`${
      lightMode
        ? "bg-slate-600 text-white"
        : "bg-gray-900 text-white"
    } min-h-screen`}
    >
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen w-64 bg-gray-800 p-4 space-y-6 transition-transform transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ transition: "transform 0.3s ease-in-out" }}
      >
        <nav className="space-y-4 mt-6">
          {/* Show All Links */}
          <a href="#history" className="block hover:text-teal-400">
            History
          </a>
          <a href="/add-song" className="block hover:text-teal-400">
            Add New Song
          </a>
          <a href="/add-album" className="block hover:text-teal-400">
            Add New Album
          </a>
          <a href="/add-podcast" className="block hover:text-teal-400">
            Add New Podcast
          </a>
          <Link
            to={{
              pathname: "/liked-songs",
              state: { likedSongs }, // Pass the liked songs array
            }}
            className="block hover:text-teal-400"
          >
            Liked Songs
          </Link>
          {/* Light Mode Toggle */}
          <button
            className="block hover:text-teal-400"
            onClick={toggleLightMode}
          >
            {lightMode ? <FaMoon /> : <FaSun />} {/* Toggle Icons */}
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <main
        className={`flex-grow p-4 transition-all duration-300 ${
          sidebarOpen ? "ml-64" : ""
        }`}
      >
        {/* Top Navbar */}
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <button className="text-teal-400 text-3xl" onClick={toggleSidebar}>
              <FaBars /> {/* Hamburger Icon */}
            </button>
            <img src={logo} alt="Music World Logo" className="h-12" />
          </div>
          {/* Search Bar in Navbar (centered) */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                console.log("Search triggered");
              }}
              className="relative"
            >
              <input
                type="text"
                className="w-96 p-4 rounded-full bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Search for songs, artists, or albums..."
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white"
              >
                <FaSearch />
              </button>
            </form>
          </div>

          <div className="flex space-x-6">
            <a href="/About" className="hover:text-teal-400">
              About
            </a>
            <a href="#albums" className="hover:text-teal-400">
              Albums
            </a>
            <button
              className="relative hover:text-teal-400"
              onClick={toggleDropdown}
              type="submit"
            >
              Profile
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg">
                  <div className="p-4 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-700">
                    Name: {user?.name}
                    </p>
                    <p className="text-sm font-medium text-gray-700">
                      Email: {user?.email}
                    </p>
                  </div>
                  <button
                    className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </button>
          </div>
        </header>

        {/* Secondary Navbar */}

        <div className="flex space-x-6 mb-8">
          <a href="#new-releases" className="hover:text-teal-400">
            New Releases
          </a>
          <a href="/mood-genre" className="hover:text-teal-400">
            Mood & Genre
          </a>
          <a href="#artists" className="hover:text-teal-400">
            Artists
          </a>
        </div>
        <section id="history" className="mb-8">
          <h2 className="text-xl font-bold mb-4">🎧 Recently Played</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {history.map((track) => (
              <div
                key={track._id}
                className="bg-gray-800 p-4 rounded-lg hover:scale-105 transition-transform cursor-pointer"
                onClick={() => handleTracksClick(track)}
              >
                <div
                  className="bg-gray-700 h-40 rounded mb-2"
                  style={{
                    backgroundImage: `url(http://localhost:8081/uploads/${track.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                ></div>
                <p className="text-center">{track.title}</p>
              </div>
            ))}
          </div>
        </section>

        {/* New Releases Section */}
        <section id="new-releases" className="mb-8">
          <h2 className="text-xl font-bold mb-4">🎵 New Releases</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {newReleases.map((track) => (
              <div
                key={track._id}
                className="bg-gray-800 p-4 rounded-lg hover:scale-105 transition-transform cursor-pointer"
                onClick={() => handleTracksClick(track)}
              >
                <div
                  className="bg-gray-700 h-40 rounded mb-2"
                  style={{
                    backgroundImage: `url(http://localhost:8081/uploads/${track.image})`,
                    backgroundSize: "cover",
                  }}
                ></div>
                <p className="text-center">{track.title}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Podcasts Section */}
        <section id="podcasts" className="mb-8">
          <h2 className="text-xl font-bold mb-4">🎙️ Podcasts</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {podcasts.map((podcast) => (
              <div
                key={podcast.podcastName} // Use podcastName here
                className="bg-gray-800 p-4 rounded-lg hover:scale-105 transition-transform cursor-pointer"
                onClick={() => handleAlbumClick(podcast)}
              >
                <div
                  className="bg-gray-700 h-40 rounded mb-2"
                  style={{
                    backgroundImage: `url(http://localhost:8081/uploads/${podcast.coverimage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                ></div>
                <p className="text-center">{podcast.podcastName}</p>{" "}
                {/* Use podcastName */}
              </div>
            ))}
          </div>
        </section>

        {/* Albums Section */}
        <section id="albums" className="mb-8">
          <h2 className="text-xl font-bold mb-4">🎼 Albums</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {albums.map((album) => (
              <div
                key={album._id}
                className="bg-gray-800 p-4 rounded-lg hover:scale-105 transition-transform cursor-pointer"
                onClick={() => handleAlbumClick(album)}
              >
                <div
                  className="bg-gray-700 h-40 rounded mb-2"
                  style={{
                    backgroundImage: `url(http://localhost:8081/albumimage/${album.coverimage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                ></div>
                <p className="text-center">{album.albumName}</p>
              </div>
            ))}
          </div>
        </section>

        {currentAlbum && (
          <section id="tracks" className="mb-8">
            <h2 className="text-xl font-bold mb-4">
              🎶 {currentAlbum.albumName} Tracks
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {currentAlbum.tracks.map((track) => (
                <div
                  key={track._id}
                  className="bg-gray-800 p-4 rounded-lg hover:scale-105 transition-transform cursor-pointer"
                  onClick={() => handleTrackClick(track)}
                >
                  <div
                    className="bg-gray-700 h-40 rounded mb-2"
                    style={{
                      backgroundImage: `url(http://localhost:8081/uploads/${track.image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  ></div>
                  <p className="text-center">{track.title}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {currentTrack && (
          <div className="fixed bottom-0 left-0 right-0 bg-gray-800 p-4 flex items-center justify-between shadow-lg">
            <div className="flex items-center">
              <img
                src={`http://localhost:8081/uploads/${currentTrack.image}`}
                alt="Thumbnail"
                className="h-12 w-12 rounded-full"
              />
              <div className="ml-4">
                <p className="font-semibold">{currentTrack.title}</p>
                <p className="text-sm text-gray-400">{currentTrack.artist}</p>
              </div>
            </div>
            <input
              type="range"
              min="0"
              max={audioRef.current?.duration || 0}
              value={trackProgress}
              onChange={handleProgressChange}
            />
            <audio
              ref={audioRef}
              src={`http://localhost:8081/audios/${currentTrack.audio}`}
            />
            <div className="flex items-center space-x-4">
              <button
                className="p-2 bg-gray-600 rounded-full hover:bg-gray-500"
                onClick={handlePreviousTrack}
              >
                <FaBackward />
              </button>
              <button
                onClick={togglePlayPause}
                className="p-2 bg-gray-600 rounded-full hover:bg-gray-500"
              >
                {isPlaying ? <FaPause /> : <FaPlay />}
              </button>
              <button
                className="p-2 bg-gray-600 rounded-full hover:bg-gray-500"
                onClick={handleNextTrack}
              >
                <FaForward />
              </button>
              <button
                onClick={() => handleLikeClick(currentTrack)}
                className={`p-2 bg-gray-600 rounded-full hover:bg-gray-500 ${
                  likedSongs.some(
                    (likedTrack) => likedTrack._id === currentTrack?._id
                  )
                    ? "text-teal-500"
                    : "text-gray-400"
                }`}
              >
                <FaThumbsUp />
              </button>
              <div>
      {/* Existing Comment Button */}
      <button
        onClick={() => handleAddCommentClick()}
        className="p-2 bg-gray-600 rounded-full hover:bg-gray-500"
      >
        <FaComment />
      </button>

      {/* Modal for Comment */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-800 p-4 rounded-lg w-96">
            <h3 className="text-lg font-semibold">{editCommentId ? "Edit Comment" : "Add a Comment"}</h3>
            <textarea
              value={editCommentId ? editCommentText : newComment} // Use edited text if in edit mode
              onChange={(e) => {
                if (editCommentId) {
                  setEditCommentText(e.target.value);
                } else {
                  setNewComment(e.target.value);
                }
              }}
              className="w-full p-2 mt-2 rounded-lg bg-gray-700 text-white"
              rows="4"
              placeholder="Add your comment..."
            ></textarea>
            <div className="mt-4 flex justify-between">
              <button
                onClick={handleCloseModal}
                className="p-2 bg-gray-600 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleCommentSubmit}
                className="p-2 bg-teal-600 text-white rounded hover:bg-teal-500"
              >
                {editCommentId ? "Save Changes" : "Submit Comment"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Display Comments */}
      <div className="comments-section mt-8">
        <h3 className="text-lg font-semibold">Comments</h3>
        {comments
          .filter((comment) => comment.trackId === currentTrack?._id) // Only display comments for current track
          .map((comment) => (
            <div key={comment.id} className="p-2 bg-gray-800 rounded mb-4">
              <div className="flex justify-between">
                <span className="font-semibold">{comment.user}</span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleAddCommentClick(comment.id, comment.text)} // Open modal with comment pre-filled for editing
                    className="text-teal-500 hover:text-teal-400"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="text-red-500 hover:text-red-400"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <span>{comment.text}</span>
            </div>
          ))}
      </div>
    </div>
              </div>
              </div>
        )}
      </main>
      {/* Snackbar for alerts */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      {/* Footer */}
      <footer className="bg-gray-800 p-4 text-center text-gray-400">
        © 2024 Musiverse. All Rights Reserved.
      </footer>
    </div>
  );
};

export default Home1;
