import { useState } from 'react';

import { View, TextInput, Pressable, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/use-theme';
import { scale } from '@/utils/scaling';
import { Fonts } from '@/constants/theme';
import { QuickSuggestions } from './quick-suggestions';
import { ImagePreviewModal } from './image-preview-modal';

type Props = {
  onSend: (text: string) => void;

  onTyping: (typing: boolean) => void;

  onPickImage: (uri: string) => void;
};

export function ChatInput({
  onSend,

  onTyping,

  onPickImage,
}: Props) {
  const { Colors } = useTheme();

  const styles = createStyles(Colors);
  const [text, setText] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [previewImageUri, setPreviewImageUri] = useState<string | null>(null);
  const [isSendingImage, setIsSendingImage] = useState(false);

  const hasText = text.trim().length > 0;

  const handlePickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
      allowsEditing: false,
    });

    if (result.canceled) {
      return;
    }

    setPreviewImageUri(result.assets[0].uri);
  };

  const handleConfirmImage = () => {
    if (previewImageUri) {
      setIsSendingImage(true);
      onPickImage(previewImageUri);
      setPreviewImageUri(null);
      setIsSendingImage(false);
      setShowSuggestions(false);
    }
  };

  const handleQuickSuggestion = (suggestion: string) => {
    onSend(suggestion);
    setText('');
    onTyping(false);
    setShowSuggestions(false);
  };

  const handleSend = () => {
    if (!text.trim()) {
      return;
    }

    onSend(text.trim());

    setText('');

    onTyping(false);
    setShowSuggestions(false);
  };

  return (
    <View style={styles.wrapper}>
      {showSuggestions && (
        <QuickSuggestions onSelect={handleQuickSuggestion} />
      )}
      
      <View style={styles.container}>
        <Pressable
          onPress={handlePickImage}
          style={({ pressed }) => [
            styles.imageButton,
            pressed && { opacity: 0.75, transform: [{ scale: 0.95 }] },
          ]}
        >
          <Ionicons name="image-outline" size={24} color={Colors.text} />
        </Pressable>

        <TextInput
          value={text}
          onChangeText={(value) => {
            setText(value);
            onTyping(value.length > 0);
            if (value.length === 0) {
              setShowSuggestions(true);
            } else {
              setShowSuggestions(false);
            }
          }}
          placeholder="Type a message..."
          style={styles.input}
          multiline
        />

        <Pressable
          disabled={!hasText}
          onPress={handleSend}
          style={({ pressed }) => [
            styles.sendButton,
            !hasText && styles.sendDisabled,
            pressed && hasText && { transform: [{ scale: 0.95 }] },
          ]}
        >
          <Ionicons
            name="paper-plane"
            size={18}
            color={hasText ? Colors.text : Colors.textMuted}
            style={{
              marginLeft: 2,
              marginTop: 1,
              transform: [{ rotate: '-0deg' }],
            }}
          />
        </Pressable>
      </View>

      <ImagePreviewModal
        visible={previewImageUri !== null}
        imageUri={previewImageUri}
        onConfirm={handleConfirmImage}
        onCancel={() => setPreviewImageUri(null)}
        isLoading={isSendingImage}
      />
    </View>
  );
}

const createStyles = (Colors: any) =>
  StyleSheet.create({
    wrapper: {
      backgroundColor: Colors.background,
    },
    container: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      gap: scale(10),

      paddingHorizontal: scale(14),
      paddingVertical: scale(12),

      backgroundColor: Colors.background,

      borderTopWidth: 0,

      shadowColor: '#000',
      shadowOpacity: 0.08,
      shadowRadius: 12,
      shadowOffset: {
        width: 0,
        height: -4,
      },

      elevation: 8,
    },
    imageButton: {
      width: scale(46),
      height: scale(46),

      borderRadius: scale(23),

      backgroundColor: Colors.backgroundSecondary,

      borderWidth: 1,
      borderColor: Colors.border,

      alignItems: 'center',
      justifyContent: 'center',
    },

    input: {
      flex: 1,
      minHeight: scale(48),
      maxHeight: scale(120),

      borderRadius: scale(24),

      paddingHorizontal: scale(18),
      paddingVertical: scale(12),

      backgroundColor: Colors.backgroundSecondary,

      borderWidth: 1,
      borderColor: Colors.border,

      fontSize: scale(14),
      fontFamily: Fonts.brandRegular,
    },

    sendButton: {
      width: scale(48),
      height: scale(48),

      borderRadius: scale(24),

      backgroundColor: Colors.primary,

      alignItems: 'center',
      justifyContent: 'center',
    },

    sendDisabled: {
      backgroundColor: Colors.backgroundSecondary,

      shadowOpacity: 0,
      shadowRadius: 0,

      elevation: 0,

      shadowOffset: {
        width: 0,
        height: 0,
      },
    },
  });
