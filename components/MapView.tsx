import { useRef } from "react"
import { View, Text } from "react-native"
import MapView, {Marker} from "react-native-maps"



export default function MapViewComponent() {
    const MapViewRef = useRef<MapView>(null)
    return <View  className="w-full h-full ">
        <MapView ref={MapViewRef}initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }} className="flex flex-1">
        </MapView>
    </View>
}