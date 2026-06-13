import Button from "@/components/ui/buttons/button";
import { Colors, Fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { normalize, scale } from "@/utils/scaling";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, View } from "react-native";

export default function NoDelivery() {

  const { Colors, isDark } = useTheme();

  const styles = createStyles(Colors);


  return (
    <View style={styles.noDeliveryContainer}>
      <Ionicons name="bicycle-outline" size={32} color={Colors.textSecondary} />

      <Text style={styles.title}>No Active Deliveries</Text>

      <Text style={styles.message}>
        You have no active deliveries at the moment. Check back later for new
        delivery opportunities!
      </Text>

      <Button
        variant="green"
        size="md"
        leftIcon={
          <Ionicons name="navigate-outline" size={16} color={isDark ? Colors.text : Colors.background  } />
        }
      >
        Search for Deliveries
      </Button>
    </View>
  );
}


const createStyles = (Colors: any) => StyleSheet.create({
    noDeliveryContainer: {
    paddingVertical: scale(24),
    paddingHorizontal: scale(16),
       backgroundColor: Colors.inputBackground,

    borderRadius: scale(12),
    alignItems: 'center',
    gap: scale(14),
  },
  title: {
    fontSize: normalize(16),
    fontFamily: Fonts.brandMedium,
    color: Colors.text,
  },
  message: {
    fontSize: normalize(12),
    color: Colors.textSecondary,
    fontFamily: Fonts.brandRegular,
    textAlign: 'center',
  },

})