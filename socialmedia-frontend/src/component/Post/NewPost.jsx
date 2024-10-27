import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { publishPost } from "../../Redux/Features/postSlice";

const NewPost = () => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImage(file);

    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!title.trim() || !content.trim() || !image) {
      setError("All fields are required.");
      return;
    }

    // Dispatch action with the needed object fields
    dispatch(publishPost({ title, content, imageFile: image }))
      .unwrap()
      .then(() => {
        setSuccess("Post published successfully!");
        setTitle("");
        setContent("");
        setImage(null);
        setImagePreview("");
      })
      .catch((error) => {
        setError(error.message || "Something went wrong!");
      });
  };

  return (
    <div className="publish-post bg-gray-800 p-4 rounded-lg shadow-lg">
      <h2 className="text-white text-lg font-semibold mb-4">Publish a Post</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      {success && <p className="text-green-500 mb-2">{success}</p>}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-4">
          <label className="block text-white" htmlFor="title">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-white" htmlFor="content">
            Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white"
            rows="4"
            required
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-white" htmlFor="image">
            Image
          </label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-2 rounded bg-gray-700 text-white"
            required
          />
        </div>
        {imagePreview && (
          <div className="mb-4">
            <img
              src={imagePreview}
              alt="Image Preview"
              className="w-full h-auto rounded"
            />
          </div>
        )}
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-500"
        >
          Publish Post
        </button>
      </form>
    </div>
  );
};

export default NewPost;
