import SuccessModal from '@/components/layout/success-modal';
import Button from '@/components/ui/buttons/button';
import ErrorMessage from '@/components/ui/error/error-message';
import UploadField from '@/components/ui/input/upload-field';
import { Fonts } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { normalize, scale } from '@/utils/scaling';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as DocumentPicker from 'expo-document-picker';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { submitDocumentsAction } from '../../action';
import { DriverDocumentType } from '../../schema';
import { useOnboardingStore } from '../../store';

export default function Documents({
  goToStep,
  currentStep,
  resumeStep,
}: {
  goToStep: (step: number) => void;
  currentStep: number;
  resumeStep: number;
}) {
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  function handlePreviousStep() {
    goToStep(2);
  }

  const { Colors } = useTheme();

  const styles = createStyles(Colors);

  const {
    step3Data,
    saveDocument,
    isSubmitting,
    setSubmitting,
    setError,
    error,
  } = useOnboardingStore();

  // inside Documents component

  const pickDocument = async (
    documentType: DriverDocumentType,
    description: string,
  ) => {
    const result = await DocumentPicker.getDocumentAsync({
      type: '*/*',
      copyToCacheDirectory: true,
      multiple: false,
    });

    if (result.canceled) return;

    const file = result.assets[0];

    console.log('Picked file:', file);

    saveDocument(documentType, {
      uri: file.uri,
      name: file.name,
      mimeType: file.mimeType || 'application/octet-stream',

      documentType,

      description,
    });
  };

  // handleSubmitDocuments

  const handleSubmitDocuments = async () => {
    try {
      const documents = Object.values(step3Data);

      if (documents.length < 3) {
        setError('Please upload all required documents');

        return;
      }

      // Extra validation
      for (const doc of documents) {
        if (!doc.uri || !doc.name) {
          setError('One or more uploaded files are invalid');

          return;
        }
      }

      console.log(
        'Final documents payload:',
        JSON.stringify(documents, null, 2),
      );

      setSubmitting(true);

      setError(null);

      const result = await submitDocumentsAction({
        documents,
      });

      if (!result.success) return;

      setShowSuccessModal(true);
    } catch (error) {
      console.log('SUBMIT ERROR:', error);

      setError('Failed to upload documents');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <View style={styles.iconContainer}>
            <Ionicons
              name="document-outline"
              size={24}
              color={Colors.primary}
            />
          </View>

          <View style={styles.mainTextContainer}>
            <Text style={styles.mainText}>Upload Documents</Text>
            <Text style={styles.subText}>
              Required documents for verification
            </Text>
          </View>
        </View>

        {error && <ErrorMessage message={error} />}

        <View style={styles.form}>
          <UploadField
            label="Driver's License"
            onPress={() => pickDocument('DRIVER_LICENSE', 'Driver license')}
            fileName={step3Data.DRIVER_LICENSE?.name}
          />

          <UploadField
            label="Vehicle Insurance"
            onPress={() =>
              pickDocument('VEHICLE_INSURANCE', 'Vehicle insurance')
            }
            fileName={step3Data.VEHICLE_INSURANCE?.name}
          />

          <UploadField
            label="Vehicle Registration"
            onPress={() =>
              pickDocument('VEHICLE_REGISTRATION', 'Vehicle registration')
            }
            fileName={step3Data.VEHICLE_REGISTRATION?.name}
          />

          <View style={styles.buttonContainer}>
            <Button
              disabled={currentStep - 1 <= resumeStep}
              onPress={handlePreviousStep}
              variant="outline"
            >
              Previous
            </Button>
            <Button
              loading={isSubmitting}
              disabled={isSubmitting}
              onPress={handleSubmitDocuments}
            >
              Continue
            </Button>
          </View>
        </View>
      </View>

      <SuccessModal
        title="Onboarding Completed"
        // path="/(app)/(protected)/(tabs)/home"
        description="You have successfully completed the onboarding process. Your account is now being reviewed. We will notify you once the verification is complete."
        buttonText="Contact Support"
        showSuccessModal={showSuccessModal}
        setShowSuccessModal={setShowSuccessModal}
      />
    </>
  );
}

const createStyles = (Colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      borderWidth: 1,
      borderColor: Colors.border,
      borderRadius: scale(12),
      padding: scale(20),
      gap: scale(32),
    },
    textContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: scale(16),
    },

    iconContainer: {
      width: scale(48),
      height: scale(48),
      borderRadius: scale(12),
      backgroundColor: Colors.primaryLight,
      justifyContent: 'center',
      alignItems: 'center',
    },

    mainTextContainer: {
      flex: 1,
    },

    mainText: {
      fontSize: normalize(20),
      fontFamily: Fonts.brandBold,
      color: Colors.text,
    },

    subText: {
      fontSize: normalize(16),
      color: Colors.textSecondary,
      fontFamily: Fonts.brandRegular,
    },

    form: {
      marginTop: scale(24),
      gap: scale(20),
    },

    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: scale(16),
    },
  });
