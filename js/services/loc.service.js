import { storageService } from '../services/storage.service.js'
import { utilService } from '../services/util.storage.js'

export const locService = {
    getLocs,
    createLocation
}
const STORAGE_KEY='locationsDB'
const locs = [
    { name: 'Greatplace', lat: 32.047104, lng: 34.832384 }, 
    { name: 'Neveragain', lat: 32.047201, lng: 34.832581 }
]
function createLocation(name,position){
    const location={id:utilService.makeId(),
        name,
        lat:position.lat,
        lng:position.lng,
        Weather:'',
        createdAt:Date.now(),
        updatedAt:Date.now()
    }
    locs.push(location)
    storageService.saveToStorage(STORAGE_KEY,locs)

}
function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(locs)
        }, 2000)
    })
}


