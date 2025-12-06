import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { usersAPI } from "../../api/usersAPI";

const ProfileFriendsWidget = ({ userId, onTabChange }) => {
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFriends = async () => {
            if (!userId) return;
            try {
                setLoading(true);
                const response = await usersAPI.getUserFriends(userId);
                setFriends(response.data || response);
            } catch (error) {
                console.error("Error fetching friends:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFriends();
    }, [userId]);

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 animate-pulse">
                <div className="h-5 w-20 bg-gray-200 rounded mb-3" />
                <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                        <div key={i} className="aspect-square bg-gray-200 rounded-lg" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center justify-between mb-1">
                <div>
                    <h2 className="text-[15px] font-semibold text-gray-900">Bạn bè</h2>
                </div>
                <button
                    className="text-xs font-medium text-gray-600 hover:underline cursor-pointer"
                    onClick={() => onTabChange?.("Bạn bè")}
                >
                    Xem tất cả
                </button>
            </div>

            <p className="text-sm text-gray-500 mb-2">{friends.length} người bạn</p>

            {friends.length > 0 ? (
                <div className="grid grid-cols-3 gap-2.5">
                    {friends.slice(0, 9).map((friend) => (
                        <Link
                            key={friend.id}
                            to={`/profile/${friend.id}`}
                            className="block"
                        >
                            <div className="w-full aspect-square rounded-lg overflow-hidden border border-gray-50 bg-gray-100 hover:brightness-95 transition-all">
                                <img
                                    src={friend.avatar || "/default-avatar.png"}
                                    alt={friend.username}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <p className="text-sm font-medium text-gray-900 mt-1 truncate hover:underline cursor-pointer">
                                {friend.username}
                            </p>
                        </Link>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-gray-500 text-center py-4">Chưa có bạn bè nào</p>
            )}
        </div>
    );
};

export default ProfileFriendsWidget;
