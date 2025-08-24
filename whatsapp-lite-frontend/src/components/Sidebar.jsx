import { useEffect, useState, useContext } from "react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function Sidebar({ onSelectChat }) {
  const { user } = useContext(AuthContext);
  const [chats, setChats] = useState([]);

 useEffect(() => {
  const fetchChats = async () => {
    try {
      const res = await API.get("/chats");
      console.log("Chats response:", res.data);

      setChats(Array.isArray(res.data) ? res.data : res.data.chats || []);
    } catch (err) {
      console.error("Error loading chats:", err);
    }
  };
  fetchChats();
}, []);


  return (
    <div className="w-1/4 border-r bg-gray-50 p-3">
      <h2 className="font-bold mb-4">Chats</h2>
      {chats.map((chat) => (
        <div
          key={chat._id}
          className="p-2 hover:bg-gray-200 rounded cursor-pointer"
          onClick={() => onSelectChat(chat)}
        >
          {chat.isGroup ? chat.name : chat.users.find(u => u._id !== user._id)?.username}
        </div>
      ))}
    </div>
  );
}
