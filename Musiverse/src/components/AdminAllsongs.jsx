import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Snackbar,
  Alert,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

const AdminAllsongs = () => {
  const [Tracks, setTracks] = useState([]);
  const [alert, setAlert] = useState({ open: false, type: "", message: "" });
  const [editingTrack, setEditingTrack] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedArtist, setEditedArtist] = useState("");

  useEffect(() => {
    let isMounted = true;
    const fetchtracks = async () => {
      try {
        const response = await axios.get("http://localhost:8081/all-tracks");
        if (Array.isArray(response.data) && isMounted) {
          setTracks(response.data);
        } else {
          throw new Error("Invalid data format");
        }
      } catch (err) {
        if (isMounted) showAlert("error", "Failed to fetch tracks.");
      }
    };

    fetchtracks();
    return () => {
      isMounted = false;
    };
  }, []);

  const showAlert = (type, message) => {
    setAlert({ open: true, type, message });
  };

  const deletetracks = async (likeId) => {
    if (!likeId) {
      showAlert("error", "Invalid track ID.");
      return;
    }
    try {
      const response = await axios.delete(
        "http://localhost:8081/delete-track",
        {
          data: { likeId },
        }
      );
      if (response.data.success) {
        showAlert("success", "Track deleted successfully!");
        setTracks(Tracks.filter((song) => song._id !== likeId));
      } else {
        showAlert("error", "Failed to delete track.");
      }
    } catch (err) {
      console.error("Error deleting track:", err);
      showAlert("error", "Failed to delete track.");
    }
  };

  const handleEditClick = (song) => {
    setEditingTrack(song);
    setEditedTitle(song.title);
    setEditedArtist(song.artist);
  };

  const handleSaveChanges = async () => {
    try {
      const response = await axios.post("http://localhost:8081/update-track", {
        _id: editingTrack._id, // Make sure _id is passed here as a string
        title: editedTitle,
        artist: editedArtist,
      });

      // Check if the backend response is successful
      if (response.data.message === "Track updated successfully!") {
        showAlert("success", "Track updated successfully!"); // Show success alert

        // Update the tracks in the frontend list automatically
        const updatedTracks = Tracks.map((track) =>
          track._id === editingTrack._id
            ? { ...track, title: editedTitle, artist: editedArtist }
            : track
        );
        setTracks(updatedTracks); // Update the track list with new values

        setEditingTrack(null); // Close the edit form (dialog)
      } else {
        showAlert("error", "Failed to update track."); // Show error alert
      }
    } catch (err) {
      console.error("Error updating track:", err);
      showAlert("error", "Failed to update track."); // Show error alert
    }
  };

  const handleCancelEdit = () => {
    setEditingTrack(null); // Close the edit dialog
  };

  return (
    <div className="min-h-screen p-6 bg-gray-900 text-white">
      <h2 className="text-3xl font-semibold mb-6 text-center">All Tracks</h2>
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
        {Tracks.length > 0 ? (
          Tracks.map((song) => (
            <li key={song._id} className="border-b border-gray-700 pb-4">
              <div className="flex justify-between items-center">
                <div>
                  <strong className="text-xl">{song.title}</strong> by{" "}
                  <span className="italic">{song.artist}</span>
                  <br />
                  {song.email && (
                    <em className="text-gray-400">{song.email}</em>
                  )}
                </div>
                <div className="flex gap-2">
                  {/* Edit Button */}
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => handleEditClick(song)}
                    sx={{
                      width: "120px", // Ensures the same width for both buttons
                      padding: "8px 16px", // Adjust padding for consistency
                      fontWeight: "bold", // Optional: to make the text bold
                    }}
                    className="text-white rounded-md hover:bg-green-700 focus:outline-none"
                  >
                    Edit
                  </Button>

                  {/* Delete Button */}
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => deletetracks(song._id)}
                    sx={{
                      width: "120px", // Ensures the same width for both buttons
                      padding: "8px 16px", // Adjust padding for consistency
                      fontWeight: "bold", // Optional: to make the text bold
                    }}
                    className=" text-white rounded-md hover:bg-red-700 focus:outline-none"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </li>
          ))
        ) : (
          <p className="text-gray-400">No Tracks available.</p>
        )}
      </ul>

      {/* Edit Dialog */}
      <Dialog open={Boolean(editingTrack)} onClose={handleCancelEdit}>
        <DialogTitle>Edit Track</DialogTitle>
        <DialogContent>
          <TextField
            label="Track Title"
            fullWidth
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            margin="normal"
          />
          <TextField
            label="Artist"
            fullWidth
            value={editedArtist}
            onChange={(e) => setEditedArtist(e.target.value)}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelEdit} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSaveChanges} color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AdminAllsongs;
