import { View, Text } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export default function Home() {
    const insets = useSafeAreaInsets()
    return <View
        style={{paddingTop : false}}
        className="flex flex-1 flex-col w-full h-full"
    >
        <Text>
            Home Component
        </Text>

    </View>
}
