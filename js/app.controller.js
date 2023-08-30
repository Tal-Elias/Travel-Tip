import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'

window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetLocs = onGetLocs
window.onGetUserPos = onGetUserPos
window.onRemoveLocation = onRemoveLocation

function onInit() {
    mapService.initMap()
        .then(() => {
            console.log('Map is ready')
            const map = mapService.getMap()
            getInfoWindow(map)

        })
        .catch((err) => console.log(err, 'Error: cannot init map'))
}

//infoWindow Function
function getInfoWindow(map) {
    // Create the initial InfoWindow.
    let infoWindow = new google.maps.InfoWindow({
        content: "Click the map to get Lat/Lng!",
        position: map.center,
    });

    infoWindow.open(map);
    // Configure the click listener.
    map.addListener("click", (mapsMouseEvent) => {
        //add location name
        const locationName = prompt('whats the location name?')
        if (locationName) {
            locService.createLocation(locationName, mapsMouseEvent.latLng.toJSON())
        }
        // Close the current InfoWindow.
        infoWindow.close();
        // Create a new InfoWindow.
        infoWindow = new google.maps.InfoWindow({
            position: mapsMouseEvent.latLng,
        })
        infoWindow.setContent(
            JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2),
        )
        infoWindow.open(map);
    })
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    console.log('Getting Pos')
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function onAddMarker() {
    console.log('Adding a marker')
    mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 })
}

function onGetLocs() {
    locService.getLocs()
        .then(renderLocs)
}

function renderLocs(locs) {
    const strHTMLs = locs.map(loc => `
                <article>
                    <h3>${loc.name}</h3>
                    <button onclick="onPanTo(${loc.lat, loc.lng})">Go</button>
                    <button onclick="onRemoveLocation('${loc.id}')">Delete</button>
                </article>
        `)
    document.querySelector('.card-container').innerHTML = strHTMLs.join('')
}

function onGetUserPos() {
    getPosition()
        .then(pos => {
            onPanTo(pos.coords.latitude, pos.coords.longitude)
            console.log('User position is:', pos.coords)
            document.querySelector('.user-pos').innerText =
                `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
        })
        .catch(err => {
            console.log('err!!!', err)
        })
}
function onPanTo(lat, lng) {
    console.log('Panning the Map')
    // mapService.panTo(35.6895, 139.6917)
    mapService.panTo(lat, lng)
}

function onRemoveLocation(id) {
    // console.log('id is:', id);
    locService.removeLocation(id)
}