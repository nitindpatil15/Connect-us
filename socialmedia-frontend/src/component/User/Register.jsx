import React, { useState } from "react";
import "material-icons/iconfont/material-icons.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { registerUser } from "../../Redux/Features/userSlice";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [credentials, setCredentials] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
  });
  const [profilePic, setProfilePic] = useState(null);
  const [previewProfilePic, setPreviewProfilePic] = useState(null);

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleProfilePicChange = (event) => {
    setProfilePic(event.target.files[0]);
    setPreviewProfilePic(URL.createObjectURL(event.target.files[0]));
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("fullName", credentials.fullName);
    formData.append("username", credentials.username);
    formData.append("email", credentials.email);
    formData.append("password", credentials.password);
    formData.append("avatar", profilePic);

    dispatch(registerUser(formData))
      .unwrap()
      .then(() => {
        navigate("/login");
      })
      .catch((err) => {
        console.error("Failed to register:", err);
      });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 mt-8">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md md:max-w-2xl lg:max-w-3xl mx-4">
        <form onSubmit={handleOnSubmit} className="flex flex-col">
          <h2 className="text-3xl font-semibold text-center mb-6">Register</h2>

          <div className="flex flex-col items-center mb-6">
            <label htmlFor="profilePic" className="form__label mb-2">
              Profile Picture
            </label>
            <input
              className="text-sm mb-2"
              type="file"
              name="avatar"
              id="profilePic"
              onChange={handleProfilePicChange}
              required
            />
            {previewProfilePic && (
              <img
                className="rounded-full border-2 w-24 h-24 object-cover"
                src={previewProfilePic}
                alt="Avatar"
              />
            )}
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col">
              <label className="text-gray-700 font-bold mb-1">Full Name</label>
              <input
                className="p-3 rounded-lg border border-gray-300 w-full md:w-[40rem]"
                type="text"
                name="fullName"
                value={credentials.fullName}
                onChange={onChange}
                placeholder="Enter Full Name"
                required
              />
            </div>
            <div>
              <label className="text-gray-700 font-bold mb-1">Username</label>
              <input
                className="p-3 rounded-lg border border-gray-300 w-full"
                type="text"
                name="username"
                value={credentials.username}
                onChange={onChange}
                placeholder="Username"
                required
              />
            </div>
            <div>
              <label className="text-gray-700 font-bold mb-1">Email</label>
              <input
                className="p-3 rounded-lg border border-gray-300 w-full"
                type="email"
                name="email"
                value={credentials.email}
                onChange={onChange}
                placeholder="Enter Your Email"
                required
              />
            </div>
            <div>
              <label className="text-gray-700 font-bold mb-1">Password</label>
              <input
                className="p-3 rounded-lg border border-gray-300 w-full"
                type="password"
                name="password"
                value={credentials.password}
                onChange={onChange}
                placeholder="Password"
                required
              />
            </div>
          </div>

          <button
            className="bg-blue-600 text-white font-semibold py-3 rounded-lg mt-6 hover:bg-blue-700 transition duration-200"
            type="submit"
          >
            Register
          </button>

          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500 hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
