import React from "react";
import Header from "../components/Header";
import ConversationList from "../components/messages/ConversationList";
import ChatWindow from "../components/messages/ChatWindow";
import MessageInput from "../components/messages/MessageInput";

const Messages = () => {
  return (
    <div className="flex flex-col h-screen bg-[#f9f9f9]">
      <Header />

      <main className="flex-1 overflow-hidden pt-16">
        <div className="flex h-full">
          {/* Conversation List - 360px */}
          <div className="w-[360px] shrink-0">
            <ConversationList />
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col border-l border-gray-100">
            <ChatWindow />
            <MessageInput />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Messages;

