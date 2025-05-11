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

export { update_weather_img };