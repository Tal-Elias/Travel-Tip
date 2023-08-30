import { storageService } from '../services/storage.service.js'
import { utilService } from '../services/util.service.js'

export const locService = {
    getLocs,
    createLocation,
    removeLocation
}

const STORAGE_KEY = 'locationsDB'

const gLocs = storageService.loadFromStorage(STORAGE_KEY) || [
    { name: 'Greatplace', lat: 32.047104, lng: 34.832384 },
    { name: 'Neveragain', lat: 32.047201, lng: 34.832581 }
]

function createLocation(name, position) {
    const location = {
        id: utilService.makeId(),
        name,
        lat: position.lat,
        lng: position.lng,
        Weather: '',
        createdAt: Date.now(),
        updatedAt: Date.now()
    }
    gLocs.push(location)
    _saveLocsToStorage()
}

function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(gLocs)
        }, 1000)
    })
}

function removeLocation(id) {
    return new Promise((res, rej) => {
        const locationIdx = gLocs.findIndex(loc => id === loc.id)
        gLocs.splice(locationIdx, 1)
        _saveLocsToStorage()
    })
}

function _saveLocsToStorage() {
    storageService.saveToStorage(STORAGE_KEY, gLocs)
}


