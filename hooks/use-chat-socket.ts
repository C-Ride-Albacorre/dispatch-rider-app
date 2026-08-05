import { useCallback, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

import { useAuthStore } from '@/store/auth-store';
import { useChatStore } from '@/store/chat-store';

import {
  deleteMessageService,
  editMessageService,
  getChatService,
  markMessageReadService,
  sendMessageService,
  uploadChatImageService,
} from '@/features/chat/service';

const CHAT_URL = 'https://backend-service-1rc7.onrender.com/chat';

export function useChat(orderId: string) {
  const token = useAuthStore((s) => s.accessToken);

  const socketRef = useRef<Socket | null>(null);

  const {
    messages,

    setSocket,
    setConnected,

    setMessages,
    addMessage,
    updateMessage,
    deleteMessage,

    clearMessages,

    setTyping,
    clearTyping,
  } = useChatStore();

  /**
   * Load old messages
   * REST only
   */
  useEffect(() => {
    if (!orderId) return;

    async function loadMessages() {
      try {
        const response = await getChatService(orderId);

        console.log('CHAT HISTORY:', response);

        setMessages(response);
      } catch (error) {
        console.log('CHAT HISTORY ERROR:', error);
      }
    }

    loadMessages();
  }, [orderId, setMessages]);

  /**
   * Socket connection
   */
  useEffect(() => {
    if (!token || !orderId) return;

    const socket = io(CHAT_URL, {
      auth: {
        token,
      },

      transports: ['websocket'],

      reconnection: true,

      reconnectionAttempts: Infinity,

      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    setSocket(socket);

    /**
     * Debug every server event
     */
    socket.onAny((event, payload) => {
      console.log('CHAT SOCKET EVENT:', event, payload);
    });

    /**
     * Connected
     */
    socket.on('connect', () => {
      console.log('CHAT SOCKET CONNECTED', socket.id);

      setConnected(true);

      /**
       * Join order room
       */
      socket.emit('join-chat', orderId);
    });

    socket.on('disconnect', (reason) => {
      console.log('CHAT SOCKET DISCONNECTED:', reason);

      setConnected(false);
    });

    /**
     * Server confirms room join
     */
    socket.on('joined', (payload) => {
      console.log('CHAT ROOM JOINED:', payload);
    });

    /**
     * Live messages
     */
    socket.on('new-message', (payload) => {
      console.log('NEW MESSAGE EVENT:', payload);

      /**
       * Backend sends:
       * {
       *   orderId,
       *   message
       * }
       */

      if (payload?.message) {
        addMessage(payload.message);
      }
    });

    /**
     * Message edited
     */
    socket.on('message-edited', (payload) => {
      updateMessage(payload.messageId, {
        message: payload.newMessage,

        editedAt: payload.editedAt,
      });
    });

    /**
     * Message deleted
     */
    socket.on('message-deleted', ({ messageId }) => {
      deleteMessage(messageId);
    });

    /**
     * Typing
     */
    socket.on('user-typing', ({ userId, isTyping }) => {
      setTyping(userId, isTyping);
    });

    /**
     * Read receipt
     */
    socket.on('message-read', ({ messageId }) => {
      updateMessage(messageId, {
        isRead: true,
      });
    });

    return () => {
      clearTyping();

      clearMessages();

      socket.disconnect();

      socketRef.current = null;

      setSocket(null);

      setConnected(false);
    };
  }, [
    token,
    orderId,

    addMessage,
    updateMessage,
    deleteMessage,

    setMessages,

    clearMessages,

    clearTyping,

    setTyping,

    setSocket,
    setConnected,
  ]);

  /**
   * Send message
   * WebSocket first
   * REST fallback
   */
  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim()) return;

      const payload: {
        orderId: string;
        message: string;
        type: 'TEXT' | 'IMAGE';
      } = {
        orderId,
        message: text,
        type: 'TEXT',
      };

      const socket = socketRef.current;

      if (socket && socket.connected) {
        socket.emit('send-message', payload);

        return;
      }

      /**
       * Socket unavailable
       * fallback REST
       */
      try {
        const response = await sendMessageService(payload);

        addMessage(response);
      } catch (error) {
        console.log('SEND MESSAGE ERROR:', error);
      }
    },
    [orderId, addMessage],
  );

  /**
   * Upload image
   * WebSocket first with confirmation
   * REST fallback
   */
  const sendImage = useCallback(
    async (uri: string) => {
      const socket = socketRef.current;

      try {
        // Upload image and get URL from server
        const response = await uploadChatImageService({
          orderId,
          uri,
        });

        // Emit via socket if connected
        if (socket && socket.connected) {
          const payload = {
            orderId,
            message: response.imageUrl || response.url || uri,
            type: 'IMAGE',
          };

          socket.emit('send-message', payload, (ack: any) => {
            console.log('IMAGE SENT ACK:', ack);
            addMessage(ack?.message || response);
          });

          return;
        }

        // Fallback: add message directly if socket not connected
        addMessage(response);
      } catch (error) {
        console.log('IMAGE ERROR:', error);
      }
    },
    [orderId, addMessage],
  );

  /**
   * Typing indicator
   */
  const typing = useCallback(
    (isTyping: boolean) => {
      console.log('EMIT typing', {
        orderId,
        isTyping,
        connected: socketRef.current?.connected,
      });

      socketRef.current?.emit('typing', {
        orderId,
        isTyping,
      });
    },
    [orderId],
  );

  /**
   * Mark read
   */
  const markRead = useCallback(
    async (messageId: string) => {
      const socket = socketRef.current;

      if (socket && socket.connected) {
        socket.emit('mark-read', {
          orderId,
          messageId,
        });

        return;
      }

      await markMessageReadService(messageId);
    },
    [orderId],
  );

  /**
   * Edit
   */
  const editMessage = useCallback(
    async (messageId: string, newMessage: string) => {
      const socket = socketRef.current;

      if (socket && socket.connected) {
        socket.emit('edit-message', {
          orderId,
          messageId,
          newMessage,
        });

        return;
      }

      await editMessageService({
        messageId,
        newMessage,
      });
    },
    [orderId],
  );

  /**
   * Delete
   */
  const removeMessage = useCallback(
    async (messageId: string) => {
      const socket = socketRef.current;

      if (socket && socket.connected) {
        socket.emit('delete-message', {
          orderId,
          messageId,
        });

        return;
      }

      await deleteMessageService(messageId);
    },
    [orderId],
  );

  return {
    messages,

    sendMessage,

    sendImage,

    typing,

    markRead,

    editMessage,

    deleteMessage: removeMessage,
  };
}
