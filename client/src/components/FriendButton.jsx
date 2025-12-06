import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    cancelFriendRequest,
    unfriend,
    getFriendStatus,
} from '../store/friendsSlice';
import { IoTrashBinOutline } from 'react-icons/io5';
import { FiUserX } from "react-icons/fi";

const FriendButton = ({ userId, onStatusChange }) => {
    const dispatch = useDispatch();
    const friendStatus = useSelector((state) => state.friends.friendStatuses[userId]);
    const [loading, setLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        // Fetch friend status when component mounts
        if (!friendStatus) {
            dispatch(getFriendStatus(userId));
        }
    }, [userId, friendStatus, dispatch]);

    const handleSendRequest = async () => {
        setLoading(true);
        try {
            await dispatch(sendFriendRequest(userId)).unwrap();
            onStatusChange?.('request_sent');
        } catch (error) {
            console.error('Error sending friend request:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAcceptRequest = async () => {
        setLoading(true);
        try {
            await dispatch(acceptFriendRequest(userId)).unwrap();
            onStatusChange?.('friends');
        } catch (error) {
            console.error('Error accepting friend request:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRejectRequest = async () => {
        setLoading(true);
        try {
            await dispatch(rejectFriendRequest(userId)).unwrap();
            onStatusChange?.('none');
        } catch (error) {
            console.error('Error rejecting friend request:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelRequest = async () => {
        setLoading(true);
        try {
            await dispatch(cancelFriendRequest(userId)).unwrap();
            onStatusChange?.('none');
        } catch (error) {
            console.error('Error canceling friend request:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUnfriend = async () => {
        setLoading(true);
        setShowDropdown(false);
        try {
            await dispatch(unfriend(userId)).unwrap();
            onStatusChange?.('none');
        } catch (error) {
            console.error('Error unfriending:', error);
        } finally {
            setLoading(false);
        }
    };

    // Render based on status
    if (friendStatus === 'self') {
        return null; // Don't show button for own profile
    }

    if (friendStatus === 'friends') {
        return (
            <div className="relative">
                <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    disabled={loading}
                    className="px-4 py-2 bg-gray-100 text-gray-800 text-sm font-medium rounded-lg hover:bg-gray-200 transition cursor-pointer flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                    Bạn bè
                </button>
                {showDropdown && (
                    <div className="absolute top-full mt-2 right-0 bg-white shadow-xl rounded-lg py-1 z-50 min-w-[200px] border border-gray-200">
                        <button
                            onClick={handleUnfriend}
                            className="w-full px-4 py-2.5 text-left hover:bg-gray-100 text-gray-900 flex items-center gap-3 transition-colors"
                        >
                            <FiUserX className="w-5 h-5 text-gray-600" />
                            <span className="text-sm font-medium">Hủy kết bạn</span>
                        </button>
                        <button
                            onClick={handleUnfriend}
                            className="w-full px-4 py-2.5 text-left hover:bg-gray-100 text-gray-900 flex items-center gap-3 transition-colors"
                        >
                            <IoTrashBinOutline className="w-5 h-5 text-gray-600" />
                            <span className="text-sm font-medium">Bỏ theo dõi</span>
                        </button>
                    </div>
                )}
            </div>
        );
    }

    if (friendStatus === 'request_sent') {
        return (
            <button
                onClick={handleCancelRequest}
                disabled={loading}
                className="px-4 py-2 bg-gray-100 text-gray-800 text-sm font-medium rounded-lg hover:bg-gray-200 transition cursor-pointer"
            >
                {loading ? 'Đang xử lý...' : 'Hủy lời mời'}
            </button>
        );
    }

    if (friendStatus === 'request_received') {
        return (
            <div className="flex gap-2">
                <button
                    onClick={handleAcceptRequest}
                    disabled={loading}
                    className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition cursor-pointer"
                >
                    {loading ? 'Đang xử lý...' : 'Chấp nhận'}
                </button>
                <button
                    onClick={handleRejectRequest}
                    disabled={loading}
                    className="px-4 py-2 bg-gray-100 text-gray-800 text-sm font-medium rounded-lg hover:bg-gray-200 transition cursor-pointer"
                >
                    Từ chối
                </button>
            </div>
        );
    }

    // Default: none - show add friend button
    return (
        <button
            onClick={handleSendRequest}
            disabled={loading}
            className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition cursor-pointer flex items-center gap-2"
        >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            {loading ? 'Đang gửi...' : 'Kết bạn'}
        </button>
    );
};

export default FriendButton;
