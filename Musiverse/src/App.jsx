import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import Home from "./components/Home";
import Admin from "./components/Admin";
import About from "./components/About";
import AddSong from "./components/AddSong";
import LikedSongs from "./components/LikedSongs";
import MoodGenre from "./components/MoodGenre";
import AddPodcast from "./components/AddPodcast";
import AddAlbum from "./components/AddAlbum";
import { UserProvider } from "./components/UserContext";
import AdminLikesongs from "./components/AdminLikesongs";
import AdminAllsongs from "./components/AdminAllsongs";
import Adminallpodcasts from "./components/Adminallpodcasts";
import Allusers from "./components/Allusers";

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/About" element={<About />} />
          <Route path="/add-song" element={<AddSong />} />
          <Route path="/liked-songs" element={<LikedSongs />} />
          <Route path="/mood-genre" element={<MoodGenre />} />
          <Route path="/add-podcast" element={<AddPodcast />} />
          <Route path="/add-album" element={<AddAlbum />} />
          <Route path="/admin-likedsongs" element={<AdminLikesongs />} />
          <Route path="/admin-dashboard" element={<Admin />} />
          <Route path="/list-of-all-tracks" element={<AdminAllsongs />} />
          <Route path="/list-of-all-podcasts" element={<Adminallpodcasts />} />
          <Route path="/all-users" element={<Allusers/>} />
        </Routes>
        
      </Router>
    </UserProvider>
  );
}

export default App;
