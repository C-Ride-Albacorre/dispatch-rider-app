import '../global.css';

import { Slot } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ReactQueryProvider from './providers/react-query-provider';

export default function RootLayout() {
  return (
    <GestureHandlerRootView className="flex-1">
      <ReactQueryProvider>
        <Slot />
      </ReactQueryProvider>
    </GestureHandlerRootView>
  );
}
