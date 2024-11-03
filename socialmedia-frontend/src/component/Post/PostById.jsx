import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchPostById,
  updatePost,
  deletePost,
} from "../../Redux/Features/postSlice";
import {
  addComment,
  updateComment,
  deleteComment,
  fetchComments,
} from "../../Redux/Features/commentSlice";
import {
  togglePostLike,
  toggleCommentLike,
} from "../../Redux/Features/likeSlice";
import { getCurrentUser } from "../../Redux/Features/userSlice";

const PostById = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { singlePost, loading, error } = useSelector((state) => state.posts);
  const { comments } = useSelector((state) => state.comments);
  const userInfo = useSelector((state) => state.auth);

  const [commentText, setCommentText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [updatedContent, setUpdatedContent] = useState("");
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [commentToEdit, setCommentToEdit] = useState(null);
  const [postLiked, setPostLiked] = useState(false);
  const [commentLikes, setCommentLikes] = useState({});

  useEffect(() => {
    dispatch(getCurrentUser());
    dispatch(fetchPostById({ id }));
    dispatch(fetchComments(id));
  }, [dispatch, id]);

  useEffect(() => {
    const isPostLiked = singlePost?.postById?.likes?.includes(
      userInfo?.user?._id
    );
    setPostLiked(isPostLiked);

    const initialCommentLikes = {};
    comments.forEach((comment) => {
      initialCommentLikes[comment._id] = comment?.likes?.includes(
        userInfo?.user?._id
      );
    });
    setCommentLikes(initialCommentLikes);
  }, [singlePost, comments, userInfo]);

  const handleLike = () => {
    setPostLiked(!postLiked);
    dispatch(togglePostLike(id));
  };

  const handleAddOrUpdateComment = (e) => {
    e.preventDefault();
    if (commentText.trim()) {
      if (commentToEdit) {
        dispatch(
          updateComment({
            commentId: commentToEdit._id,
            content: commentText,
          })
        );
      } else {
        dispatch(addComment({ postId: id, content: commentText }));
      }
      setCommentText("");
      setCommentToEdit(null);
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setUpdatedContent(singlePost?.postById.content);
      setUpdatedTitle(singlePost?.postById.title);
    }
  };

  const handleUpdatePost = (e) => {
    e.preventDefault();
    dispatch(
      updatePost({ postId: id, title: updatedTitle, content: updatedContent })
    );
    setIsEditing(false);
  };

  const handleDeletePost = () => {
    dispatch(deletePost({ postId: id }));
    navigate("/");
  };

  const handleEditComment = (comment) => {
    setCommentToEdit(comment);
    setCommentText(comment.content);
  };

  const handleDeleteComment = (commentId) => {
    dispatch(deleteComment(commentId));
  };

  const handleCommentLike = (commentId) => {
    const isLiked = commentLikes[commentId];
    setCommentLikes((prevLikes) => ({
      ...prevLikes,
      [commentId]: !isLiked,
    }));
    dispatch(toggleCommentLike(commentId));
  };

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!singlePost) return <p className="text-center">No post found</p>;

  return (
    <div className="flex flex-col justify-center p-1 text-white border-2 border-white rounded-lg shadow-lg md:mt-4 md:w-[40rem]">
      <div className="flex items-center mb-4">
        <img
          src={singlePost?.user?.avatar}
          alt={singlePost?.user?.username}
          className="w-10 h-10 rounded-full border border-gray-300"
        />
        <h3 className="text-lg font-semibold mx-2">{singlePost?.user?.username}</h3>
      </div>

      <img
        src={singlePost?.postById?.image}
        alt={singlePost?.postById?.title}
        className="w-full h-auto rounded-lg mb-4 border-2 border-black"
      />

      <div className="mb-4">
        {!isEditing ? (
          <>
            <h2 className="text-2xl font-bold">
              {singlePost?.postById?.title}
            </h2>
            <p className="text-white">{singlePost?.postById?.content}</p>
          </>
        ) : (
          <form onSubmit={handleUpdatePost} className="mb-4">
            <input
              type="text"
              value={updatedTitle}
              onChange={(e) => setUpdatedTitle(e.target.value)}
              placeholder="Title"
              className="w-auto p-2 border border-gray-300 rounded-lg mb-2"
            />
            <textarea
              value={updatedContent}
              onChange={(e) => setUpdatedContent(e.target.value)}
              rows="4"
              className="w-auto p-2 border border-gray-300 rounded-lg mb-2"
            ></textarea>
            <div className="flex justify-between">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
              >
                Update
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="mb-4">
        <button
          onClick={handleLike}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          {postLiked ? "Unlike" : "Like"}{" "}
          {postLiked
            ? singlePost?.postById?.likes?.length + 1
            : singlePost?.postById?.likes?.length}
        </button>
      </div>

      <div className="post-comments mb-4">
        <h4 className="text-xl font-semibold mb-2">Comments</h4>
        {comments?.length > 0 ? (
          comments.map((comment) => {
            const isCommentLiked = commentLikes[comment._id];
            return (
              <div key={comment._id} className="flex items-start mb-4">
                <img
                  src={comment.owner[0]?.avatar}
                  alt={comment.owner[0]?.username}
                  className="w-8 h-8 rounded-full border border-gray-300 mr-2 mt-3"
                />
                <div className="flex-1">
                  <strong>{comment.owner[0]?.username}</strong>
                  <p>{comment.content}</p>
                  <div className="flex items-center mt-1">
                    {userInfo?.user?._id === comment?.owner[0]?._id && (
                      <>
                        <button
                          onClick={() => handleEditComment(comment)}
                          className="text-blue-500 mr-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteComment(comment._id)}
                          className="text-red-500 mr-2"
                        >
                          Delete
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleCommentLike(comment._id)}
                      className="text-blue-500"
                    >
                      {isCommentLiked ? "Unlike" : "Like"}{" "}
                      {isCommentLiked
                        ? comment?.likes?.length + 1
                        : comment?.likes?.length}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p>No comments yet</p>
        )}
      </div>

      <form onSubmit={handleAddOrUpdateComment} className="flex mb-4">
        <input
          type="text"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 p-2 border border-gray-300 rounded-lg mr-2"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          {commentToEdit ? "Update Comment" : "Comment"}
        </button>
      </form>

      <div className="flex justify-between">
        {userInfo?.user?._id === singlePost?.postById?.user && (
          <button
            onClick={handleEditToggle}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            {isEditing ? "Cancel" : "Edit"}
          </button>
        )}
        {userInfo?.user?._id === singlePost?.postById?.user && (
          <button
            onClick={handleDeletePost}
            className="bg-red-500 text-white px-4 py-2 rounded-lg"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default PostById;
