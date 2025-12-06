import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFollowers } from '../store/followsSlice';
import Header from '../components/Header';
import UserCard from '../components/UserCard';
import UserSkeleton from '../components/UserSkeleton';

const Followers = () => {
    const dispatch = useDispatch();
    const { followers, loading } = useSelector((state) => state.follows);

    useEffect(() => {
        dispatch(fetchFollowers());
    }, [dispatch]);

    return (
        <div className="flex flex-col min-h-screen bg-[#f9f9f9]">
            <Header />

            <main className="flex-1 pt-16">
                <div className="max-w-4xl mx-auto px-4 py-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                        <div className="px-6 py-4 border-b border-gray-100">
                            <h1 className="text-2xl font-bold text-gray-900">Người theo dõi</h1>
                            <p className="text-sm text-gray-600 mt-1">
                                {followers.length} người đang theo dõi bạn
                            </p>
                        </div>

                        {loading ? (
                            <div className="p-6 space-y-4">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <UserSkeleton key={i} />
                                ))}
                            </div>
                        ) : (
                            <div className="p-6 space-y-4">
                                {followers.length === 0 ? (
                                    <div className="text-center py-12">
                                        <svg
                                            className="mx-auto h-12 w-12 text-gray-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                            />
                                        </svg>
                                        <p className="mt-2 text-gray-600">Chưa có người theo dõi nào</p>
                                    </div>
                                ) : (
                                    followers.map((follower) => (
                                        <UserCard
                                            key={follower.id}
                                            user={follower}
                                            showFriendButton={true}
                                            showMessageButton={true}
                                        />
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Followers;
