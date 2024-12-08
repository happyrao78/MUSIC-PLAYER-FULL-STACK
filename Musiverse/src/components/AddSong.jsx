import React, { useState } from "react";
import axios from "axios";
import { Snackbar, Alert, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Grid, TextField } from "@mui/material";

const SongUploadForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    artist: "",
    album: "",
    genre: "",
    language: "",
    releaseYear: "",
    email: "",
    audio: null,
    image: null,
  });

  const [alert, setAlert] = useState({ open: false, message: "", severity: "" });
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
    const data = new FormData();

    // Append form data
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    try {
      const response = await axios.post(
        "http://localhost:8081/api/upload",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setAlert({
        open: true,
        message: "Song uploaded successfully!",
        severity: "success",
      });
      setTimeout(() => {
        navigate("/home");
      }, 2000);
      console.log(response.data);
    } catch (error) {
      console.log("Error uploading song:", error);
      // alert("Failed to upload the song. Please try again.");
      setAlert({
        open: true,
        message: "Failed to upload the song. Please try again.",
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
  className="bg-white text-black p-6 rounded-lg shadow-lg w-full max-w-xl"
>
  <h2 className="text-2xl font-bold text-center mb-6">Upload a Song</h2>

  {/* Form Fields */}
  <Grid container spacing={3}>
    {/* Row 1 */}
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

    {/* Row 2 */}
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

    {/* Row 3 */}
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

    {/* Row 4 */}
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

    {/* Row 5 */}
    <Grid item xs={12} sm={6}>
      <input
        type="file"
        id="audio"
        name="audio"
        accept="audio/*"
        onChange={handleChange}
        required
        className="w-full bg-gray-200 border border-gray-600 rounded px-3 py-2"
      />
      <label className="block font-medium mb-1" htmlFor="audio">
        Upload Audio
      </label>
    </Grid>
    <Grid item xs={12} sm={6}>
      <input
        type="file"
        id="image"
        name="image"
        accept="image/*"
        onChange={handleChange}
        required
        className="w-full bg-gray-200 border border-gray-600 rounded px-3 py-2"
      />
      <label className="block font-medium mb-1" htmlFor="image">
        Upload Image
      </label>
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

export default SongUploadForm;
