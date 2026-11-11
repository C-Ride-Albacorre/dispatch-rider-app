import { ThemedText } from '@/components/themed-text';
import Button from '@/components/ui/buttons/button';
import UploadField from '@/components/ui/input/upload-field';
import { Fonts, Spacing } from '@/constants/theme';
import StepCard, { StepActions, stepActionStyles } from '@/features/onboarding/components/step-card';
import { useTheme } from '@/hooks/use-theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as DocumentPicker from 'expo-document-picker';
import { Link } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

export default function Review({
  goToStep,
}: {
  goToStep: (step: number) => void;
}) {
  const [license, setLicense] = useState<string | null>(null);
  const [insurance, setInsurance] = useState<string | null>(null);
  const [registration, setRegistration] = useState<string | null>(null);

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

  const handlePreviousStep = () => {
    goToStep(3);
  };

  const { Colors } = useTheme();

  const styles = createStyles(Colors);

  return (
    <StepCard
      icon="checkmark-circle-outline"
      title="Review Your Information"
      subtitle="Ensure all your details are correct before submission"
    >
      <View style={styles.form}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="person-outline" size={16} color={Colors.primary} />

            <ThemedText style={styles.sectionTitle}>Personal Information</ThemedText>
          </View>

          <View style={styles.reviewItem}>
            <ThemedText style={styles.itemTitle} themeColor="textMuted">Full Name</ThemedText>
            <ThemedText style={styles.itemSubText}>Dele Akinrinde</ThemedText>
          </View>

          <View style={styles.reviewItem}>
            <ThemedText style={styles.itemTitle} themeColor="textMuted">Phone</ThemedText>
            <ThemedText style={styles.itemSubText}>+234 812 345 6789</ThemedText>
          </View>

          <View style={styles.reviewItem}>
            <ThemedText style={styles.itemTitle} themeColor="textMuted">Email</ThemedText>
            <ThemedText style={styles.itemSubText}>dele.akinrinde@example.com</ThemedText>
          </View>

          <View style={styles.reviewItem}>
            <ThemedText style={styles.itemTitle} themeColor="textMuted">Address</ThemedText>
            <ThemedText style={styles.itemSubText}>
              123 Main Street, Lagos, Nigeria
            </ThemedText>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="car-outline" size={16} color={Colors.primary} />

            <ThemedText style={styles.sectionTitle}>Vehicle Information</ThemedText>
          </View>

          <View style={styles.reviewItem}>
            <ThemedText style={styles.itemTitle} themeColor="textMuted">Vehicle Type</ThemedText>
            <ThemedText style={styles.itemSubText}>Sedan</ThemedText>
          </View>

          <View style={styles.reviewItem}>
            <ThemedText style={styles.itemTitle} themeColor="textMuted">License Plate</ThemedText>
            <ThemedText style={styles.itemSubText}>ABC-1234</ThemedText>
          </View>

          <View style={styles.reviewItem}>
            <ThemedText style={styles.itemTitle} themeColor="textMuted">Make & Model</ThemedText>
            <ThemedText style={styles.itemSubText}>Toyota Corolla</ThemedText>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="document-outline" size={16} color={Colors.primary} />

            <ThemedText style={styles.sectionTitle}>Uploaded Documents</ThemedText>
          </View>

          <View style={styles.reviewItem}>
            <ThemedText style={styles.itemTitle} themeColor="textMuted">Driver's License</ThemedText>
            <UploadField
              onPress={() => pickDocument(setLicense)}
              fileName={license || undefined}
            />
          </View>

          <View style={styles.reviewItem}>
            <ThemedText style={styles.itemTitle} themeColor="textMuted">Vehicle Insurance</ThemedText>
            <UploadField
              onPress={() => pickDocument(setInsurance)}
              fileName={insurance || undefined}
            />
          </View>

          <View style={styles.reviewItem}>
            <ThemedText style={styles.itemTitle} themeColor="textMuted">Vehicle Registration</ThemedText>
            <UploadField
              onPress={() => pickDocument(setRegistration)}
              fileName={registration || undefined}
            />
          </View>
        </View>

        <StepActions>
          <Button
            size="lg"
            onPress={handlePreviousStep}
            variant="outline"
            style={stepActionStyles.button}
          >
            Previous
          </Button>

          <Link href={'/home'} asChild>
            <Button size="lg" style={stepActionStyles.button}>
              Continue
            </Button>
          </Link>
        </StepActions>
      </View>
    </StepCard>
  );
}

const createStyles = (Colors: any) =>
  StyleSheet.create({
    form: {
      gap: Spacing.three,
    },

    section: {
      backgroundColor: Colors.card,
      borderWidth: 1,
      borderColor: Colors.border,
      borderRadius: 16,
      padding: 14,
      gap: 12,
    },

    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.two,
    },

    sectionTitle: {
      fontFamily: Fonts.brandSemiBold,
      fontSize: 14,
      lineHeight: 20,
    },

    reviewItem: {
      gap: Spacing.half,
    },

    itemTitle: {
      fontFamily: Fonts.brandRegular,
      fontSize: 12,
      lineHeight: 17,
    },

    itemSubText: {
      fontFamily: Fonts.brandMedium,
      fontSize: 14,
      lineHeight: 20,
    },
  });
