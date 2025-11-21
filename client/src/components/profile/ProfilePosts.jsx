import React from "react";
import PostShare from "../PostShare";
import Post from "../Post";

const ProfilePosts = () => {
  return (
    <div className="space-y-4 overflow-y-auto">
      <PostShare />
      <Post />
    </div>
  );
};

export default ProfilePosts;


