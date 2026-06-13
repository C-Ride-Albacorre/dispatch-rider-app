import { useTheme } from '@/hooks/use-theme';
import { scale } from '@/utils/scaling';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';

export default function AppFrame({ children }: { children: React.ReactNode }) {
  const { Colors, isDark } = useTheme();

  const styles = createStyles(Colors);

  return (
    <LinearGradient
      colors={isDark ? ['#111827', '#1F2937'] : ['#111111', '#3A3A3A']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.statsFrame}
    >
      {children}

      <View style={styles.bubbleTop}></View>

      <View style={styles.bubbleBottom}></View>
    </LinearGradient>
  );
}

const createStyles = (Colors: any) =>
  StyleSheet.create({
    statsFrame: {
      borderRadius: scale(14),
      padding: scale(20),
      overflow: 'hidden',
      position: 'relative',
    },

    bubbleTop: {
      position: 'absolute',
      width: scale(120),
      height: scale(120),
      borderRadius: scale(999),
      backgroundColor: Colors.primaryLight,
      top: scale(-40),
      right: scale(-30),
    },

    bubbleBottom: {
      position: 'absolute',
      width: scale(80),
      height: scale(80),
      borderRadius: scale(999),
      backgroundColor: Colors.successExtraLight,
      bottom: scale(-30),
      right: scale(20),
    },
  });
