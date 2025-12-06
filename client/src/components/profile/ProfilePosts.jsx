import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserPosts, clearUserPosts } from "../../store/postsSlice";
import PostShare from "../PostShare";
import PostCard from "../PostCard";
import PostSkeleton from "../PostSkeleton";

const ProfilePosts = ({ userId }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user);
  const { userPosts: posts, loading } = useSelector((state) => state.posts);
  const isOwnProfile = !userId || (currentUser && userId == currentUser.id);

  useEffect(() => {
    const targetUserId = userId || currentUser?.id;
    if (targetUserId) {
      dispatch(fetchUserPosts({ userId: targetUserId }));
    }

    return () => {
      dispatch(clearUserPosts());
    };
  }, [userId, currentUser?.id, dispatch]);

  return (
    <div className="space-y-4">
      {isOwnProfile && <PostShare />}

      {loading && posts.length === 0 ? (
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
