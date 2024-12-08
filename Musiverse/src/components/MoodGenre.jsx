import React, { useState, useEffect, useRef } from "react";
import { FaBackward, FaForward, FaPlay, FaPause } from "react-icons/fa"; // For icons
import logo from "../assets/logo.png";
import axios from "axios";
import { Link } from "react-router-dom";

const MoodGenre = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackProgress, setTrackProgress] = useState(0);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [currentAlbum, setCurrentAlbum] = useState(null);
  const [albums, setAlbums] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [likedSongs, setLikedSongs] = useState([]);

  const audioRef = useRef(null);

  const togglePlayPause = () => setIsPlaying(!isPlaying);

  const handleTrackProgress = (e) => setTrackProgress(e.target.value);

  useEffect(() => {
    const fetchAlbums = async () => {
      const response = await fetch("http://localhost:8081/api/albums");
      const data = await response.json();
      setAlbums(data);
    };
    fetchAlbums();
  }, []);
  const handleLikeClick = () => {
    if (
      currentTrack &&
      !likedSongs.some((track) => track._id === currentTrack._id)
    ) {
      const updatedLikedSongs = [...likedSongs, currentTrack];
      // write code to call server to update liked song in database
      axios
        .post("http://localhost:8081/add_liked_song", {
          token: localStorage.getItem("token"),
          trackid: currentTrack._id,
        })
        .then((response) => {
          if (response.data.msg === "ok") {
            setLikedSongs(updatedLikedSongs);
            console.log("liked!"); // Add to liked songs
          } else {
            console.log("try  again");
          }
        });
    }
  };

  const handleAlbumClick = (album) => {
    setCurrentAlbum(album);
    setCurrentTrack(null);
    // Reset track on album change
  };
  const handleTrackClick = (track) => {
    const trackIndex = currentAlbum.tracks.findIndex(
      (t) => t._id === track._id
    );
    setCurrentTrackIndex(trackIndex);
    setCurrentTrack(track);
    setIsPlaying(true);
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

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      {/* Main Content */}
      <main className="p-6">
        {/* Albums Section */}
        <section id="albums" className="mb-8">
          <h1 className="text-xl font-bold mb-4">Mood & Genre </h1>
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
                    backgroundImage: `url(http://localhost:8081/albumimage/${album.genreimage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                ></div>
                <p className="text-center">{album.genre}</p>
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
                className="p-2 bg-gray-600 rounded-full hover:bg-gray-500"
                onClick={handleLikeClick}
              >
                ❤️
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MoodGenre;
