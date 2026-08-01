export function convertMessage(message: any) {
  return {
    _id: message.id,

    text: message.message,

    createdAt: new Date(message.createdAt),

    user: {
      _id: message.sender.id,
      name: message.sender.name,
      avatar: message.sender.photo,
    },

    image: message.image,

    pending: false,
  };
}
