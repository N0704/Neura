import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleLike, sharePost } from "../store/postsSlice";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { BiComment, BiLike, BiShare, BiSolidLike } from "react-icons/bi";
import { IoEarth, IoPeople, IoLockClosed } from "react-icons/io5";
import CommentsModal from "./CommentsModal";

const privacyIcons = {
  public: { icon: IoEarth, label: "Công khai" },
  friends: { icon: IoPeople, label: "Bạn bè" },
  private: { icon: IoLockClosed, label: "Chỉ mình tôi" },
};

const Post = () => {
  const posts = useSelector((state) => state.posts.posts);
  const dispatch = useDispatch();
  const [selectedPost, setSelectedPost] = useState(null);

  if (!posts.length) {
    return (
      <div className="bg-white rounded-xl border border-dashed border-gray-200 p-6 text-center text-sm text-gray-500">
        Chưa có bài viết nào. Hãy đăng điều gì đó!
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {posts.map((post) => {
        const privacy = privacyIcons[post.privacy] || privacyIcons.public;
        const PrivacyIcon = privacy.icon;

        return (
          <div
            key={post.id}
            className="flex flex-col bg-white px-5 pt-4 pb-3 rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.1)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3.5 cursor-pointer">
                <img
                  src={post.user.avatar}
                  alt=""
                  className="rounded-full w-10 h-10 object-cover shadow-[0_1px_2px_rgba(0,0,0,0.15)]"
                />
                <div className="flex flex-col">
                  <p className="text-base font-semibold text-gray-900 hover:underline cursor-pointer">
                    {post.user.name}
                  </p>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    {post.time}
                    <span className="text-gray-400">·</span>
                    <PrivacyIcon size={12} />
                    <span className="mb-0.5">
                      {post.privacyLabel || privacy.label}
                    </span>
                  </p>
                </div>
              </div>

              <button className="p-1.5 rounded-full hover:bg-gray-100 transition cursor-pointer">
                <HiOutlineDotsHorizontal size={22} className="text-gray-600" />
              </button>
            </div>

            {/* Content */}
            {post.background ? (
              <div
                className={`rounded-2xl px-6 py-40 text-center my-4 text-white text-2xl font-semibold leading-tight tracking-wide whitespace-pre-line ${post.background}`}
              >
                {post.content || "Chia sẻ cảm xúc của bạn"}
                {post.feeling && (
                  <p className="mt-3 text-base font-medium">
                    Đang cảm thấy {post.feeling}
                  </p>
                )}
              </div>
            ) : (
              <>
                <p
                  className={`text-gray-800 leading-relaxed px-1 whitespace-pre-line ${
                    post.image ? "text-base py-3" : "text-lg py-4"
                  }`}
                >
                  {post.content}
                </p>
                {post.feeling && (
                  <p className="text-sm text-blue-500 px-1">
                    Đang cảm thấy {post.feeling}
                  </p>
                )}
              </>
            )}

            {/* Image */}
            {post.image && (
              <div className="rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={post.image}
                  alt=""
                  className="w-full h-full max-h-[70vh] object-contain"
                  loading="lazy"
                />
              </div>
            )}

            {/* Stats */}
            <div className="flex items-center justify-between text-sm text-[#65686C] px-1.5 py-2.5">
              <button className="hover:underline cursor-pointer">
                {post.reactions_count} lượt thích
              </button>
              <div className="flex items-center gap-4">
                <button className="hover:underline cursor-pointer">
                  {post.comments_count} bình luận
                </button>
                <button className="hover:underline cursor-pointer">
                  {post.shares_count} lượt chia sẻ
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-3 text-sm font-medium text-[#65686C]">
              <button
                onClick={() => dispatch(toggleLike(post.id))}
                className={`py-2 flex items-center justify-center gap-2 rounded-lg hover:bg-gray-100 transition cursor-pointer ${
                  post.liked ? "text-blue-600" : ""
                }`}
              >
                {post.liked ? (
                  <BiSolidLike size={20} className="mb-0.5" />
                ) : (
                  <BiLike size={20} className="mb-0.5" />
                )}
                Thích
              </button>

              <button
                onClick={() => setSelectedPost(post.id)}
                className="py-2 flex items-center justify-center gap-2 rounded-lg hover:bg-gray-100 transition cursor-pointer"
              >
                <BiComment size={20} />
                Bình luận
              </button>

              <button
                onClick={() => dispatch(sharePost(post.id))}
                className="py-2 flex items-center justify-center gap-2 rounded-lg hover:bg-gray-100 transition cursor-pointer"
              >
                <BiShare size={20} className="transform -scale-x-100" />
                Chia sẻ
              </button>
            </div>
          </div>
        );
      })}

      <CommentsModal
        isOpen={Boolean(selectedPost)}
        onClose={() => setSelectedPost(null)}
        postId={selectedPost}
      />
    </div>
  );
};

export default Post;
