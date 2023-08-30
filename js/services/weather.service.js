export const weatherService={
    getWeatherByAddress
}

const API_KEY='ea096fd6d04106dc5720c1d1885b9ff2'

function getWeatherByAddress(adress){
// const locs=storageService.loadFromStorage('locationsDB') ||{}
// if(locs[adress]) return Promise.resolve(locs[adress]) 
console.log('Getting from Network')
return axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${adress.lat}&lon=${adress.lng}&appid=${API_KEY}&units=metric`)
.then(res =>res.data)
}