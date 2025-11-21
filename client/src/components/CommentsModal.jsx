import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleLike, sharePost, addComment } from "../store/postsSlice";
import { IoCloseOutline } from "react-icons/io5";
import { assets } from "../assets/assets";
import { BiComment, BiLike, BiShare, BiSolidLike } from "react-icons/bi";
import { IoMdArrowDropdown } from "react-icons/io";

const CommentsModal = ({ isOpen, onClose, postId }) => {
  const dispatch = useDispatch();

  // ⭐ Lấy post mới nhất từ Redux
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    dispatch(addComment({ postId, commentText }));
    setCommentText("");
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
                alt={post.user.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">
                  {post.user.name}
                </p>
                <p className="text-xs text-gray-500">{post.time}</p>
              </div>
            </div>

            {post.content && (
              <p className="my-3 text-sm text-gray-800 whitespace-pre-line">
                {post.content}
              </p>
            )}

            {post.image && (
              <div className="rounded-lg overflow-hidden bg-gray-100 mb-1">
                <img
                  src={post.image}
                  alt=""
                  className="w-full max-h-[60vh] object-contain"
                />
              </div>
            )}

            {/* Stats */}
            <div className="flex items-center justify-between text-sm text-[#65686C] px-1.5 pt-3">
              <span>{post.reactions_count} lượt thích</span>
              <div className="flex items-center gap-4">
                <span>{post.comments_count} bình luận</span>
                <span>{post.shares_count} chia sẻ</span>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-3 text-sm font-medium text-[#65686C] pt-2">
              <button
                onClick={() => dispatch(toggleLike(post.id))}
                className={`py-2 flex items-center justify-center gap-2 rounded-lg hover:bg-gray-100 ${
                  post.liked ? "text-blue-600" : ""
                }`}
              >
                {post.liked ? <BiSolidLike size={20} /> : <BiLike size={20} />}
                Thích
              </button>

              <button className="py-2 flex items-center justify-center gap-2 rounded-lg hover:bg-gray-100">
                <BiComment size={20} />
                Bình luận
              </button>

              <button
                onClick={() => dispatch(sharePost(post.id))}
                className="py-2 flex items-center justify-center gap-2 rounded-lg hover:bg-gray-100"
              >
                <BiShare size={20} className="-scale-x-100" />
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
                    alt={comment.user.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />

                  <div>
                    <div className="bg-gray-100 rounded-2xl px-4 py-2 inline-block">
                      <p className="text-sm font-semibold text-gray-900">
                        {comment.user.name}
                      </p>
                      <p className="text-sm text-gray-800">{comment.text}</p>
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
              src={assets.avatar}
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
              className={`px-4 py-2 rounded-xl text-sm font-semibold ${
                commentText.trim()
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
