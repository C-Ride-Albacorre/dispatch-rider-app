import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from 'react-native';

import { useEffect, useRef } from 'react';

import { useChatStore } from '@/store/chat-store';

import { useAuthStore } from '@/store/auth-store';

import { useChat } from '@/hooks/use-chat-socket';

import { ChatBubble } from '@/features/chat/components/chat-bubble';

import ScreenHeader from '@/components/layout/screen-header';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Fonts, Spacing } from '@/constants/theme';
import { ChatInput } from '@/features/chat/components/chat-input';
import { ConnectionStatus } from '@/features/chat/components/connection-status';
import TypingDot from '@/features/chat/components/typing-dot';
import { useTheme } from '@/hooks/use-theme';

export default function ChatScreen() {
  const { Colors } = useTheme();

  const styles = createStyles(Colors);

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

  const goBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/active');
  };

  if (!orderId) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator color={Colors.primary} />
      </ThemedView>
    );
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
        <StatusBar style="auto" />
        <View style={styles.wrapperContainer}>
          <ScreenHeader
            title="Chat with customer"
            onBack={goBack}
            right={<ConnectionStatus isConnected={isConnected} />}
          />

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

                <ThemedText style={styles.typingText} themeColor="textMuted">
                  Customer is typing…
                </ThemedText>
              </View>
            )}

            <ChatInput
              onSend={sendMessage}
              onTyping={typing}
              onPickImage={sendImage}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}

const createStyles = (Colors: any) =>
  StyleSheet.create({
    centered: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },

    keyboardSafeArea: {
      flex: 1,
      backgroundColor: Colors.background,
    },

    wrapperContainer: {
      flex: 1,
      backgroundColor: Colors.background,
    },

    container: {
      flex: 1,
      position: 'relative',
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: Colors.border,
    },

    list: {
      flexGrow: 1,
      justifyContent: 'flex-end',
      paddingHorizontal: Spacing.three,
      paddingTop: Spacing.three,
      paddingBottom: 12,
    },

    typingWrapper: {
      position: 'absolute',
      bottom: 100,
      left: 0,
      right: 0,
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.two,
      paddingHorizontal: Spacing.three,
      paddingBottom: Spacing.two,
    },

    typingBubble: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      width: 52,
      height: 34,
      borderRadius: 18,
      borderBottomLeftRadius: 4,
      backgroundColor: Colors.backgroundElement,
    },

    dotMiddle: {
      width: 5,
    },

    typingText: {
      fontFamily: Fonts.brandRegular,
      fontSize: 12,
      lineHeight: 18,
      fontStyle: 'italic',
    },
  });
