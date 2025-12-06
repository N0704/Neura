import React from "react";
import { contacts } from "../../assets/assets";
import { IoSearchOutline } from "react-icons/io5";

const ProfileFriends = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Bạn bè</h2>
        </div>
        <button className="text-sm font-medium text-gray-600 hover:underline cursor-pointer">
          Xem tất cả bạn bè
        </button>
      </div>
      <div className="flex flex-wrap gap-3 mb-4">
        <button className="px-3 py-1.5 rounded-xl bg-gray-900 text-white text-sm font-medium">
          Tất cả bạn bè
        </button>
        <button className="px-3 py-1.5 rounded-xl bg-gray-100 text-sm font-medium text-gray-800 hover:bg-gray-200">
          Gần đây
        </button>
        <button className="px-3 py-1.5 rounded-xl bg-gray-100 text-sm font-medium text-gray-800 hover:bg-gray-200">
          Sinh sống gần đây
        </button>
      </div>

      <div className="mb-5">
        <div className="flex items-center gap-2 bg-gray-100 px-4 py-3 rounded-xl text-gray-600 text-base">
          <IoSearchOutline size={18} />
          <input
            type="text"
            placeholder="Tìm kiếm bạn bè"
            className="bg-transparent outline-none flex-1 text-sm text-gray-700"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {contacts.map((friend) => (
          <button
            key={friend.id}
            className="text-left rounded-lg overflow-hidden mb-1 hover:shadow-xl transition-shadow duration-150 cursor-pointer"
          >
            <div className="w-full aspect-square bg-gray-100 overflow-hidden">
              <img
                src={friend.avatar}
                alt={friend.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className=" px-2 pt-2 pb-3">
              <p className="text-base font-semibold text-gray-900 truncate">
                {friend.name}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProfileFriends;
