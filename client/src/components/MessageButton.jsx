import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { IoChatbubbleEllipsesOutline } from 'react-icons/io5';
import FollowButton from './FollowButton';

const MessageButton = ({ userId }) => {
    const navigate = useNavigate();
    const friendStatus = useSelector((state) => state.friends.friendStatuses[userId]);

    const handleMessage = () => {
        navigate('/messages');
    };

    // If already friends, show Message button
    if (friendStatus === 'friends') {
        return (
            <button
                onClick={handleMessage}
                className="px-4 py-2 bg-gray-100 text-gray-800 text-sm font-medium rounded-lg hover:bg-gray-200 transition cursor-pointer flex items-center gap-2"
            >
                <IoChatbubbleEllipsesOutline className="w-5 h-5" />
                Nhắn tin
            </button>
        );
    }

    // Otherwise, show Follow button
    return <FollowButton userId={userId} />;
};

export default MessageButton;
