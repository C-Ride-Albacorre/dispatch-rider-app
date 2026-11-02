import { Ionicons } from '@expo/vector-icons';

export const DELETE_ACCOUNT_STEPS = 3;

export const DELETE_CONFIRMATION_PHRASE = 'delete my account';

export const DELETE_CONSEQUENCES: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  { label: 'Your driver profile and verification documents', icon: 'trash-outline' },
  { label: 'All earnings history and wallet balance', icon: 'trash-outline' },
  { label: 'Your delivery records and ratings', icon: 'trash-outline' },
  { label: 'Access to the C-Ride driver platform', icon: 'shield-outline' },
];

export const DELETE_REASONS = [
  'No longer need the account',
  'Not earning enough',
  'Too few delivery requests',
  'Found another platform',
  'Privacy concerns',
  'Other',
];
