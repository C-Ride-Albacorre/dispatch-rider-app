import { createContext, useContext } from 'react';
import {
  SharedValue,
  useAnimatedScrollHandler,
  withTiming,
} from 'react-native-reanimated';

/**
 * The fixed pixel height of the AppHeader.
 * Used both for the absolute-positioned container height
 * and as the paddingTop on each tab's ScrollView.
 */
export const HEADER_HEIGHT = 60;

interface ScrollHeaderContextValue {
  headerTranslateY: SharedValue<number>;
  lastScrollY: SharedValue<number>;
}

export const ScrollHeaderContext =
  createContext<ScrollHeaderContextValue | null>(null);

/**
 * Call in a tab screen that has a scrollable list.
 * Returns an `onScroll` handler to attach to Animated.ScrollView.
 *
 * Example:
 *   const scrollHandler = useScrollHeader();
 *   <Animated.ScrollView onScroll={scrollHandler} scrollEventThrottle={16}>
 */
export function useScrollHeader() {
  const ctx = useContext(ScrollHeaderContext);
  if (!ctx) {
    throw new Error('useScrollHeader must be used inside the (tabs) layout');
  }

  const { headerTranslateY, lastScrollY } = ctx;

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const y = event.contentOffset.y;
      const diff = y - lastScrollY.value;

      // scrolling DOWN past the header → hide
      if (diff > 4 && y > HEADER_HEIGHT) {
        headerTranslateY.value = withTiming(-HEADER_HEIGHT, { duration: 200 });
      }
      // scrolling UP → show
      else if (diff < -4) {
        headerTranslateY.value = withTiming(0, { duration: 200 });
      }

      lastScrollY.value = y;
    },
  });

  return scrollHandler;
}

/**
 * Call in screens that have NO scrollable content (e.g. jobs, active, profile).
 * Returns a reset function — call it inside useFocusEffect to ensure the
 * header is always visible when entering that tab.
 *
 * Example:
 *   const resetHeader = useHeaderReset();
 *   useFocusEffect(useCallback(() => { resetHeader(); }, []));
 */
export function useHeaderReset() {
  const ctx = useContext(ScrollHeaderContext);
  if (!ctx) {
    throw new Error('useHeaderReset must be used inside the (tabs) layout');
  }

  const { headerTranslateY, lastScrollY } = ctx;

  return () => {
    headerTranslateY.value = withTiming(0, { duration: 150 });
    lastScrollY.value = 0;
  };
}
