import { Text, View } from "react-native"
import MapView from "@/components/MapView"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import AppBar from "@/components/AppBar"
// display games playable
function Home() {
  const inset = useSafeAreaInsets()
  return (
    <View style={{paddingTop : inset.top }}  className="flex-1 w-full h-screen flex">
      <AppBar />

    </View>
  )
}

export default Home