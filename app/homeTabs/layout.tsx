import { Tabs } from "expo-router"
import {Feather} from "@expo/vector-icons"

function HomeTabs() {
    
  return <Tabs>
    <Tabs.Screen name="Home" 
    options={{
        tabBarIcon : () => (<Feather name="home" color={}/>)
    }} 
    />
  </Tabs>
}

export default HomeTabs