import { update_left, update_city, update_right } from './ui.js';

// Function to watch user's location changes
function watchLocation() {
    // if the browser supports the Geolocation API. 
    if (navigator.geolocation) {
        //watch position
        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                // get latitude
                const latitude = position.coords.latitude;
                // get longitude
                const longitude = position.coords.longitude;
                // Call the function to fetch weather data using the obtained coordinates
                getWeatherData(latitude, longitude);
            },
            //if theres an error getting the position
            (error) => {
                //print this
                console.error("Error watching user location:", error);
            }
        );
    }
    // if browser doesn't support geolocation
    else {
        // print this
        console.error("Geolocation is not supported by this browser.");
    }
}

// Function to fetch weather data based on user's location
function getWeatherData(latitude, longitude) {
    // API endpoint for Open-Meteo weather
    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m,wind_direction_10m&minutely_15=apparent_temperature,rain,snowfall,weather_code,wind_speed_10m,is_day&daily=weather_code,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_sum,rain_sum,snowfall_sum,precipitation_probability_max,wind_speed_10m_max&timezone=auto&forecast_hours=6&forecast_minutely_15=24`;
    // reverse geo-coding to get city, state, country from the latitude & longitude  
    let geoapiurl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
    
    // Fetch weather data
    fetch(apiUrl)
    // get that json
    .then((response) => response.json())
    .then((data) => {
        // Store the weather data globally
        window.setWeatherData(data);
        
        // get the location info with the geoAPI after getting weather data
        fetch(geoapiurl)
        //get that json too
        .then((response) => response.json())
        .then((locationData) => {
            // Update the search-div(left side) based on weather data
            update_left(data);
            
            // Update the search bar with the detected city and country info
            update_city(locationData);
            
            // Update the weather div(right side)
            update_right(data);
        })
        // if theres an error getting the location data
        .catch((error) => {
            console.error("Error fetching location data:", error);
        });
    })
    // if theres an error getting the weather data
    .catch((error) => {
        console.error("Error fetching weather data:", error);
    });
}

export { watchLocation, getWeatherData };