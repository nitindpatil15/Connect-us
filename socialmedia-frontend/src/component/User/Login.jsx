import React, { useState } from "react";
import "material-icons/iconfont/material-icons.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../Redux/Features/userSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const { loading, error } = useSelector((state) => state.auth);

  const handleChange = (e) =>
    setCredentials({ ...credentials, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(credentials))
      .unwrap()
      .then(() => {
        navigate("/");
      })
      .catch((err) => {
        console.error("Failed to login:", err);
      });
  };

  return (
    <div className="mt-24">
      <div className="flex justify-around">
        <form onSubmit={handleSubmit} method="post" className="w-64 md:w-96">
          <div className="text-white text-4xl mb-2 text-center">
            <span className="material-icons" style={{ fontSize: "6rem" }}>
              account_circle
            </span>
          </div>
          <div className="flex flex-col">
            <label className="text-white font-bold mb-2 text-2xl">Email</label>
            <input
              className="p-3 rounded-lg"
              type="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              placeholder="Enter Your Email"
              required
            />
            <label className="text-white font-bold mb-2 text-2xl">
              Password
            </label>
            <input
              className="p-3 rounded-lg"
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              placeholder="Password"
              required
            />
            <button className="bg-blue-700 my-3 p-2" disabled={loading}>
              {loading ? "Logging in..." : "Submit"}
            </button>
            {error && <p className="text-red-500">{error}</p>}
            <div className="text-white">
              Don't have an account?{" "}
              <Link to="/register" className="text-red-500">
                Sign Up
              </Link>{" "}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
