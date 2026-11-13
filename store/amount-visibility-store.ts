import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { create } from 'zustand';

const STORAGE_KEY = 'hide_amounts';

const isWeb = Platform.OS === 'web';

async function readHidden() {
  try {
    const value = isWeb
      ? localStorage.getItem(STORAGE_KEY)
      : await SecureStore.getItemAsync(STORAGE_KEY);
    return value === '1';
  } catch {
    return false;
  }
}

async function writeHidden(hidden: boolean) {
  try {
    const value = hidden ? '1' : '0';
    if (isWeb) localStorage.setItem(STORAGE_KEY, value);
    else await SecureStore.setItemAsync(STORAGE_KEY, value);
  } catch {}
}

type AmountVisibilityState = {
  /** When true, money figures on home and earnings are masked. */
  hidden: boolean;
  toggle: () => void;
};

/**
 * Rider's "hide my figures" preference, shared by the home and earnings
 * screens so toggling it on one applies to both, and kept across app restarts.
 */
export const useAmountVisibility = create<AmountVisibilityState>((set, get) => ({
  hidden: false,

  toggle: () => {
    const hidden = !get().hidden;
    set({ hidden });
    writeHidden(hidden);
  },
}));

readHidden().then((hidden) => {
  if (hidden) useAmountVisibility.setState({ hidden });
});

export const MASKED_AMOUNT = '₦ ••••';
