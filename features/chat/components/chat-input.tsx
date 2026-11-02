import { useRef, useState } from 'react';

import * as ImagePicker from 'expo-image-picker';
import { Animated, StyleSheet, TextInput, View } from 'react-native';

import IconButton from '@/components/ui/buttons/icon-button';
import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { ImagePreviewModal } from './image-preview-modal';
import { QuickSuggestions } from './quick-suggestions';

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
  const suggestionsOpacity = useRef(new Animated.Value(1)).current;

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

  const handleTextChange = (value: string) => {
    setText(value);

    const typing = value.length > 0;
    onTyping(typing);

    if (typing && showSuggestions) {
      setShowSuggestions(false);

      Animated.timing(suggestionsOpacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }

    if (!typing && !showSuggestions) {
      setShowSuggestions(true);

      Animated.timing(suggestionsOpacity, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }
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
      <Animated.View
        style={[
          styles.suggestionsContainer,
          { opacity: suggestionsOpacity },
          { pointerEvents: showSuggestions ? 'auto' : 'none' },
        ]}
      >
        <QuickSuggestions onSelect={handleQuickSuggestion} />
      </Animated.View>

      <View style={styles.container}>
        <IconButton
          icon="image-outline"
          size="md"
          variant="ghost"
          onPress={handlePickImage}
          accessibilityLabel="Send a photo"
        />

        <TextInput
          value={text}
          // onChangeText={(value) => {
          //   setText(value);
          //   onTyping(value.length > 0);
          //   const hasText = value.length > 0;
          //   const shouldShow = !hasText;

          //   if (shouldShow !== showSuggestions) {
          //     setShowSuggestions(shouldShow);
          //     Animated.timing(suggestionsOpacity, {
          //       toValue: shouldShow ? 1 : 0,
          //       duration: 200,
          //       useNativeDriver: true,
          //     }).start();
          //   }
          // }}

          onChangeText={handleTextChange}
          placeholder="Message"
          placeholderTextColor={Colors.textMuted}
          style={styles.input}
          multiline
        />

        <IconButton
          icon="send"
          size="md"
          variant="primary"
          disabled={!hasText}
          onPress={handleSend}
          accessibilityLabel="Send message"
        />
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
      paddingTop: Spacing.two,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: Colors.border,
      backgroundColor: Colors.background,
    },

    suggestionsContainer: {
      overflow: 'hidden',
    },

    container: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      gap: Spacing.two,
      paddingHorizontal: Spacing.three,
      paddingTop: Spacing.two,
      paddingBottom: Spacing.two,
    },

    input: {
      flex: 1,
      minHeight: 44,
      maxHeight: 120,
      paddingHorizontal: Spacing.three,
      paddingTop: 11,
      paddingBottom: 11,
      borderRadius: 22,
      backgroundColor: Colors.backgroundTertiary,
      color: Colors.text,
      fontFamily: Fonts.brandRegular,
      fontSize: 14,
    },
  });
