import { Colors, Fonts } from '@/constants/theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Page() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      {/* <TouchableOpacity
        style={styles.closeBtn}
        onPress={() => router.dismiss()}
      >
        <Ionicons name="close" size={24} />
      </TouchableOpacity> */}

      <TouchableOpacity style={styles.returnBtn} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} />
      </TouchableOpacity>

      <Text style={styles.title}>Create a C-ride account</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },

  returnBtn: {
    alignSelf: 'flex-start',
    padding: 8,
    borderRadius: 40,
    backgroundColor: Colors.light,
    alignItems: 'center',
    justifyContent: 'center',
  },

  closeBtn: {
    alignSelf: 'flex-end',
    padding: 8,
    borderRadius: 40,
    backgroundColor: Colors.light,
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    fontSize: 30,
    fontFamily: Fonts.brandBold,
    marginVertical: 22,
    textAlign: 'center',
  },
});
