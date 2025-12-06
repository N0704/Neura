import React from 'react';
import { useDispatch } from 'react-redux';
import { acceptFriendRequest, rejectFriendRequest } from '../store/friendsSlice';

const FriendRequestCard = ({ request }) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = React.useState(false);

    const handleAccept = async () => {
        setLoading(true);
        try {
            await dispatch(acceptFriendRequest(request.user.id)).unwrap();
        } catch (error) {
            console.error('Error accepting friend request:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleReject = async () => {
        setLoading(true);
        try {
            await dispatch(rejectFriendRequest(request.user.id)).unwrap();
        } catch (error) {
            console.error('Error rejecting friend request:', error);
        } finally {
            setLoading(false);
        }
    };

    const timeAgo = (date) => {
        const now = new Date();
        const created = new Date(date);
        const diffInSeconds = Math.floor((now - created) / 1000);

        if (diffInSeconds < 60) return 'Vừa xong';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} ngày trước`;
        return created.toLocaleDateString('vi-VN');
    };

    return (
        <div className="bg-white p-4 flex items-center gap-4">
            <img
                src={request.user.avatar || '/default-avatar.png'}
                alt={request.user.username}
                className="w-16 h-16 rounded-full object-cover"
            />
            <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{request.user.username}</h3>
                {request.user.bio && (
                    <p className="text-sm text-gray-600 line-clamp-1">{request.user.bio}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">{timeAgo(request.created_at)}</p>
            </div>
            <div className="flex gap-2">
                <button
                    onClick={handleAccept}
                    disabled={loading}
                    className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                    Chấp nhận
                </button>
                <button
                    onClick={handleReject}
                    disabled={loading}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
                >
                    Từ chối
                </button>
            </div>
        </div>
    );
};

export default FriendRequestCard;
