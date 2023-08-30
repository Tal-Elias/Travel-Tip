import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'
import {weatherService} from './services/weather.service.js'
window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetLocs = onGetLocs
window.onGetUserPos = onGetUserPos
window.onRemoveLocation = onRemoveLocation
window.onSearch = onSearch
window.onCreateLink = onCreateLink

function onInit() {
    let loc = onFilterByQueryParams()
    if (loc === undefined) loc = { lat: 32.0749831, lng: 34.9120554 }
    mapService.initMap(loc.lat, loc.lng)
        .then(() => {
            console.log('Map is ready')
            const map = mapService.getMap()
            getInfoWindow(map)
            weatherService.getWeatherByAddress(loc).then(res=>{
                const weather=res
                console.log(weather);
                document.querySelector('.weather').innerHTML=`
                <article class='weather'>
                <h2>weather today</h2>
                <h3>${weather.weather[0].main}</h3>
                <h4>${weather.name}</h4>
                <p> Temp:${weather.main.temp+'</p> <p> wind speed:'+ weather.wind.speed}</p>
            </article>
                `
            })
        
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
            locService.setCurrPosition(mapsMouseEvent.latLng.toJSON())
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

//search location
function onSearch(ev) {
    if (ev) ev.preventDefault()
    const elInputSearch = document.querySelector('input[name=search]')
    mapService.getAddressBySearchInput(elInputSearch.value).then(
        res => {
            const { lat, lng } = res
            onPanTo(lat, lng)
            locService.setCurrPosition({ lat, lng })

            weatherService.getWeatherByAddress({lat,lng}).then(res=>{
                const weather=res
                console.log(weather);
                document.querySelector('.weather').innerHTML=`
                <article class='weather'>
                <h2>weather today</h2>
                <h3>${weather.weather[0].main}</h3>
                <h4>${weather.name}</h4>
                <p> Temp:${weather.main.temp+'</p> <p> wind speed:'+ weather.wind.speed}</p>
            </article>
                `
            })
        }
    )
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
    const prmUserDecision = Swal.fire({
        title: 'Delete Location??',
        showDenyButton: true,
    })

    prmUserDecision.then((userDecision) => {
        if (userDecision.value) {
            locService.removeLocation(id)
            onGetLocs()
            setTimeout(() => {
                Swal.fire('Deleted!')
            }, 1000)
        } else {
            setTimeout(() => {
                Swal.fire('Cancelling...')
            }, 1000)
        }
    })
}

function onGetCurrPosition() {
    return locService.getCurrPosition()
}

function onCreateLink() {
    const currPos = onGetCurrPosition()
    console.log('currPos:', currPos);
    const queryParams = `?lat=${currPos.lat}&lng=${currPos.lng}`
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + queryParams
    navigator.clipboard.writeText(newUrl)
    alert('Link copied to clipboard!')
}

function onFilterByQueryParams() {
    const queryParams = new URLSearchParams(window.location.search)
    console.log(queryParams);
    const filterBy = {
        lat: +queryParams.get('lat'),
        lng: +queryParams.get('lng')
    }
    if (filterBy.lat && filterBy.lng) return filterBy
    else return
    // return onPanTo(filterBy.lat, filterBy.lng)
}

function weatherIcon(type){
if(type.toLowerCase()==='cloud') return '☁'
if(type.toLowerCase()==='clear') return '🌞'
if(type.toLowerCase()==='rain') return '🌧'
}