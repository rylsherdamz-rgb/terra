type StreetViewParams = {
  apiKey: string;
  heading: number;
  latitude: number;
  longitude: number;
  pitch: number;
};

export function buildStreetViewEmbedUrl({
  apiKey,
  heading,
  latitude,
  longitude,
  pitch,
}: StreetViewParams) {
  return (
    "https://www.google.com/maps/embed/v1/streetview" +
    `?key=${encodeURIComponent(apiKey)}` +
    `&location=${latitude},${longitude}` +
    `&heading=${heading}` +
    `&pitch=${pitch}` +
    "&fov=80"
  );
}
