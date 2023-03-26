const container = document.querySelector('.container');
const search = document.querySelector('.search-box button');
const weatherBox = document.querySelector('.weather-box');
const weatherDetails = document.querySelector('.weather-details');
const error404 = document.querySelector('.not-found');

const APIKey = '7ece734db73e21dd84af8c64ad909415';

const getCoordData = async (city) => {

    const apiGeolocationurl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${APIKey}`;

    const res = await fetch(apiGeolocationurl);
    const data = await res.json();
    
    if (data.length === 0) {
        throw new Error(`City '${city}' not found`);
    }

    const { lat, lon } = data[0];

    return { lat, lon };
};

const getWeatherData = async (city) => {

    const { lat, lon} = await getCoordData(city)

    const apiWeatherurl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIKey}&units=metric`;

    const res = await fetch(apiWeatherurl);
    const data = await res.json();

    return data;

}

const showWeatherData = async (city) => {

    const data = await getWeatherData(city);

    if (data.cod === "404") {

        container.style.height = '400px';
        weatherBox.style.display = 'none';
        weatherDetails.style.display = 'none';
        error404.style.display = 'block';
        error404.classList.add('fadeIn');
        return;
    }

    error404.style.display = 'none';
    error404.classList.remove('fadeIn');

    const image = document.querySelector('.weather-box img');
    const temperature = document.querySelector('.weather-box .temperature');
    const description = document.querySelector('.weather-box .description');
    const humidity = document.querySelector('.weather-details .humidity span');
    const wind_speed = document.querySelector('.weather-details .wind span');

    switch (data.weather[0].description) {

        case 'clear':
            image.src = 'Images/clear.png';
            break;

        case 'rain':
            image.src = 'Images/rain.png';
            break;

        case 'snow':
            image.src = 'Images/snow.png';
            break;

        case 'overcast clouds':
        case 'few clouds':
        case 'clouds':
            image.src = 'Images/cloud.png';
            break;

        case 'haze':
            image.src = 'Images/mist.png';
            break;
        
        default:
            image.src = 'Images/404.png';
    }

    temperature.innerHTML = parseInt(data.main.temp);
    description.innerText = data.weather[0].description;
    humidity.innerText = `${data.main.humidity}%`;
    wind_speed.innerText = `${data.wind.speed}km/h`;

    weatherBox.style.display = '';
    weatherDetails.style.display = '';
    weatherBox.classList.add('fadeIn');
    weatherDetails.classList.add('fadeIn');
    container.style.height = '590px';
}

search.addEventListener('click', async (e) => {
    e.preventDefault();

    const city = document.querySelector('.search-box input').value;

    console.log(city);

    showWeatherData(city);
});