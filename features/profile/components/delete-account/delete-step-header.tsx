import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Fonts } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { normalize, scale } from '@/utils/scaling';

export default function DeleteStepHeader({
  icon,
  title,
  description,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
}) {
  const { Colors } = useTheme();

  const styles = createStyles(Colors);

  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>
        <Ionicons name={icon} size={scale(32)} color={Colors.error} />
      </View>

      <Text style={styles.title}>{title}</Text>

      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const createStyles = (Colors: any) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      width: '100%',
    },

    iconWrapper: {
      width: scale(64),
      height: scale(64),
      borderRadius: scale(32),
      backgroundColor: Colors.errorLight,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: scale(16),
    },

    title: {
      fontFamily: Fonts.brandSemiBold,
      fontSize: normalize(18),
      color: Colors.text,
      marginBottom: scale(8),
      textAlign: 'center',
    },

    description: {
      fontFamily: Fonts.brandRegular,
      fontSize: normalize(13),
      color: Colors.textSecondary,
      textAlign: 'center',
      lineHeight: normalize(20),
      marginBottom: scale(20),
    },
  });
