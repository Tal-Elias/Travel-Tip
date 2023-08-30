import { storageService } from "../services/storage.service.js"

export const mapService = {
    initMap,
    addMarker,
    panTo,
    getMap,
    getAddressBySearchInput
}


// Var that is used throughout this Module (not global)
var gMap

function initMap(lat = 32.0749831, lng = 34.9120554) {
    console.log('InitMap')
    return _connectGoogleApi()
        .then(() => {
            console.log('google available')
            gMap = new google.maps.Map(
                document.querySelector('#map'), {
                center: { lat, lng },
                zoom: 15
            })
            
        })
}

function getAddressBySearchInput(adress){
    console.log('hi adress=',adress)
// const locs =storageService.loadFromStorage('locationsDB') ||{}
// if(locs[adress]) return Promise.resolve(locs[adress]) 
console.log('Getting from Network')
return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${adress}&key=AIzaSyBMZ1V7mYaThIm95gpB0Bgzqg9Zs53qPq8`)
.then(res =>res.data.results[0].geometry.location)
}

function getMap(){
    return gMap
}

function addMarker(loc) {
    var marker = new google.maps.Marker({
        position: loc,
        map: gMap,
        title: 'Hello World!'
    })
    return marker
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng)
    gMap.panTo(laLatLng)
}


function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
    const API_KEY = 'AIzaSyBMZ1V7mYaThIm95gpB0Bgzqg9Zs53qPq8' //TODO: Enter your API Key
    var elGoogleApi = document.createElement('script')
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`
    elGoogleApi.async = true
    document.body.append(elGoogleApi)

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}
