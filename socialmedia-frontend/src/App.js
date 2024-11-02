import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./component/User/Navbar";
import Feed from "./component/User/Feed";
import Register from "./component/User/Register";
import Login from "./component/User/Login";
import Profile from "./component/User/Profile";
import PostById from "./component/Post/PostById";
import NewPost from "./component/Post/NewPost";
import UserById from "./component/User/Anotheruser";
import Chat from "./component/chat/Chat";
import UpdateUserDetails from "./component/User/UpdateUser";

function App() {
  return (
    <div className="app bg-black">
      <Router>
        <div className="md:flex">
          <Navbar />
          <div className="flex justify-center items-center w-screen">
            <div>
              <Routes>
                <Route path="/" element={<Feed />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/profile/:id" element={<UserById />} />
                <Route path="/profile/update" element={<UpdateUserDetails />} />
                <Route path="/post/:id" element={<PostById />} />
                <Route path="/new/post" element={<NewPost />} />
                <Route path="/chat-list" element={<Chat />} />
              </Routes>
            </div>
          </div>
        </div>
      </Router>
    </div>
  );
}

export default App;
