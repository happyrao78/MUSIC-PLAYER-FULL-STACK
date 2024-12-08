import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { UserProvider } from "./components/UserContext"; // Import the UserProvider component

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>
      {" "}
      {/* Wrap your App with UserProvider */}
      <App />
    </UserProvider>
  </StrictMode>
);
