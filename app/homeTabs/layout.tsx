import { Tabs } from "expo-router"
import {View} from "react-native"
import {Feather} from "@expo/vector-icons"
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context"
import AppBar from "@/components/AppBar"

function HomeTabs() {
    const insets = useSafeAreaInsets()
  return <Tabs screenOptions={{
    tabBarStyle : {
        paddingTop : 100 + insets.top

    },
        headerStyle : {
    }
  }} >
    <AppBar />
    <Tabs.Screen name="Home" 
    options={{
        tabBarIcon : () => (<Feather name="home" color="#0000" size={18}/>)
    }} 
    />
  </Tabs>
  }

export default HomeTabs