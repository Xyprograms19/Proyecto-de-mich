import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(authService.getCurrentUser());
  const [loadingUser] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserSession = () => {
      const currentUser = authService.getCurrentUser();

      if (currentUser && currentUser.token) {
        setUser(currentUser);
      } else {
        setUser(null);
        if (window.location.pathname !== "/login") {
          console.log("No user or token found, redirecting to login.");
          navigate("/login", { replace: true });
        }
      }
    };

    checkUserSession();
  }, [navigate]);

  const logout = () => {
    authService.logout();
    setUser(null);
    navigate("/login", { replace: true });
  };

  return (
    <UserContext.Provider value={{ user, setUser, loadingUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
