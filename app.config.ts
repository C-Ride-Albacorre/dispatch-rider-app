import { ConfigContext, ExpoConfig } from 'expo/config';


const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...(config as ExpoConfig),

  android: {
    ...config.android,
    config: {
      ...config.android?.config,
      googleMaps: { apiKey: GOOGLE_MAPS_API_KEY },
    },
  },

  plugins: (config.plugins ?? []).map((plugin) =>
    plugin === 'react-native-maps'
      ? [
          'react-native-maps',
          {
            iosGoogleMapsApiKey: GOOGLE_MAPS_API_KEY,
            androidGoogleMapsApiKey: GOOGLE_MAPS_API_KEY,
          },
        ]
      : plugin,
  ),
});
