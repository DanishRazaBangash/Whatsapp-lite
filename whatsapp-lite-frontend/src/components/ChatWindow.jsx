import MessageInput from "./MessageInput";

export default function ChatWindow() {
  return (
    <div className="h-full flex flex-col">
      {/* Chat Header */}
      <div className="p-4 border-b bg-white shadow">
        <h2 className="font-semibold">John Doe</h2>
        <p className="text-sm text-gray-500">online</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        <div className="flex justify-start">
          <div className="bg-white px-4 py-2 rounded-lg shadow">
            Hey, how are you?
          </div>
        </div>
        <div className="flex justify-end">
          <div className="bg-green-200 px-4 py-2 rounded-lg shadow">
            I'm good, thanks!
          </div>
        </div>
      </div>

      {/* Input */}
      <MessageInput />
    </div>
  );
}
