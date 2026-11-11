import { Platform } from 'react-native';

export const ColorScheme = {
  light: {
    // Brand
    primary: '#D4AF37',
    // Text and icons drawn on primary
    onPrimary: '#1A1A1A',
    primaryLight: '#D4AF3733',
    primaryExtraLight: '#D4AF371A',

    // Backgrounds
    background: '#FFFFFF',
    backgroundElement: '#F0F0F0',
    backgroundSelected: '#D4AF37',
    backgroundSecondary: '#F8F9FA',
    backgroundTertiary: '#F1F3F5',

    // Text
    text: '#1A1A1A',
    textSecondary: '#555555',
    textMuted: '#8A8A8A',

    // UI
    border: '#E8E8E8',
    inputBackground: '#F5F6FA',
    card: '#FFFFFF',

    // Status
    success: '#10B981',
    successLight: '#10B98133',
    successExtraLight: '#10B9811A',

    error: '#EF4444',
    errorLight: '#FEF2F2',
    errorExtraLight: '#EF44441A',

    warning: '#FFA500',
    warningLight: '#FFF4E5',
    warningExtraLight: '#FFA5001A',

    info: '#17A2B8',
    infoLight: '#D6F4F8',
    infoExtraLight: '#17A2B81A',

    // Misc
    shadow: 'rgba(0,0,0,0.08)',
    overlay: 'rgba(0,0,0,0.4)',
    glass: 'rgba(255,255,255,0.06)',
    glassBorder: 'rgba(255,255,255,0.14)',

    // Neutral
    dark: '#2C3E50',
    light: '#ECF0F1',
    white: '#FFFFFF',
    black: '#000000',

    googleBlue: '#4285F4',
  },
  dark: {
    // Brand
    primary: '#E2B93B',
    // Text and icons drawn on primary
    onPrimary: '#1A1A1A',
    primaryLight: '#E2B93B33',
    primaryExtraLight: '#E2B93B1A',

    // Backgrounds
    background: '#0F1115',
    backgroundElement: '#1A1F2E',
    backgroundSelected: '#E2B93B',
    backgroundSecondary: '#161A20',
    backgroundTertiary: '#1D222A',

    // Text
    text: '#F5F5F5',
    textSecondary: '#B8BCC4',
    textMuted: '#858B96',

    // UI
    border: '#292E37',
    inputBackground: '#191E26',
    card: '#151922',

    // Status
    success: '#34D399',
    successLight: '#063B2D',
    successExtraLight: '#062A22',

    error: '#F87171',
    errorLight: '#3B1719',
    errorExtraLight: '#291113',

    warning: '#FBBF24',
    warningLight: '#3A2C0A',
    warningExtraLight: '#292007',

    info: '#38BDF8',
    infoLight: '#082F49',
    infoExtraLight: '#061F30',

    // Misc
    shadow: 'rgba(0,0,0,0.5)',
    overlay: 'rgba(0,0,0,0.7)',
    glass: 'rgba(255,255,255,0.06)',
    glassBorder: 'rgba(255,255,255,0.1)',

    // Neutral
    dark: '#0B0F14',
    light: '#E5E7EB',
    white: '#FFFFFF',
    black: '#000000',

    googleBlue: '#4285F4',
  },
} as const;

export const LightColors = ColorScheme.light;
export const DarkColors = ColorScheme.dark;

export const Colors = ColorScheme.light;

export type ThemeColor = keyof typeof ColorScheme.light &
  keyof typeof ColorScheme.dark;

export const Fonts = {
  brand: 'Poppins',
  brandRegular: 'Poppins_400Regular',
  brandMedium: 'Poppins_500Medium',
  brandSemiBold: 'Poppins_600SemiBold',
  brandBold: 'Poppins_700Bold',
};

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
