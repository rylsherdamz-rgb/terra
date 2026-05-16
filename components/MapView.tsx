import NativeMapView, {
  MapPressEvent,
  Marker,
  PROVIDER_GOOGLE,
  Region,
} from "react-native-maps";
import { StyleSheet, View } from "react-native";
import type { GuessLocation } from "@/types/geogame";

type GameMapViewProps = {
  actualGuess: GuessLocation | null;
  editable: boolean;
  initialRegion?: Region;
  onSelectGuess: (guess: GuessLocation) => void;
  selectedGuess: GuessLocation | null;
};

const DEFAULT_WORLD_REGION: Region = {
  latitude: 20,
  latitudeDelta: 110,
  longitude: 0,
  longitudeDelta: 110,
};

export default function GameMapView({
  actualGuess,
  editable,
  initialRegion = DEFAULT_WORLD_REGION,
  onSelectGuess,
  selectedGuess,
}: GameMapViewProps) {
  const onPress = (event: MapPressEvent) => {
    if (!editable) {
      return;
    }

    onSelectGuess(event.nativeEvent.coordinate);
  };

  return (
    <View style={styles.shell}>
      <NativeMapView
        initialRegion={initialRegion}
        onPress={onPress}
        provider={PROVIDER_GOOGLE}
        rotateEnabled={false}
        scrollEnabled
        style={styles.map}
      >
        {selectedGuess ? (
          <Marker
            coordinate={selectedGuess}
            pinColor="#f97316"
            title="Your guess"
          />
        ) : null}
        {actualGuess ? (
          <Marker
            coordinate={actualGuess}
            pinColor="#22c55e"
            title="Actual location"
          />
        ) : null}
      </NativeMapView>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    borderRadius: 20,
    height: 290,
    overflow: "hidden",
  },
  map: {
    flex: 1,
  },
});
