import { ColorScheme } from '@/constants/theme';
import { useColorScheme } from 'react-native';

export function useTheme() {
  const scheme = useColorScheme();

  const Colors = scheme === 'dark' ? ColorScheme.dark : ColorScheme.light;

  return { Colors, isDark: scheme === 'dark' };
}
