import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchChatHistory,
  sendMessage,
  addMessageToHistory,
  fetchUnreadMessages,
} from "../../Redux/Features/chatSlice";
import { getCurrentUser } from "../../Redux/Features/userSlice";
import ContactList from "./ContactList";
import ChatWindow from "./ChatWindow";

const Chat = () => {
  const dispatch = useDispatch();
  const { chatHistory } = useSelector((state) => state.chat);
  const { userInfo } = useSelector((state) => state.auth);
  const [newMessage, setNewMessage] = useState("");
  const [selectedContact, setSelectedContact] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const currentUserId = userInfo?.user?._id;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    dispatch(getCurrentUser());
    dispatch(fetchUnreadMessages());

    if (selectedContact) {
      const intervalId = setInterval(() => {
        dispatch(fetchChatHistory(selectedContact._id));
      }, 5000);

      return () => clearInterval(intervalId);
    }
  }, [dispatch, selectedContact]);

  const contactList = userInfo
    ? Array.from(
        new Set(
          [...userInfo.user.followers, ...userInfo.user.following].map(
            (contact) => contact._id
          )
        )
      ).map((id) => ({
        ...(userInfo.user.followers.find((c) => c._id === id) ||
          userInfo.user.following.find((c) => c._id === id)),
      }))
    : [];

  const handleContactSelect = (contact) => {
    setSelectedContact(contact);
    dispatch(fetchChatHistory(contact._id));
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() && selectedContact) {
      const receiverId = selectedContact._id;

      const messageData = {
        sender: {
          _id: currentUserId,
          username: userInfo.user.username,
          avatar: userInfo.user.avatar,
        },
        receiver: receiverId,
        message: newMessage,
        timestamp: new Date().toISOString(),
      };

      try {
        await dispatch(
          sendMessage({ receiverId, message: newMessage })
        ).unwrap();
        dispatch(addMessageToHistory(messageData));
        setNewMessage("");
      } catch (err) {
        alert(err);
      }
    }
  };

  const handleBackToContacts = () => {
    setSelectedContact(null);
  };

  return (
    <div className="flex h-screen w-full bg-gray-50">
      {(!selectedContact || !isMobile) && (
        <div
          className={`md:flex ${
            isMobile && selectedContact ? "hidden" : "block"
          } md:w-1/3`}
        >
          <ContactList
            contactList={contactList}
            onContactSelect={handleContactSelect}
          />
        </div>
      )}
      <div
        className={`${
          selectedContact || !isMobile ? "flex" : "hidden"
        } flex-1 md:flex flex-col`}
      >
        {/* Back Button on Top for Mobile */}
        {selectedContact && isMobile && (
          <div className="flex items-center p-4 bg-blue-500 text-white">
            <button
              onClick={handleBackToContacts}
              className="text-lg font-semibold"
            >
              ← Back to Contacts
            </button>
          </div>
        )}
        {selectedContact && (
          <ChatWindow
            chatHistory={chatHistory}
            selectedContact={selectedContact}
            onSendMessage={handleSendMessage}
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            currentUserId={currentUserId}
          />
        )}
      </div>
    </div>
  );
};

export default Chat;

// import React, { useEffect, useState, useRef } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchChatHistory,
//   sendMessage,
//   addMessageToHistory,
//   fetchUnreadMessages,
// } from "../../Redux/Features/chatSlice";
// import { getCurrentUser } from "../../Redux/Features/userSlice";
// import { useNavigate } from "react-router-dom";

// const Chat = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { chatHistory } = useSelector((state) => state.chat);
//   const { userInfo } = useSelector((state) => state.auth);
//   const [newMessage, setNewMessage] = useState("");
//   const [selectedContact, setSelectedContact] = useState(null);
//   const chatContainerRef = useRef(null);
//   const currentUserId = userInfo?.user?._id;

//   // Combine followers and following lists and remove duplicates
//   const contactList = userInfo
//     ? Array.from(
//         new Set(
//           [...userInfo.user.followers, ...userInfo.user.following].map(
//             (contact) => contact._id
//           )
//         ) // Filter by unique IDs
//       ).map((id) => ({
//         ...(userInfo.user.followers.find((c) => c._id === id) ||
//           userInfo.user.following.find((c) => c._id === id)),
//       }))
//     : [];

//   useEffect(() => {
//     dispatch(getCurrentUser());
//     dispatch(fetchUnreadMessages());

//     if (selectedContact) {
//       const intervalId = setInterval(() => {
//         dispatch(fetchChatHistory(selectedContact._id));
//       }, 5000); // Poll every 5 seconds
//       return () => clearInterval(intervalId);
//     }
//   }, [dispatch, selectedContact]);

//   useEffect(() => {
//     if (chatContainerRef.current) {
//       chatContainerRef.current.scrollTop =
//         chatContainerRef.current.scrollHeight;
//     }
//   }, [chatHistory]);

//   const handleContactClick = (contact) => {
//     setSelectedContact(contact);
//     dispatch(fetchChatHistory(contact._id));
//   };

//   const handleSendMessage = async () => {
//     if (newMessage.trim() && selectedContact) {
//       const receiverId = selectedContact._id;

//       const messageData = {
//         sender: {
//           _id: currentUserId,
//           username: userInfo.user.username,
//           avatar: userInfo.user.avatar,
//         },
//         receiver: receiverId,
//         message: newMessage,
//         timestamp: new Date().toISOString(),
//       };

//       try {
//         await dispatch(
//           sendMessage({ receiverId, message: newMessage })
//         ).unwrap();
//         dispatch(addMessageToHistory(messageData));
//         setNewMessage("");
//       } catch (err) {
//         alert(err); // Show alert if there is an error sending the message
//       }
//     }
//   };

//   const navigateToUserProfile = (userId) => {
//     navigate(`/profile/${userId}`);
//   };

//   return (
//     <div className="flex h-screen w-full bg-gray-50">
//       {/* Contacts List Section */}
//       <div className="w-80 p-4 border-r border-gray-300 bg-white overflow-y-auto">
//         <input
//           type="text"
//           placeholder="Search..."
//           className="w-full p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none"
//         />
//         <div className="space-y-4">
//           {contactList.map((contact) => (
//             <div
//               key={contact._id}
//               onClick={() => handleContactClick(contact)}
//               className="flex items-center p-3 cursor-pointer bg-white hover:bg-gray-200 rounded-lg transition-all"
//             >
//               <img
//                 src={contact.avatar || "default-profile.png"}
//                 alt="Profile"
//                 className="w-10 h-10 rounded-full mr-3"
//               />
//               <div>
//                 <h5 className="font-semibold text-gray-800">
//                   {contact.username}
//                 </h5>
//                 <p className="text-sm text-gray-500">Tap to view chat</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Chat Section */}
//       <div className="flex-1 flex flex-col bg-white h-full">
//         {selectedContact && (
//           <div className="flex items-center p-4 bg-gray-100 border-b border-gray-300">
//             <img
//               src={selectedContact.avatar || "default-profile.png"}
//               alt="Profile"
//               className="w-10 h-10 rounded-full mr-3"
//               onClick={() => navigateToUserProfile(selectedContact._id)}
//             />
//             <h5
//               className="font-semibold text-gray-800 cursor-pointer"
//               onClick={() => navigateToUserProfile(selectedContact._id)}
//             >
//               {selectedContact.username}
//             </h5>
//           </div>
//         )}

//         <div className="flex-1 p-4 overflow-y-auto" ref={chatContainerRef}>
//           {chatHistory.map((message, index) => (
//             <div
//               key={index}
//               className={`flex items-end mb-4 ${
//                 message.sender._id === currentUserId
//                   ? "justify-end"
//                   : "justify-start"
//               }`}
//             >
//               {message.sender._id !== currentUserId && (
//                 <img
//                   src={message.sender.avatar || "default-profile.png"}
//                   alt="Profile"
//                   className="w-8 h-8 mr-2 rounded-full cursor-pointer"
//                   onClick={() => navigateToUserProfile(message.sender._id)}
//                 />
//               )}
//               <div
//                 className={`max-w-xs px-4 py-2 rounded-2xl shadow ${
//                   message.sender._id === currentUserId
//                     ? "bg-blue-500 text-white rounded-br-none"
//                     : "bg-gray-200 text-gray-900 rounded-bl-none"
//                 }`}
//               >
//                 {message.content}
//               </div>
//               {message.sender._id === currentUserId && (
//                 <img
//                   src={userInfo.user.avatar || "default-profile.png"}
//                   alt="Profile"
//                   className="w-8 h-8 ml-2 rounded-full cursor-pointer"
//                   onClick={() => navigateToUserProfile(currentUserId)}
//                 />
//               )}
//             </div>
//           ))}
//         </div>

//         <div className="flex p-4 border-t border-gray-300">
//           <input
//             type="text"
//             value={newMessage}
//             onChange={(e) => setNewMessage(e.target.value)}
//             placeholder="Type your message..."
//             className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none"
//           />
//           <button
//             onClick={handleSendMessage}
//             className="ml-3 px-4 py-2 text-white bg-blue-500 rounded-lg"
//           >
//             Send
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Chat;
