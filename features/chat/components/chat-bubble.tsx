import { Image, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

import { useAuthStore } from '@/store/auth-store';
import { useChatStore } from '@/store/chat-store';

import { ThemedText } from '@/components/themed-text';
import IconButton from '@/components/ui/buttons/icon-button';
import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

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
            <ThemedText
              style={styles.deleted}
              themeColor={isMine ? 'onPrimary' : 'textMuted'}
            >
              Message deleted
            </ThemedText>
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
                placeholderTextColor={Colors.textMuted}
              />

              <View style={styles.editActions}>
                <Pressable
                  style={({ pressed }) => [
                    styles.editButton,
                    pressed && styles.pressed,
                  ]}
                  onPress={handleEdit}
                  accessibilityRole="button"
                >
                  <ThemedText
                    style={styles.editButtonText}
                    themeColor="background"
                  >
                    Save
                  </ThemedText>
                </Pressable>

                <Pressable
                  onPress={() => {
                    setEditText(message.message);

                    setEditing(false);
                  }}
                  style={({ pressed }) => [
                    styles.cancelButton,
                    pressed && styles.pressed,
                  ]}
                  accessibilityRole="button"
                >
                  <ThemedText
                    style={styles.cancelButtonText}
                    themeColor="onPrimary"
                  >
                    Cancel
                  </ThemedText>
                </Pressable>
              </View>
            </View>
          ) : (
            <ThemedText
              style={styles.text}
              themeColor={isMine ? 'onPrimary' : 'text'}
            >
              {message.message}
            </ThemedText>
          )}

          <View style={styles.footer}>
            <ThemedText
              style={[styles.time, isMine && styles.mineMeta]}
              themeColor={isMine ? 'onPrimary' : 'textMuted'}
            >
              {new Date(message.createdAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </ThemedText>

            {message.editedAt && (
              <ThemedText
                style={[styles.time, isMine && styles.mineMeta]}
                themeColor={isMine ? 'onPrimary' : 'textMuted'}
              >
                edited
              </ThemedText>
            )}

            {isMine && (
              <Ionicons
                name={message.isRead ? 'checkmark-done' : 'checkmark'}
                size={14}
                color={Colors.onPrimary}
              />
            )}
          </View>
        </Pressable>

        {showActions && isMine && !isDeleted && message.type === 'TEXT' && (
          <View style={styles.actions}>
            <IconButton
              icon="create-outline"
              size="sm"
              variant="ghost"
              onPress={() => {
                setEditing(true);

                setActiveActionMessage(null);
              }}
              accessibilityLabel="Edit message"
            />

            <IconButton
              icon="trash-outline"
              size="sm"
              variant="redSecondary"
              onPress={handleDelete}
              accessibilityLabel="Delete message"
            />
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
      marginVertical: Spacing.one,
      overflow: 'visible',
    },

    left: {
      alignItems: 'flex-start',
    },

    right: {
      alignItems: 'flex-end',
    },

    messageRow: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      gap: Spacing.two,
      overflow: 'visible',
    },

    bubble: {
      maxWidth: '80%',
      paddingHorizontal: 14,
      paddingVertical: Spacing.two,
      borderRadius: 18,
      overflow: 'visible',
    },

    mine: {
      backgroundColor: Colors.primary,
      borderBottomRightRadius: 4,
    },

    theirs: {
      backgroundColor: Colors.backgroundElement,
      borderBottomLeftRadius: 4,
    },

    imageBubble: {
      padding: Spacing.one,
      overflow: 'hidden',
    },

    text: {
      fontFamily: Fonts.brandRegular,
      fontSize: 14,
      lineHeight: 20,
    },

    deleted: {
      fontFamily: Fonts.brandRegular,
      fontSize: 14,
      lineHeight: 20,
      fontStyle: 'italic',
    },

    footer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: Spacing.one,
      marginTop: 2,
    },

    time: {
      fontFamily: Fonts.brandRegular,
      fontSize: 11,
      lineHeight: 16,
    },

    mineMeta: {
      opacity: 0.7,
    },

    imageContainer: {
      overflow: 'hidden',
      borderRadius: 14,
    },

    image: {
      width: 220,
      height: 220,
    },

    editInput: {
      minWidth: 180,
      borderWidth: 1,
      borderColor: Colors.border,
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: Spacing.two,
      backgroundColor: Colors.inputBackground,
      color: Colors.text,
      fontFamily: Fonts.brandRegular,
      fontSize: 14,
    },

    editActions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: Spacing.two,
      marginTop: Spacing.two,
    },

    editButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 999,
      backgroundColor: Colors.text,
    },

    editButtonText: {
      fontFamily: Fonts.brandMedium,
      fontSize: 12,
      lineHeight: 17,
    },

    cancelButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 999,
    },

    cancelButtonText: {
      fontFamily: Fonts.brandMedium,
      fontSize: 12,
      lineHeight: 17,
    },

    pressed: {
      opacity: 0.8,
    },

    actions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.one,
      padding: Spacing.one,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: Colors.card,
    },
  });
