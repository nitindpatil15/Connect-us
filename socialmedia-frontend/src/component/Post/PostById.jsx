import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPostById } from "../../Redux/Features/postSlice";
import { useParams } from "react-router-dom";

const PostById = () => {
  const {id} = useParams()
  const dispatch = useDispatch();
  const { singlePost, loading, error } = useSelector((state) => state.posts);

  useEffect((id) => {
    dispatch(fetchPostById(id));
  }, [dispatch, id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!singlePost) return null;

  return (
      <div className="post-detail-container">
        <div className="post-image-column">
          <img src={singlePost.image} alt={singlePost.title} className="post-image" />
        </div>

        <div className="post-details-column">
          <div className="post-owner">
            <img src={singlePost.owner?.avatar} alt={singlePost.owner?.username} className="avatar" />
            <h3>{singlePost.owner?.username}</h3>
          </div>

          <div className="post-caption">
            <p>{singlePost.content}</p>
          </div>

          <div className="post-stats">
            <p>{singlePost.likes} likes</p>
            <p>{singlePost.views} views</p>
          </div>

          <div className="post-comments">
            <h4>Comments</h4>
            {singlePost.comments?.length > 0 ? (
              singlePost.comments.map((comment) => (
                <div key={comment._id} className="comment">
                  <img src={comment.user.avatar} alt={comment.user.username} className="comment-avatar" />
                  <div className="comment-content">
                    <strong>{comment.user.username}</strong>
                    <p>{comment.text}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>No comments yet</p>
            )}
          </div>
        </div>
      </div>
  );
};

export default PostById;
