import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image, StyleSheet } from 'react-native';
import { VehicleType, VehicleTypeConfig, VehicleTypeValue } from '../service';

type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

const VEHICLE_ICONS: Record<VehicleTypeValue, IconName> = {
  CAR: 'car-outline',
  EV: 'car-electric-outline',
  E_BIKE: 'bicycle-electric',
  MOTORCYCLE: 'motorbike',
};

function matchVehicleType(value: string): VehicleTypeValue | null {
  const normalized = value.toUpperCase().replace(/[^A-Z0-9]+/g, '_');
  const tokens = normalized.split('_');

  if (normalized.includes('MOTORCYCLE') || tokens.includes('MOTORBIKE')) {
    return VehicleType.MOTORCYCLE;
  }
  if (normalized.includes('E_BIKE') || tokens.includes('EBIKE')) {
    return VehicleType.E_BIKE;
  }
  if (tokens.includes('EV')) return VehicleType.EV;
  if (tokens.includes('CAR')) return VehicleType.CAR;

  return null;
}

function resolveVehicleType(config: VehicleTypeConfig): VehicleTypeValue | null {
  for (const candidate of [config.vehicleType, config.type, config.name]) {
    if (!candidate) continue;

    const match = matchVehicleType(String(candidate));
    if (match) return match;
  }

  return null;
}

export default function VehicleTypeIcon({
  config,
  size = 24,
  color,
}: {
  config: VehicleTypeConfig;
  size?: number;
  color: string;
}) {
  const icon = config.icon?.trim();

  if (icon && /^https?:\/\//i.test(icon)) {
    return (
      <Image
        source={{ uri: icon }}
        style={[styles.image, { width: size, height: size }]}
        resizeMode="contain"
      />
    );
  }

  const vehicleType = resolveVehicleType(config);
  const name: IconName = vehicleType
    ? VEHICLE_ICONS[vehicleType]
    : 'steering';

  return <MaterialCommunityIcons name={name} size={size} color={color} />;
}

const styles = StyleSheet.create({
  image: {
    borderRadius: 4,
  },
});
