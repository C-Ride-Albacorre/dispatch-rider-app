import { Text, View } from "react-native";

export default function ErrorMessage({ message }: { message: string }) {
  return (
    <View style={{
      backgroundColor: '#F8D7DA',
      padding: 10,
      borderRadius: 5,
      marginBottom: 10,
    }} role="alert">
      <Text style={{ color: '#721C24', fontSize: 14 }}>{message}</Text>
    </View>
  );
}