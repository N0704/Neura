import { createSlice } from '@reduxjs/toolkit';
import { contacts } from '../assets/assets';

const initialConversations = contacts.slice(0, 5).map((contact, index) => ({
  id: `conv-${contact.id}`,
  user: contact,
  lastMessage: index === 0 
    ? 'Xin chào! Bạn có khỏe không?'
    : index === 1
    ? 'Hôm nay trời đẹp quá!'
    : 'Cảm ơn bạn đã chia sẻ',
  lastMessageTime: index === 0 ? '10:30' : index === 1 ? '09:15' : 'Hôm qua',
  unreadCount: index === 0 ? 2 : 0,
  messages: index === 0
    ? [
        {
          id: 'msg-1',
          senderId: contact.id,
          text: 'Xin chào! Bạn có khỏe không?',
          timestamp: '10:25',
          isRead: false,
        },
        {
          id: 'msg-2',
          senderId: 'current-user',
          text: 'Mình khỏe, cảm ơn bạn!',
          timestamp: '10:27',
          isRead: true,
        },
        {
          id: 'msg-3',
          senderId: contact.id,
          text: 'Tuyệt vời! Bạn có rảnh không?',
          timestamp: '10:30',
          isRead: false,
        },
      ]
    : [],
}));

const initialState = {
  conversations: initialConversations,
  activeConversationId: initialConversations[0]?.id || null,
};

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setActiveConversationId(state, action) {
      state.activeConversationId = action.payload;
    },
    sendMessage(state, action) {
      const { conversationId, text, image = null } = action.payload;
      if (!text.trim() && !image) return;
      const newMessage = {
        id: `msg-${Date.now()}`,
        senderId: 'current-user',
        text: text.trim() || '',
        image: image || null,
        timestamp: new Date().toLocaleTimeString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        isRead: true,
      };
      state.conversations = state.conversations.map(conv =>
        conv.id === conversationId
          ? {
              ...conv,
              lastMessage: newMessage.image ? '📷 Ảnh' : newMessage.text || '📷 Ảnh',
              lastMessageTime: newMessage.timestamp,
              unreadCount: 0,
              messages: [...conv.messages, newMessage],
            }
          : conv
      );
    },
    markAsRead(state, action) {
      const conversationId = action.payload;
      state.conversations = state.conversations.map(conv =>
        conv.id === conversationId
          ? {
              ...conv,
              unreadCount: 0,
              messages: conv.messages.map(msg => ({ ...msg, isRead: true })),
            }
          : conv
      );
    },
  },
});

export const {
  setActiveConversationId,
  sendMessage,
  markAsRead,
} = messagesSlice.actions;
export default messagesSlice.reducer;
