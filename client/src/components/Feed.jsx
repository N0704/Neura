import React from "react";
import PostShare from "./PostShare";
import Post from "./Post";

const Feed = () => {
  return (
    <div className="space-y-6 py-6">
      <PostShare />
      <Post />
    </div>
  );
};

export default Feed;
