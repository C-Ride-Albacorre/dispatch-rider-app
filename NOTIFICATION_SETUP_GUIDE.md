# Notification Sound & iOS Setup Guide

## 1. Add Android Notification Sound

### Step 1: Create Android Directories (if not exists)

```bash
mkdir -p android/app/src/main/res/raw
```

### Step 2: Add Sound File

Copy a notification sound file (MP3, WAV, or OGG format) to:

```
android/app/src/main/res/raw/notification.mp3
```

**Sound recommendations:**

- Short duration: 1-3 seconds
- MP3 or OGG format for small file size
- ~100-300 KB recommended
- No silence at start

**Where to find free sounds:**

- Freesound.org
- Zapsplat.com
- Notification sound libraries online

### Step 3: Rebuild Android

```bash
eas build --platform android --profile preview
```

Or locally:

```bash
expo run:android
```

---

## 2. iOS Notification Sound Setup

### Option A: Via EAS (Recommended)

If using EAS Build, sounds are automatically bundled. Ensure `app.json` has:

```json
{
  "expo": {
    "plugins": [
      [
        "@react-native-firebase/messaging",
        {
          "ios_auto_register_for_remote_messages": true
        }
      ]
    ]
  }
}
```

### Option B: Via Xcode

If building locally:

1. Open `ios/CRideDriverApp.xcworkspace` in Xcode
2. Select target → Build Phases → Copy Bundle Resources
3. Click `+` and add your sound file
4. Ensure file is in `.plist` as remote notification capability

### Required iOS Configuration

In `app.json`:

```json
{
  "expo": {
    "ios": {
      "infoPlist": {
        "UIBackgroundModes": ["remote-notification"],
        "NSLocalizedDescription": "Remote notifications"
      }
    }
  }
}
```

---

## 3. Verify APNs Certificate (Backend Critical!)

This is the **most common reason iOS doesn't receive notifications**.

### Check in Firebase Console:

1. Go to Firebase Console → Your Project
2. Project Settings → Cloud Messaging → iOS app configuration
3. Verify:
   - ✅ APNs Authentication Key uploaded
   - ✅ Key ID matches
   - ✅ Team ID correct

### If Missing:

You need to:

1. Create an Apple App ID for `com.albacorre.cridedriver`
2. Create APNs key in Apple Developer Account
3. Upload to Firebase Console

**This is a backend/Apple Developer setup - ask your backend team if not done!**

---

## 4. Test Notifications

### Android Test:

```bash
# Build and install
eas build --platform android --profile preview --local

# Then test:
# 1. Close app completely (swipe from recent apps)
# 2. Send test FCM notification from Firebase Console
# 3. Notification should appear in notification panel
# 4. Sound should play
```

### iOS Test:

```bash
# Build and install
eas build --platform ios --profile preview --local

# Then test:
# 1. Close app completely
# 2. Send test FCM notification from Firebase Console
# 3. Notification should appear on home screen
# 4. Sound should play
```

---

## 5. Troubleshooting

### Android Sound Not Playing:

- Verify `android/app/src/main/res/raw/notification.mp3` exists
- Check Android notification channel volume isn't muted
- Ensure `setNotificationChannelAsync()` called before notifications arrive
- Check app notification settings: Settings → Apps → C-Ride Driver → Notifications → Volume

### iOS Not Receiving:

- ✅ Verify APNs certificate uploaded to Firebase
- ✅ Check iPhone Settings → C-Ride Driver → Notifications enabled
- ✅ Verify Apple Push Notifications permission granted
- ✅ Check device token was sent to backend

### Notifications Only Work When App Open:

- Background handler not working
- Android channels not created
- Missing iOS remote notification capability

---

## 6. Current App.json Configuration

Your Firebase plugin is already configured for iOS auto-registration:

```json
[
  "@react-native-firebase/messaging",
  {
    "ios_auto_register_for_messages": true
  }
]
```

This is correct! Just ensure APNs certificate is uploaded.

---

## Summary of Changes Made

✅ Created `services/notifications/setupNotificationChannels.ts`

- Creates 3 Android notification channels: delivery_requests, messages, general
- Sets up sound, vibration, LED configuration
- Only runs on Android (safe on all platforms)

✅ Updated `app/_layout.tsx`

- Calls `setupNotificationChannels()` at app startup
- Enhanced background message handler to display notifications
- Now uses `Notifications.scheduleNotificationAsync()` for closed app state

✅ Updated `services/notifications/initializeNotifications.ts`

- Calls channel setup when user grants permission

**Next Steps:**

1. Add `notification.mp3` to `android/app/src/main/res/raw/`
2. Rebuild: `eas build --platform android --profile preview`
3. Test: Close app, send FCM notification, verify it appears with sound
4. For iOS: Verify APNs certificate in Firebase Console
