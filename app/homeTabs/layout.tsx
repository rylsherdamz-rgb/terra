import { Tabs } from "expo-router"
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context"

function HomeTabs() {
    const insets = useSafeAreaInsets()
  return <Tabs screenOptions={{
    tabBarStyle : {
        paddingTop : 100 + insets.top
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