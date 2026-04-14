import AuthPageHeader from '@/components/layout/auth-header';
import Button from '@/components/ui/buttons/button';
import Input from '@/components/ui/input/input';
import { Colors, Fonts } from '@/constants/theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <KeyboardAvoidingView
      style={styles.keyboardSafeArea}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
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
            label="Email"
            placeholder="john.doe@example.com"
            value={email}
            onChangeText={setEmail}
          />

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

          <Button size="lg">Sign in</Button>

          <View style={styles.action}>
            <Text style={styles.actionText}>Don't have an account?</Text>

            <Link href={'/register'} asChild>
              <TouchableOpacity>
                <Text style={styles.actionLink}>Register</Text>
              </TouchableOpacity>
            </Link>
          </View>
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

  form: {
    marginTop: 32,
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

  action: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
  },

  actionText: {
    color: Colors.text,
    fontFamily: Fonts.brandMedium,
    fontSize: 16,
  },

  actionLink: {
    color: Colors.primary,
    fontFamily: Fonts.brandSemiBold,
    fontSize: 16,
  },
});
