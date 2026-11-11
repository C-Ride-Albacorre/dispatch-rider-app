import { ThemedText } from '@/components/themed-text';
import Button from '@/components/ui/buttons/button';
import Input from '@/components/ui/input/input';
import Select from '@/components/ui/input/select';
import { Fonts, Spacing } from '@/constants/theme';
import StepCard, { StepActions, stepActionStyles } from '@/features/onboarding/components/step-card';
import { useTheme } from '@/hooks/use-theme';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { vehicleInfoAction } from '../../action';
import { VehicleInfoFormValues, vehicleInfoSchema } from '../../schema';
import { useOnboardingStore } from '../../store';
import { useVehicleTypeConfigs } from '../../use-fetch';
import VehicleTypeIcon from '../vehicle-type-icon';

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

      const result = await vehicleInfoAction({
        ...payload,
        year: Number(payload.year),
      });

      if (!result.success) return;

      handleNextStep();
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <StepCard
      icon="car-outline"
      title="Vehicle Information"
      subtitle="Tell us about your vehicle"
    >
      <View style={styles.form}>
        <View style={styles.vehicleTypeContainer}>
          <ThemedText style={styles.vehicleTypeLabel}>Vehicle Type</ThemedText>

          {isLoadingVehicleTypes ? (
            <ActivityIndicator color={Colors.primary} />
          ) : isVehicleTypesError ? (
            <TouchableOpacity onPress={() => refetchVehicleTypes()}>
              <ThemedText style={styles.errorText} themeColor="error">
                Failed to load vehicle types. Tap to retry.
              </ThemedText>
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
                        styles.vehicleOption,
                        value === type.id && styles.selectedVehicleType,
                      ]}
                    >
                      <VehicleTypeIcon
                        config={type}
                        size={28}
                        color={
                          value === type.id ? Colors.primary : Colors.textSecondary
                        }
                      />
                      <ThemedText
                        style={styles.vehicleOptionText}
                        numberOfLines={1}
                        themeColor={value === type.id ? 'text' : 'textSecondary'}
                      >
                        {type.name}
                      </ThemedText>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            />
          )}

          {errors.vehicleTypeConfigId?.message && (
            <ThemedText style={styles.errorText} themeColor="error">
              {errors.vehicleTypeConfigId.message}
            </ThemedText>
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
            disabled={!isValid || isSubmitting}
            loading={isSubmitting}
            onPress={handleSubmit(onSubmit)}
            style={stepActionStyles.button}
          >
            Continue
          </Button>
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

    errorText: {
      fontFamily: Fonts.brandMedium,
      fontSize: 12,
      lineHeight: 17,
    },

    vehicleTypeContainer: {
      gap: Spacing.two,
    },

    vehicleTypeLabel: {
      fontFamily: Fonts.brandMedium,
      fontSize: 14,
      lineHeight: 20,
    },

    vehicleTypeOptions: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },

    vehicleOption: {
      flexGrow: 1,
      flexBasis: '40%',
      alignItems: 'center',
      justifyContent: 'center',
      gap: Spacing.one,
      padding: 14,
      borderWidth: 1,
      borderColor: Colors.border,
      borderRadius: 12,
      backgroundColor: Colors.card,
    },

    vehicleOptionText: {
      fontFamily: Fonts.brandSemiBold,
      fontSize: 14,
      lineHeight: 20,
    },

    selectedVehicleType: {
      borderColor: Colors.primary,
      backgroundColor: Colors.primaryExtraLight,
    },
  });
