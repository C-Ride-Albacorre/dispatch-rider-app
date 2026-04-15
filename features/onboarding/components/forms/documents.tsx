import { useState } from 'react';
import UploadField from '@/components/ui/input/upload-field';
import { Colors, Fonts } from '@/constants/theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, View } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import Button from '@/components/ui/buttons/button';

export default function Documents({
  setStep,
}: {
  setStep: (step: string) => void;
}) {
  const [license, setLicense] = useState<string | null>(null);
  const [insurance, setInsurance] = useState<string | null>(null);
  const [registration, setRegistration] = useState<string | null>(null);

  // Generic picker function
  const pickDocument = async (setFile: (name: string) => void) => {
    const result = await DocumentPicker.getDocumentAsync({
      type: '*/*',
      copyToCacheDirectory: true,
    });

    if (result.canceled === false) {
      const file = result.assets[0];
      setFile(file.name);
    }
  };

  const handleNextStep = () => {
    setStep('4');
  };

  function handlePreviousStep(){
    setStep('3')
  }

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <View style={styles.iconContainer}>
          <Ionicons name="document-outline" size={24} color={Colors.primary} />
        </View>

        <View style={styles.mainTextContainer}>
          <Text style={styles.mainText}>Upload Documents</Text>
          <Text style={styles.subText}>
            Required documents for verification
          </Text>
        </View>
      </View>

      <View style={styles.form}>
        <UploadField
          label="Driver's License"
          onPress={() => pickDocument(setLicense)}
          fileName={license || undefined}
        />

        <UploadField
          label="Vehicle Insurance"
          onPress={() => pickDocument(setInsurance)}
          fileName={insurance || undefined}
        />

        <UploadField
          label="Vehicle Registration"
          onPress={() => pickDocument(setRegistration)}
          fileName={registration || undefined}
        />

        <View style={styles.buttonContainer}>
          <Button onPress={handlePreviousStep} variant="outline">Previous</Button>
          <Button onPress={handleNextStep}>Continue</Button>
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
    marginTop: 24,
    gap: 20,
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
});
