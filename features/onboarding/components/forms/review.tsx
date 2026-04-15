import UploadField from '@/components/ui/input/upload-field';
import { Colors, Fonts } from '@/constants/theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import * as DocumentPicker from 'expo-document-picker';

export default function Review() {
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

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <View style={styles.iconContainer}>
          <Ionicons
            name="checkmark-circle-outline"
            size={24}
            color={Colors.primary}
          />
        </View>

        <View style={styles.mainTextContainer}>
          <Text style={styles.mainText}>Review Your Information</Text>
          <Text style={styles.subText}>
            Ensure all your details are correct before submission
          </Text>
        </View>
      </View>

      <View style={styles.form}>
        <View>
          <View style={styles.textContainer}>
            <Ionicons name="person-outline" size={16} color={Colors.primary} />

            <Text style={styles.largeMainText}>Personal Information</Text>
          </View>

          <View style={styles.reviewItemsContainer}>
            <View style={styles.reviewItems}>
              <Text style={styles.itemTitle}>Full Name</Text>
              <Text style={styles.itemSubText}>Dele Akinrinde</Text>
            </View>

            <View style={styles.reviewItems}>
              <Text style={styles.itemTitle}>Phone</Text>
              <Text style={styles.itemSubText}>+234 812 345 6789</Text>
            </View>

            <View style={styles.reviewItems}>
              <Text style={styles.itemTitle}>Email</Text>
              <Text style={styles.itemSubText}>dele.akinrinde@example.com</Text>
            </View>

            <View style={styles.reviewItems}>
              <Text style={styles.itemTitle}>Address</Text>
              <Text style={styles.itemSubText}>
                123 Main Street, Lagos, Nigeria
              </Text>
            </View>
          </View>
        </View>

        <View>
          <View style={styles.textContainer}>
            <Ionicons name="car-outline" size={16} color={Colors.primary} />

            <Text style={styles.largeMainText}>Vehicle Information</Text>
          </View>

          <View style={styles.reviewItemsContainer}>
            <View style={styles.reviewItems}>
              <Text style={styles.itemTitle}>Vehicle Type</Text>
              <Text style={styles.itemSubText}>Sedan</Text>
            </View>

            <View style={styles.reviewItems}>
              <Text style={styles.itemTitle}>License Plate</Text>
              <Text style={styles.itemSubText}>ABC-1234</Text>
            </View>

            <View style={styles.reviewItems}>
              <Text style={styles.itemTitle}>Make & Model</Text>
              <Text style={styles.itemSubText}>Toyota Corolla</Text>
            </View>
          </View>
        </View>

        <View>
          <View style={styles.textContainer}>
            <Ionicons
              name="document-outline"
              size={16}
              color={Colors.primary}
            />

            <Text style={styles.largeMainText}>Uploaded Documents</Text>
          </View>

          <View style={styles.reviewItemsContainer}>
            <View style={styles.reviewItems}>
              <Text style={styles.itemTitle}>Driver's License</Text>

              <View style={styles.document}>
                <UploadField
                  onPress={() => pickDocument(setLicense)}
                  fileName={license || undefined}
                />
              </View>
            </View>

            <View style={styles.reviewItems}>
              <Text style={styles.itemTitle}>Vehicle Insurance</Text>

              <View style={styles.document}>
                <UploadField
                  onPress={() => pickDocument(setInsurance)}
                  fileName={insurance || undefined}
                />
              </View>
            </View>

            <View style={styles.reviewItems}>
              <Text style={styles.itemTitle}>Vehicle Registration</Text>

              <View style={styles.document}>
                <UploadField
                  onPress={() => pickDocument(setRegistration)}
                  fileName={registration || undefined}
                />
              </View>
            </View>
          </View>
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

  largeMainText: {
    fontSize: 18,
    fontFamily: Fonts.brandBold,
    color: Colors.text,
  },

  form: {
    gap: 32,
  },

  reviewItemsContainer: {
    marginTop: 16,
    gap: 8,
  },

  reviewItems: {
    paddingVertical: 12,
  },

  itemTitle: {
    fontSize: 16,
    fontFamily: Fonts.brandBold,
    color: Colors.text,
  },
  itemSubText: {
    fontSize: 16,
    fontFamily: Fonts.brandRegular,
    color: Colors.textSecondary,
  },

  document:{
        marginTop: 8,
  }
});
