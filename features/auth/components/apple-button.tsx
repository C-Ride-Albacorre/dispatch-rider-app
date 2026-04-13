import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Fonts } from '@/constants/theme';

export default function AppleButton() {
  return (
    <TouchableOpacity style={style.button}>
      <Ionicons name="logo-apple" size={20} color="#fff" />
      <Text style={style.buttonText}>Continue with Apple</Text>
    </TouchableOpacity>
  );
}

const style = StyleSheet.create({
  button: {
    backgroundColor: '#000',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: Fonts.brandMedium,
  },
});
