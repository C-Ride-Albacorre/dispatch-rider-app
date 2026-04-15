import AuthPageHeader from '@/components/layout/auth-header';
import Button from '@/components/ui/buttons/button';
import Input from '@/components/ui/input/input';
import PhoneInput from '@/components/ui/input/phone-input';
import { Colors, Fonts } from '@/constants/theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function ForgetPassword() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'email' | 'phone'>('email');

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

        <View style={styles.textContainer}>
          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subtitle}>
            Enter your phone number or email address and we will send you a code
            to reset your password.
          </Text>
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'email' && styles.activeTab]}
            onPress={() => setActiveTab('email')}
          >
            <Ionicons
              name="mail"
              size={16}
              color={
                activeTab === 'email' ? Colors.primary : Colors.textSecondary
              }
            />
            <Text
              style={[
                styles.tabText,
                activeTab === 'email' && styles.activeTabText,
              ]}
            >
              Email
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'phone' && styles.activeTab]}
            onPress={() => setActiveTab('phone')}
          >
            <Ionicons
              name="call"
              size={16}
              color={
                activeTab === 'phone' ? Colors.primary : Colors.textSecondary
              }
            />
            <Text
              style={[
                styles.tabText,
                activeTab === 'phone' && styles.activeTabText,
              ]}
            >
              Phone
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'email' && (
          <View>
            <Input placeholder="john.doe@example.com" label="Email address" />
          </View>
        )}

        {activeTab === 'phone' && (
          <View>
            <PhoneInput />
          </View>
        )}

        <Link href={'/reset-password'}  asChild>
          <Button>Send Code</Button>
        </Link>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardSafeArea: {
    flex: 1,
  },

  returnBtn: {
    alignSelf: 'flex-start',
    padding: 8,
    borderRadius: 40,
    backgroundColor: Colors.light,
    alignItems: 'center',
    justifyContent: 'center',
  },

  container: {
    padding: 20,
    flexGrow: 1,
    gap: 24,
  },

  textContainer: {
    gap: 8,
    alignItems: 'center',
    marginVertical: 20,
  },

  title: {
    fontSize: 26,
    fontFamily: Fonts.brandBold,
    color: Colors.text,
  },

  subtitle: {
    fontSize: 16,
    fontFamily: Fonts.brandRegular,
    color: Colors.textSecondary,
    textAlign: 'center',
  },

  tabContainer: {
    flexDirection: 'row',
    borderRadius: 14,
    backgroundColor: Colors.inputBackground,
    padding: 4,
    marginVertical: 20,
  },

  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6,
  },

  activeTab: {
    backgroundColor: '#fff',
    color: Colors.text,
  },
  tabText: {
    fontSize: 14,
    fontFamily: Fonts.brandMedium,
    color: Colors.textSecondary,
  },

  activeTabText: {
    color: Colors.text,
  },
});
