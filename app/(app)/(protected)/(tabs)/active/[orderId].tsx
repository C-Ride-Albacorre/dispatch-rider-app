import { useLocalSearchParams } from 'expo-router';

import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useEffect, useRef } from 'react';

import { useChatStore } from '@/store/chat-store';

import { useAuthStore } from '@/store/auth-store';

import { useChat } from '@/hooks/use-chat-socket';

import { ChatBubble } from '@/features/chat/components/chat-bubble';

import { Fonts } from '@/constants/theme';
import { ChatInput } from '@/features/chat/components/chat-input';
import { ConnectionStatus } from '@/features/chat/components/connection-status';
import TypingDot from '@/features/chat/components/typing-dot';
import { useTheme } from '@/hooks/use-theme';
import { normalize, scale } from '@/utils/scaling';

export default function ChatScreen() {
  const { Colors } = useTheme();

  const styles = createStyles(Colors);

  const insets = useSafeAreaInsets();

  const { orderId: rawOrderId } = useLocalSearchParams<{
    orderId: string | string[];
  }>();

  const orderId = Array.isArray(rawOrderId) ? rawOrderId[0] : rawOrderId;

  const flatListRef = useRef<FlatList>(null);

  const messages = useChatStore((state) => state.messages);

  const isConnected = useChatStore((state) => state.isConnected);

  console.log(' ChatScreen orderId:', orderId, 'messages:', messages);

  const typingUsers = useChatStore((state) => state.typingUsers);

  const { sendMessage, sendImage, typing, markRead } = useChat(orderId);

  const driverId = useAuthStore((state) => state.driverId);

  // Mark incoming messages as read when displayed
  useEffect(() => {
    messages.forEach((message) => {
      // Only mark messages from other people (not the driver)
      if (!message.isRead && message.senderId !== driverId) {
        markRead(message.id);
      }
    });
  }, [messages, markRead, driverId]);

  // useEffect(() => {
  //   if (messages.length) {
  //     setTimeout(() => {
  //       flatListRef.current?.scrollToEnd({
  //         animated: true,
  //       });
  //     }, 100);
  //   }
  // }, [messages.length]);

  if (!orderId) {
    return <ActivityIndicator />;
  }

  return (
    <>
      {/* <Stack.Screen
        options={{
          title: 'Chat',
        }}
      /> */}

      <KeyboardAvoidingView
        style={styles.keyboardSafeArea}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <SafeAreaView edges={['top']} style={[styles.wrapperContainer, { paddingTop: insets.top + scale(16) }]}>
          <View style={styles.connectionStatusContainer}>
            <ConnectionStatus isConnected={isConnected} />
          </View>

          <View style={styles.container}>
            <FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <ChatBubble orderId={orderId} message={item} />
              )}
              contentContainerStyle={styles.list}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              // onContentSizeChange={() =>
              //   flatListRef.current?.scrollToEnd({ animated: false })
              // }
            />
            {typingUsers.length > 0 && (
              <View style={styles.typingWrapper}>
                <View style={styles.typingBubble}>
                  <TypingDot delay={0} Colors={Colors} />

                  <View style={styles.dotMiddle} />

                  <TypingDot delay={180} Colors={Colors} />

                  <View style={styles.dotMiddle} />

                  <TypingDot delay={360} Colors={Colors} />
                </View>

                <Text style={styles.typingText}>Customer is typing</Text>
              </View>
            )}

            <ChatInput
              onSend={sendMessage}
              onTyping={typing}
              onPickImage={sendImage}
            />
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </>
  );
}

const createStyles = (Colors: any) =>
  StyleSheet.create({
    keyboardSafeArea: {
      flex: 1,
      backgroundColor: Colors.background,
     
    },

    wrapperContainer: {
      flex: 1,
      backgroundColor: Colors.backgroundSecondary,
      flexDirection: 'column',
    },

    connectionStatusContainer: {
      paddingHorizontal: scale(16),
      paddingVertical: scale(8),
      backgroundColor: Colors.background,
      borderBottomWidth: 1,
      borderBottomColor: Colors.border,
    },

    container: {
      flex: 1,
      position: 'relative',
    },

    list: {
      flexGrow: 1,
      justifyContent: 'flex-end',
      paddingHorizontal: scale(16),
      paddingTop: scale(16),
      paddingBottom: scale(12),
    },

    typingContainer: {
      paddingHorizontal: scale(16),
      paddingBottom: scale(8),
    },

    typingWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: scale(16),
      paddingBottom: scale(10),

      position: 'absolute',
      bottom: scale(100),
      left: 0,
      right: 0,
    },

    typingBubble: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',

      width: scale(50),
      height: scale(34),

      borderRadius: scale(18),

      backgroundColor: Colors.background,

      marginRight: scale(10),

      shadowColor: '#000',
      shadowOpacity: 0.08,
      shadowRadius: 8,
      shadowOffset: {
        width: 0,
        height: 2,
      },

      elevation: 4,
    },

    dot: {
      width: scale(6),
      height: scale(6),
      borderRadius: scale(3),
    },

    dotMiddle: {
      width: scale(5),
    },

    typingText: {
      color: Colors.textMuted,
      fontFamily: Fonts.brandMedium,
      fontSize: normalize(12),
    },
  });
