import React, { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ChatWindow = ({
  chatHistory,
  selectedContact,
  onSendMessage,
  newMessage,
  setNewMessage,
  currentUserId,
}) => {
  const chatContainerRef = useRef(null);

  const navigate = useNavigate()

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  return (
    <div className="flex-1 w-screen md:w-[40rem] flex flex-col bg-white h-full">
      {selectedContact && (
        <div className="flex items-center p-4 bg-gray-100 border-b border-gray-300">
          <img
            src={selectedContact.avatar || "default-profile.png"}
            alt="Profile"
            className="w-10 h-10 mr-3 rounded-full cursor-pointer"
            onClick={()=>navigate(`/profile/${selectedContact._id}`)}
          />
          <h5 className="font-semibold text-gray-800 cursor-pointer" onClick={()=>navigate(`/profile/${selectedContact._id}`)}>{selectedContact.username}</h5>
        </div>
      )}

      <div className="flex-1 p-4 overflow-y-auto" ref={chatContainerRef}>
        {chatHistory.map((message, index) => (
          <div
            key={index}
            className={`flex items-end mb-4 ${
              message.sender._id === currentUserId ? "justify-end" : "justify-start"
            }`}
          >
            {message.sender._id !== currentUserId && (
              <img
                src={message.sender.avatar || "default-profile.png"}
                alt="Profile"
                className="w-8 h-8 mr-2 rounded-full"
              />
            )}
            <div
              className={`max-w-xs px-4 py-2 rounded-2xl shadow ${
                message.sender._id === currentUserId
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-gray-200 text-gray-900 rounded-bl-none"
              }`}
            >
              {message.content}
            </div>
            {message.sender._id === currentUserId && (
              <img
                src={message.sender.avatar || "default-profile.png"}
                alt="Profile"
                className="w-8 h-8 ml-2 rounded-full"
              />
            )}
          </div>
        ))}
      </div>

      <div className="flex p-4 border-t border-gray-300">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none"
        />
        <button
          onClick={onSendMessage}
          className="ml-3 px-4 py-2 text-white bg-blue-500 rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
