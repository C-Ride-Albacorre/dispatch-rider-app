
export type ChatMessage = {
  id: string;

  orderId: string;

  senderId: string;

  senderRole: string;

  message: string;

  type: 'TEXT' | 'IMAGE';

  isRead: boolean;

  readAt: string | null;

  createdAt: string;

  editedAt: string | null;

  deletedAt: string | null;
};
