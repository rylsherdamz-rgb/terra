import { Text, View } from "react-native"
import MapView from "@/components/MapView"
// display games playable
function Home() {
  return (
    <View className="flex-1 w-full h-screen flex">

      <MapView />
    </View>
  )
}

export default Home