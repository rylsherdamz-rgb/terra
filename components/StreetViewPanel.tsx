import { StyleSheet, Text, View } from "react-native";
import { WebView } from "react-native-webview";
import { buildStreetViewEmbedUrl } from "@/utils/streetView";

type StreetViewPanelProps = {
  apiKey: string | undefined;
  heading: number;
  latitude: number | null;
  longitude: number | null;
  pitch: number;
};

export function StreetViewPanel({
  apiKey,
  heading,
  latitude,
  longitude,
  pitch,
}: StreetViewPanelProps) {
  if (!apiKey) {
    return (
      <View style={[styles.container, styles.placeholder]}>
        <Text style={styles.title}>Street View unavailable</Text>
        <Text style={styles.copy}>
          Add `EXPO_PUBLIC_MAPS_KEY` with Maps Embed API and Street View enabled.
        </Text>
      </View>
    );
  }

  if (latitude == null || longitude == null) {
    return (
      <View style={[styles.container, styles.placeholder]}>
        <Text style={styles.title}>Round not ready</Text>
        <Text style={styles.copy}>Waiting for the next location to load.</Text>
      </View>
    );
  }

  const uri = buildStreetViewEmbedUrl({
    apiKey,
    heading,
    latitude,
    longitude,
    pitch,
  });

  return (
    <View style={styles.container}>
      <WebView
        allowsInlineMediaPlayback
        javaScriptEnabled
        originWhitelist={["*"]}
        source={{ uri }}
        style={styles.webview}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#111827",
    borderRadius: 24,
    height: 330,
    overflow: "hidden",
  },
  webview: {
    flex: 1,
  },
  placeholder: {
    gap: 8,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    color: "#f8fafc",
    fontSize: 20,
    fontWeight: "800",
  },
  copy: {
    color: "#cbd5e1",
    fontSize: 14,
    lineHeight: 20,
  },
});
