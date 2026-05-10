

export function RandomPlaceGenerator() {
    const lat = Math.random() * 180 - 90
    const lng = Math.random() * 360 - 180
    return {
        lat,lng 
    } 
}