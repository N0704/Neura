import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleReaction, addComment } from "../store/postsSlice";
import { IoCloseOutline } from "react-icons/io5";
import { assets } from "../assets/assets";
import { BiComment, BiLike, BiShare, BiSolidLike } from "react-icons/bi";
import { IoMdArrowDropdown } from "react-icons/io";

const CommentsModal = ({ isOpen, onClose, postId }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user);

  const post = useSelector((state) =>
    state.posts.posts.find((p) => p.id === postId)
  );

  const [commentText, setCommentText] = useState("");
  const commentsEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto focus khi mở
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // ⭐ Scroll xuống khi comments thay đổi
  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [post?.comments]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      await dispatch(addComment({ postId, content: commentText })).unwrap();
      setCommentText("");
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  if (!isOpen || !post) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Bình luận</h3>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 cursor-pointer"
          >
            <IoCloseOutline size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
          <div>
            <div className="flex items-center gap-3">
              <img
                src={post.user.avatar}
                alt={post.user.username}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">
                  {post.user.username}
                </p>
                <p className="text-xs text-gray-500">{post.time}</p>
              </div>
            </div>

            {post.content && (
              <p className="my-3 text-sm text-gray-800 whitespace-pre-line">
                {post.content}
              </p>
            )}

            {post.media_urls && post.media_urls.length > 0 && (
              <div className="rounded-lg overflow-hidden bg-gray-100 mb-1">
                <img
                  src={post.media_urls[0].url}
                  alt=""
                  className="w-full max-h-[60vh] object-cover"
                />
              </div>
            )}

            {/* Stats */}
            <div className="flex items-center justify-between text-sm text-[#65686C] pt-3">

              {/* Likes */}
              {post.reactions_count > 0 && (
                <button className="hover:underline cursor-pointer">
                  {post.reactions_count} lượt thích
                </button>
              )}

              <div className="flex items-center gap-4">

                {/* Comments */}
                {post.comments_count > 0 && (
                  <span className="hover:underline cursor-pointer">
                    {post.comments_count} bình luận
                  </span>
                )}

                {/* Shares */}
                {post.shares_count > 0 && (
                  <button className="hover:underline cursor-pointer">
                    {post.shares_count} lượt chia sẻ
                  </button>
                )}

              </div>
            </div>


            {/* Actions */}
            <div className="grid grid-cols-3 text-sm font-medium text-[#65686C] pt-2">
              <button
                onClick={() => dispatch(toggleReaction({ postId: post.id, type: 'like' }))}
                className={`py-2 flex items-center justify-center gap-2 rounded-lg hover:bg-gray-100 transition cursor-pointer ${post.user_reaction?.liked ? "text-gray-900" : ""
                  }`}
              >
                {post.user_reaction?.liked ? (
                  <BiSolidLike size={20} className="mb-0.5" />
                ) : (
                  <BiLike size={20} className="mb-0.5" />
                )}
                Thích
              </button>

              <button
                onClick={() => inputRef.current?.focus()}
                className="py-2 flex items-center justify-center gap-2 rounded-lg hover:bg-gray-100 transition cursor-pointer"
              >
                <BiComment size={20} />
                Bình luận
              </button>

              <button
                onClick={() => alert('Chức năng chia sẻ đang phát triển')}
                className="py-2 flex items-center justify-center gap-2 rounded-lg hover:bg-gray-100 transition cursor-pointer"
              >
                <BiShare size={20} className="transform -scale-x-100" />
                Chia sẻ
              </button>
            </div>
            <div className="flex items-center gap-1 text-sm text-[#65686C] cursor-pointer mt-1">
              <span className="font-medium">Phù hợp nhất</span>
              <IoMdArrowDropdown />
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-4">
            {post.comments?.length > 0 ? (
              post.comments.map((comment) => (
                <div key={comment.id} className="flex items-start gap-3">
                  <img
                    src={comment.user.avatar}
                    alt={comment.user.username}
                    className="w-8 h-8 rounded-full object-cover"
                  />

                  <div>
                    <div className="bg-gray-100 rounded-2xl px-4 py-2 inline-block">
                      <p className="text-sm font-semibold text-gray-900">
                        {comment.user.username}
                      </p>
                      <p className="text-sm text-gray-800">{comment.content}</p>
                    </div>

                    <div className="flex items-center gap-4 mt-1 ml-2">
                      <span className="text-xs text-gray-500 hover:underline cursor-pointer">
                        Thích
                      </span>
                      <span className="text-xs text-gray-500 hover:underline cursor-pointer">
                        Phản hồi
                      </span>
                      <span className="text-xs text-gray-400">
                        {comment.time}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-gray-500 text-sm">
                Chưa có bình luận nào.
              </div>
            )}

            <div ref={commentsEndRef} />
          </div>
        </div>

        {/* INPUT BAR */}
        <div className="bg-white px-6 py-4 border-t border-gray-100">
          <form onSubmit={handleSubmit} className="flex items-center gap-3">
            <img
              src={currentUser?.avatar || assets.avatar}
              alt="avatar"
              className="w-8 h-8 rounded-full object-cover"
            />

            <textarea
              ref={inputRef}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Viết bình luận..."
              rows={1}
              className="flex-1 bg-gray-100 rounded-2xl px-4 py-3 text-sm outline-none resize-none"
            />

            <button
              type="submit"
              disabled={!commentText.trim()}
              className={`px-4 py-2 rounded-xl text-sm font-semibold cursor-pointer ${commentText.trim()
                ? "bg-gray-900 text-white hover:bg-gray-700"
                : "bg-gray-200 text-gray-400"
                }`}
            >
              Đăng
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CommentsModal;
