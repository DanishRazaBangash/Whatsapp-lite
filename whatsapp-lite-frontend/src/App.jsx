// src/App.jsx
import { Routes, Route } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Chat from "./pages/Chat";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  const { user, loading } = useContext(AuthContext);

  // Block the app until /auth/me finishes
  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  // When logged in, wrap the app (or protected area) with SocketProvider
  if (user) {
    return (
      <SocketProvider>
        <Routes>
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Chat />} />
        </Routes>
      </SocketProvider>
    );
  }

  // When logged out, render public routes (no SocketProvider)
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Login />} />
    </Routes>
  );
}
