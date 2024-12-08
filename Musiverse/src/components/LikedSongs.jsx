import React, { useState, useEffect } from "react";
import axios from "axios";

const LikedSongs = () => {
  const [likedSongs, setLikedSongs] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token"); // Retrieve token from local storage
    axios
      .get("http://localhost:8081/liked_songs_with_details", {
        params: { token },
      })
      .then((response) => {
        setLikedSongs(response.data);
      })
      .catch((error) => {
        console.error("Error fetching liked songs:", error);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <h2 className="text-2xl font-bold mb-4">Liked Songs</h2>

      {likedSongs.length === 0 ? (
        <p className="text-center text-lg">No liked songs yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {likedSongs.map((track) => (
            <div
              key={track._id}
              className="bg-gray-800 p-4 rounded-lg cursor-pointer hover:scale-105 transition-transform"
            >
              <div
                className="bg-gray-700 h-40 rounded mb-2"
                style={{
                  backgroundImage: `url(http://localhost:8081/uploads/${track.trackDetails.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              ></div>
              <p className="text-center text-lg">{track.trackDetails.title}</p>
              <p className="text-center text-sm text-gray-400">
                {track.trackDetails.artist}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LikedSongs;
