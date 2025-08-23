import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Sidebar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="h-full flex flex-col">
      {/* Top user info */}
      <div className="p-4 flex justify-between items-center border-b">
        <h2 className="font-bold text-lg">{user?.username}</h2>
        <button
          onClick={logout}
          className="text-sm bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* Chats list */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 border-b hover:bg-gray-100 cursor-pointer">
          <p className="font-semibold">John Doe</p>
          <p className="text-sm text-gray-500">Last message...</p>
        </div>
        <div className="p-4 border-b hover:bg-gray-100 cursor-pointer">
          <p className="font-semibold">Jane Smith</p>
          <p className="text-sm text-gray-500">Typing...</p>
        </div>
      </div>
    </div>
  );
}
