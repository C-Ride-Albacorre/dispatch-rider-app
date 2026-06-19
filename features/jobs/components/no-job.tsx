import { Fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { normalize, scale } from "@/utils/scaling";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

export default function NoJobs() {

      const { Colors } = useTheme();
    
      const styles = createStyles(Colors);


    return  <View style={styles.emptyContainer}>
          <View
            style={[
              styles.iconWrapper,
              { backgroundColor: Colors.backgroundTertiary ?? '#F7FAFC' },
            ]}
          >
            <Ionicons
              name="bicycle-outline"
              size={scale(36)}
              color={Colors.textMuted}
            />
          </View>
          <View style={styles.emptyTextGroup}>
            <Text style={[styles.title, { color: Colors.textSecondary }]}>
              No Jobs Available
            </Text>
            <Text style={[styles.subtitle, { color: Colors.textMuted }]}>
              Please check back later.
            </Text>
          </View>
        </View>
}

const createStyles = (Colors: any) =>
  StyleSheet.create({
     emptyContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: scale(100),
    },

    
        iconWrapper: {
          width: scale(72),
          height: scale(72),
          borderRadius: scale(36),
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: scale(16),
        },
        emptyTextGroup: {
          alignItems: 'center',
          gap: scale(4),
        },
        title: {
          fontSize: normalize(18),
          fontFamily: Fonts.brandSemiBold,
          textAlign: 'center',
        },
        subtitle: {
          fontSize: normalize(14),
          fontFamily: Fonts.brandRegular,
          textAlign: 'center',
        },
    
  })