import Button from '@/components/ui/buttons/button';
import Input from '@/components/ui/input/input';
import Select from '@/components/ui/input/select';
import { Colors, Fonts } from '@/constants/theme';
import { normalize, scale } from '@/utils/scaling';
import Ionicons from '@expo/vector-icons/Ionicons';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { vehicleInfoAction } from '../../action';
import { VehicleInfoFormValues, vehicleInfoSchema } from '../../schema';
import { useOnboardingStore } from '../../store';
import { useVehicleTypeConfigs } from '../../use-fetch';
import { useTheme } from '@/hooks/use-theme';

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

  const { Colors } = useTheme();

  const styles = createStyles(Colors);

  const {
    data: vehicleTypes = [],
    isLoading: isLoadingVehicleTypes,
    isError: isVehicleTypesError,
    refetch: refetchVehicleTypes,
  } = useVehicleTypeConfigs();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<VehicleInfoFormValues>({
    resolver: zodResolver(vehicleInfoSchema),

    defaultValues: {
      vehicleTypeConfigId: step2Data.vehicleTypeConfigId ?? '',
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

          {isLoadingVehicleTypes ? (
            <ActivityIndicator color={Colors.primary} />
          ) : isVehicleTypesError ? (
            <TouchableOpacity onPress={() => refetchVehicleTypes()}>
              <Text style={styles.errorText}>
                Failed to load vehicle types. Tap to retry.
              </Text>
            </TouchableOpacity>
          ) : (
            <Controller
              control={control}
              name="vehicleTypeConfigId"
              render={({ field: { value, onChange } }) => (
                <View style={styles.vehicleTypeOptions}>
                  {vehicleTypes.map((type) => (
                    <TouchableOpacity
                      key={type.id}
                      activeOpacity={0.8}
                      onPress={() => onChange(type.id)}
                      style={[
                        styles.largeVehicles,
                        value === type.id && styles.selectedVehicleType,
                      ]}
                    >
                      <Text style={styles.largeMainText}>{type.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            />
          )}

          {errors.vehicleTypeConfigId?.message && (
            <Text style={styles.errorText}>
              {errors.vehicleTypeConfigId.message}
            </Text>
          )}
        </View>

        <Controller
          control={control}
          name="vehicleMake"
          render={({ field: { value, onChange } }) => (
            <Input
              label="Vehicle Make"
              placeholder="e.g., Honda"
              value={value}
              onChangeText={onChange}
              required
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
              placeholder="e.g., Civic"
              value={value}
              onChangeText={onChange}
              required
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
              required
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
              required
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

    errorText: {
      fontSize: normalize(12),
      color: Colors.error,
      fontFamily: Fonts.brandMedium,
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
      fontSize: normalize(16),
      fontFamily: Fonts.brandBold,
      color: Colors.text,
    },

    subText: {
      fontSize: normalize(12),
      color: Colors.textSecondary,
      fontFamily: Fonts.brandRegular,
    },

    form: {
      gap: scale(32),
    },

    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: scale(16),
    },

    vehicleTypeContainer: {
      gap: scale(12),
    },

    vehicleTypeLabel: {
      fontSize: normalize(14),
      fontFamily: Fonts.brandMedium,
      color: Colors.text,
    },

    vehicleTypeOptions: {
      flexDirection: 'row',
      gap: scale(12),
    },

    largeVehicles: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: scale(8),
      padding: scale(14),
      borderWidth: 1,
      borderColor: Colors.border,
      borderRadius: scale(8),
      flex: 1,
    },

    largeMainText: {
      fontSize: normalize(14),
      fontFamily: Fonts.brandSemiBold,
      color: Colors.text,
    },

    selectedVehicleType: {
      borderColor: Colors.primary,
      backgroundColor: Colors.primaryLight,
    },
  });
