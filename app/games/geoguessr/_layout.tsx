import { Stack } from "expo-router";
import { GeoGameProvider } from "@/games/geoguessr/GeoGameContext";

export default function GeoGuessrLayout() {
  return (
    <GeoGameProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#020617" },
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="lobby" />
        <Stack.Screen name="play" />
        <Stack.Screen name="result" />
      </Stack>
    </GeoGameProvider>
  );
}