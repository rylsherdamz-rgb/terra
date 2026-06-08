import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "react-native";
import "../globals.css";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar barStyle={"dark-content"} backgroundColor="#020617" />
            <Stack screenOptions={{headerShown : false}} /> </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
