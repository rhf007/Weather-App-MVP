// when the document is loaded, do the following
document.addEventListener("DOMContentLoaded", () => {
    
    //today/week nav links
    let navLinks = document.querySelectorAll(".today-week");
    let isWeekView = false;
    
    //for each today/week nav link
    navLinks.forEach((link) => {
        //if it is clicked
        link.addEventListener("click", () => {
            // Remove active class from all links
            navLinks.forEach((item) => item.classList.remove("active"));
            
            //then add active class to the clicked link
            link.classList.add("active");
            isWeekView = (link.id === "week");
            if(weatherData){
                update_weather_div(weatherData);
            }
        });
    });
    
    //cel/feh nav links
    let celFehLinks = document.querySelectorAll(".cel-feh");
    // main/big degree on the left
    let degreeElement = document.getElementById("degree");
    // Track whether the temperature is converted
    let isConverted = false;
    let weatherData = null; // Store the weather data globally
    
    celFehLinks.forEach((link) => {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            
            // Toggle active classes
            celFehLinks.forEach((item) => item.classList.remove("active"));
            link.classList.add("active");
            
            //only convert if we have weather data
            if(weatherData){
                const currentTemp = weatherData.current.apparent_temperature;
                
                if (link.id === "feh") {
                    isConverted = true;
                    const fahrenheit = (currentTemp * 9) / 5 + 32;
                    degreeElement.innerHTML = `${fahrenheit.toFixed(1)}°F`;
                } else {
                    isConverted = false;
                    degreeElement.innerHTML = `${currentTemp.toFixed(1)}°C`;
                }
                
                update_weather_div(weatherData);
            }
            
        });
    });
    
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
            // print the json
            weatherData = data;
            
            // get the location info with the geoAPI after getting weather data
            fetch(geoapiurl)
            //get that json too
            .then((response) => response.json())
            .then((locationData) => {
                // Update the search-div(left side) based on weather data
                updateSearchDiv(data, locationData);
                
                // Update the search bar with the detected city and country info
                update_search_bar(locationData);
                
                // Update the weather div(right side)
                update_weather_div(data);
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
    
    //updating the left side
    //now that we have the weather and location data
    function updateSearchDiv(weather_data, locationData) {
        
        //big weather image
        let weather_img = document.getElementById("weather-image");
        //big degree
        let deg = document.getElementById("degree");
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
    function update_search_bar(locationData) {
        //search bar
        const searchBar = document.getElementById("search-bar");
        
        //if there is in fact a search bar
        if (searchBar) {
            // Update the search bar content with the detcted city, state, and country
            searchBar.value = `${locationData.city}, ${locationData.principalSubdivision}, ${locationData.countryName}`;
            
        }
    }
    
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
    
    //update the right side
    function update_weather_div(data) {
        
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
    
    // Call the watchLocation function when the page loads or when needed
    watchLocation();
});