import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve user and token from local storage
    const storedUser = localStorage.getItem("obeUser");
    const storedToken = localStorage.getItem("obeToken");

    // Redirect to home page if token does not exist
    if (!storedToken) {
      navigate("/");
      return;
    }

    // Set user and token in the context
    setUser(JSON.parse(storedUser));
    setToken(storedToken);
  }, [navigate]);

  const setUserAndToken = (userData, tokenData) => {
    setUser(userData);
    setToken(tokenData);
  };

  const handleLogout = () => {
    // Clear user and token from the context and local storage
    setUser(null);
    setToken(null);
    localStorage.removeItem("obeUser");
    localStorage.removeItem("obeToken");

    // Redirect to home page or any other desired page
    navigate("/");
  };
  const contextValue = {
    user,
    token,
    setUserAndToken,
    handleLogout,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};
