import React, { useState } from "react";
import Header from "../components/Header";
import { contacts } from "../assets/assets";
import { IoSearchOutline, IoPersonAddOutline, IoCheckmarkOutline, IoCloseOutline } from "react-icons/io5";

const Friends = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // all, requests, suggestions

  const friendRequests = contacts.slice(0, 3);
  const friendSuggestions = contacts.slice(3, 8);
  const allFriends = contacts;

  const filteredFriends =
    activeTab === "all"
      ? allFriends.filter((friend) =>
          friend.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : activeTab === "requests"
      ? friendRequests.filter((friend) =>
          friend.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : friendSuggestions.filter((friend) =>
          friend.name.toLowerCase().includes(searchQuery.toLowerCase())
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
                onClick={() => setActiveTab("all")}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition cursor-pointer ${
                  activeTab === "all"
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                Tất cả bạn bè ({allFriends.length})
              </button>
              <button
                onClick={() => setActiveTab("requests")}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition cursor-pointer ${
                  activeTab === "requests"
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                Lời mời kết bạn ({friendRequests.length})
              </button>
              <button
                onClick={() => setActiveTab("suggestions")}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition cursor-pointer ${
                  activeTab === "suggestions"
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                Gợi ý ({friendSuggestions.length})
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

          {/* Friends List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">
                {activeTab === "all"
                  ? "Tất cả bạn bè"
                  : activeTab === "requests"
                  ? "Lời mời kết bạn"
                  : "Gợi ý kết bạn"}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
              {filteredFriends.map((friend) => (
                <div
                  key={friend.id}
                  className="flex flex-col items-center p-4 rounded-xl hover:bg-gray-50 transition"
                >
                  <img
                    src={friend.avatar}
                    alt={friend.name}
                    className="w-24 h-24 rounded-full object-cover mb-3"
                  />
                  <p className="text-sm font-semibold text-gray-900 mb-2">
                    {friend.name}
                  </p>
                  {activeTab === "requests" && (
                    <div className="flex items-center gap-2 w-full">
                      <button className="flex-1 flex items-center justify-center gap-1 px-4 py-1.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 cursor-pointer">
                        <IoCheckmarkOutline size={16} />
                        Chấp nhận
                      </button>
                      <button className="flex-1 flex items-center justify-center gap-1 px-1.5 py-1.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 cursor-pointer">
                        <IoCloseOutline size={16} />
                        Xóa
                      </button>
                    </div>
                  )}
                  {activeTab === "suggestions" && (
                    <button className="w-full flex items-center justify-center gap-1 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 cursor-pointer">
                      <IoPersonAddOutline size={16} />
                      Thêm bạn bè
                    </button>
                  )}
                  {activeTab === "all" && (
                    <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 cursor-pointer">
                      Nhắn tin
                    </button>
                  )}
                </div>
              ))}
            </div>

            {filteredFriends.length === 0 && (
              <div className="px-6 py-12 text-center">
                <p className="text-gray-500">
                  Không tìm thấy bạn bè nào phù hợp
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Friends;

