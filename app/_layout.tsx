import { Stack } from "expo-router";
import "../globals.css"
import {GestureHandlerRootView} from "react-native-gesture-handler"
import {ColorThemeProvider} from "@/context/ThemeContext" 

export default function RootLayout() {
  return <GestureHandlerRootView style={{flex : 1}}>
  <ColorThemeProvider>
  <Stack />
  </ColorThemeProvider>
  </GestureHandlerRootView> 
}
