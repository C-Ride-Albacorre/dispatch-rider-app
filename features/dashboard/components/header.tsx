import { Colors, Fonts } from '@/constants/theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import {
  Image,
  Modal,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function DashboardHeader() {
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const [visible, setVisible] = useState(false);

  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Image
          source={require('@/assets/images/c-ride.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <View style={styles.profileContainer}>
          <View>
            <TouchableOpacity
              style={styles.notificationButton}
              onPress={() => setVisible(true)}
            >
              <Ionicons
                name="notifications-outline"
                size={24}
                color={Colors.textSecondary}
              />

              <View style={styles.dot}></View>
            </TouchableOpacity>

            <Modal transparent visible={visible} animationType="fade">
              <View style={styles.overlay}>
                <View style={styles.alertBox}>
                  <View style={styles.header}>
                    {/* This is your notification dot */}
                    <View style={styles.dot} />
                    <Text style={styles.title}>Update Available</Text>
                  </View>
                  <Text style={styles.message}>
                    A new version of the app is ready.
                  </Text>
                  <TouchableOpacity
                    onPress={() => setVisible(false)}
                    style={styles.button}
                  >
                    <Text style={styles.buttonText}>Dismiss</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>

          <View>
            <Image
              source={require('@/assets/images/rider-image.jpg')}
              style={styles.profileImage}
              resizeMode="contain"
            />
          </View>
        </View>
      </View>

      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>Status</Text>
        <Switch
          trackColor={{ false: Colors.light, true: Colors.success }}
          thumbColor={isEnabled ? Colors.background : Colors.light}
          ios_backgroundColor={Colors.light}
          onValueChange={toggleSwitch}
          value={isEnabled}
          style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },

  profileContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 20,
  },

  logo: {
    width: 80,
    height: 80,
    objectFit: 'contain',
  },

  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },

  statusText: {
    fontSize: 14,
    fontFamily: Fonts.brandMedium,
    color: Colors.textSecondary,
    marginRight: 4,
  },

  profileImage: {
    width: 44,
    height: 44,
    borderRadius: 200,
    objectFit: 'cover',
  },

  notificationButton: {
    position: 'relative',
  },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertBox: {
    width: 280,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
  },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF3B30',
    marginRight: 8,
    position: 'absolute',
    top: -6,
    right: -10,
  },
  title: { fontWeight: 'bold', fontSize: 18 },
  message: { color: '#666', marginBottom: 20 },
  button: { alignSelf: 'flex-end' },
  buttonText: { color: '#007AFF', fontWeight: '600' },
});
