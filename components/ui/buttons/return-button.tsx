import { useTheme } from '@/hooks/use-theme';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { scale } from '@/utils/scaling';
import { useRouter } from 'expo-router';

export default function ReturnButton() {
  const { Colors } = useTheme();

  const styles = createStyles(Colors);

  const router = useRouter();

  return (
    <TouchableOpacity style={styles.returnBtn} onPress={() => router.back()}>
      <Ionicons name="arrow-back" size={20} color={Colors.text} />
    </TouchableOpacity>
  );
}

const createStyles = (Colors: any) =>
  StyleSheet.create({
    returnBtn: {
      alignSelf: 'flex-start',
      padding: scale(8),
      borderRadius: scale(40),
      backgroundColor: Colors.backgroundTertiary,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
