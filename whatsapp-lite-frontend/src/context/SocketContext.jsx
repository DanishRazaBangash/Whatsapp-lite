// src/context/SocketContext.jsx
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "./AuthContext";

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const socketRef = useRef(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Only connect AFTER session is restored and user exists
    if (!loading && user && !socketRef.current) {
      const s = io("http://localhost:5000", {
        path: "/socket.io",
        withCredentials: true,
        transports: ["websocket", "polling"],
      });

      // optional: quick visibility if handshake fails
      s.on("connect_error", (err) => {
        console.error("Socket connect_error:", err?.message || err);
      });

      socketRef.current = s;
      setSocket(s);
    }

    // If user logs out (or becomes null), disconnect
    if (!loading && !user && socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setSocket(null);
    }

    // Cleanup when provider unmounts
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [loading, user]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
