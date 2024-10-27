import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser } from "../../Redux/Features/userSlice";
import { fetchCurrentUserPosts } from "../../Redux/Features/postSlice";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo, loading, error } = useSelector((state) => state.auth);
  const { currentUserPosts } = useSelector((state) => state.posts);

  useEffect(() => {
    dispatch(getCurrentUser());
    dispatch(fetchCurrentUserPosts());
  }, [dispatch]);

  const handlePostById = (id) => {
    navigate(`/post/${id}`);
  };

  const handleUpdateProfile = () => {
    navigate("/profile/update"); // Redirect to the profile update page
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="flex flex-col items-center p-4">
      {/* Profile Header */}
      <div className="flex items-center space-x-6 mb-4">
        {/* Profile Image */}
        <img
          src={userInfo?.user.avatar}
          alt="Avatar"
          className="w-20 h-20 rounded-full border border-gray-300"
        />
        {/* User Info */}
        <div>
          <h2 className="text-xl text-white font-bold">{userInfo?.user.fullName}</h2>
          <p className="text-gray-400">@{userInfo?.user.username}</p>
          <div className="flex space-x-4 mt-2">
            <div className="text-white">
              <span className="font-bold">{userInfo?.user.post?.length}</span> posts
            </div>
            <div className="text-white">
              <span className="font-bold">{userInfo?.user.followers?.length}</span>{" "}
              followers
            </div>
            <div className="text-white">
              <span className="font-bold">{userInfo?.user.following?.length}</span>{" "}
              following
            </div>
          </div>
        </div>
      </div>

      {/* Update Profile Button */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={handleUpdateProfile}
          className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
        >
          Update Profile
        </button>
      </div>

      {/* User Posts */}
      <div className="text-white font-bold text-4xl my-4 border-b-4 border-gray-400">
        Posts
      </div>
      <div className="grid grid-cols-3 gap-4 border-t-4 border-gray-400">
        {currentUserPosts?.map((post) => (
          <div
            key={post._id}
            className="mt-2 w-full h-32 bg-gray-200 rounded-md"
          >
            <img
              src={post.image}
              alt={post.title}
              onClick={() => handlePostById(post._id)}
              className="w-full h-full object-cover rounded-md cursor-pointer"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
