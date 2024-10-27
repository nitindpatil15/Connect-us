import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChatHistory, sendMessage } from '../../Redux/Features/chatSlice';
import { getCurrentUser } from '../../Redux/Features/userSlice';

const Chat = () => {
  const dispatch = useDispatch();
  const { messages, chatHistory, loading, error } = useSelector((state) => state.chat);
  const { userInfo } = useSelector((state) => state.auth); // Assuming userInfo contains followers and following data
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    // Fetch current user data (including followers and following)
    dispatch(getCurrentUser());
  }, [dispatch]);

  useEffect(() => {
    if (userInfo) {
      // Assuming userInfo contains arrays of followers and following
      const contactList = [...userInfo.followers, ...userInfo.following];
      dispatch(fetchChatHistory(contactList)); // Update chatHistory with followers and following users
    }
  }, [userInfo, dispatch]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const receiverId = 'receiver-id'; // Replace with actual receiver ID from selected contact
      dispatch(sendMessage({ receiverId, message: newMessage }));
      setNewMessage('');
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/4 p-4 border-r border-gray-300 bg-gray-100">
        <input
          type="text"
          placeholder="Search..."
          className="w-full p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none"
        />
        <div className="space-y-4">
          {chatHistory.map((contact, index) => (
            <div
              key={index}
              className="flex items-center p-2 transition-all bg-white rounded-lg cursor-pointer hover:bg-gray-200"
            >
              <img
                src={contact.profilePicture || 'default-profile.png'} // Use default if profilePicture is missing
                alt="Profile"
                className="w-10 h-10 mr-3 rounded-full"
              />
              <div>
                <h5 className="font-semibold text-gray-900">{contact.username}</h5>
                <p className="text-sm text-gray-500">{contact.lastMessage || 'No recent message'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex flex-col w-1/2 p-4">
        <div className="flex-1 overflow-y-auto space-y-4 p-2 bg-gray-50">
          {loading ? (
            <p className="text-center text-gray-500">Loading messages...</p>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`flex items-end ${
                  msg.isSender ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-xs p-3 text-white rounded-lg ${
                    msg.isSender ? 'bg-blue-500' : 'bg-gray-300 text-gray-900'
                  }`}
                >
                  <p>{msg.content}</p>
                  <span className="text-xs text-gray-500">{msg.timestamp}</span>
                </div>
              </div>
            ))
          )}
          {error && <p className="text-center text-red-500">{error}</p>}
        </div>
        <div className="flex items-center p-2 mt-4 border-t border-gray-300">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 mr-2 border border-gray-300 rounded-lg focus:outline-none"
          />
          <button
            onClick={handleSendMessage}
            className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </div>

      {/* Profile Section */}
      <div className="w-1/4 p-4 bg-gray-100 border-l border-gray-300">
        <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow">
          <img
            src={userInfo?.profilePicture || 'profile-pic-url'}
            alt="Profile"
            className="w-24 h-24 mb-4 rounded-full"
          />
          <h3 className="text-lg font-semibold">{userInfo?.username || 'Profile Name'}</h3>
          <p className="text-sm text-gray-500 mb-4 text-center">
            {userInfo?.bio || 'Bio text here...'}
          </p>
          <button className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600">
            View Profile
          </button>
        </div>
        <div className="flex justify-around mt-6">
          <button className="p-2 text-blue-500 bg-gray-200 rounded-full">
            📞
          </button>
          <button className="p-2 text-blue-500 bg-gray-200 rounded-full">
            📹
          </button>
          <button className="p-2 text-blue-500 bg-gray-200 rounded-full">
            ✉️
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
