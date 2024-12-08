import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8081/api/current-user",
          {
            headers: {
              "x-access-token": localStorage.getItem("tokenkey"),
            },
          }
        );
        setUser(response.data); // Set the user data
      } catch (error) {
        console.error(error);
        setError("Failed to fetch user details");
      }
    };

    if (localStorage.getItem("tokenkey")) {
      fetchUserDetails();
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
