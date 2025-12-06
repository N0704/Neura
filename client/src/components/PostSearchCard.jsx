import React from 'react';
import { Link } from 'react-router-dom';
import { IoEarth, IoPeople, IoLockClosed } from 'react-icons/io5';
import { BiLike, BiComment } from 'react-icons/bi';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

const privacyIcons = {
    public: { icon: IoEarth, label: "Công khai" },
    friends: { icon: IoPeople, label: "Bạn bè" },
    private: { icon: IoLockClosed, label: "Chỉ mình tôi" },
};

const formatTimeAgo = (date) => {
    const timeString = formatDistanceToNow(new Date(date), { addSuffix: true, locale: vi });
    return timeString.replace('khoảng ', '');
};

const PostSearchCard = ({ post }) => {
    const privacy = privacyIcons[post.privacy] || privacyIcons.public;
    const PrivacyIcon = privacy.icon;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
            {/* User Info */}
            <div className="flex items-start gap-3 mb-3">
                <Link to={`/profile/${post.user.id}`}>
                    <img
                        src={post.user.avatar || '/default-avatar.png'}
                        alt={post.user.username}
                        className="w-10 h-10 rounded-full object-cover shadow-sm"
                    />
                </Link>
                <div className="flex-1">
                    <Link to={`/profile/${post.user.id}`} className="hover:underline">
                        <h3 className="font-semibold text-gray-900">{post.user.username}</h3>
                    </Link>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                        {formatTimeAgo(post.created_at)}
                        <span className="text-gray-400">·</span>
                        <PrivacyIcon size={12} />
                        <span>{privacy.label}</span>
                    </p>
                </div>
            </div>

            {/* Post Content */}
            <p className="text-sm text-gray-800 mb-3 line-clamp-4 whitespace-pre-line leading-relaxed">
                {post.content}
            </p>

            {/* Post Image */}
            {post.media_urls && post.media_urls.length > 0 && (
                <div className="mb-3 rounded-lg overflow-hidden bg-gray-100">
                    <img
                        src={post.media_urls[0].url}
                        alt="Post"
                        className="w-full h-48 object-cover"
                    />
                </div>
            )}

            {/* Stats */}
            <div className="flex items-center justify-between text-xs text-gray-600 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-4">
                    {post.reactions_count > 0 && (
                        <div className="flex items-center gap-1">
                            <BiLike className="w-4 h-4" />
                            <span>{post.reactions_count}</span>
                        </div>
                    )}
                    {post.comments_count > 0 && (
                        <div className="flex items-center gap-1">
                            <BiComment className="w-4 h-4" />
                            <span>{post.comments_count}</span>
                        </div>
                    )}
                </div>
                <Link
                    to="/"
                    className="text-blue-600 hover:text-blue-700 font-medium"
                >
                    Xem bài viết
                </Link>
            </div>
        </div>
    );
};

export default PostSearchCard;
