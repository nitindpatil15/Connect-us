import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser, logoutUser } from "../../Redux/Features/userSlice";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login"); // Redirect to login page after logout
  };

  return (
    <nav className="bg-black p-8 h-screen w-64 md:fixed left-0 top-0 border-r-2">
      <div className="flex md:flex-col items-start">
        {/* Navbar Brand */}
        <Link
          to="/"
          className="flex flex-col items-center justify-center text-white text-4xl font-bold mb-12"
        >
          ConnectUs
        </Link>

        {/* Navbar Actions */}
        <Link
          to="/new/post"
          className="text-white text-lg mb-3 flex items-center justify-between"
        >
          <img
            src="https://static.thenounproject.com/png/2796180-200.png"
            alt="add post"
            className="w-12 bg-white rounded-full mr-1 text-2xl"
          />{" "}
          Add Post
        </Link>
        <Link
          to="/chat-list"
          className="flex justify-center items-center text-white text-lg mb-3"
        >
          <img
            src="https://i.pinimg.com/564x/02/76/e7/0276e7e10311f0f161c5c38a2d7b8008.jpg"
            alt="Chat"
            className="w-12 rounded-full mr-1 text-2xl"
          />{" "}
          Message
        </Link>

        {userInfo ? (
          <>
            <div className="flex items-center mb-2">
              <img
                src={userInfo?.user?.avatar || "default-avatar-url"} // Provide a default avatar URL if none exists
                alt="Profile"
                className="w-12 rounded-full mr-2"
              />
              <Link to="/profile" className="text-white text-2xl">
                Profile
              </Link>
            </div>
            <button
              onClick={handleLogout}
              className="text-white text-lg mt-3 flex items-center"
            >
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-_PIB_M-3mrXysid-v8-YRtbTXjcaP3I-cw&s"
                alt="logout"
                className="w-12 mr-1 rounded-full text-2xl"
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
    </nav>
  );
}

export default Navbar;
