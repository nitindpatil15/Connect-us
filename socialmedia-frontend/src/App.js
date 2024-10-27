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

function App() {
  return (
    <div className="app bg-black">
      <Router>
        <Navbar/>
        <Routes>
          <Route path="/" element={<Feed/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/profile" element={<Profile/>} />
          <Route path="/profile/:id" element={<UserById/>} />
          <Route path="/post/:id" element={<PostById/>} />
          <Route path="/new/post" element={<NewPost/>} />
          <Route path="/chat-list" element={<Chat/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
