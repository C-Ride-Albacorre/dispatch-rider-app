import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

import { useAuthStore } from '@/store/auth-store';
import { useChatStore } from '@/store/chat-store';

import { Fonts } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { normalize, scale } from '@/utils/scaling';

import { ChatMessage } from '../types';

type Props = {
  message: ChatMessage;
  orderId: string;
};

export function ChatBubble({ message, orderId }: Props) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(message.message);

  const { Colors } = useTheme();

  const styles = createStyles(Colors);

  const driverId = useAuthStore((state) => state.driverId);

  const socket = useChatStore((state) => state.socket);

  const updateMessage = useChatStore((state) => state.updateMessage);

  const deleteMessage = useChatStore((state) => state.deleteMessage);

  const activeActionMessageId = useChatStore(
    (state) => state.activeActionMessageId,
  );

  const setActiveActionMessage = useChatStore(
    (state) => state.setActiveActionMessage,
  );

  const showActions = activeActionMessageId === message.id;

  const isMine = message.senderId === driverId;

  const isDeleted = !!message.deletedAt;

  const handleEdit = () => {
    if (!editText.trim()) return;

    updateMessage(message.id, {
      message: editText.trim(),
      editedAt: new Date().toISOString(),
    });

    socket?.emit('edit-message', {
      orderId,
      messageId: message.id,
      newMessage: editText.trim(),
    });

    setEditing(false);
  };

  const handleDelete = () => {
    socket?.emit('delete-message', {
      orderId,
      messageId: message.id,
    });

    deleteMessage(message.id);

    setActiveActionMessage(null);
  };

  return (
    <View style={[styles.wrapper, isMine ? styles.right : styles.left]}>
      <View style={styles.messageRow}>
        <Pressable
          onPress={() =>
            setActiveActionMessage(showActions ? null : message.id)
          }
          onLongPress={() => setActiveActionMessage(message.id)}
          delayLongPress={300}
          style={[
            styles.bubble,
            isMine ? styles.mine : styles.theirs,
            message.type === 'IMAGE' && styles.imageBubble,
          ]}
        >
          {isDeleted ? (
            <Text style={styles.deleted}>Message deleted</Text>
          ) : message.type === 'IMAGE' ? (
            <View style={styles.imageContainer}>
              <Image
                source={{
                  uri: message.message,
                }}
                style={styles.image}
                resizeMode="cover"
              />
            </View>
          ) : editing ? (
            <View>
              <TextInput
                value={editText}
                onChangeText={setEditText}
                style={styles.editInput}
              />

              <View style={styles.editActions}>
                <Pressable style={styles.editButton} onPress={handleEdit}>
                  <Text style={styles.editButtonText}>Save</Text>
                </Pressable>

                <Pressable
                  onPress={() => {
                    setEditText(message.message);

                    setEditing(false);
                  }}
                  style={styles.cancelButton}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <Text
              style={[styles.text, isMine ? styles.mineText : styles.theirText]}
            >
              {message.message}
            </Text>
          )}

          <View style={styles.footer}>
            <Text
              style={[styles.time, isMine ? styles.mineTime : styles.theirTime]}
            >
              {new Date(message.createdAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>

            {message.editedAt && <Text style={styles.edited}>edited</Text>}

            {isMine && (
              <Ionicons
                name={message.isRead ? 'checkmark-done' : 'checkmark'}
                size={14}
                color={Colors.text}
              />
            )}
          </View>
        </Pressable>

        {showActions && isMine && !isDeleted && message.type === 'TEXT' && (
          <View style={styles.actions}>
            <Pressable
              onPress={() => {
                setEditing(true);

                setActiveActionMessage(null);
              }}
            >
              <Ionicons
                name="create-outline"
                size={18}
                color={Colors.textSecondary}
              />
            </Pressable>

            <Pressable onPress={handleDelete}>
              <Ionicons name="trash-outline" size={18} color={Colors.error} />
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}
const createStyles = (Colors: any) =>
  StyleSheet.create({
    wrapper: {
      width: '100%',
      marginVertical: scale(5),
      overflow: 'visible',
    },

    left: {
      alignItems: 'flex-start',
    },

    right: {
      alignItems: 'flex-end',
    },

    bubble: {
      maxWidth: '85%',
      padding: scale(12),
      borderRadius: scale(16),
      overflow: 'visible',
    },

    bubblePressable: {
      flexShrink: 1,
    },

    bubbleContainer: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      gap: scale(8),
    },

    messageRow: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      gap: scale(8),
      overflow: 'visible',
    },

    mine: {
      backgroundColor: Colors.primary,
      borderTopLeftRadius: scale(22),
      borderTopRightRadius: scale(22),
      borderBottomLeftRadius: scale(22),
      borderBottomRightRadius: scale(6),
    },

    theirs: {
      backgroundColor: Colors.backgroundTertiary,
      borderBottomLeftRadius: scale(4),
    },

    text: {
      fontSize: normalize(13),
      fontFamily: Fonts.brandRegular,
    },

    mineText: {
      color: Colors.text,
      fontFamily: Fonts.brandMedium,
    },

    theirText: {
      color: Colors.text,
      fontFamily: Fonts.brandMedium,
    },

    time: {
      fontFamily: Fonts.brandRegular,
      fontSize: normalize(10),
      marginTop: scale(5),
    },

    mineTime: {
      color: Colors.text,
      fontFamily: Fonts.brandMedium,
       fontSize: normalize(10),
    },

    theirTime: {
      color: Colors.textSecondary,
        fontFamily: Fonts.brandMedium,
       fontSize: normalize(10),
    },

    deleted: {
      fontStyle: 'italic',
      fontSize: normalize(10),
      fontFamily: Fonts.brandMedium,
      color: Colors.textSecondary,
    },

    footer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      marginTop: scale(6),
    },

    imageContainer: {
      overflow: 'hidden',
      borderRadius: scale(18),
    },

    image: {
      width: scale(240),
      height: scale(260),
    },

    imageFooter: {
      position: 'absolute',
      right: scale(10),
      bottom: scale(10),

      flexDirection: 'row',
      alignItems: 'center',

      paddingHorizontal: scale(8),
      paddingVertical: scale(4),

      borderRadius: scale(12),

      backgroundColor: 'rgba(0,0,0,0.45)',
    },

    imageTime: {
      color: Colors.background,
      fontSize: normalize(10),
      fontFamily: Fonts.brandMedium,
      marginRight: scale(4),
    },

    imageBubble: {
      padding: scale(12),
      overflow: 'hidden',
    },

    editInput: {
      minWidth: 150,
      borderWidth: 1,
      borderColor: Colors.border,
      borderRadius: 10,
      fontFamily: Fonts.brandRegular,
      backgroundColor: Colors.backgroundSecondary,
      paddingHorizontal: 10,
      paddingVertical: 8,
      color: Colors.text,
    },

    editActions: {
      flexDirection: 'row',
      justifyContent: 'center',
  
      marginTop: scale(8),
    },

    editButton: {
      backgroundColor: Colors.text,

      paddingHorizontal: scale(12),
      paddingVertical: scale(6),
      borderRadius: scale(8),
    },

    editButtonText: {
      color: Colors.background,
        fontSize: normalize(12),
      fontFamily: Fonts.brandMedium,
    },

    cancelButton: {
        paddingHorizontal: scale(12),   
    paddingVertical: scale(6),
        borderRadius: scale(8),
    },

    cancelButtonText: {
        color: Colors.textSecondary,
        fontSize: normalize(12),
        fontFamily: Fonts.brandMedium,
    },

    edited: {
      fontSize: normalize(10),
      color: Colors.textMuted,
      fontFamily: Fonts.brandRegular,
      marginLeft: scale(5),
    },

    actions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: scale(10),
      marginHorizontal: scale(8),
      backgroundColor: Colors.background,
      paddingHorizontal: scale(8),
      paddingVertical: scale(6),
      borderRadius: scale(20),
      elevation: 3,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 5,
    },
  });
