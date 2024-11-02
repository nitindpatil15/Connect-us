import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser, logoutUser } from "../../Redux/Features/userSlice";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai"; // For the mobile menu icon

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false); // For mobile menu toggle

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <nav className="bg-black text-white w-full md:w-64 md:fixed md:h-screen md:border-r-2 p-4">
      {/* Mobile Header */}
      <div className="flex items-center justify-between md:hidden">
        <Link to="/" className="text-2xl font-bold">
          ConnectUs
        </Link>
        <button className="text-2xl" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <AiOutlineClose /> : <AiOutlineMenu />}
        </button>
      </div>

      {/* Sidebar/Menu */}
      <div className={`mt-4 md:mt-0 ${isOpen ? "block" : "hidden"} md:block`}>
        <div className="flex flex-col md:flex-col items-start">
          <Link to="/" className="hidden md:block text-2xl font-bold">
            ConnectUs
          </Link>
          <Link
            to="/"
            className="text-xl md:text-2xl mb-5 p-2 md:p-4 hover:bg-gray-700 rounded"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/new/post"
            className="text-xl md:text-2xl mb-5 p-2 md:p-4 flex items-center hover:bg-gray-700 rounded"
            onClick={() => setIsOpen(false)}
          >
            <img
              src="https://static.thenounproject.com/png/2796180-200.png"
              alt="add post"
              className="hidden sm:block w-8 md:w-12 bg-white rounded-full mr-2"
            />
            Add Post
          </Link>
          <Link
            to="/chat-list"
            className="text-xl md:text-2xl mb-5 p-2 md:p-4 flex items-center hover:bg-gray-700 rounded"
            onClick={() => setIsOpen(false)}
          >
            <img
              src="https://i.pinimg.com/564x/02/76/e7/0276e7e10311f0f161c5c38a2d7b8008.jpg"
              alt="Chat"
              className="hidden sm:block w-8 md:w-12 rounded-full mr-2"
            />
            Message
          </Link>

          {userInfo ? (
            <>
              <Link
                to="/profile"
                className="text-xl md:text-2xl mb-5 p-2 md:p-4 flex items-center hover:bg-gray-700 rounded"
                onClick={() => setIsOpen(false)}
              >
                <img
                  src={userInfo?.user?.avatar || "default-avatar-url"}
                  alt="Profile"
                  className="w-8 md:w-12 rounded-full mr-2"
                />
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="text-xl md:text-2xl mb-5 p-2 md:p-4 flex items-center hover:bg-gray-700 rounded"
              >
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-_PIB_M-3mrXysid-v8-YRtbTXjcaP3I-cw&s"
                  alt="logout"
                  className="hidden sm:block w-8 md:w-12 rounded-full mr-2"
                />
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
