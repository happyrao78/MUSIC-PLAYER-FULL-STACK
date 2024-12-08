import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SignupModal from "./SignUp";
import AdminLoginModal from "./AdminLogin";
import backgroundVideo from "../assets/background.mp4";
import logo from "../assets/logo.png";

const LandingPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null); // Error message state
  const [isAdminModalOpen, setAdminModalOpen] = useState(false);
  const navigate = useNavigate(); // To navigate to the Home page on successful login

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const openModaladmin = () => setAdminModalOpen(true);
  const closeModaladmin = () => setAdminModalOpen(false);

  const handleSignupSuccess = (message) => {
    // Display success message
    alert(message);
  };

  const handleLoginSuccess = (token) => {
    // Store the token (e.g., in localStorage)
    localStorage.setItem("authToken", token);

    // Navigate to Home.jsx on successful login
    navigate("/home");
  };

  const handleError = (message) => {
    // Display error message
    setErrorMessage(message);
    alert(message); // Show as alert popup
  };
  const handle = () => {
    const token = localStorage.getItem("token");
    return token ? true : false;
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <video
        className="absolute top-0 left-0 w-full h-full max-h-screen object-cover object-center"
        src={backgroundVideo}
        autoPlay
        loop
        muted
      ></video>

      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50"></div>

      {/* Header */}
      <header className="relative z-10 flex justify-between items-center p-6">
        <img src={logo} alt="Music World Logo" className="h-12" />
        <nav className="flex space-x-6 ml-auto text-lg">
          <a href="#about" className="hover:text-gray-300">
            About
          </a>
          {handle() ? (
            <a href="/home" className="hover:text-gray-300">
            Home
          </a>
          ) : (
            <>
            <button onClick={openModal} className="hover:text-gray-300">
              Sign Up
            </button>
            <button
        onClick={openModaladmin}
        className="hover:text-gray-300"
      >
        Admin 
      </button>
          </>
          )}
        </nav>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col justify-center items-start min-h-[87.5vh] px-8 md:px-16 lg:px-24">
        <div className="max-w-lg">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            “Where words fail, music speaks.”
          </h2>
          <p className="text-lg md:text-xl text-gray-300">
            Experience the power of music with us. Let the rhythm, harmony, and
            melody bring magic to your life.
          </p>
        </div>
      </main>

      {/* About Section */}
      <section
        id="about"
        className="relative min-h-screen flex items-center justify-center -mt-2"
        style={{ backgroundColor: "#01011e" }}
      >
        <div className="relative z-10 bg-white bg-opacity-95 p-12 rounded-lg max-w-3xl mx-4 text-center">
          <h3 className="text-4xl font-bold mb-6 text-[#110640]">
            About Musiverse
          </h3>
          <p className="text-lg leading-relaxed text-[#333366]">
            Welcome to Musiverse, a unique online platform where the world of
            music comes alive. From discovering emerging artists to revisiting
            timeless classics, Musiverse is designed for every music lover. Dive
            into a universe where melodies meet passion, and let your soul
            resonate with the rhythm.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-gray-900 text-center py-4 text-sm text-gray-400">
        <p>Contact us: info@musiverse.com | Phone: (123) 456-7890</p>
        <p className="mt-2">
          &copy; {new Date().getFullYear()} Musiverse. All rights reserved.
        </p>
      </footer>

      {/* Signup Modal */}
      <SignupModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSignupSuccess={handleSignupSuccess}
        onError={handleError}
        onLoginSuccess={handleLoginSuccess}
      />

<AdminLoginModal
        isOpen={isAdminModalOpen}
        onClose={closeModaladmin}
        onSignupSuccess={handleSignupSuccess}
        onError={handleError}
        onLoginSuccess={handleLoginSuccess}
      />


      {/* Show error message if any */}
      {errorMessage && <div className="popup">{errorMessage}</div>}
    </div>
  );
};

export default LandingPage;
