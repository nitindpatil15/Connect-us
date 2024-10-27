import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser, logoutUser } from "../../Redux/Features/userSlice";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Navbar Brand */}
        <div className="text-white text-2xl font-bold">ConnectUs</div>

        {/* Navbar Actions */}
        <div className="flex items-center space-x-4">
          <Link
            to="/new/post"
            className="focus:outline-none text-white text-2xl"
          >
            AddPost
          </Link>
          <Link
            to="/chat-list"
            className="focus:outline-none text-white text-2xl"
          >
            <img
              src="https://i.pinimg.com/564x/02/76/e7/0276e7e10311f0f161c5c38a2d7b8008.jpg"
              alt="message"
              className="w-10 rounded-full"
            />
          </Link>
          {userInfo ? (
            <div className="relative">
              {/* Avatar button to open dropdown */}
              <button onClick={toggleDropdown} className="focus:outline-none">
                <img
                  src={userInfo?.user?.avatar || userInfo?.avatar} // replace with user's avatar URL
                  alt="User avatar"
                  className="w-10 h-10 rounded-full border-2 border-gray-300"
                />
              </button>

              {/* Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate("/profile");
                    }}
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left"
                  >
                    Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => {
                navigate("/login");
              }}
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
