import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFriends, fetchFriendRequests } from '../store/friendsSlice';
import Header from '../components/Header';
import UserCard from '../components/UserCard';
import FriendRequestCard from '../components/FriendRequestCard';
import UserSkeleton from '../components/UserSkeleton';
import { IoSearchOutline } from 'react-icons/io5';

const Friends = () => {
  const dispatch = useDispatch();
  const { friends, friendRequests, loading } = useSelector((state) => state.friends);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'requests'
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(fetchFriends());
    dispatch(fetchFriendRequests());
  }, [dispatch]);

  const filteredFriends = friends.filter((friend) =>
    friend.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredRequests = friendRequests.filter((request) =>
    request.user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#f9f9f9]">
      <Header />

      <main className="flex-1 pt-16">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-4">
            <div className="px-6 py-4 border-b border-gray-100">
              <h1 className="text-2xl font-bold text-gray-900">Bạn bè</h1>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 px-6 py-2 border-b border-gray-100">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition cursor-pointer ${activeTab === 'all'
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-50'
                  }`}
              >
                Tất cả bạn bè ({friends.length})
              </button>
              <button
                onClick={() => setActiveTab('requests')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition cursor-pointer relative ${activeTab === 'requests'
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-50'
                  }`}
              >
                Lời mời kết bạn ({friendRequests.length})
                {friendRequests.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {friendRequests.length}
                  </span>
                )}
              </button>
            </div>

            {/* Search */}
            <div className="px-6 py-4">
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-4 py-2">
                <IoSearchOutline size={18} className="text-gray-500" />
                <input
                  type="text"
                  placeholder="Tìm kiếm bạn bè..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent outline-none text-sm text-gray-700 flex-1"
                />
              </div>
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {[1, 2, 3, 4, 5].map((i) => (
                <UserSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">
                  {activeTab === 'all' ? 'Tất cả bạn bè' : 'Lời mời kết bạn'}
                </h2>
              </div>

              <div className="p-6 space-y-4">
                {activeTab === 'all' && (
                  <>
                    {filteredFriends.length === 0 ? (
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
                        <p className="mt-2 text-gray-600">
                          {searchQuery ? 'Không tìm thấy bạn bè nào' : 'Bạn chưa có bạn bè nào'}
                        </p>
                      </div>
                    ) : (
                      filteredFriends.map((friend) => (
                        <UserCard
                          key={friend.id}
                          user={friend}
                          showFriendButton={true}
                          showMessageButton={true}
                        />
                      ))
                    )}
                  </>
                )}

                {activeTab === 'requests' && (
                  <>
                    {filteredRequests.length === 0 ? (
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
                            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                          />
                        </svg>
                        <p className="mt-2 text-gray-600">
                          {searchQuery ? 'Không tìm thấy lời mời nào' : 'Không có lời mời kết bạn nào'}
                        </p>
                      </div>
                    ) : (
                      filteredRequests.map((request) => (
                        <FriendRequestCard key={request.id} request={request} />
                      ))
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Friends;
