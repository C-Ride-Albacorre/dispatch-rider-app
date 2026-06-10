import Button from "@/components/ui/buttons/button";
import { Colors, Fonts } from "@/constants/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, View } from "react-native";

export default function NoDelivery() {
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
        leftIcon={
          <Ionicons name="search-outline" size={16} color={Colors.text} />
        }
      >
        Search for Deliveries
      </Button>
    </View>
  );
}


const styles = StyleSheet.create({
    noDeliveryContainer: {
    padding: 24,
    backgroundColor: Colors.inputBackground,
    borderRadius: 12,
    alignItems: 'center',
    gap: 14,
    marginTop: 20,
  },
  title: {
    fontSize: 20,
    fontFamily: Fonts.brandSemiBold,
    color: Colors.textSecondary,
  },
  message: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontFamily: Fonts.brandRegular,
    textAlign: 'center',
  },
})