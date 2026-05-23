import AuthPageHeader from '@/components/layout/auth-header';
import SuccessModal from '@/components/layout/success-modal';
import Button from '@/components/ui/buttons/button';
import ErrorMessage from '@/components/ui/error/error-message';
import Input from '@/components/ui/input/input';
import PhoneInput from '@/components/ui/input/phone-input';
import { Colors, Fonts } from '@/constants/theme';
import { forgetPasswordAction } from '@/features/auth/action';
import {
  ForgetPasswordPayload,
  forgetPasswordSchema,
} from '@/features/auth/schema';
import Ionicons from '@expo/vector-icons/Ionicons';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  ActivityIndicator,
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

  const [successModalVisible, setSuccessModalVisible] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [successData, setSuccessData] = useState<{
    identifier: string;
    method: string;
  } | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgetPasswordPayload>({
    resolver: zodResolver(forgetPasswordSchema),

    defaultValues: {
      email: '',
      phoneNumber: '',
    },
  });

  const onSubmit = async (data: ForgetPasswordPayload) => {
    setIsLoading(true);

    try {
      const payload =
        activeTab === 'email'
          ? { email: data.email }
          : { phoneNumber: data.phoneNumber };

      const response = await forgetPasswordAction(payload);

      if (response.success) {
        setSuccessData({
          identifier: response.identifier,
          method: response.method,
        });

        setSuccessModalVisible(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {successModalVisible && successData && (
        <SuccessModal
          title={`Check your ${
            successData?.method === 'email' ? 'inbox' : 'messages'
          }`}
          description={`We have sent a code to your ${
            successData?.method === 'email' ? 'email' : 'phone'
          } (${successData?.identifier}). Please use it to reset your password.`}
          buttonText="Back to Login"
          path="/(app)/(auth)/login"
          showSuccessModal={successModalVisible}
          setShowSuccessModal={setSuccessModalVisible}
        />
      )}

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
              Enter your {activeTab === 'email' ? 'email' : 'phone'} address and
              we will send you a code to reset your password.
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

          {errors.email?.message ||
            (errors.phoneNumber?.message && (
              <ErrorMessage
                message={errors.email?.message || errors.phoneNumber?.message}
              />
            ))}

          {activeTab === 'email' && (
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="john.doe@example.com"
                  label="Email address"
                  onChangeText={onChange}
                  value={value}
                  error={errors.email?.message}
                />
              )}
            />
          )}

          {activeTab === 'phone' && (
            <Controller
              control={control}
              name="phoneNumber"
              render={({ field: { onChange, value } }) => (
                <PhoneInput
                  placeholder="Enter your phone number"
                  label="Phone number"
                  onChangePhone={onChange}
                  value={value}
                  errorMessage={errors.phoneNumber?.message}
                />
              )}
            />
          )}

          {isLoading ? (
            <ActivityIndicator />
          ) : (
            <Button disabled={isLoading} onPress={handleSubmit(onSubmit)}>
              {isLoading ? 'Submitting...' : 'Submit'}
            </Button>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </>
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
