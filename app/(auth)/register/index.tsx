import AuthPageHeader from '@/components/layout/auth-header';
import Button from '@/components/ui/buttons/button';
import Input from '@/components/ui/input/input';
import PhoneInput from '@/components/ui/input/phone-input';
import { Colors, Fonts } from '@/constants/theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Image,
} from 'react-native';

export default function Page() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const router = useRouter();
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
          <View style={styles.row}>
            <Input
              label="First Name"
              placeholder="John"
              value={name}
              onChangeText={setName}
            />

            <Input
              label="Last Name"
              placeholder="Doe"
              value={name}
              onChangeText={setName}
            />
          </View>

          <Input
            label="Email"
            placeholder="john.doe@example.com"
            value={email}
            onChangeText={setEmail}
          />

          <PhoneInput label="Phone Number" placeholder="(123) 456-7890" />

          <Input
            label="Password"
            placeholder="********"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Input label="Referral Code (Optional)" placeholder="Enter Code" />


          <Button size='lg'>
            Register
          </Button>
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

  closeBtn: {
    alignSelf: 'flex-end',
    padding: 8,
    borderRadius: 40,
    backgroundColor: Colors.light,
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    fontSize: 28,
    fontFamily: Fonts.brandBold,
    marginVertical: 22,
    textAlign: 'center',
  },

  form: {
    marginTop: 32,
    gap: 24,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
});
