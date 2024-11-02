import React from "react";

const ContactList = ({ contactList, onContactSelect }) => {
  return (
    <div className="w-screen md:w-[30rem] p-4 border-r border-gray-300 bg-white">
      <input
        type="text"
        placeholder="Search..."
        className="w-full p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none"
      />
      <div className="p-8 m-auto">
        {contactList.map((contact) => (
          <div
            key={contact._id}
            onClick={() => onContactSelect(contact)}
            className="flex items-center p-3 cursor-pointer bg-white hover:bg-gray-200 rounded-lg transition-all"
          >
            <img
              src={contact.avatar || "default-profile.png"}
              alt="Profile"
              className="w-10 h-10 rounded-full mr-3"
            />
            <div>
              <h5 className="font-semibold text-gray-800">{contact.username}</h5>
              <p className="text-sm text-gray-500">Tap to view chat</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactList;
