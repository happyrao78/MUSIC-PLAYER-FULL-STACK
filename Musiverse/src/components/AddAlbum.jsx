import React, { useState } from "react";
import axios from "axios";
import { Snackbar, Alert, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Grid, TextField } from "@mui/material";

const AlbumuploadForm = () => {
  const [formData, setFormData] = useState({
    album: "",
    genre: "",
    title: "",
    artist: "",
    language: "",
    releaseYear: "",
    email:"",
    audio: null,
    image: null,
    coverimage: null,
    genreimage: null,
  });

  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === "file" ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.audio ||
      !formData.image ||
      !formData.coverimage ||
      !formData.genreimage
    ) {
      setAlert({
        open: true,
        message:
          "All file fields (audio, image, coverimage, genreimage) are required!",
        severity: "error",
      });
      return;
    }
    const data = new FormData();

    // Append form data
    Object.keys(formData).forEach((key) => {
      if (formData[key]) {
        data.append(key, formData[key]);
      }
    });

    try {
      const response = await axios.post(
        "http://localhost:8081/api/addalbum",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setAlert({
        open: true,
        message: "Album uploaded successfully!",
        severity: "success",
      });
      setTimeout(() => {
        navigate("/home");
      }, 2000);
      console.log(response.data);
    } catch (error) {
      console.error("Error uploading album:", error);
      setAlert({
        open: true,
        message: "Failed to upload the Podcast. Please try again.",
        severity: "error",
      });
    }
  };
  const handleAlertClose = () => {
    setAlert({ ...alert, open: false });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center mb-6">Upload an Album</h2>

        {alert.open && (
          <Alert severity={alert.severity} className="mb-4">
            {alert.message}
          </Alert>
        )}

        {/* Album Name and Genre */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Album Name"
              variant="outlined"
              fullWidth
              name="album"
              value={formData.album}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Genre"
              variant="outlined"
              fullWidth
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Grid>
          {/* Song Name and Artist Name */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Song Name"
              variant="outlined"
              fullWidth
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Artist Name"
              variant="outlined"
              fullWidth
              name="artist"
              value={formData.artist}
              onChange={handleChange}
              required
            />
          </Grid>

          {/* Language and Release Year */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Language"
              variant="outlined"
              fullWidth
              name="language"
              value={formData.language}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Release Year"
              variant="outlined"
              fullWidth
              name="releaseYear"
              value={formData.releaseYear}
              onChange={handleChange}
              required
            />
          </Grid>
        </Grid>

        {/* File Uploads */}
        <Grid container spacing={3}>
          {/* Upload Audio and Image */}
          <Grid item xs={12} sm={6}>
            <label htmlFor="audio" className="block font-medium mb-1">
              Upload a Song
            </label>
            <input
              type="file"
              id="audio"
              name="audio"
              accept="audio/*"
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <label htmlFor="image" className="block font-medium mb-1">
              Upload Image of Track
            </label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </Grid>

          {/* Cover Image and Genre Image */}
          <Grid item xs={12} sm={6}>
            <label htmlFor="coverimage" className="block font-medium mb-1">
              Cover Image of Album
            </label>
            <input
              type="file"
              id="coverimage"
              name="coverimage"
              accept="image/*"
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <label htmlFor="genreimage" className="block font-medium mb-1">
              Genre Image
            </label>
            <input
              type="file"
              id="genreimage"
              name="genreimage"
              accept="image/*"
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </Grid>
        </Grid>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mt-4"
        >
          Submit
        </button>
      </form>

      {/* Snackbar Alert */}
      <Snackbar
        open={alert.open}
        autoHideDuration={3000}
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleAlertClose}
          severity={alert.severity}
          sx={{ width: "100%" }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AlbumuploadForm;
