import Button from '@/components/ui/buttons/button';
import Input from '@/components/ui/input/input';
import PhoneInput from '@/components/ui/input/phone-input';
import { Colors, Fonts } from '@/constants/theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function PersonalInfo() {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <View style={styles.iconContainer}>
          <Ionicons name="car-outline" size={24} color={Colors.primary} />
        </View>

        <View style={styles.mainTextContainer}>
          <Text style={styles.mainText}>Vehicle Information</Text>

          <Text style={styles.subText}>Tell us about your vehicle</Text>
        </View>
      </View>

      <View style={styles.form}>
        <View style={styles.vehicleTypeContainer}>
          <Text style={styles.vehicleTypeLabel}>Vehicle Type</Text>
          <TouchableOpacity style={styles.vehicleTypeOptions}>
            <View style={styles.largeVehicles}>
              <Ionicons
                name="car-outline"
                size={16}
                color={Colors.textSecondary}
              />

              <View style={styles.largeTextContainer}>
                <Text style={styles.largeMainText}>Car/Vehicle</Text>

                <Text style={styles.largeSubText}>For larger orders</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.evContainer}>
              <View style={styles.evTextContainer}>
                <Text style={styles.evMainText}>
                  Electric Vehicle (EV) Driver
                </Text>

                <View style={styles.evIconContainer}>
                  <Ionicons
                    name="leaf-outline"
                    size={12}
                    color={Colors.background}
                  />
                  <Text style={styles.evSubText}>Eco-Friendly</Text>
                </View>
              </View>

              <Text style={styles.evDescription}>
                Check this if you're using an electric vehicle or e-bike. Enjoy
                priority access to premium deliveries and eco bonuses!
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
        <Input label="Vehicle Make" placeholder="e.g., Honda, Toyota" />

        <Input label="Vehicle Model" placeholder="e.g., Civic, Camry" />

        <Input label="Vehicle Year" placeholder="e.g., 2020" />

        <Input
          label="License Plate Number"
          placeholder="Enter your license plate number"
        />

        <View style={styles.buttonContainer}>
          <Button variant="outline">Previous</Button>
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

  vehicleTypeContainer: {
    gap: 12,
  },

  vehicleTypeLabel: {
    fontSize: 16,
    fontFamily: Fonts.brandMedium,
    color: Colors.text,
  },

  vehicleTypeOptions: {
    gap: 16,
  },

  largeVehicles: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    flex: 1,
  },

  largeTextContainer: {
    gap: 4,
  },

  largeMainText: {
    fontSize: 24,
    fontFamily: Fonts.brandSemiBold,
    color: Colors.text,
    textAlign: 'center',
  },

  largeSubText: {
    fontSize: 14,
    fontFamily: Fonts.brandRegular,
    color: Colors.textSecondary,

    textAlign: 'center',
  },

  evContainer: {
    gap: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.successLight,
    borderRadius: 8,
    flex: 1,
    backgroundColor: Colors.successExtraLight,
  },

  evMainText: {
    fontSize: 16,
    fontFamily: Fonts.brandSemiBold,
    color: Colors.text,
    textAlign: 'center',
  },

  evTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },

  evIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: Colors.success,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 24,
  },

  evSubText:{
    fontSize: 10,
    fontFamily: Fonts.brandMedium,
    color: Colors.background,
  },


  evDescription:{
    fontSize: 14,
    fontFamily: Fonts.brandRegular,
    color: Colors.textSecondary,
    lineHeight: 20,
  }
});
