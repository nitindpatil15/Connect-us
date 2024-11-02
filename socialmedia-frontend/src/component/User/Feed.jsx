import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../../Redux/Features/postSlice";
import {
  togglePostLike,
  toggleCommentLike,
} from "../../Redux/Features/likeSlice";
import {
  addComment,
  fetchComments,
  updateComment,
  deleteComment,
} from "../../Redux/Features/commentSlice";
import { useNavigate } from "react-router-dom";
import "material-icons/iconfont/material-icons.css";

const Feed = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize useNavigate
  const { posts, loading, error } = useSelector((state) => state.posts);
  const { postLikes } = useSelector((state) => state.likes);
  const { comments } = useSelector((state) => state.comments);

  const [commentContent, setCommentContent] = useState("");
  const [commentIdToUpdate, setCommentIdToUpdate] = useState(null);
  const [commentsVisible, setCommentsVisible] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPosts, setFilteredPosts] = useState(posts);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  useEffect(() => {
    if (searchTerm) {
      const lowercasedSearchTerm = searchTerm.toLowerCase();
      setFilteredPosts(
        posts.filter(
          (post) =>
            post.owner.username.toLowerCase().includes(lowercasedSearchTerm) ||
            post.content.toLowerCase().includes(lowercasedSearchTerm)
        )
      );
    } else {
      setFilteredPosts(posts);
    }
  }, [searchTerm, posts]);

  const handleLikeToggle = (postId) => {
    dispatch(togglePostLike(postId));
  };

  const handleCommentSubmit = (postId) => {
    if (commentContent.trim()) {
      if (commentIdToUpdate) {
        dispatch(
          updateComment({
            commentId: commentIdToUpdate,
            content: commentContent,
          })
        );
        setCommentIdToUpdate(null);
      } else {
        dispatch(addComment({ postId, content: commentContent }));
      }
      setCommentContent("");
    }
  };

  const toggleCommentsVisibility = (postId) => {
    setCommentsVisible((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));

    if (!commentsVisible[postId]) {
      dispatch(fetchComments(postId));
    }
  };

  const handleDeleteComment = (commentId) => {
    dispatch(deleteComment(commentId));
  };

  const handleCommentLike = (commentId) => {
    dispatch(toggleCommentLike(commentId));
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="flex flex-col bg-black text-white p-4">
      <input
        type="text"
        placeholder="Search users or content..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 p-2 text-black"
      />
      {filteredPosts && filteredPosts.length > 0 ? (
        filteredPosts.map((post) => (
          <div
            key={post._id}
            className="mb-4 p-3 border border-gray-700 rounded-lg md:w-[30rem] w-[20rem]"
          >
            <div className="author-info flex items-center mb-2">
              <img
                src={post.owner?.avatar || "default-avatar-url.jpg"}
                alt={`${post.owner?.username || "Unknown Author"}'s avatar`}
                className="avatar w-10 h-10 rounded-full mr-3 cursor-pointer"
                onClick={() => navigate(`/profile/${post.owner.id}`)}
              />
              <h3
                className="text-lg font-semibold cursor-pointer"
                onClick={() => navigate(`/profile/${post.owner.id}`)}
              >
                {post.owner?.username || "Unknown Author"}
              </h3>
            </div>
            <p className="content text-gray-300 mb-3">{post.content}</p>
            {post.image && (
              <img
                src={post.image}
                alt="Post content"
                className="post-image mb-3 w-[30rem]"
              />
            )}
            <div
              className={`flex items-center p-2 ${
                commentsVisible[post._id] ? "flex-col" : ""
              }`}
            >
              <button
                onClick={() => handleLikeToggle(post._id)}
                className="like-button"
                style={{
                  color: postLikes[post._id] ? "red" : "white",
                }}
              >
                {postLikes[post._id] ? (
                  <span className="material-icons">favorite</span>
                ) : (
                  <span className="material-icons">favorite_border</span>
                )}
              </button>
              <button
                onClick={() => toggleCommentsVisibility(post._id)}
                className="mx-2"
              >
                {commentsVisible[post._id] ? (
                  <span className="material-icons">hide_source</span>
                ) : (
                  <span className="material-icons">add_comment</span>
                )}
              </button>
              {commentsVisible[post._id] && (
                <div className="comments-section mt-4">
                  <input
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    placeholder="Add a comment..."
                    className="w-full p-2 mb-2 text-black rounded-lg"
                  />
                  <button
                    onClick={() => handleCommentSubmit(post._id)}
                    className="submit-comment-button"
                  >
                    {commentIdToUpdate ? "Update Comment" : "Submit Comment"}
                  </button>
                  <div className="comment-list mt-3">
                    {comments.map((comment) => (
                      <div
                        key={comment._id}
                        className="comment flex items-center justify-between mb-2 bg-gray-500 p-2"
                      >
                        <div className="flex items-center ">
                          <img
                            src={
                              comment.owner[0]?.avatar ||
                              "default-avatar-url.jpg"
                            }
                            alt={`${
                              comment.owner[0]?.username || "Unknown User"
                            }'s avatar`}
                            className="avatar w-8 h-8 rounded-full mr-2 cursor-pointer"
                            onClick={() =>
                              navigate(`/profile/${comment.owner[0]._id}`)
                            }
                          />
                          <div>
                            <p className="font-semibold">
                              {comment.owner[0]?.username || "Unknown User"}
                            </p>
                            <p className="mr-2">{comment.content}</p>
                            <span className="text-gray-400 text-sm">
                              {new Date(comment.createdAt).toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex md:flex-row flex-col items-center">
                          <button
                            onClick={() => handleCommentLike(comment._id)}
                            className="like-button mx-2"
                          >
                            Like
                          </button>
                          <button
                            onClick={() => {
                              setCommentContent(comment.content);
                              setCommentIdToUpdate(comment._id);
                            }}
                            className="mx-2"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteComment(comment._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))
      ) : (
        <p>No posts available</p>
      )}
    </div>
  );
};

export default Feed;
