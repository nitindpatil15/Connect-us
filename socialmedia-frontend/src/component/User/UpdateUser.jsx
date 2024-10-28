import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUserDetails } from "../../Redux/Features/userSlice"; // Assuming this is defined to dispatch the update
import { useNavigate } from "react-router-dom";

const UpdateUserDetails = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, loading, error } = useSelector((state) => state.auth);

    const [userDetails, setUserDetails] = useState({
        fullName: user?.fullName || "",
        avatar: null, // Set to null initially; we'll handle file input separately
        username: user?.username || "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserDetails((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setUserDetails((prev) => ({ ...prev, avatar: e.target.files[0] })); // Store file object
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append("fullName", userDetails.fullName);
        formData.append("username", userDetails.username);
        if (userDetails.avatar) {
            formData.append("avatar", userDetails.avatar);
        }

        dispatch(updateUserDetails({ formData }))
            .unwrap()
            .then(() => {
                navigate("/profile"); // Redirect after successful update
            })
            .catch((err) => {
                console.error("Failed to update user details:", err);
            });
    };

    return (
        <div className="mt-24">
            <div className="flex justify-around">
                <form onSubmit={handleSubmit} method="post" className="w-96">
                    <div className="text-white text-4xl mb-2 text-center">
                        <span className="material-icons" style={{ fontSize: "6rem" }}>
                            edit
                        </span>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-white font-bold mb-2 text-2xl">Full Name</label>
                        <input
                            className="p-3 rounded-lg"
                            type="text"
                            name="fullName"
                            value={userDetails.fullName}
                            onChange={handleChange}
                            placeholder="Enter Your Full Name"
                            required
                        />
                        <label className="text-white font-bold mb-2 text-2xl">Username</label>
                        <input
                            className="p-3 rounded-lg"
                            type="text"
                            name="username"
                            value={userDetails.username}
                            onChange={handleChange}
                            placeholder="Enter Your Username"
                            required
                        />
                        <label className="text-white font-bold mb-2 text-2xl">Avatar</label>
                        <input
                            className="p-3 rounded-lg"
                            type="file"
                            name="avatar"
                            onChange={handleFileChange}
                        />
                        <button className="bg-blue-700 my-3 p-2" disabled={loading}>
                            {loading ? "Updating..." : "Update"}
                        </button>
                        {error && <p className="text-red-500">{error}</p>}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateUserDetails;
