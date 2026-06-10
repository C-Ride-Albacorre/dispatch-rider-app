import { useColorScheme } from 'react-native';
import { LightColors, DarkColors } from '../constants/theme';

export function useTheme() {
  const scheme = useColorScheme();

  const Colors = scheme === 'dark' ? DarkColors : LightColors;

  return {
    Colors,
    isDark: scheme === 'dark',
  };
}
