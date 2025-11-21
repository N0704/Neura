import React from "react";
import Header from "../components/Header";
import {
  IoHeartOutline,
  IoChatbubbleOutline,
  IoPersonAddOutline,
  IoPeopleOutline,
} from "react-icons/io5";
import { notifications } from "../assets/assets";

const getNotificationIcon = (type) => {
  switch (type) {
    case "like":
      return <IoHeartOutline className="text-red-500" size={20} />;
    case "comment":
      return <IoChatbubbleOutline className="text-blue-500" size={20} />;
    case "friend_request":
    case "friend_accept":
      return <IoPersonAddOutline className="text-green-500" size={20} />;
    default:
      return <IoPeopleOutline className="text-gray-500" size={20} />;
  }
};

const Notifications = () => {
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="flex flex-col min-h-screen bg-[#f9f9f9]">
      <Header />

      <main className="flex-1 pt-16">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100">
              <h1 className="text-2xl font-bold text-gray-900">Thông báo</h1>
              {unreadCount > 0 && (
                <p className="text-sm text-gray-500 mt-1">
                  {unreadCount} thông báo chưa đọc
                </p>
              )}
            </div>

            {/* Notifications List */}
            <div className="divide-y divide-gray-100">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`px-6 py-4 hover:bg-gray-50 transition-colors ${
                    !notification.read ? "bg-blue-50/30" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <img
                        src={notification.user.avatar}
                        alt={notification.user.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">
                        <span className="font-semibold">
                          {notification.user.name}
                        </span>{" "}
                        {notification.action}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {notification.time}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2" />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {notifications.length === 0 && (
              <div className="px-6 py-12 text-center">
                <p className="text-gray-500">Chưa có thông báo nào</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Notifications;
