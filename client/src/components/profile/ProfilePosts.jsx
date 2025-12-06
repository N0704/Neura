import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { postsAPI } from "../../api/postsAPI";
import PostShare from "../PostShare";
import PostCard from "../PostCard";
import PostSkeleton from "../PostSkeleton";

const ProfilePosts = ({ userId }) => {
  const currentUser = useSelector((state) => state.auth.user);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const isOwnProfile = !userId || (currentUser && userId == currentUser.id);

  useEffect(() => {
    const fetchUserPosts = async () => {
      const targetUserId = userId || currentUser?.id;
      if (!targetUserId) return;

      try {
        setLoading(true);
        const response = await postsAPI.getUserPosts(targetUserId);
        // response.data is the paginator object, response.data.data is the posts array
        setPosts(response.data?.data || []);
      } catch (error) {
        console.error("Error fetching user posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, [userId, currentUser?.id]);

  return (
    <div className="space-y-4">
      {isOwnProfile && <PostShare />}

      {loading ? (
        <>
          <PostSkeleton />
          <PostSkeleton />
        </>
      ) : posts.length > 0 ? (
        posts.map((post) => <PostCard key={post.id} post={post} />)
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-500">
          <p>Chưa có bài viết nào</p>
        </div>
      )}
    </div>
  );
};

export default ProfilePosts;


