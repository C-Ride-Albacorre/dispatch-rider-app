export type RoutePoint = {
  latitude: number;
  longitude: number;
};

export type NearestPointResult = {
  index: number;
  fraction: number;
  point: RoutePoint;
  distance: number;
};

const EARTH_RADIUS = 6371000;

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

/**
 * Projects a coordinate onto a line segment.
 *
 * Uses a local meter-based coordinate system rather than
 * raw latitude/longitude differences.
 */
function projectPointOnSegment(
  point: RoutePoint,
  start: RoutePoint,
  end: RoutePoint,
): {
  fraction: number;
  point: RoutePoint;
  distance: number;
} {
  const lat0 = toRadians(point.latitude);

  const cosLat = Math.cos(lat0);

  const x1 =
    toRadians(start.longitude - point.longitude) *
    EARTH_RADIUS *
    cosLat;

  const y1 =
    toRadians(start.latitude - point.latitude) *
    EARTH_RADIUS;

  const x2 =
    toRadians(end.longitude - point.longitude) *
    EARTH_RADIUS *
    cosLat;

  const y2 =
    toRadians(end.latitude - point.latitude) *
    EARTH_RADIUS;

  const dx = x2 - x1;
  const dy = y2 - y1;

  const lengthSquared = dx * dx + dy * dy;

  let fraction = 0;

  if (lengthSquared > 0) {
    fraction = (-(x1 * dx + y1 * dy)) / lengthSquared;
  }

  fraction = Math.max(0, Math.min(1, fraction));

  const projectedX = x1 + fraction * dx;
  const projectedY = y1 + fraction * dy;

  const distance = Math.sqrt(
    projectedX * projectedX + projectedY * projectedY,
  );

  const latitude =
    start.latitude +
    (end.latitude - start.latitude) * fraction;

  const longitude =
    start.longitude +
    (end.longitude - start.longitude) * fraction;

  return {
    fraction,
    point: {
      latitude,
      longitude,
    },
    distance,
  };
}

/**
 * Finds the closest point on a route.
 *
 * startIndex allows us to avoid repeatedly scanning the entire
 * route from the beginning as the driver moves forward.
 */
export function findNearestPointOnPolyline(
  polyline: RoutePoint[],
  driverLocation: RoutePoint,
  startIndex = 0,
): NearestPointResult | null {
  if (polyline.length === 0) {
    return null;
  }

  if (polyline.length === 1) {
    return {
      index: 0,
      fraction: 0,
      point: polyline[0],
      distance: distanceBetweenPoints(
        driverLocation,
        polyline[0],
      ),
    };
  }

  let minDistance = Infinity;
  let bestIndex = startIndex;
  let bestFraction = 0;
  let bestPoint = polyline[startIndex];

  const safeStartIndex = Math.max(
    0,
    Math.min(startIndex, polyline.length - 2),
  );

  for (let i = safeStartIndex; i < polyline.length - 1; i++) {
    const result = projectPointOnSegment(
      driverLocation,
      polyline[i],
      polyline[i + 1],
    );

    if (result.distance < minDistance) {
      minDistance = result.distance;
      bestIndex = i;
      bestFraction = result.fraction;
      bestPoint = result.point;
    }
  }

  return {
    index: bestIndex,
    fraction: bestFraction,
    point: bestPoint,
    distance: minDistance,
  };
}

export function distanceBetweenPoints(
  a: RoutePoint,
  b: RoutePoint,
): number {
  const lat1 = toRadians(a.latitude);
  const lat2 = toRadians(b.latitude);

  const deltaLat = lat2 - lat1;
  const deltaLng =
    toRadians(b.longitude - a.longitude);

  const sinLat = Math.sin(deltaLat / 2);
  const sinLng = Math.sin(deltaLng / 2);

  const value =
    sinLat * sinLat +
    Math.cos(lat1) *
      Math.cos(lat2) *
      sinLng *
      sinLng;

  return (
    EARTH_RADIUS *
    2 *
    Math.atan2(Math.sqrt(value), Math.sqrt(1 - value))
  );
}

/**
 * Trims the route so that it starts exactly at the driver's
 * projected position on the route.
 */
export function trimPolyline(
  polyline: RoutePoint[],
  driverLocation: RoutePoint,
  startIndex = 0,
): {
  coordinates: RoutePoint[];
  index: number;
  distance: number;
} {
  if (polyline.length < 2) {
    return {
      coordinates: polyline,
      index: 0,
      distance: 0,
    };
  }

  const nearest = findNearestPointOnPolyline(
    polyline,
    driverLocation,
    startIndex,
  );

  if (!nearest) {
    return {
      coordinates: polyline,
      index: 0,
      distance: 0,
    };
  }

  return {
    coordinates: [
      nearest.point,
      ...polyline.slice(nearest.index + 1),
    ],
    index: nearest.index,
    distance: nearest.distance,
  };
}