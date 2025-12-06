import React from 'react';
import { Link } from 'react-router-dom';
import FriendButton from './FriendButton';
import MessageButton from './MessageButton';

const UserCard = ({ user, showFriendButton = true, showMessageButton = true }) => {
    return (
        <div className="bg-white p-4 flex items-center gap-4">
            <Link to={`/profile/${user.id}`}>
                <img
                    src={user.avatar || '/default-avatar.png'}
                    alt={user.username}
                    className="w-16 h-16 rounded-full object-cover hover:opacity-80 transition-opacity"
                />
            </Link>
            <div className="flex-1">
                <Link to={`/profile/${user.id}`} className="hover:underline">
                    <h3 className="font-semibold text-gray-900">{user.username}</h3>
                </Link>
                {user.bio && (
                    <p className="text-sm text-gray-600 line-clamp-2">{user.bio}</p>
                )}
                {user.email && (
                    <p className="text-xs text-gray-500 mt-1">{user.email}</p>
                )}
            </div>
            <div className="flex gap-2">
                {showFriendButton && <FriendButton userId={user.id} />}
                {showMessageButton && <MessageButton userId={user.id} />}
            </div>
        </div>
    );
};

export default UserCard;
