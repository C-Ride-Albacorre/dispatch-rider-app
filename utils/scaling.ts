import { Dimensions, PixelRatio } from 'react-native';

const guidelineBaseWidth = 375; // iPhone 11 Pro width
const guidelineBaseHeight = 812; // iPhone 11 Pro height

// Screens render inside a centered column capped at this width (see the
// route group layouts), so scale against the column, not the full window.
// Without this, an iPad's 1024pt+ window inflates every size ~2.7x.
export const CONTENT_MAX_WIDTH = 600;

// Most styles are built once at module load via StyleSheet.create, so the
// factor can't follow live resizes (iPad multitasking, iPhone Duo fold/unfold).
// Clamping keeps the size launched with close to any size it resizes to.
const MIN_FACTOR = 0.85;
const MAX_FACTOR = 1.15;

const clamp = (value: number) =>
  Math.min(MAX_FACTOR, Math.max(MIN_FACTOR, value));

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');
const contentWidth = Math.min(windowWidth, CONTENT_MAX_WIDTH);

const widthFactor = clamp(contentWidth / guidelineBaseWidth);
const heightFactor = clamp(windowHeight / guidelineBaseHeight);

export function scale(size: number) {
  return widthFactor * size;
}

export function verticalScale(size: number) {
  return heightFactor * size;
}

export function moderateScale(size: number, factor = 0.5) {
  return size + (scale(size) - size) * factor;
}

export function normalize(size: number) {
  // Use moderateScale for font sizes
  return Math.round(PixelRatio.roundToNearestPixel(moderateScale(size)));
}
