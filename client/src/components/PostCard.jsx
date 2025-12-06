import { useState } from "react";
import { useDispatch } from "react-redux";
import { toggleReaction } from "../store/postsSlice";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { BiComment, BiLike, BiShare, BiSolidLike } from "react-icons/bi";
import { IoEarth, IoPeople, IoLockClosed } from "react-icons/io5";
import CommentsModal from "./CommentsModal";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { Link } from "react-router-dom";

// Helper function to format time without "khoảng"
const formatTimeAgo = (date) => {
    const timeString = formatDistanceToNow(new Date(date), { addSuffix: true, locale: vi });
    return timeString.replace('khoảng ', '');
};

const privacyIcons = {
    public: { icon: IoEarth, label: "Công khai" },
    friends: { icon: IoPeople, label: "Bạn bè" },
    private: { icon: IoLockClosed, label: "Chỉ mình tôi" },
};

const PostCard = ({ post }) => {
    const dispatch = useDispatch();
    const [selectedPost, setSelectedPost] = useState(null);
    const privacy = privacyIcons[post.privacy] || privacyIcons.public;
    const PrivacyIcon = privacy.icon;

    return (
        <>
            <div
                className="flex flex-col bg-white px-5 pt-4 pb-3 rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.1)]"
            >
                <div className="flex items-center justify-between">
                    <Link to={`/profile/${post.user.id}`} className="flex items-start gap-3.5 cursor-pointer">
                        <img
                            src={post.user.avatar}
                            alt=""
                            className="rounded-full w-10 h-10 object-cover shadow-[0_1px_2px_rgba(0,0,0,0.15)]"
                        />
                        <div className="flex flex-col">
                            <div className="flex items-center gap-1">
                                <p className="text-base font-semibold text-gray-900 hover:underline cursor-pointer">
                                    {post.user.username}
                                </p>
                                {post.feeling && (
                                    <p className="text-[15px] text-gray-600 font-medium">
                                        đang cảm thấy {post.feeling}
                                    </p>
                                )}
                            </div>
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                {formatTimeAgo(post.created_at)}
                                <span className="text-gray-400">·</span>
                                <PrivacyIcon size={12} />
                                <span className="mb-0.5">
                                    {post.privacyLabel || privacy.label}
                                </span>
                            </p>
                        </div>
                    </Link>

                    <button className="p-1.5 rounded-full hover:bg-gray-100 transition cursor-pointer">
                        <HiOutlineDotsHorizontal size={22} className="text-gray-600" />
                    </button>
                </div>

                {post.background ? (
                    <div
                        className={`rounded-2xl px-6 py-40 text-center mt-4 mb-1 text-white text-2xl font-semibold leading-tight tracking-wide whitespace-pre-line ${post.background}`}
                    >
                        {post.content}
                    </div>
                ) : (
                    <>
                        <p
                            className={`text-gray-800 leading-relaxed px-1 whitespace-pre-line ${post.image ? "text-lg py-4" : "text-[17px] py-3"
                                }`}
                        >
                            {post.content}
                        </p>
                    </>
                )}


                {post.media_urls && post.media_urls.length > 0 && (
                    <div className="rounded-lg overflow-hidden bg-gray-100 mb-1">
                        <img
                            src={post.media_urls[0].url}
                            alt=""
                            className="w-full h-full max-h-[70vh] object-cover"
                            loading="lazy"
                        />
                    </div>
                )}

                <div className="flex items-center justify-between text-sm text-[#65686C] py-2.5">

                    {/* Likes */}
                    <div>
                        {post.reactions_count > 0 && (
                            <button className="hover:underline cursor-pointer">
                                {post.reactions_count} lượt thích
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-4">

                        {/* Comments */}
                        {post.comments_count > 0 && (
                            <button
                                onClick={() => setSelectedPost(post.id)}
                                className="hover:underline cursor-pointer"
                            >
                                {post.comments_count} bình luận
                            </button>
                        )}

                        {/* Shares */}
                        {post.shares_count > 0 && (
                            <button className="hover:underline cursor-pointer">
                                {post.shares_count} lượt chia sẻ
                            </button>
                        )}

                    </div>
                </div>


                <div className="grid grid-cols-3 text-sm font-medium text-[#65686C]">
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
                        onClick={() => setSelectedPost(post.id)}
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
            </div>

            <CommentsModal
                isOpen={Boolean(selectedPost)}
                onClose={() => setSelectedPost(null)}
                postId={selectedPost}
            />
        </>
    );
};

export default PostCard;
