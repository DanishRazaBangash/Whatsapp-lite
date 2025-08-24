// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from "react";
import API from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // 👈 expose this

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get("/auth/me");  // cookie-based
        setUser(res.data.user);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false); // 👈 important
      }
    };
    fetchUser();
  }, []);

  const login = async (data) => {
    const res = await API.post("/auth/login", data);
    setUser(res.data.user);
  };

  const register = async (data) => {
    const res = await API.post("/auth/register", data);
    setUser(res.data.user);
  };

  const logout = async () => {
    await API.post("/auth/logout");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
