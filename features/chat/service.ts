
import { api } from '@/libs/api';



/**
 * GET CHAT HISTORY
 * GET /chat/orders/:orderId/messages
 */
export async function getChatService(
  orderId: string,
) {

  if (!orderId) {
    throw new Error(
      'Order ID is required',
    );
  }


  const response = await api.get(
    `/chat/orders/${orderId}/messages`,
  );


  return response.data.data ?? [];

}





/**
 * SEND MESSAGE REST FALLBACK
 * POST /chat/orders/:orderId/messages
 */
export async function sendMessageService({
  orderId,
  message,
  type,
}: {
  orderId: string;
  message: string;
  type: 'TEXT' | 'IMAGE';
}) {


  if (!orderId) {
    throw new Error(
      'Order ID is required',
    );
  }


  const response = await api.post(
    `/chat/orders/${orderId}/messages`,
    {
      message,
      type,
    },
  );


  return response.data.data;

}





/**
 * UPLOAD IMAGE
 * POST /chat/orders/:orderId/images
 */
export async function uploadChatImageService({
  orderId,
  uri,
}: {
  orderId:string;
  uri:string;
}) {


  const formData = new FormData();


  formData.append(
    'image',
    {
      uri,
      name:'chat-image.jpg',
      type:'image/jpeg',
    } as any,
  );



  const response = await api.post(
    `/chat/orders/${orderId}/images`,
    formData,
    {
      headers:{
        'Content-Type':
          'multipart/form-data',
      },
    },
  );


  return response.data.data;

}





/**
 * MARK READ REST FALLBACK
 * PATCH /chat/messages/:messageId/read
 */
export async function markMessageReadService(
  messageId:string,
) {


  const response = await api.patch(
    `/chat/messages/${messageId}/read`,
  );


  return response.data.data;

}





/**
 * EDIT MESSAGE REST FALLBACK
 * PATCH /chat/messages/:messageId
 */
export async function editMessageService({
  messageId,
  newMessage,
}:{
  messageId:string;
  newMessage:string;
}) {


  const response = await api.patch(
    `/chat/messages/${messageId}`,
    {
      message:newMessage,
    },
  );


  return response.data.data;

}





/**
 * DELETE MESSAGE REST FALLBACK
 * DELETE /chat/messages/:messageId
 */
export async function deleteMessageService(
  messageId:string,
) {


  const response = await api.delete(
    `/chat/messages/${messageId}`,
  );


  return response.data.data;

}
