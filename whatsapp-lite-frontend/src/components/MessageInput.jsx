import { useState } from "react";

export default function MessageInput() {
  const [message, setMessage] = useState("");

  const sendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    console.log("Send:", message);
    setMessage("");
  };

  return (
    <form onSubmit={sendMessage} className="p-4 bg-white border-t flex">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message"
        className="flex-1 border px-4 py-2 rounded-lg focus:ring-2 focus:ring-green-500"
      />
      <button
        type="submit"
        className="ml-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
      >
        Send
      </button>
    </form>
  );
}
