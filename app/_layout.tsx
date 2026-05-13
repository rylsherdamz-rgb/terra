import { Stack } from "expo-router";
import "../globals.css"
import {GestureHandlerRootView} from "react-native-gesture-handler"
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar, View, Text } from "react-native";
import { Slot } from "expo-router";
import {ColorThemeProvider} from "@/context/ThemeContext" 

export default function RootLayout() {

  return <GestureHandlerRootView style={{flex : 1}}>
    <SafeAreaProvider>
  <ColorThemeProvider>
  <StatusBar barStyle={"dark-content"}  />
  <Stack screenOptions={{
  headerShown : false 


  }}  />
  </ColorThemeProvider>
    </SafeAreaProvider>
  </GestureHandlerRootView> 
}
