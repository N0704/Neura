import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { followUser, unfollowUser, getFollowStatus } from '../store/followsSlice';
import { IoBookmarkOutline, IoBookmark } from 'react-icons/io5';

const FollowButton = ({ userId, onStatusChange }) => {
    const dispatch = useDispatch();
    const followStatus = useSelector((state) => state.follows.followStatuses[userId]);
    const [loading, setLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        // Fetch follow status when component mounts
        if (!followStatus) {
            dispatch(getFollowStatus(userId));
        }
    }, [userId, followStatus, dispatch]);

    const handleFollow = async () => {
        setLoading(true);
        try {
            await dispatch(followUser(userId)).unwrap();
            onStatusChange?.(true);
        } catch (error) {
            console.error('Error following user:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUnfollow = async () => {
        setLoading(true);
        setShowDropdown(false);
        try {
            await dispatch(unfollowUser(userId)).unwrap();
            onStatusChange?.(false);
        } catch (error) {
            console.error('Error unfollowing user:', error);
        } finally {
            setLoading(false);
        }
    };

    const isFollowing = followStatus?.is_following || false;

    if (isFollowing) {
        return (
            <div className="relative">
                <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    disabled={loading}
                    className="px-4 py-2 bg-gray-100 text-gray-800 text-sm font-medium rounded-lg hover:bg-gray-200 transition cursor-pointer flex items-center gap-2"
                >
                    <IoBookmark className="w-5 h-5" />
                    Đang theo dõi
                </button>
                {showDropdown && (
                    <div className="absolute top-full mt-2 right-0 bg-white shadow-xl rounded-lg py-1 z-50 min-w-[200px] border border-gray-200">
                        <button
                            onClick={handleUnfollow}
                            className="w-full px-4 py-2.5 text-left hover:bg-gray-100 text-gray-900 flex items-center gap-3 transition-colors"
                        >
                            <IoBookmarkOutline className="w-4 h-4 text-gray-600" />
                            <span className="text-sm font-medium">Bỏ theo dõi</span>
                        </button>
                    </div>
                )}
            </div>
        );
    }

    return (
        <button
            onClick={handleFollow}
            disabled={loading}
            className="px-4 py-2 bg-gray-100 text-gray-800 text-sm font-medium rounded-lg hover:bg-gray-200 transition cursor-pointer flex items-center gap-2"
        >
            <IoBookmarkOutline className="w-4 h-4" />
            {loading ? 'Đang xử lý...' : 'Theo dõi'}
        </button>
    );
};

export default FollowButton;
