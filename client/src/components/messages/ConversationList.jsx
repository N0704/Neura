import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setActiveConversationId, markAsRead } from "../../store/messagesSlice";
import { IoSearchOutline } from "react-icons/io5";
import { HiOutlineDotsHorizontal } from "react-icons/hi";

const ConversationList = () => {
  const dispatch = useDispatch();
  const conversations = useSelector((state) => state.messages.conversations);
  const activeConversationId = useSelector((state) => state.messages.activeConversationId);

  const handleConversationClick = (conversationId) => {
    dispatch(setActiveConversationId(conversationId));
    dispatch(markAsRead(conversationId));
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-100">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold text-gray-900">Messenger</h2>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-full hover:bg-gray-100">
              <HiOutlineDotsHorizontal size={20} className="text-gray-600" />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2 mb-1">
          <IoSearchOutline size={18} className="text-gray-500" />
          <input
            type="text"
            placeholder="Tìm kiếm trên Messenger"
            className="bg-transparent outline-none text-sm text-gray-700 flex-1"
          />
        </div>
      </div>
      {/* Conversations */}
      <div className="flex-1 space-y-2 overflow-y-auto">
        {conversations.map((conversation) => {
          const isActive = conversation.id === activeConversationId;
          return (
            <button
              key={conversation.id}
              onClick={() => handleConversationClick(conversation.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer ${
                isActive ? "bg-gray-100" : ""
              }`}
            >
              <div className="relative">
                <img
                  src={conversation.user.avatar}
                  alt={conversation.user.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                {conversation.unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-gray-600 rounded-full flex items-center justify-center">
                    <span className="text-xs font-semibold text-white">
                      {conversation.unreadCount}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-1 text-left min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p
                    className={`text-sm font-semibold truncate ${
                      isActive ? "text-gray-600" : "text-gray-900"
                    }`}
                  >
                    {conversation.user.name}
                  </p>
                  <span className="text-xs text-gray-500 ml-2">
                    {conversation.lastMessageTime}
                  </span>
                </div>
                <p
                  className={`text-sm truncate ${
                    conversation.unreadCount > 0
                      ? "text-gray-900 font-semibold"
                      : "text-gray-500"
                  }`}
                >
                  {conversation.lastMessage}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ConversationList;

