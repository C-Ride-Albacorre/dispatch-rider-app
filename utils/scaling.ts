import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const guidelineBaseWidth = 375; // iPhone 11 Pro width
const guidelineBaseHeight = 812; // iPhone 11 Pro height

export function scale(size: number) {
  return (SCREEN_WIDTH / guidelineBaseWidth) * size;
}

export function verticalScale(size: number) {
  return (SCREEN_HEIGHT / guidelineBaseHeight) * size;
}

export function moderateScale(size: number, factor = 0.5) {
  return size + (scale(size) - size) * factor;
}

export function normalize(size: number) {
  // Use moderateScale for font sizes
  return Math.round(PixelRatio.roundToNearestPixel(moderateScale(size)));
}
