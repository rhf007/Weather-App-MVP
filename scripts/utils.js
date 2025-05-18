// mapping object for weather conditions
const weatherImageMap = {
    // Structure: 
    // [weatherCode]: { day: day image, night: night image }
    0: { 
        day: "./images/glass weather icons/Day/sunny.png", 
        night: "./images/glass weather icons/Night/moon.png" 
    },
    2: { 
        day: "./images/glass weather icons/Day/pcloudy.png", 
        night: "./images/glass weather icons/Night/pcloudy 0.png" 
    },
    3: { 
        day: "./images/glass weather icons/Day/Cloudy.png", 
        night: "./images/glass weather icons/Night/mcloudy 0.png" 
    },
    61: { 
        day: "./images/glass weather icons/Day/Lrain.png", 
        night: "./images/glass weather icons/Night/Lrain 0.png" 
    },
    63: { 
        day: "./images/glass weather icons/Day/Rain.png", 
        night: "./images/glass weather icons/Night/rain 0.png" 
    },
    65: { 
        day: "./images/glass weather icons/Day/Rain.png", 
        night: "./images/glass weather icons/Night/rain 0.png" 
    },
    71: { 
        day: "./images/glass weather icons/Night/Snow.png", 
        night: "./images/glass weather icons/Night/Snow.png" 
    },
    73: { 
        day: "./images/glass weather icons/Night/Snow.png", 
        night: "./images/glass weather icons/Night/Snow.png" 
    },
    75: { 
        day: "./images/glass weather icons/Night/Snow.png", 
        night: "./images/glass weather icons/Night/Snow.png" 
    },
    95: { 
        day: "./images/glass weather icons/Day/Tshower.png", 
        night: "./images/glass weather icons/Night/Tshower 0.png" 
    },
    96: { 
        day: "./images/glass weather icons/Day/TStorm.png", 
        night: "./images/glass weather icons/Night/Tstorm.png" 
    },
    99: { 
        day: "./images/glass weather icons/Day/TStorm.png", 
        night: "./images/glass weather icons/Night/Tstorm.png" 
    }
};

// fallback images
const defaultImages = {
    day: "./images/glass weather icons/Day/sunny.png",
    night: "./images/glass weather icons/Night/moon.png"
};

function renderHighlights(containerElement, data) {
    const highlightData = [
        {
            name: "Sunrise<br>Sunset",
            value: `${data.daily.sunrise[0].slice(-5)}<br>${data.daily.sunset[0].slice(-5)}`
        },
        {
            name: "UV Index",
            value: `${data.daily.uv_index_max[0]}`
        },
        {
            name: "Humidity",
            value: `${data.current.relative_humidity_2m}%`
        },
        {
            name: "PCPN",
            value: `${data.daily.precipitation_probability_max[0]}%`
        },
        {
            name: "Rain Sum",
            value: `${data.daily.rain_sum[0]} mm`
        },
        {
            name: "Snowfall Sum",
            value: `${data.daily.snowfall_sum[0]} cm`
        },
        {
            name: "Wind Speed<br>Wind Direction",
            value: `${data.current.wind_speed_10m} km/hr <br> ${data.current.wind_direction_10m}&deg;`
        }
    ];

    containerElement.innerHTML = "";

    const row = document.createElement("div");
    row.className = "row g-3";
    containerElement.appendChild(row);

    highlightData.forEach(item => {
        const col = document.createElement("div");
        // Fixed width columns that maintain their size and wrap when needed
        col.className = "col-6 col-sm-4 col-md-3 col-xl-2 mb-3";
        
        const card = document.createElement("div");
        card.className = "highlight-cards d-flex flex-column justify-content-center align-items-center border-0 rounded-3";
        
        const name = document.createElement("p");
        name.className = "highlight-name mb-2";
        name.innerHTML = item.name;

        const value = document.createElement("p");
        value.className = "highlight-value";
        value.innerHTML = item.value;

        card.appendChild(name);
        card.appendChild(value);
        col.appendChild(card);
        row.appendChild(col);
    });
}

// Function to update the weather image
// Takes weather condition code and day/night flag (0 = night, 1 = day)
function update_weather_img(weather_condition, is_day) {
    // Convert is_day to string key for readability
    let timeOfDay;
    
    if (is_day === 1) {
        timeOfDay = 'day';
    } else {
        timeOfDay = 'night';
    }
    
    // Look up the weather condition in our map
    const weatherType = weatherImageMap[weather_condition];
    
    // If we have this weather condition in our map, return the appropriate day/night image
    if (weatherType) {
        return weatherType[timeOfDay];
    }
    
    // If weather condition isn't in our map, return the default image for day/night
    return defaultImages[timeOfDay];
}

export { update_weather_img, renderHighlights };