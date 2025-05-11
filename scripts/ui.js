import { update_weather_img } from './utils.js';
import { isWeekView, isConverted } from './main.js';

//updating the left side
//now that we have the weather and location data
function update_left(weather_data) {
    
    //big weather image
    let weather_img = document.getElementById("weather-image");
    //date and time
    let daytime = document.getElementById("day-time");
    
    //get date and time
    let today = new Date();
    let day = today.toLocaleDateString("en-GB", { weekday: "long" });
    let hours = today.getHours().toString().padStart(2, '0');
    let minutes = today.getMinutes().toString().padStart(2, '0');
    
    //change weather image based on current weather status(weather code) and day/night(is_day)
    weather_img.src = update_weather_img(
        weather_data.current.weather_code,
        weather_data.current.is_day
    );
    
    // Set temperature according to active unit immediately
    updateMainTemperature(weather_data.current.apparent_temperature);
    
    daytime.innerHTML = `${day}, ${hours}:${minutes}`;
    
    //update the time every minute
    setInterval(() => {
        let now = new Date();
        let currentDay = now.toLocaleDateString("en-GB", { weekday: "long" });
        let currentHours = now.getHours().toString().padStart(2, '0');
        let currentMinutes = now.getMinutes().toString().padStart(2, '0');
        daytime.innerHTML = `${currentDay}, ${currentHours}:${currentMinutes}`;
    }, 1000);
}

// Dedicated function to update the main temperature display
function updateMainTemperature(temperature) {
    let deg = document.getElementById("degree");
    
    if (isConverted) {
        const fahrenheit = (temperature * 9) / 5 + 32;
        deg.innerHTML = `${fahrenheit.toFixed(1)}°F`;
    } else {
        deg.innerHTML = `${temperature.toFixed(1)}°C`;
    }
}

// update the search bar with the detected city and country info
function update_city(locationData) {
    const cityElement = document.getElementById("city");
    
    if (cityElement) {
        // Show city, state, and country in a separate div
        cityElement.innerHTML = `${locationData.city}, ${locationData.principalSubdivision}, ${locationData.countryName}`;
    }
}

//update the right side
function update_right(data) {
    
    //card days
    let card_days = document.querySelectorAll(".card-day");
    //card images
    let card_imgs = document.querySelectorAll(".card-img");
    //card weathers
    let card_weathers = document.querySelectorAll(".card-weather");
    //name of highlight in today's highlights
    let highlights_names = document.querySelectorAll(".highlight-name");
    //name of highlight in today's highlights
    let highlights_values = document.querySelectorAll(".highlight-value");
    
    //sunrise time today
    let sunrise = data.daily.sunrise[0].slice(-5);
    //sunset time today
    let sunset = data.daily.sunset[0].slice(-5);
    //Max UV Index
    let uv_idx = data.daily.uv_index_max[0];
    //humidity
    let humidity = data.current.relative_humidity_2m;
    //precipitation
    let precipitation = data.daily.precipitation_probability_max[0];
    //rain
    let rain = data.daily.rain_sum[0];
    //snowfall
    let snowfall = data.daily.snowfall_sum[0];
    //wind speed
    let wind_speed = data.current.wind_speed_10m;
    //wid direction
    let wind_direction = data.current.wind_direction_10m;
    //is it CURRENTLY day or night? 0 = night, 1 = day
    let current_is_day = data.current.is_day;
    
    //update highlight names & values
    highlights_names[0].innerHTML = "Sunrise&#47;Sunset";
    highlights_values[0].innerHTML = `${sunrise}<br>${sunset}`;
    highlights_names[1].innerHTML = "UV Index";
    highlights_values[1].innerHTML = `${uv_idx}`;
    highlights_names[2].innerHTML = "Humidity";
    highlights_values[2].innerHTML = `${humidity}&#37;`;
    highlights_names[3].innerHTML = "Precipitation";
    highlights_values[3].innerHTML = `${precipitation}&#37;`;
    highlights_names[4].innerHTML = "Rain Sum";
    highlights_values[4].innerHTML = `${rain} mm`;
    highlights_names[5].innerHTML = "Snowfall Sum";
    highlights_values[5].innerHTML = `${snowfall} cm`;
    highlights_names[6].innerHTML = "Wind Speed&#47;Wind Direction";
    highlights_values[6].innerHTML = `${wind_speed} km&#47;hr <br> ${wind_direction}&deg;`;
    
    let quart_mins = data.minutely_15.time.slice(0, 7);
    let quart_mins_temp = data.minutely_15.apparent_temperature.slice(0, 7);
    let quart_mins_weather_code = data.minutely_15.weather_code.slice(0, 7);
    let quart_mins_is_day = data.minutely_15.is_day.slice(0, 7);
    let days = data.daily.time;
    let daily_weather_codes = data.daily.weather_code;
    let daily_min_temp = data.daily.apparent_temperature_min;
    let daily_max_temp = data.daily.apparent_temperature_max;
    
    // Determine which view to display (Today or Week)
    if (!isWeekView) {
        // Today view
        for (let i = 0; i < quart_mins.length; i++) {
            // Update time labels
            card_days[i].innerHTML = quart_mins[i].slice(-5);
            
            // Update weather images
            let weather_code = quart_mins_weather_code[i];
            let is_day = quart_mins_is_day[i];
            card_imgs[i].src = update_weather_img(weather_code, is_day);
            
            // Update temperature display based on unit
            if (isConverted) {
                const fahrenheit = (quart_mins_temp[i] * 9) / 5 + 32;
                card_weathers[i].innerHTML = `${fahrenheit.toFixed(1)}°F`;
            } else {
                card_weathers[i].innerHTML = `${quart_mins_temp[i].toFixed(1)}°C`;
            }
            
            // Reset font size
            card_weathers[i].style.fontSize = "16px";
        }
    } else {
        // Week view
        let today = new Date();
        let options = { weekday: "short" };
        
        for (let i = 0; i < days.length && i < card_days.length; i++) {
            // Get the day of the week
            let day = new Date(today);
            day.setDate(today.getDate() + i);
            let dayOfWeek = day.toLocaleDateString("en-GB", options);
            
            // Update day display
            card_days[i].innerHTML = dayOfWeek;
            
            // Update weather image
            card_imgs[i].src = update_weather_img(daily_weather_codes[i], current_is_day);
            
            // Update temperature display based on unit
            if (isConverted) {
                const minF = (daily_min_temp[i] * 9) / 5 + 32;
                const maxF = (daily_max_temp[i] * 9) / 5 + 32;
                card_weathers[i].innerHTML = `${minF.toFixed(1)}°F, ${maxF.toFixed(1)}°F`;
            } else {
                card_weathers[i].innerHTML = `${daily_min_temp[i].toFixed(1)}°C, ${daily_max_temp[i].toFixed(1)}°C`;
            }
            
            // Make the font smaller for week view (has more text)
            card_weathers[i].style.fontSize = "14px";
        }
    }
}

export { update_left, update_city, update_right, updateMainTemperature };