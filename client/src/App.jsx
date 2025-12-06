import React from "react";
import { Routes, Route } from "react-router";
import AuthLayout from "./layouts/AuthLayout";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Home from "./pages/Home";
import MainLayout from "./layouts/MainLayout";
import Profile from "./pages/Profile";
import Messages from "./pages/Messages";
import Notifications from "./pages/Notifications";
import Friends from "./pages/Friends";
import SearchUsers from "./pages/SearchUsers";
import Followers from "./pages/Followers";
import Following from "./pages/Following";

function App() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/:userId" element={<Profile />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/friends" element={<Friends />} />
        <Route path="/search" element={<SearchUsers />} />
        <Route path="/followers" element={<Followers />} />
        <Route path="/following" element={<Following />} />
      </Route>
    </Routes>
  );
}

export default App;
