import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchChatHistory,
  sendMessage,
  addMessageToHistory,
  fetchUnreadMessages,
} from "../../Redux/Features/chatSlice";
import { getCurrentUser } from "../../Redux/Features/userSlice";
import { useNavigate } from "react-router-dom";

const Chat = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { chatHistory } = useSelector((state) => state.chat);
  const { userInfo } = useSelector((state) => state.auth);
  const [newMessage, setNewMessage] = useState("");
  const [selectedContact, setSelectedContact] = useState(null);
  const chatContainerRef = useRef(null);
  const currentUserId = userInfo?.user?._id;

  useEffect(() => {
    dispatch(getCurrentUser());
    dispatch(fetchUnreadMessages());

    if (selectedContact) {
      const intervalId = setInterval(() => {
        dispatch(fetchChatHistory(selectedContact._id)); // Make sure to pass the _id
      }, 5000); // Poll every 5 seconds

      return () => clearInterval(intervalId);
    }
  }, [dispatch, selectedContact]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const contactList = userInfo ? [...userInfo?.user?.followers] : [];

  const handleContactClick = (contact) => {
    setSelectedContact(contact);
    dispatch(fetchChatHistory(contact._id)); // Ensure passing the correct contact ID
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() && selectedContact) {
      const receiverId = selectedContact._id; // Get the _id of the selected contact

      const messageData = {
        sender: {
          _id: currentUserId,
          username: userInfo.user.username,
          avatar: userInfo.user.avatar,
        },
        receiver: receiverId, // Pass the receiver ID
        message: newMessage,
        timestamp: new Date().toISOString(),
      };

      try {
        await dispatch(
          sendMessage({ receiverId, message: newMessage }) // Pass the correct receiverId
        ).unwrap();

        dispatch(addMessageToHistory(messageData));
        setNewMessage("");
      } catch (err) {
        alert(err); // Show alert if there is an error sending the message
      }
    }
  };

  const navigateToUserProfile = (userId) => {
    navigate(`/profile/${userId}`);
  };

  return (
    <div className="flex h-screen w-full">
      {/* Contacts List Section */}
      <div className="w-[20rem] p-4 border-r border-gray-300 bg-gray-100">
        <input
          type="text"
          placeholder="Search..."
          className="w-full p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none"
        />
        <div className="space-y-4">
          {contactList.map((contact) => (
            <div
              key={contact._id}
              onClick={() => handleContactClick(contact)}
              className="flex items-center p-2 transition-all bg-white rounded-lg cursor-pointer hover:bg-gray-200"
            >
              <img
                src={contact.avatar || "default-profile.png"}
                alt="Profile"
                className="w-10 h-10 mr-3 rounded-full"
              />
              <div>
                <h5
                  className="font-semibold text-gray-900 cursor-pointer"
                  onClick={() => navigateToUserProfile(contact._id)}
                >
                  {contact.username}
                </h5>
                <p className="text-sm text-gray-500">
                  {"Tap to view Msg"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Section */}
      <div className="flex-1 flex flex-col w-[40rem] h-auto border-red-700 border-2">
        {selectedContact && (
          <div className="flex items-center p-4 bg-gray-200 border-b border-red-300">
            <img
              src={selectedContact.avatar || "default-profile.png"}
              alt="Profile"
              className="w-10 h-10 mr-3 rounded-full"
              onClick={() => navigateToUserProfile(selectedContact._id)}
            />
            <h5
              className="font-semibold text-gray-900 cursor-pointer"
              onClick={() => navigateToUserProfile(selectedContact._id)}
            >
              {selectedContact.username}
            </h5>
          </div>
        )}

        <div className="flex-1 p-4 overflow-y-auto" ref={chatContainerRef}>
          {chatHistory.map((message, index) => (
            <div
              key={index}
              className={`flex items-end mb-4 ${
                message.sender._id === currentUserId
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              {message.sender._id !== currentUserId && (
                <img
                  src={message.sender.avatar || "default-profile.png"}
                  alt="Profile"
                  className="w-8 h-8 mr-2 rounded-full cursor-pointer"
                  onClick={() => navigateToUserProfile(message.sender._id)}
                />
              )}
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  message.sender._id === currentUserId
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300 text-black"
                }`}
              >
                {message.content} 
              </div>
              {message.sender._id === currentUserId && (
                <img
                  src={userInfo.user.avatar || "default-profile.png"}
                  alt="Profile"
                  className="w-8 h-8 ml-2 rounded-full cursor-pointer"
                  onClick={() => navigateToUserProfile(currentUserId)}
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
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none"
          />
          <button
            onClick={handleSendMessage}
            className="ml-2 px-4 py-2 text-white bg-blue-500 rounded-lg"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
