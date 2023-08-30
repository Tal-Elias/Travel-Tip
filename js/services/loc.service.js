import { storageService } from './storage.service'

export const locService = {
    getLocs
}

const locs = [
    { name: 'Greatplace', lat: 32.047104, lng: 34.832384 }, 
    { name: 'Neveragain', lat: 32.047201, lng: 34.832581 }
]
function createLocation(name,position){
    const loc={id:makeId(),
        name,
        lat:position.lat,
        lat:position.lng,
        Weather:weather,
        createdAt:Date.now(),
        updatedAt:Date.now()

    }
}
function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(locs)
        }, 2000)
    })
}


