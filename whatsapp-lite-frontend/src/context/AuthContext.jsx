import { createContext, useState, useEffect } from "react";
import API from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // TODO: hit a /me endpoint later for auto-login
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
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
