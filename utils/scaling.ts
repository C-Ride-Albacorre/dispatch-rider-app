import { Dimensions, PixelRatio } from 'react-native';

const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

export const CONTENT_MAX_WIDTH = 600;

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
  return Math.round(PixelRatio.roundToNearestPixel(moderateScale(size)));
}
