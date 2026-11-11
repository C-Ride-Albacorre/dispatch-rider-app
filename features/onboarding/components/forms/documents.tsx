import SuccessModal from '@/components/layout/success-modal';
import Button from '@/components/ui/buttons/button';
import ErrorMessage from '@/components/ui/error/error-message';
import UploadField from '@/components/ui/input/upload-field';
import { Spacing } from '@/constants/theme';
import StepCard, { StepActions, stepActionStyles } from '@/features/onboarding/components/step-card';
import * as DocumentPicker from 'expo-document-picker';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
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

  const {
    step3Data,
    saveDocument,
    isSubmitting,
    setSubmitting,
    setError,
    error,
  } = useOnboardingStore();

  const allDocumentsUploaded =
    !!step3Data.DRIVER_LICENSE &&
    !!step3Data.VEHICLE_INSURANCE &&
    !!step3Data.VEHICLE_REGISTRATION;

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

      setSubmitting(true);

      setError(null);

      const result = await submitDocumentsAction({
        documents,
      });

      if (!result.success) return;

      setShowSuccessModal(true);
    } catch {
      setError('Failed to upload documents');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <StepCard
        icon="document-outline"
        title="Upload Documents"
        subtitle="Required documents for verification"
      >
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

          <StepActions>
            <Button
              size="lg"
              disabled={currentStep - 1 <= resumeStep}
              onPress={handlePreviousStep}
              variant="outline"
              style={stepActionStyles.button}
            >
              Previous
            </Button>
            <Button
              size="lg"
              loading={isSubmitting}
              disabled={!allDocumentsUploaded || isSubmitting}
              onPress={handleSubmitDocuments}
              style={stepActionStyles.button}
            >
              Continue
            </Button>
          </StepActions>
        </View>
      </StepCard>

      <SuccessModal
        title="Onboarding Completed"
        path="/(app)/(protected)/(tabs)/home"
        description="You have successfully completed the onboarding process. Your account is now being reviewed. We will notify you once the verification is complete."
        showSuccessModal={showSuccessModal}
        setShowSuccessModal={setShowSuccessModal}
        buttonText="Get Started"
      />
    </>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: Spacing.three,
  },
});
