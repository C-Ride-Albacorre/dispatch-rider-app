import { ThemedText } from '@/components/themed-text';
import { Fonts } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { LinearGradient } from 'expo-linear-gradient';
import { useMemo, useState } from 'react';
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  View,
} from 'react-native';

const GRADIENTS: [string, string][] = [
  ['#2563EB', '#60A5FA'],
  ['#DC2626', '#F87171'],
  ['#16A34A', '#4ADE80'],
  ['#7C3AED', '#A78BFA'],
  ['#EA580C', '#FB923C'],
  ['#DB2777', '#F472B6'],
  ['#0891B2', '#22D3EE'],
  ['#4F46E5', '#818CF8'],
];

function getGradientFromName(name?: string) {
  if (!name) return GRADIENTS[0];

  let hash = 0;

  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  return GRADIENTS[Math.abs(hash) % GRADIENTS.length];
}

interface AvatarProps {
  src?: string | ImageSourcePropType;
  name?: string;
  size?: number;
}

export default function Avatar({ src, name, size = 96 }: AvatarProps) {
  const [error, setError] = useState(false);

  const { Colors } = useTheme();
  const styles = createStyles(Colors);

  const initials = name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const gradient = useMemo(() => getGradientFromName(name), [name]);

  return (
    <LinearGradient
      colors={gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
      ]}
    >
      {src && !error ? (
        <Image
          source={typeof src === 'string' ? { uri: src } : src}
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
          }}
          resizeMode="cover"
          onError={() => setError(true)}
        />
      ) : (
        <View style={styles.initialsContainer}>
          <ThemedText
            themeColor="white"
            style={[
              styles.initials,
              {
                fontSize: size * 0.4,
                lineHeight: size * 0.5,
              },
            ]}
          >
            {initials || '?'}
          </ThemedText>
        </View>
      )}
    </LinearGradient>
  );
}

const createStyles = (Colors: any) =>
  StyleSheet.create({
    container: {
      overflow: 'hidden',
      justifyContent: 'center',
      alignItems: 'center',
    },

    initialsContainer: {
      justifyContent: 'center',
      alignItems: 'center',
    },

    initials: {
      fontFamily: Fonts.brandSemiBold,
      letterSpacing: 0.5,
    },
  });
