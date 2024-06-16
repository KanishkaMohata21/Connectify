import { Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/login";
import Signup from "./components/signup";
import NotificationPage from "./components/notificationPage"
import Profile from "./components/profilePage"
import Chat from "./components/chats";


export default function App() {
  return <div className="container">
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/" element={<Home />} />
      <Route path="/notification" element={<NotificationPage />} />
      <Route path="/profile/:username" element={<Profile />} />
      <Route path='/chat' element={<Chat/>}/>
    </Routes>
  </div>
}
