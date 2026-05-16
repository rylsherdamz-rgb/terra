import * as ImagePicker from "expo-image-picker"
import { Alert } from "react-native"
import { useState } from "react"



export default function useImagePicker() {

    const [image, setImage] = useState<ImagePicker.ImagePickerResult | null>(null)


    const pickImage = async () => {

        const permissionResult =  await ImagePicker.requestMediaLibraryPermissionsAsync()

         if (permissionResult.granted === false) {
            alert("Permission to camera roll is required")

        }


    }







    return {

    }
}
