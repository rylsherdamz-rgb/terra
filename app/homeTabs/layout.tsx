import { Tabs } from "expo-router"
import {View} from "react-native"
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context"
import { headerRightComponent } from "@/components/headerComponents"

function HomeTabs() {
    const insets = useSafeAreaInsets()
  return <Tabs screenOptions={{
    tabBarStyle : {
        paddingTop : 100 + insets.top

    },
        headerStyle : {
      borderBottomRightRadius : 25
    }
  }} >
    <Tabs.Screen name="Home" 
    // options={{
    //     tabBarIcon : () => (<Feather name="home" color={}/>)
    // }} 
    />
  </Tabs>
  }

export default HomeTabs