import { RandomPlaceGenerator } from "./RandomPlaceGenerator";
// call the streetView and look at the data 



// call this a lot times to get more data 
export async function hasStreetView(lat : string, lng : string) {
    const apiKey = process.env.EXPO_PUBLIC_MAPS_KEY
    const url =
    `https://maps.googleapis.com/maps/api/streetview/metadata` +
    `?location=${lat},${lng}` +
    `&key=${apiKey}`;

    const respone = await fetch(url);
    const data = await respone.json()

// add 
    
    return data
}



// example usage create a unified function to all this
const {lat, lng} = RandomPlaceGenerator()