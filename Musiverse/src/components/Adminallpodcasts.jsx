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

const Adminallpodcasts = () => {
  const [podcasts, setPodcasts] = useState([]);
  const [alert, setAlert] = useState({ open: false, type: "", message: "" });
  const [editingPodcast, setEditingPodcast] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedPodcastName, setEditedPodcastName] = useState("");

  useEffect(() => {
    let isMounted = true;
    const fetchPodcasts = async () => {
      try {
        const response = await axios.get("http://localhost:8081/all-podcasts");
        if (Array.isArray(response.data) && isMounted) {
          setPodcasts(response.data);
        } else {
          throw new Error("Invalid data format");
        }
      } catch (err) {
        if (isMounted) showAlert("error", "Failed to fetch podcasts.");
      }
    };

    fetchPodcasts();
    return () => {
      isMounted = false;
    };
  }, []);

  const showAlert = (type, message) => {
    setAlert({ open: true, type, message });
  };

  const deletePodcast = async (podcastId) => {
    if (!podcastId) {
      showAlert("error", "Invalid podcast ID.");
      return;
    }
    try {
      const response = await axios.delete("http://localhost:8081/delete-podcast", {
        data: { podcastId },  // Ensure you're using the correct payload format
      });
      if (response.data.success) {
        showAlert("success", "Podcast deleted successfully!");
        setPodcasts(podcasts.filter((podcast) => podcast._id !== podcastId));  // Update UI after delete
      } else {
        showAlert("error", "Failed to delete podcast.");
      }
    } catch (err) {
      console.error("Error deleting podcast:", err);
      showAlert("error", "Failed to delete podcast.");
    }
  };
  
  

  const handleEditClick = (podcast) => {
    setEditingPodcast(podcast);
    setEditedTitle(podcast.title);
    setEditedPodcastName(podcast.podcastName); // Populate with podcastName
  };

  const handleSaveChanges = async () => {
    try {
      const response = await axios.post("http://localhost:8081/update-podcast", {
        _id: editingPodcast._id,
        title: editedTitle,
        podcastName: editedPodcastName,
      });
  
      if (response.data.message === "Podcast updated successfully!") {
        showAlert("success", "Podcast updated successfully!");
  
        // Update the podcast in the list
        const updatedPodcasts = podcasts.map((podcast) =>
          podcast._id === editingPodcast._id
            ? { ...podcast, title: editedTitle, podcastName: editedPodcastName }
            : podcast
        );
        setPodcasts(updatedPodcasts);
  
        // Close the edit form
        setEditingPodcast(null);
      } else {
        showAlert("error", response.data.message || "Failed to update podcast.");
      }
    } catch (err) {
      console.error("Error updating podcast:", err);
      showAlert("error", "Failed to update podcast.");
    }
  };
  

  const handleCancelEdit = () => {
    setEditingPodcast(null);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-900 text-white">
      <h2 className="text-3xl font-semibold mb-6 text-center">All Podcasts</h2>
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
        {podcasts.length > 0 ? (
          podcasts.map((podcast) => (
            <li key={podcast._id} className="border-b border-gray-700 pb-4">
              <div className="flex justify-between items-center">
                <div>
                  <strong className="text-xl">{podcast.title}</strong> from{" "}
                  <span className="italic">{podcast.podcastName}</span>
                  <br />
                </div>
                <div className="flex gap-2">
                  {/* Edit Button */}
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => handleEditClick(podcast)}
                    sx={{
                      width: "120px",
                      padding: "8px 16px",
                      fontWeight: "bold",
                    }}
                    className="text-white rounded-md hover:bg-green-700 focus:outline-none"
                  >
                    Edit
                  </Button>

                  {/* Delete Button */}
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => deletePodcast(podcast._id)}
                    sx={{
                      width: "120px",
                      padding: "8px 16px",
                      fontWeight: "bold",
                    }}
                    className="text-white rounded-md hover:bg-red-700 focus:outline-none"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </li>
          ))
        ) : (
          <p className="text-gray-400">No Podcasts available.</p>
        )}
      </ul>

      {/* Edit Dialog */}
      <Dialog open={Boolean(editingPodcast)} onClose={handleCancelEdit}>
        <DialogTitle>Edit Podcast</DialogTitle>
        <DialogContent>
          <TextField
            label="Podcast Title"
            fullWidth
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            margin="normal"
          />
          <TextField
            label="Podcast Name"
            fullWidth
            value={editedPodcastName} // Podcast name field
            onChange={(e) => setEditedPodcastName(e.target.value)} // Update state for podcast name
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

export default Adminallpodcasts;
