export function formatDistance(distanceMeters: number) {
  if (distanceMeters >= 1000) {
    return `${(distanceMeters / 1000).toFixed(1)} km`;
  }

  return `${Math.round(distanceMeters)} m`;
}

export function formatPoints(points: number) {
  return `${points.toLocaleString()} pts`;
}
