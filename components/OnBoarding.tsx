import { View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"


export default function OnBoarding() {
    const insets = useSafeAreaInsets()
    return <View
        style={{paddingTop : false}}
        className="flex flex-1 flex-col w-full h-screen"
    >

    </View>
}
