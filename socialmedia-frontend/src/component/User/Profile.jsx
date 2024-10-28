import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser } from "../../Redux/Features/userSlice";
import { fetchCurrentUserPosts } from "../../Redux/Features/postSlice";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);

  const {
    userInfo,
    loading: userLoading,
    error: userError,
  } = useSelector((state) => state.auth);
  const {
    currentUserPosts,
    loading: postsLoading,
    error: postsError,
  } = useSelector((state) => state.posts);

  useEffect(() => {
    dispatch(getCurrentUser());
    dispatch(fetchCurrentUserPosts());
  }, [dispatch]);

  const handlePostById = (id) => {
    navigate(`/post/${id}`);
  };

  const handleUpdateProfile = () => {
    navigate("/profile/update");
  };

  if (userLoading || postsLoading) return <p>Loading...</p>;
  if (userError) return <p>Error fetching user data: {userError}</p>;
  if (postsError) return <p>Error fetching posts: {postsError}</p>;

  return (
    <div className="flex flex-col items-center p-4 md:mr-32">
      {/* Profile Header */}
      <div className="flex items-center space-x-6 mb-4">
        <img
          src={userInfo?.user.avatar}
          alt="Avatar"
          className="w-40 h-40 rounded-full border mt-10 border-gray-300"
        />
        <div>
          <h2 className="text-2xl text-white font-bold">
            {userInfo?.user.fullName}
          </h2>
          <p className="text-gray-400 font-bold">@{userInfo?.user.username}</p>
          <div className="flex space-x-4 mt-2 text-xl">
            <div
              onClick={() => setShowFollowers(true)}
              className="text-white cursor-pointer"
            >
              <span className="font-bold">
                {userInfo?.user.followers?.length || 0}
              </span>{" "}
              followers
            </div>
            <div
              onClick={() => setShowFollowing(true)}
              className="text-white cursor-pointer"
            >
              <span className="font-bold">
                {userInfo?.user.following?.length || 0}
              </span>{" "}
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
        {currentUserPosts && currentUserPosts.length > 0 ? (
          currentUserPosts.map((post) => (
            <div
              key={post._id}
              className="mt-2 w-full h-32 bg-gray-200 rounded-md"
              onClick={() => handlePostById(post._id)}
            >
              <img
                src={post.image}
                alt={post.title}
                className="w-[20rem] h-[20rem] my-2 object-cover rounded-md cursor-pointer"
              />
            </div>
          ))
        ) : (
          <p className="col-span-3 text-center text-gray-400">
            No posts available.
          </p>
        )}
      </div>

      {/* Followers Popup */}
      {showFollowers && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-md w-80 max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Followers</h2>
            <button
              onClick={() => setShowFollowers(false)}
              className="absolute top-4 right-4 text-2xl font-bold text-blue-700 hover:text-red-800"
            >
              &times;
            </button>
            {userInfo?.user.followers?.length > 0 ? (
              userInfo.user.followers.map((follower) => (
                <div
                  key={follower._id}
                  className="flex items-center space-x-4 my-2"
                >
                  <img
                    src={follower.avatar}
                    alt={follower.username}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-bold">{follower.fullName}</p>
                    <p className="text-gray-600">@{follower.username}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>No followers available</p>
            )}
          </div>
        </div>
      )}

      {/* Following Popup */}
      {showFollowing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-md w-80 max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Following</h2>
            <button
              onClick={() => setShowFollowing(false)}
              className="absolute top-4 right-4 text-2xl font-bold text-blue-700 hover:text-red-800"
            >
              &times;
            </button>
            {userInfo?.user.following?.length > 0 ? (
              userInfo.user.following.map((followedUser) => (
                <div
                  key={followedUser._id}
                  className="flex items-center space-x-4 my-2"
                >
                  <img
                    src={followedUser.avatar}
                    alt={followedUser.username}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-bold">{followedUser.fullName}</p>
                    <p className="text-gray-600">@{followedUser.username}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>No following users available</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
