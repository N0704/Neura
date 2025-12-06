import React from "react";
import { assets } from "../../assets/assets";
import { PROFILE_TABS } from "../../constants/profileTabs";
import FriendButton from "../FriendButton";
import MessageButton from "../MessageButton";

const ProfileHeader = ({
  activeTab,
  onTabChange,
  onEditProfile,
  name = "",
  subtitle = "",
  isOwnProfile = true,
  userId,
  avatar,
}) => {
  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Cover */}
      <div className="h-56 w-full bg-linear-to-r from-gray-600 via-gray-500 to-gray-400 rounded-t-xl overflow-hidden" />

      {/* Avatar + Info + Actions */}
      <div className="px-6 pt-1 pb-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 -mt-14">
          <div className="flex items-end gap-4">
            <div className="relative">
              <img
                src={avatar || assets.avatar}
                alt="Avatar"
                className="w-32 h-32 rounded-full border-4 border-white shadow-sm object-cover bg-white"
              />
            </div>
            <div className="pb-2">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">{name}</h1>
              <p className="text-sm text-gray-500">{subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 pb-2">
            {isOwnProfile ? (
              <>
                <button
                  className="px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 transition cursor-pointer"
                  onClick={() => onEditProfile?.()}
                >
                  Chỉnh sửa trang cá nhân
                </button>
                <button className="px-4 py-2 rounded-lg bg-gray-100 text-sm font-medium text-gray-800 hover:bg-gray-200 transition cursor-pointer">
                  Xem với tư cách khác
                </button>
              </>
            ) : (
              <>
                <FriendButton userId={userId} />
                <MessageButton userId={userId} />
              </>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-4 border-t border-gray-100">
          <div className="flex flex-wrap gap-1">
            {PROFILE_TABS.map((tab) => {
              const isActive = tab === activeTab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => onTabChange?.(tab)}
                  className={`px-4 py-3 my-0.5 text-sm font-medium transition-colors duration-150 cursor-pointer ${isActive
                    ? "text-gray-900 border-b-2 border-gray-900"
                    : "text-gray-600 hover:bg-gray-50"
                    }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileHeader;
