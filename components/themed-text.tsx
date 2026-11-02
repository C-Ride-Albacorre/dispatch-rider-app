import { Platform, StyleSheet, Text, type TextProps } from 'react-native';

import { Colors, Fonts, ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ThemedTextProps = TextProps & {
  type?:
    | 'default'
    | 'title'
    | 'small'
    | 'smallBold'
    | 'subtitle'
    | 'link'
    | 'linkPrimary'
    | 'code';
  themeColor?: ThemeColor;
};

export function ThemedText({
  style,
  type = 'default',
  themeColor,
  ...rest
}: ThemedTextProps) {
  const {Colors} = useTheme();


  const styles = createStyles(Colors);

  

  return (
    <Text
      style={[
        { color: Colors[themeColor ?? 'text'] },
        type === 'default' && styles.default,
        type === 'title' && styles.title,
        type === 'small' && styles.small,
        type === 'smallBold' && styles.smallBold,
        type === 'subtitle' && styles.subtitle,
        type === 'link' && styles.link,
        type === 'linkPrimary' && styles.linkPrimary,
        type === 'code' && styles.code,
        style,
      ]}
      {...rest}
    />
  );
}

const createStyles = (Colors:  any) => StyleSheet.create({
  small: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: Fonts.brandRegular,
  },
  smallBold: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: Fonts.brandBold,
  },
  default: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: Fonts.brandRegular,
  },
  title: {
    fontSize: 48,
    fontFamily: Fonts.brandMedium,
    lineHeight: 52,
  },
  subtitle: {
    fontSize: 32,
    lineHeight: 44,
    fontFamily: Fonts.brandMedium,
  },
  link: {
    lineHeight: 30,
    fontSize: 14,
    fontFamily: Fonts.brandRegular,
  },
  linkPrimary: {
    lineHeight: 30,
    fontSize: 14,
    fontFamily: Fonts.brandRegular,
    color: Colors.primary,
  },
  code: {
    fontSize: 12,
  },
});
