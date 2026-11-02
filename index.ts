// Must be imported before the router so the FCM background handler is
// registered even when Android wakes the app from a closed state to deliver a
// push (headless JS, no UI rendered)
import './services/notifications/backgroundHandler';

import 'expo-router/entry';
