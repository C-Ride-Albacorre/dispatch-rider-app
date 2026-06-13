import { Fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { normalize, scale } from "@/utils/scaling";
import { Text, View } from "react-native";
import { StyleSheet } from "react-native";

export default function DriverStats({
    stats
} :{
    stats?: {
        totalDeliveries: number;
        
    }
}) {

      const { Colors } = useTheme();
    
      const styles = createStyles(Colors);
  return (
    <View style={styles.statsRow}>
      <View style={styles.statItem}>
        <Text style={styles.statValue}>{stats?.totalDeliveries ?? 0}</Text>
        <Text style={styles.statLabel}>Deliveries</Text>
      </View>

      <View style={styles.statItem}>
        <Text style={styles.statValue}>₦0</Text>
        <Text style={styles.statLabel}>Earnings</Text>
      </View>

      <View style={styles.statItem}>
        <Text style={styles.statValue}>0h</Text>
        <Text style={styles.statLabel}>Online</Text>
      </View>

      <View style={styles.statItem}>
        <Text style={styles.statValue}>₦0</Text>
        <Text style={styles.statLabel}>Tips</Text>
      </View>
    </View>
  );
}



const createStyles = (Colors: ReturnType<typeof useTheme>['Colors']) =>
  StyleSheet.create({

    
        statsRow: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          gap: scale(8),
        },
        statItem: {
          flex: 1,
          alignItems: 'center',
          paddingVertical: scale(10),
          borderRadius: scale(12),
          borderWidth: 1,
          borderColor: Colors.border,
        },
        statValue: {
          fontSize: normalize(12),
          fontFamily: Fonts.brandSemiBold,
          color: Colors.text,
        },
        statLabel: {
          fontSize: normalize(10),
          fontFamily: Fonts.brandRegular,
          color: Colors.text,
        },
    
      
  })
    