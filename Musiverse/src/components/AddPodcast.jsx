import React, { useState } from "react";
import axios from "axios";
import { Snackbar, Alert, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const PodcastUploadForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    podcastName: "",
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
        "http://localhost:8081/api/uploadpodcast",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setAlert({
        open: true,
        message: "Podcast uploaded successfully!",
        severity: "success",
      });
      setTimeout(() => {
        navigate("/home");
      }, 2000);
      console.log(response.data);
    } catch (error) {
      
      console.log("Error uploading podcast:", error);
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
        <h2 className="text-2xl font-bold text-center mb-6">
          Upload a podcast
        </h2>

        {/* Song Name */}
        <div className="mb-4">
          <label className="block font-medium mb-1" htmlFor="title">
            Podcast Episode Name
          </label>
          <input
            type="text"
            id="title"
            name="title"
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        {/* Artist Name */}
        <div className="mb-4">
          <label className="block font-medium mb-1" htmlFor="podcastName">
            Podcast Name
          </label>
          <input
            type="text"
            id="podcastName"
            name="podcastName"
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        {/* Upload Audio */}
        <div className="mb-4">
          <label className="block font-medium mb-1" htmlFor="audio">
            Upload Audio
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
        </div>

        {/* Upload Image */}
        <div className="mb-4">
          <label className="block font-medium mb-1" htmlFor="image">
            Upload Image
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
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
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

export default PodcastUploadForm;
