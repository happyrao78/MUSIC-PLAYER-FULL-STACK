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
} from "react-icons/fa"; // For icons
import logo from "../assets/logo.png";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";
import Alert from '@mui/material/Alert';


const Admin = () => {
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

  const audioRef = useRef(null);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const toggleLightMode = () => setLightMode(!lightMode);

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
    if (audioRef.current) {
      isPlaying ? audioRef.current.play() : audioRef.current.pause();
    }
  }, [isPlaying]);

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
          <Link
            to="/all-users"
            className="block hover:text-teal-400"
          >
            All Users
          </Link>
          <Link
            to="/list-of-all-tracks"
            className="block hover:text-teal-400"
          >
            All tracks
          </Link>
          <Link
            to="/list-of-all-podcasts"
            className="block hover:text-teal-400"
          >
            All Podcasts
          </Link>
          <Link
            to="/admin-likedsongs"
            className="block hover:text-teal-400"
          >
            Liked Songs
          </Link>
          <a href="/add-song" className="block hover:text-teal-400">
            Add New Song
          </a>
          <a href="/add-album" className="block hover:text-teal-400">
            Add New Album
          </a>
          <a href="/add-podcast" className="block hover:text-teal-400">
            Add New Podcast
          </a>
          
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
              {/* <button
                className="p-2 bg-gray-600 rounded-full hover:bg-gray-500"
                onClick={handleLikeClick}
              >
                ❤️
              </button> */}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 p-4 text-center text-gray-400">
        © 2024 Musiverse. All Rights Reserved.
      </footer>
    </div>
  );
};

export default Admin;
