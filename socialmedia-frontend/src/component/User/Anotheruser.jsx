import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  followUser,
  unfollowUser,
  getUserById,
  getCurrentUser,
} from "../../Redux/Features/userSlice";
import { fetchUserPostsById } from "../../Redux/Features/postSlice";
import { useNavigate, useParams } from "react-router-dom";

const UserById = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);

  const {
    UserById,
    userInfo,
    loading: userLoading,
    error: userError,
  } = useSelector((state) => state.auth);
  const {
    userpostById,
    loading: postsLoading,
    error: postsError,
  } = useSelector((state) => state.posts);

  useEffect(() => {
    if (!userInfo) dispatch(getCurrentUser());
    dispatch(getUserById(id));
    dispatch(fetchUserPostsById({ token: userInfo?.token, id }));
  }, [dispatch, id, userInfo]);

  const isFollowing = UserById?.followers?.some(
    (follower) => follower._id === userInfo?.user._id
  );
  console.log(UserById)

  const handleFollow = () => dispatch(followUser(id));
  const handleUnfollow = () => dispatch(unfollowUser(id));

  const handlePostById = (postId) => {
    navigate(`/post/${postId}`);
  };

  if (userLoading || postsLoading) return <p>Loading...</p>;
  if (userError || postsError) return <p>{userError || postsError}</p>;

  return (
    <div className="flex flex-col items-center p-4">
      {/* User Header */}
      <div className="flex items-center space-x-6 mb-4">
        <img
          src={UserById?.avatar}
          alt="Avatar"
          className="w-40 h-40 rounded-full border mt-10 border-gray-300"
        />
        <div>
          <h2 className="text-2xl text-white font-bold">
            {UserById?.fullName}
          </h2>
          <p className="text-gray-400 font-bold">@{UserById?.username}</p>
          <div className="flex space-x-4 mt-2 text-xl">
            <div
              onClick={() => setShowFollowers(true)}
              className="text-white cursor-pointer"
            >
              <span className="font-bold">
                {UserById?.followers?.length || 0}
              </span>{" "}
              followers
            </div>
            <div
              onClick={() => setShowFollowing(true)}
              className="text-white cursor-pointer"
            >
              <span className="font-bold">
                {UserById?.following?.length || 0}
              </span>{" "}
              following
            </div>
          </div>
        </div>
      </div>

      {/* Follow/Unfollow Buttons */}
      <div className="flex space-x-4 mb-6">
        {isFollowing ? (
          <button
            onClick={handleUnfollow}
            className="px-4 py-2 bg-gray-300 text-black font-semibold rounded-md hover:bg-gray-400"
          >
            Unfollow
          </button>
        ) : (
          <button
            onClick={handleFollow}
            className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
          >
            Follow
          </button>
        )}
        <button className="px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-100">
          Message
        </button>
      </div>

      {/* User Posts */}
      <div className="text-white font-bold text-4xl my-4 border-b-4 border-gray-400">
        Posts
      </div>
      <div className="grid grid-cols-3 gap-4 border-t-4 border-gray-400">
        {userpostById.length > 0 ? (
          userpostById.map((post) => (
            <div
              key={post._id}
              className="mt-2 w-full h-32 bg-gray-200 rounded-md"
            >
              <img
                src={post.image}
                alt={post.title}
                onClick={() => handlePostById(post._id)}
                className="w-[20rem] object-cover rounded-md cursor-pointer"
              />
            </div>
          ))
        ) : (
          <p className="text-gray-400">No posts available</p>
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
            {UserById?.followers?.length > 0 ? (
              UserById.followers.map((follower) => (
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
            {UserById?.following?.length > 0 ? (
              UserById.following.map((followedUser) => (
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

export default UserById;
