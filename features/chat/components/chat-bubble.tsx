import { View, Text, Image, StyleSheet } from 'react-native';

import { useAuthStore } from '@/store/auth-store';

import { ChatMessage } from '../types';
import { useTheme } from '@/hooks/use-theme';
import { normalize, scale } from '@/utils/scaling';
import { Fonts } from '@/constants/theme';
import { Color } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  message: ChatMessage;
};

export function ChatBubble({ message }: Props) {
  const { Colors } = useTheme();

  const styles = createStyles(Colors);

  const driverId = useAuthStore((state) => state.driverId);

  const isMine = message.senderId === driverId;

  const isDeleted = !!message.deletedAt;

  return (
    <View style={[styles.wrapper, isMine ? styles.right : styles.left]}>
      <View
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
              source={{ uri: message.message }}
              style={styles.image}
              resizeMode="cover"
            />

            {/* <View style={styles.imageFooter}>
              <Text style={styles.imageTime}>
                {new Date(message.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>

              {isMine && (
                <Ionicons
                  name={message.isRead ? 'checkmark-done' : 'checkmark'}
                  size={15}
                  color={message.isRead ? '#4FC3F7' : '#fff'}
                />
              )}
            </View> */}
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

          {isMine && (
            <Ionicons
              name={message.isRead ? 'checkmark-done' : 'checkmark'}
              size={14}
              color={message.isRead ? '#4FC3F7' : Colors.textSecondary}
              style={{ marginLeft: 4 }}
            />
          )}
        </View>
      </View>
    </View>
  );
}

const createStyles = (Colors: any) =>
  StyleSheet.create({
    wrapper: {
      width: '100%',
      marginVertical: scale(5),
    },

    left: {
      alignItems: 'flex-start',
    },

    right: {
      alignItems: 'flex-end',
    },

    bubble: {
      maxWidth: '80%',
      padding: scale(12),
      borderRadius: scale(16),
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
    },

    theirText: {
      color: Colors.text,
    },

    time: {
      fontFamily: Fonts.brandRegular,
      fontSize: normalize(10),
      marginTop: scale(5),
    },

    mineTime: {
      color: Colors.textSecondary,
    },

    theirTime: {
      color: Colors.textSecondary,
    },

    deleted: {
      fontStyle: 'italic',
      fontSize: normalize(12),
      fontFamily: Fonts.brandRegular,
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
  });
