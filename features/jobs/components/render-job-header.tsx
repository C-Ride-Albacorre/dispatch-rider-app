import { Text, View } from 'react-native';
import { JobProps } from '../types';
import { useTheme } from '@/hooks/use-theme';
import { StyleSheet } from 'react-native';
import { normalize, scale } from '@/utils/scaling';
import { Fonts } from '@/constants/theme';

export default function RenderJobHeader({ jobs }: { jobs: JobProps[] }) {
  const { Colors } = useTheme();

  const styles = createStyles(Colors);

  return (
    <View style={styles.header}>
      <Text style={styles.title}>Available Jobs</Text>

      <Text style={[styles.subtitle, { color: Colors.success }]}>
        {jobs.length} request nearby
      </Text>
    </View>
  );
}

const createStyles = (Colors: any) =>
  StyleSheet.create({
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
     paddingVertical: scale(16),
   
    },

    title: {
      fontSize: normalize(18),
      fontFamily: Fonts.brandSemiBold,
      textAlign: 'center',
         color: Colors.text
    },
    subtitle: {
      fontSize: normalize(14),
      fontFamily: Fonts.brandRegular,
      textAlign: 'center',
    },
  });
