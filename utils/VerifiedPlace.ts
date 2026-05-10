import { RandomPlaceGenerator } from "./RandomPlaceGenerator";
// call the streetView and look at the data 

let invalidCoordinatesCount = 0;

// upon gettin the data of the coordinates append and add into the mmkv

type Coordinates = {
    lat : number, 
    lng : number
}

let ValidCoordinates: Array<Coordinates> = []




// call this a lot times to get more data 
export async function hasStreetView(lat : number, lng : number) {
    try {
    const apiKey = process.env.EXPO_PUBLIC_MAPS_KEY
    const url =
    `https://maps.googleapis.com/maps/api/streetview/metadata` +
    `?location=${lat},${lng}` +
    `&key=${apiKey}`;

    const respone = await fetch(url);
    const data = await respone.json()

// add verification logic

    if (data.status === "OK") {
    // appending Coordinates    
        ValidCoordinates.push({lat, lng})
    } else {
        return invalidCoordinatesCount++;
    }

    
    } catch (err) {
        // log the erro message to monitor        

    }

}


// add into a array to use math random to choose which is the location

export default async  function StartFind() {
    setInterval(() => {
        const {lat, lng}= RandomPlaceGenerator()        
        const request = hasStreetView(lat, lng) 
    }, 1000)
}



// example usage create a unified function to all this

