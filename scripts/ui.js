import { update_weather_img, renderHighlights } from './utils.js';
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

//TODO:export later
function render_weather_cards(count) {
    const container = document.getElementById("weather-cards-container");
    container.innerHTML = "";

    const row = document.createElement("div");
    row.className = "row w-100 g-1";
    container.appendChild(row);
    
    for (let i = 0; i < count; i++) {
        const col = document.createElement("div");
        col.className = "col-6 col-sm-4 col-md-3 col-lg-2 col-xl mb-2";
        
        const card = document.createElement("div");
        card.className = "weather-cards d-flex flex-column flex-wrap justify-content-center align-items-center border-0 rounded-3 h-100";
        
        card.innerHTML = `
            <p class="card-day mb-1">---</p>
            <img class="card-img my-1" src="" alt="weather icon">
            <p class="card-weather mt-1 mb-0">--°</p>
        `;
        
        col.appendChild(card);
        row.appendChild(col);
    }
}

function update_right(data) {
    const highlightsContainer = document.getElementById("highlights-container");
    renderHighlights(highlightsContainer, data);

    const days = data.daily.time;
    const quart_mins = data.minutely_15.time.slice(0, 7);
    
    // Dynamically render cards
    if (!isWeekView) {
        render_weather_cards(quart_mins.length);
    } else {
        render_weather_cards(Math.min(days.length, 7));
    }
    
    // Now reselect elements
    let card_days = document.querySelectorAll(".card-day");
    let card_imgs = document.querySelectorAll(".card-img");
    let card_weathers = document.querySelectorAll(".card-weather");
    
    // Data extraction
    let quart_mins_temp = data.minutely_15.apparent_temperature.slice(0, 7);
    let quart_mins_weather_code = data.minutely_15.weather_code.slice(0, 7);
    let quart_mins_is_day = data.minutely_15.is_day.slice(0, 7);
    let daily_weather_codes = data.daily.weather_code;
    let daily_min_temp = data.daily.apparent_temperature_min;
    let daily_max_temp = data.daily.apparent_temperature_max;
    let current_is_day = data.current.is_day;
    
    console.log("=== 15-min Weather Codes (Today View) ===");
    console.log(quart_mins_weather_code);
    
    console.log("=== Daily Weather Codes (Week View) ===");
    console.log(daily_weather_codes);
    
    if (!isWeekView) {
        // Today view
        for (let i = 0; i < quart_mins.length; i++) {
            card_days[i].innerHTML = quart_mins[i].slice(-5);
            card_imgs[i].src = update_weather_img(quart_mins_weather_code[i], quart_mins_is_day[i]);
            console.log(`Card ${i}: Code=${quart_mins_weather_code[i]}, IsDay=${quart_mins_is_day[i]}, Image=${card_imgs[i].src}`);
            
            if (isConverted) {
                const fahrenheit = (quart_mins_temp[i] * 9) / 5 + 32;
                card_weathers[i].innerHTML = `${fahrenheit.toFixed(1)}°F`;
            } else {
                card_weathers[i].innerHTML = `${quart_mins_temp[i].toFixed(1)}°C`;
            }
        }
    } else {
        // Week view
        let today = new Date();
        let options = { weekday: "short" };
        
        for (let i = 0; i < days.length && i < card_days.length; i++) {
            let day = new Date(today);
            day.setDate(today.getDate() + i);
            let dayOfWeek = day.toLocaleDateString("en-GB", options);
            
            card_days[i].innerHTML = dayOfWeek;
            card_imgs[i].src = update_weather_img(daily_weather_codes[i], current_is_day);
            console.log(`Card ${i}: Code=${daily_weather_codes[i]}, IsDay=${current_is_day}, Image=${card_imgs[i].src}`);

            
            if (isConverted) {
                const minF = (daily_min_temp[i] * 9) / 5 + 32;
                const maxF = (daily_max_temp[i] * 9) / 5 + 32;
                card_weathers[i].innerHTML = `${minF.toFixed(1)}°F, ${maxF.toFixed(1)}°F`;
            } else {
                card_weathers[i].innerHTML = `${daily_min_temp[i].toFixed(1)}°C, ${daily_max_temp[i].toFixed(1)}°C`;
            }
        }
    }
}


export { update_left, update_city, update_right, updateMainTemperature };