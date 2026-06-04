import Button from '@/components/ui/buttons/button';
import Input from '@/components/ui/input/input';
import Select from '@/components/ui/input/select';
import { Colors, Fonts } from '@/constants/theme';
import { normalize } from '@/utils/scaling';
import Ionicons from '@expo/vector-icons/Ionicons';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { vehicleInfoAction } from '../../action';
import { VehicleInfoFormValues, vehicleInfoSchema } from '../../schema';
import { useOnboardingStore } from '../../store';



export default function VehicleInfo({
  goToStep,
  currentStep,
  resumeStep,
}: {
  goToStep: (step: number) => void;
  currentStep: number;
  resumeStep: number;
}) {
  const { step2Data, isSubmitting, error, setError, setSubmitting } =
    useOnboardingStore();

  const handleNextStep = () => {
    goToStep(3);
  };

  function handlePreviousStep() {
    goToStep(1);
  }

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<VehicleInfoFormValues>({
    resolver: zodResolver(vehicleInfoSchema),

    defaultValues: {
      vehicleType: step2Data.vehicleType ?? 'CAR',
      vehicleMake: step2Data.vehicleMake ?? '',
      vehicleModel: step2Data.vehicleModel ?? '',
      year: step2Data.year ?? '',
      licensePlate: step2Data.licensePlate ?? '',
    },

    mode: 'onTouched',
  });

  const onSubmit = async (payload: VehicleInfoFormValues) => {
    try {
      setSubmitting(true);
      setError(null);

      console.log(' Submitting vehicle info with payload:', payload);

      const result = await vehicleInfoAction({
        ...payload,
        year: Number(payload.year),
      });

      console.log('Result from vehicle info action:', result);

      if (!result.success) return;

      handleNextStep();
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

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

          <Controller
            control={control}
            name="vehicleType"
            render={({ field: { value, onChange } }) => (
              <TouchableOpacity style={styles.vehicleTypeOptions}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => onChange('CAR')}
                  style={[
                    styles.largeVehicles,
                    value === 'CAR' && styles.selectedVehicleType,
                  ]}
                >
                  <Ionicons
                    name="car-outline"
                    size={16}
                    color={Colors.textSecondary}
                  />

                  <View style={styles.largeTextContainer}>
                    <Text style={styles.largeMainText}>Car/Vehicle</Text>

                    <Text style={styles.largeSubText}>For larger orders</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => onChange('EV')}
                  style={[
                    styles.evContainer,
                    value === 'EV' && styles.selectedVehicleType,
                  ]}
                >
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
                    Check this if you're using an electric vehicle or e-bike.
                    Enjoy priority access to premium deliveries and eco bonuses!
                  </Text>
                </TouchableOpacity>
              </TouchableOpacity>
            )}
          />

          {errors.vehicleType?.message && (
            <Text style={styles.errorText}>{errors.vehicleType.message}</Text>
          )}
        </View>

        <Controller
          control={control}
          name="vehicleMake"
          render={({ field: { value, onChange } }) => (
            <Input
              label="Vehicle Make"
              placeholder="e.g., Honda, Toyota"
              value={value}
              onChangeText={onChange}
              error={errors.vehicleMake?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="vehicleModel"
          render={({ field: { value, onChange } }) => (
            <Input
              label="Vehicle Model"
              placeholder="e.g., Civic, Camry"
              value={value}
              onChangeText={onChange}
              error={errors.vehicleModel?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="year"
          render={({ field: { value, onChange } }) => (
            <Select
              label="Year of Manufacture"
              placeholder="Select year"
              value={value}
              onChange={onChange}
              options={Array.from({ length: 25 }, (_, i) => {
                const year = new Date().getFullYear() - i;
                return {
                  label: String(year),
                  value: String(year),
                };
              })}
              error={errors.year?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="licensePlate"
          render={({ field: { value, onChange } }) => (
            <Input
              label="License Plate Number"
              placeholder="Enter your license plate number"
              value={value}
              onChangeText={onChange}
              error={errors.licensePlate?.message}
            />
          )}
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
            disabled={!isValid || isSubmitting}
            loading={isSubmitting}
            onPress={handleSubmit(onSubmit)}
          >
            Continue
          </Button>
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

  errorText: {
    fontSize: normalize(12),
    color: Colors.error,
    fontFamily: Fonts.brandMedium,
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

  evSubText: {
    fontSize: 10,
    fontFamily: Fonts.brandMedium,
    color: Colors.background,
  },

  evDescription: {
    fontSize: 14,
    fontFamily: Fonts.brandRegular,
    color: Colors.textSecondary,
    lineHeight: 20,
  },

  selectedVehicleType: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
});
