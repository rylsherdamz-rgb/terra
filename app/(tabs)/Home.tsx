import { Text, View } from "react-native"
import { useRef } from "react"
import MapView from "@/components/MapView"
import BottomSheet from "@gorhom/bottom-sheet"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import AppBar from "@/components/AppBar"
import CustomBottomSheet from "@/components/CustomBottomSheet"
// display games playable
function Home() {
  const inset = useSafeAreaInsets()
  const BottomSheetRef = useRef<BottomSheet>(null)


  return (
    <View style={{paddingTop : inset.top , paddingBottom : inset.bottom}}  className="flex-1 w-full h-screen flex">
      <AppBar />
    </View>
  )
}

export default Home