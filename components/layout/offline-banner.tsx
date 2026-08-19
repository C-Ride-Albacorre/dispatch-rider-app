import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { normalize, scale } from '@/utils/scaling';
import { Fonts } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { Color } from 'expo-router';

type OfflineBannerProps = {
  onRetry?: () => Promise<void> | void;
  isRetrying?: boolean;
};

export default function OfflineBanner({
  onRetry,
  isRetrying = false,
}: OfflineBannerProps) {
  const insets = useSafeAreaInsets();


  const {Colors }= useTheme()

  const styles =   createStyles(Colors)

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.container,
        {
          paddingTop: insets.top + 8,
        },
      ]}
    >
      <View style={styles.banner}>
        <View style={styles.iconContainer}>
          <Ionicons
            name="cloud-offline-outline"
            size={20}
            color={Colors.background}
          />
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>
            No internet connection
          </Text>

          <Text style={styles.message}>
            Some features may be unavailable. We'll reconnect
            automatically.
          </Text>
        </View>

        {onRetry && (
          <Pressable 
            onPress={onRetry}
            disabled={isRetrying}
            style={({ pressed }) => [
              styles.retryButton,
              pressed && styles.retryButtonPressed,
              isRetrying && styles.retryButtonDisabled,
            ]}
          >
            {isRetrying ? (
              <ActivityIndicator
                size="small"
                color={Colors.background}
              />
            ) : (
              <Text style={styles.retryText}>
                Retry
              </Text>
            )}
          </Pressable>
        )}
      </View>
    </View>
  );
}

const createStyles = (Colors : any)=> StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    elevation: 9999,
    paddingHorizontal:scale(12),
    pointerEvents: 'box-none',
  },

  banner: {
    minHeight: scale(64),
    borderRadius: scale(14),
    backgroundColor: Colors.text,

    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: scale(12),
    paddingVertical: scale(10),

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: scale(3),
    },
    shadowOpacity: scale(0.2),
    shadowRadius: scale(6),

    elevation: scale(6),
  },

  iconContainer: {
    width: scale(36),
    height: scale(36),
    borderRadius: scale(18),

    alignItems: 'center',

    justifyContent: 'center',

    backgroundColor: Colors.textMuted,

    marginRight: scale(10),
  },

  content: {
    flex: 1,
    paddingRight: scale(8),
  },

  title: {
    color: Colors.background,
    fontSize: normalize(13),
    fontFamily: Fonts.brandMedium
  },

  message: {
    color: Colors.textMuted,
      fontSize: normalize(11),
      
    fontFamily: Fonts.brandRegular,
    lineHeight: scale(16),
    marginTop: scale(2),
  },

  retryButton: {
    minWidth: scale(52),
    height: scale(34),

    paddingHorizontal: scale(10),

    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: scale(8),
    backgroundColor: Colors.background,
  },

  retryButtonPressed: {
    opacity: 0.7,
  },

  retryButtonDisabled: {
    opacity: 0.6,
  },

  retryText: {
    color: Colors.textSecondary,
    fontSize: normalize(12),
    fontFamily: Fonts.brandMedium
  },
});