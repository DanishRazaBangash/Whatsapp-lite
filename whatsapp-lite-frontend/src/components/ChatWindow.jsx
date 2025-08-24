import { useEffect, useState } from "react";
import API from "../api/axios";
import { io } from "socket.io-client";

let socket;

export default function ChatWindow({ chat }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (!chat) return;

    const fetchMessages = async () => {
      try {
        const res = await API.get(`/messages/${chat._id}`);
        setMessages(res.data);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };

    fetchMessages();

    // connect socket
    if (!socket) {
      socket = io(import.meta.env.VITE_BACKEND_URL, { withCredentials: true });
    }

    socket.emit("joinChat", chat._id);

    socket.on("newMessage", (msg) => {
      if (msg.chat === chat._id) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => {
      socket.off("newMessage");
      socket.emit("leaveChat", chat._id);
    };
  }, [chat]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const res = await API.post("/messages", {
        chatId: chat._id,
        content: newMessage,
      });
      socket.emit("sendMessage", res.data);
      setMessages((prev) => [...prev, res.data]);
      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 overflow-y-auto p-3">
        {messages.map((msg) => (
          <div key={msg._id} className="mb-2">
            <b>{msg.sender.username}: </b> {msg.content}
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} className="p-3 border-t flex">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 border rounded p-2"
          placeholder="Type a message..."
        />
        <button type="submit" className="ml-2 px-4 py-2 bg-green-500 text-white rounded">
          Send
        </button>
      </form>
    </div>
  );
}
