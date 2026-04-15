import Button from '@/components/ui/buttons/button';
import Input from '@/components/ui/input/input';
import PhoneInput from '@/components/ui/input/phone-input';
import { Colors, Fonts } from '@/constants/theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, View } from 'react-native';

export default function PersonalInfo() {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <View style={styles.iconContainer}>
          <Ionicons name="person-outline" size={24} color={Colors.primary} />
        </View>

        <View style={styles.mainTextContainer}>
          <Text style={styles.mainText}>Personal Information</Text>

          <Text style={styles.subText}>Tell us about yourself</Text>
        </View>
      </View>

      <View style={styles.form}>
        <Input label="Full name" placeholder="Enter your full name" />

        <PhoneInput
          label="Phone number"
          placeholder="Enter your phone number"
        />

        <Input label="Email" placeholder="Enter your email address" />

        <Input label="City" placeholder="Enter your city" />

        <Input label="State" placeholder="Enter your state" />

        <View style={styles.buttonContainer}>
          <Button variant='outline' disabled>Previous</Button>
          <Button>Continue</Button>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 20,
    gap: 32,
  },

  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },

  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },

  mainTextContainer: {
    flex: 1,
  },

  mainText: {
    fontSize: 20,
    fontFamily: Fonts.brandBold,
    color: Colors.text,
  },

  subText: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontFamily: Fonts.brandRegular,
  },

  form: {
    gap: 24,
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
});
