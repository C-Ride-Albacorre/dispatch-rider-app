import AuthPageHeader from '@/components/layout/auth-header';
import Button from '@/components/ui/buttons/button';
import Input from '@/components/ui/input/input';
import { Colors, Fonts } from '@/constants/theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function ResetPassword() {
  const router = useRouter();

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <KeyboardAvoidingView style={styles.keyboardSafeArea} behavior="padding">
      <ScrollView contentContainerStyle={styles.container}>
        <View>
          <TouchableOpacity
            style={styles.returnBtn}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} />
          </TouchableOpacity>

          <AuthPageHeader />
        </View>

        <View style={styles.form}>
          <Input
            label="Password"
            placeholder="********"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            rightIcon={
              <Ionicons
                name={showPassword ? 'eye-off' : 'eye'}
                size={24}
                color="#999"
              />
            }
            onRightIconPress={() => setShowPassword(!showPassword)}
          />

          <Input
            label="Confirm Password"
            placeholder="********"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            rightIcon={
              <Ionicons
                name={showPassword ? 'eye-off' : 'eye'}
                size={24}
                color="#999"
              />
            }
            onRightIconPress={() => setShowPassword(!showPassword)}
          />

          <Button>Reset Password</Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardSafeArea: {
    flex: 1,
  },

  container: {
    padding: 20,
    flexGrow: 1,
    gap: 24,
  },

  returnBtn: {
    alignSelf: 'flex-start',
    padding: 8,
    borderRadius: 40,
    backgroundColor: Colors.light,
    alignItems: 'center',
    justifyContent: 'center',
  },


  form:{
    gap: 24,
  }
});
