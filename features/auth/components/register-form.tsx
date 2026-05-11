import AuthPageHeader from '@/components/layout/auth-header';

import Button from '@/components/ui/buttons/button';

import Input from '@/components/ui/input/input';

import PhoneInput from '@/components/ui/input/phone-input';

import { Colors, Fonts } from '@/constants/theme';

import { registerAction } from '@/features/auth/action';

import { RegisterPayload } from '@/features/auth/types';

import { getPasswordStrength } from '@/utils/password-strength';

import Ionicons from '@expo/vector-icons/Ionicons';

import { useRouter } from 'expo-router';

import { useState } from 'react';

import { Controller, useForm } from 'react-hook-form';

import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function RegisterForm() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterPayload>();

  // 🔥 WATCH PASSWORD
  const password = watch('password') || '';

  const passwordStrength = getPasswordStrength(password);

  const onSubmit = async (data: RegisterPayload) => {
    try {
      setLoading(true);

      const response = await registerAction(data);

      if (response.success) {
        router.push('/(verify)/phone');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardSafeArea}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View>
          {router.canGoBack() && (
            <TouchableOpacity
              style={styles.returnBtn}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} />
            </TouchableOpacity>
          )}

          <AuthPageHeader />
        </View>

        <View style={styles.form}>
          {/* FIRST NAME */}
          <Controller
            control={control}
            name="firstName"
            rules={{
              required: 'First name is required',
            }}
            render={({ field: { onChange, value } }) => (
              <Input
                label="First Name"
                placeholder="John"
                value={value}
                onChangeText={onChange}
              />
            )}
          />

          {errors.firstName && (
            <Text style={styles.errorText}>{errors.firstName.message}</Text>
          )}

          {/* LAST NAME */}
          <Controller
            control={control}
            name="lastName"
            rules={{
              required: 'Last name is required',
            }}
            render={({ field: { onChange, value } }) => (
              <Input
                label="Last Name"
                placeholder="Doe"
                value={value}
                onChangeText={onChange}
              />
            )}
          />

          {errors.lastName && (
            <Text style={styles.errorText}>{errors.lastName.message}</Text>
          )}

          {/* EMAIL */}
          <Controller
            control={control}
            name="email"
            rules={{
              required: 'Email is required',

              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

                message: 'Invalid email address',
              },
            }}
            render={({ field: { onChange, value } }) => (
              <Input
                label="Email"
                placeholder="john@mail.com"
                value={value}
                onChangeText={onChange}
              />
            )}
          />

          {errors.email && (
            <Text style={styles.errorText}>{errors.email.message}</Text>
          )}

          {/* PHONE */}
          <Controller
            control={control}
            name="phoneNumber"
            rules={{
              required: 'Phone number is required',
            }}
            render={({ field: { onChange, value } }) => (
              <PhoneInput
                label="Phone Number"
                placeholder="+234..."
                value={value}
                onChangePhone={onChange}
              />
            )}
          />

          {errors.phoneNumber && (
            <Text style={styles.errorText}>{errors.phoneNumber.message}</Text>
          )}

          {/* PASSWORD */}
          <Controller
            control={control}
            name="password"
            rules={{
              required: 'Password is required',

              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
              },
            }}
            render={({ field: { onChange, value } }) => (
              <Input
                label="Password"
                placeholder="********"
                value={value}
                secureTextEntry={!showPassword}
                onChangeText={onChange}
                rightIcon={
                  <Ionicons
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={22}
                    color="#999"
                  />
                }
                onRightIconPress={() => setShowPassword(!showPassword)}
              />
            )}
          />

          {/* PASSWORD ERROR */}
          {errors.password && (
            <Text style={styles.errorText}>{errors.password.message}</Text>
          )}

          {/* PASSWORD STRENGTH */}
          {password.length > 0 && (
            <Text
              style={{
                color: passwordStrength.color,

                fontSize: 13,

                fontFamily: Fonts.brandMedium,
              }}
            >
              Password Strength: {passwordStrength.label}
            </Text>
          )}

          {/* SUBMIT */}
          <Button
            size="lg"
            loading={loading}
            disabled={loading}
            onPress={handleSubmit(onSubmit)}
          >
            {loading ? 'Creating Account...' : 'Register'}
          </Button>

          {/* FOOTER */}
          <View style={styles.action}>
            <Text style={styles.actionText}>Already have an account?</Text>

            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text style={styles.actionLink}>Login</Text>
            </TouchableOpacity>
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

  returnBtn: {
    alignSelf: 'flex-start',

    padding: 8,

    borderRadius: 40,

    backgroundColor: Colors.light,

    alignItems: 'center',

    justifyContent: 'center',
  },

  form: {
    marginTop: 32,
    gap: 18,
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

  errorText: {
    color: '#dc2626',
    fontSize: 13,
    marginTop: -10,
  },
});
