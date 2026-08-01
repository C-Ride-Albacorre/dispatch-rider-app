import { create } from 'zustand';
import { Socket } from 'socket.io-client';

import { ChatMessage } from '@/features/chat/types';

type ChatState = {
  socket: Socket | null;

  isConnected: boolean;

  setSocket: (socket: Socket | null) => void;

  setConnected: (connected: boolean) => void;

  messages: ChatMessage[];

  setMessages: (messages: ChatMessage[]) => void;

  addMessage: (message: ChatMessage) => void;

  updateMessage: (messageId: string, updates: Partial<ChatMessage>) => void;

  deleteMessage: (messageId: string) => void;

  clearMessages: () => void;

  typingUsers: string[];

  setTyping: (userId: string, typing: boolean) => void;

  clearTyping: () => void;
};

export const useChatStore = create<ChatState>((set) => ({
  socket: null,

  isConnected: false,

  setSocket: (socket) =>
    set({
      socket,
    }),

  setConnected: (connected) =>
    set({
      isConnected: connected,
    }),

  messages: [],

  setMessages: (messages) =>
    set({
      messages,
    }),

  addMessage: (message) =>
    set((state) => {
      const exists = state.messages.some((item) => item.id === message.id);

      if (exists) {
        return state;
      }

      return {
        messages: [...state.messages, message],
      };
    }),

  updateMessage: (messageId, updates) =>
    set((state) => ({
      messages: state.messages.map((item) =>
        item.id === messageId
          ? {
              ...item,
              ...updates,
            }
          : item,
      ),
    })),

  deleteMessage: (messageId) =>
    set((state) => ({
      messages: state.messages.filter((item) => item.id !== messageId),
    })),

  clearMessages: () =>
    set({
      messages: [],
    }),

  typingUsers: [],

  setTyping: (userId, typing) =>
    set((state) => {
      if (typing) {
        if (state.typingUsers.includes(userId)) {
          return state;
        }

        return {
          typingUsers: [...state.typingUsers, userId],
        };
      }

      return {
        typingUsers: state.typingUsers.filter((id) => id !== userId),
      };
    }),

  clearTyping: () =>
    set({
      typingUsers: [],
    }),
}));
