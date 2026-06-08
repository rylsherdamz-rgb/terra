import { Tabs } from "expo-router"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Feather } from "@expo/vector-icons"
import { Pressable } from "react-native"
export default function TabsLayout() {
    const Color = "#000000"
    const insets = useSafeAreaInsets()
    return <Tabs
    screenOptions={{
        headerLeft : () => (<Pressable className=" px-5  ">

           <Feather name="menu" size={24} color={"#000000"} />
            </Pressable>
        ),
        headerTitle : "",
        headerRight : () => (<Pressable className=" h-full flex px-5 justify-center">
           <Feather name="more-horizontal" size={24} color={"#000000"} />
            </Pressable>
        ),
        headerStyle : {
                marginTop: insets.top,
                paddingBottom : insets.bottom,
                height : 40 + insets.top

            }
        }}
    >

        <Tabs.Screen name="Home" options={{
            title : "Home",
            tabBarIcon :  ({Color, focused}) =>  {
                return <Feather name="home" color={Color} size={24} />
            },

        }} />




    </Tabs>

}
