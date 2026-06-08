import { View, Text, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {Feather} from "@expo/vector-icons"
import {useRouter} from "expo-router"



export default function AppHeader() {
    const router = useRouter()
    return <View
        className="flex flex-1 w-full py-2  h-full bg-green-200">
        <Pressable
        onPress={() => router.push("/Home")}
        >
        <Feather name="globe" color={"#000"} size={18} />
        </Pressable>


    </View>
}
