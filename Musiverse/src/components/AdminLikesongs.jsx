// src/components/LikedSongs.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Snackbar, Alert, Button } from "@mui/material";

const AdminLikesongs = ({ userId }) => {
  const [likedSongs, setLikedSongs] = useState([]);
  const [alert, setAlert] = useState({ open: false, type: "", message: "" });// State for success message

  // Fetch liked songs for the given user
  useEffect(() => {
    const fetchLikedSongs = async () => {
      try {
        const response = await axios.get("http://localhost:8081/admin-liked-songs");
        setLikedSongs(response.data);
      } catch (err) {
        showAlert("error", "Failed to fetch liked songs.");
      }
    };

    fetchLikedSongs();
  }, []);

  const showAlert = (type, message) => {
    setAlert({ open: true, type, message });
  };


  // Handle deleting a liked song
  const deleteLikedSong = async (likeId) => {
    try {
      const response = await axios.delete("http://localhost:8081/delete-like", {
        data: { likeId },
      });
      console.log("Response from server:", response);
      if (response.data.success) {
        // Display success message
        showAlert("success", "Liked song deleted successfully!");

        // Remove the deleted song from the list
        setLikedSongs(likedSongs.filter((song) => song._id !== likeId));
      } else {
        showAlert("error", "Failed to delete liked song.");
      }
    } catch (err) {
        console.error(err);
        showAlert("error", "Failed to delete liked song.");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-900 text-white">
      <h2 className="text-3xl font-semibold mb-6 text-center">Liked Songs</h2>

      {/* Snackbar for alerts */}
      <Snackbar
        open={alert.open}
        autoHideDuration={4000}
        onClose={() => setAlert({ ...alert, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setAlert({ ...alert, open: false })}
          severity={alert.type}
          sx={{ width: "100%" }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
      
      <ul className="space-y-6">
        {likedSongs.length > 0 ? (
          likedSongs.map((song) => (
            <li key={song._id} className="border-b border-gray-700 pb-4">
              <div className="flex justify-between items-center">
                <div>
                  <strong className="text-xl">{song.trackDetails.title}</strong> by{" "}
                  <span className="italic">{song.trackDetails.artist}</span>
                  <br />
                  <em className="text-gray-400">{song.userDetails.email}</em>
                </div>
                <button
                  onClick={() => deleteLikedSong(song._id)}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none"
                >
                  Delete
                </button>
              </div>
            </li>
          ))
        ) : (
          <p className="text-gray-400">No liked songs available.</p>
        )}
      </ul>
    </div>
  );
};

export default AdminLikesongs;
