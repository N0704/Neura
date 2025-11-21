import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { IoCallOutline, IoVideocamOutline } from "react-icons/io5";

const ChatWindow = () => {
  const activeConversationId = useSelector((state) => state.messages.activeConversationId);
  const conversations = useSelector((state) => state.messages.conversations);
  const activeConversation = conversations.find((conv) => conv.id === activeConversationId);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConversation?.messages]);

  if (!activeConversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-500 text-lg">Chọn một cuộc trò chuyện</p>
          <p className="text-gray-400 text-sm mt-2">
            Bắt đầu nhắn tin với bạn bè của bạn
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Chat Header */}
      <div className="px-4 py-3.5 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={activeConversation.user.avatar}
            alt={activeConversation.user.name}
            className="w-[42px] h-[42px] rounded-full object-cover cursor-pointer"
          />
          <div>
            <p className="text-sm font-semibold text-gray-900 cursor-pointer hover:underline">
              {activeConversation.user.name}
            </p>
            <p className="text-xs text-gray-500">Đang hoạt động</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-full hover:bg-gray-100 cursor-pointer">
            <IoCallOutline size={21} className="text-gray-600" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100 cursor-pointer">
            <IoVideocamOutline size={21} className="text-gray-600" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100 cursor-pointer">
            <HiOutlineDotsHorizontal size={21} className="text-gray-600" />
          </button>
        </div>
      </div>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {activeConversation.messages.map((message) => {
          const isOwnMessage = message.senderId === "current-user";
          return (
            <div
              key={message.id}
              className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`flex items-end gap-2 max-w-[70%] ${
                  isOwnMessage ? "flex-row-reverse" : "flex-row"
                }`}
              >
                {!isOwnMessage && (
                  <img
                    src={activeConversation.user.avatar}
                    alt="avatar"
                    className="w-6 h-6 rounded-full object-cover mb-1"
                  />
                )}
                <div
                  className={`rounded-2xl ${
                    isOwnMessage
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-900"
                  } ${message.image ? "p-0 overflow-hidden" : "px-4 py-2"}`}
                >
                  {message.image && (
                    <img
                      src={message.image}
                      alt="Message"
                      className="w-full max-w-xs rounded-2xl"
                    />
                  )}
                  {message.text && (
                    <p className={`text-sm leading-relaxed ${message.image ? "px-4 py-2" : ""}`}>
                      {message.text}
                    </p>
                  )}
                  <p
                    className={`text-xs mt-1 ${message.image ? "px-4 pb-2" : ""} ${
                      isOwnMessage ? "text-blue-100" : "text-gray-500"
                    }`}
                  >
                    {message.timestamp}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatWindow;

