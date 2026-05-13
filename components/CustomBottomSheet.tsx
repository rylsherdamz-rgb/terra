import { View, Text } from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet" 
import { ForwardedRef, useCallback, useMemo, useRef } from "react";

interface CustomBottomSheetProp {
    bottomSheetRef : React.RefObject<BottomSheet | null> 
}

export default function CustomBottomSheet({bottomSheetRef} : CustomBottomSheetProp) {

    const handleChanges = useCallback((index : number) => {

    }, [])

    const snapPoints = useMemo(() => ["65%", "100%"], [])
    return <BottomSheet
    ref={bottomSheetRef}
    snapPoints={snapPoints}
    onChange={handleChanges}
    index={-1}
    enablePanDownToClose
    >
        <BottomSheetView>
            <Text>Hello</Text>
        </BottomSheetView>
    </BottomSheet>
}