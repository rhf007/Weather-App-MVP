// when the document is loaded, do the following
document.addEventListener("DOMContentLoaded", () => {
    
    //today/week nav links
    let navLinks = document.querySelectorAll(".today-week");
    
    //for each today/week nav link
    navLinks.forEach((link) => {
        //if it is clicked
        link.addEventListener("click", () => {
            // Remove active class from all links
            navLinks.forEach((item) => item.classList.remove("active"));
            
            //then add active class to the clicked link
            link.classList.add("active");
        });
    });
    
    //cel/feh nav links
    let celFehLinks = document.querySelectorAll(".cel-feh");
    // main/big degree on the left
    let degreeElement = document.getElementById("degree");
    // Track whether the temperature is converted
    let isConverted = false;
    
    celFehLinks.forEach((link) => {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            
            // Toggle active classes
            document.getElementById("cel").classList.remove("active");
            document.getElementById("feh").classList.remove("active");
            link.classList.add("active");
            
            // Convert to Fahrenheit
            if (link.id === "feh" && !isConverted) {
                const cardWeathers = document.querySelectorAll(".card-weather");
                const updatedTemps = [];
                
                cardWeathers.forEach((el) => {
                    const c = parseFloat(el.textContent);
                    const f = (c * 9) / 5 + 32;
                    updatedTemps.push(`${f.toFixed(1)}°F`);
                });
                
                const bigC = parseFloat(degreeElement.textContent);
                const bigF = (bigC * 9) / 5 + 32;
                
                cardWeathers.forEach((el, i) => {
                    el.textContent = updatedTemps[i];
                });
                degreeElement.textContent = `${bigF.toFixed(1)}°F`;
                
                isConverted = true;
            }
            // Convert to Celsius
            else if (link.id === "cel" && isConverted) {
                const cardWeathers = document.querySelectorAll(".card-weather");
                const updatedTemps = [];
                
                cardWeathers.forEach((el) => {
                    const f = parseFloat(el.textContent);
                    const c = ((f - 32) * 5) / 9;
                    updatedTemps.push(`${c.toFixed(1)}°C`);
                });
                
                const bigF = parseFloat(degreeElement.textContent);
                const bigC = ((bigF - 32) * 5) / 9;
                
                cardWeathers.forEach((el, i) => {
                    el.textContent = updatedTemps[i];
                });
                degreeElement.textContent = `${bigC.toFixed(1)}°C`;
                
                isConverted = false;
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
            console.log(data);
            
            // get the location info with the geoAPI after getting weather data
            fetch(geoapiurl)
            //get that json too
            .then((response) => response.json())
            .then((locationData) => {
                // print the location json
                console.log(locationData);
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
        let hours = today.getHours();
        let minutes = today.getMinutes();
        
        //change weather image based on current weather status(weather code) and day/night(is_day)
        weather_img.src = update_weather_img(
            weather_data.current.weather_code,
            weather_data.current.is_day
        );
        
        // change big degree
        deg.innerHTML = `${weather_data.current.apparent_temperature}°C`;
        
        
        //display current date and time
        daytime.innerHTML = `${day}, ${hours}:${minutes}`;
        
        //update the time every minute
        setInterval(() => {
            let today = new Date();
            let day = today.toLocaleDateString("en-GB", { weekday: "long" });
            let hours = today.getHours();
            let minutes = today.getMinutes();
            daytime.innerHTML = `${day}, ${hours}:${minutes}`;
        }, 1000);
        
        
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
    
    
    
    // update the weather image
    // check for the weather condition and day/night
    //return the path to the right image
    function update_weather_img(weather_condition, day_or_night) {
        
        //clear sky
        if (weather_condition === 0 && day_or_night === 0) {
            return "./images/glass weather icons/Night/moon.png";
        } else if (weather_condition === 0 && day_or_night === 1) {
            return "./images/glass weather icons/Day/sunny.png";
        }
        
        //partly cloudy
        else if (weather_condition === 2 && day_or_night === 0) {
            return "./images/glass weather icons/Night/pcloudy 0.png";
        } else if (weather_condition === 2 && day_or_night === 1) {
            return "./images/glass weather icons/Day/pcloudy.png";
        }
        
        //cloudy
        else if (weather_condition === 3 && day_or_night === 0) {
            return "./images/glass weather icons/Night/mcloudy 0.png";
        } else if (weather_condition === 3 && day_or_night === 1) {
            return "./images/glass weather icons/Day/Cloudy.png";
        }
        
        //Light Rain
        else if (weather_condition === 61 && day_or_night === 0) {
            return "./images/glass weather icons/Night/Lrain 0.png";
        } else if (weather_condition === 61 && day_or_night === 1) {
            return "./images/glass weather icons/Day/Lrain.png";
        }
        
        //Medium/Heavy Rain
        else if ([63, 65].includes(weather_condition) && day_or_night === 0) {
            return "./images/glass weather icons/Night/rain 0.png";
        } else if ([63, 65].includes(weather_condition) && day_or_night === 1) {
            return "./images/glass weather icons/Day/Rain.png";
        }
        
        //Snow
        else if (
            [71, 73, 75].includes(weather_condition) &&
            (day_or_night === 0 || day_or_night === 1)
        ) {
            return "./images/glass weather icons/Night/Snow.png";
        }
        
        //thundershower
        else if (weather_condition === 95 && day_or_night === 0) {
            return "./images/glass weather icons/Night/Tshower 0.png";
        } else if (weather_condition === 95 && day_or_night === 1) {
            return "./images/glass weather icons/Day/Tshower.png";
        }
        
        //thunderstorm
        else if ([96, 99].includes(weather_condition) && day_or_night === 0) {
            return "./images/glass weather icons/Night/Tstorm.png";
        } else if ([96, 99].includes(weather_condition) && day_or_night === 1) {
            return "./images/glass weather icons/Day/TStorm.png";
        } else {
            if (day_or_night === 0) {
                return "./images/glass weather icons/Night/moon.png";
            } else {
                return "./images/glass weather icons/Day/sunny.png";
            }
        }
    }
    
    //update the right side
    function update_weather_div(data) {
        
        //card days
        let card_days = document.querySelectorAll(".card-day");
        //card images
        let card_imgs = document.querySelectorAll(".card-img");
        //card weathers
        let card_weathers = document.querySelectorAll(".card-weather");
        //the today nav link
        let today = document.getElementById("today");
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
        let quart_mins = data.minutely_15.time.slice(0, 7);
        let quart_mins_temp = data.minutely_15.apparent_temperature.slice(0, 7);
        let quart_mins_weather_code = data.minutely_15.weather_code.slice(0, 7);
        let quart_mins_is_day = data.minutely_15.is_day.slice(0, 7);
        
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
        
        //if the today link is active AKA clicked
        if (today.classList.contains("active")) {
            //get the 15-minute time, forecast, weather_codes, and day/night
            // Determine the temperature unit based on whether Celsius or Fahrenheit is active
            let temperatureUnit = "°C";
            if (document.getElementById("feh").classList.contains("active")) {
                temperatureUnit = "°F";
                // Convert Celsius temperatures to Fahrenheit for weather cards
                const updatedCardTemps = quart_mins_temp.map((celsius) => {
                    const fahrenheit = (celsius * 9) / 5 + 32;
                    document.getElementById("degree").textContent = `${fahrenheit.toFixed(1)}°F`;
                    return `${fahrenheit.toFixed(1)}°F`;
                });
                // Update card weathers with converted temperatures
                card_weathers.forEach((weatherElement, index) => {
                    weatherElement.textContent = updatedCardTemps[index];
                });
            } else {
                // Update card weathers with Celsius temperatures
                card_weathers.forEach((weatherElement, index) => {
                    weatherElement.textContent = `${quart_mins_temp[index]}°C`;
                    document.getElementById("degree").textContent = `${quart_mins_temp[0]}°C`;
                });
            }
            
            //for each of the cards
            for (let i = 0; i < quart_mins.length; i++) {
                // update the days with the 15 minute windows/intervals
                card_days[i].innerHTML = quart_mins[i].slice(-5);
                //weather condition and day/night
                let weather_code = quart_mins_weather_code[i];
                let is_day = quart_mins_is_day[i];
                //replace card image with the right one
                card_imgs[i].src = update_weather_img(weather_code, is_day);
                //update weather for each 15-minute window/interval
                /* card_weathers[i].innerHTML = `${quart_mins_temp[i]}°C`; */
            }
        }
        //if the week link is active AKA clicked
        else {
            //next 6 days, their weather conditions and min/max temps 
            let days = data.daily.time;
            let daily_weather_codes = data.daily.weather_code;
            let daily_min_temp = data.daily.apparent_temperature_min;
            let daily_max_temp = data.daily.apparent_temperature_max;
            let fahrenheitLink = document.getElementById("feh");
            fahrenheitLink.addEventListener("click", function() {
                // Check if the week link is active
                let weekLink = document.getElementById("week");
                if (weekLink.classList.contains("active")) {
                    // Handle Fahrenheit conversion for week data
                    // Update card weathers with Fahrenheit temperatures
                    const updatedCardTemps = daily_min_temp.map((celsius, index) => {
                        const fahrenheitMin = (celsius * 9) / 5 + 32;
                        const fahrenheitMax = (daily_max_temp[index] * 9) / 5 + 32;
                        return `${fahrenheitMin.toFixed(1)}°F, ${fahrenheitMax.toFixed(1)}°F`;
                    });
                    
                    console.log("Updated Fahrenheit temperatures:", updatedCardTemps);
                    
                    // Update card weathers with converted temperatures
                    card_weathers.forEach((weatherElement, index) => {
                        weatherElement.textContent = updatedCardTemps[index];
                    });
                    // Update the "degree" element with the first day's Fahrenheit temperature
                    document.getElementById("degree").textContent = `${daily_min_temp[0]}°F`;
                } else {
                    // Handle Fahrenheit conversion for today data
                    // Update card weathers with Fahrenheit temperatures
                    const updatedCardTemps = quart_mins_temp.map((celsius) => {
                        const fahrenheit = (celsius * 9) / 5 + 32;
                        document.getElementById("degree").textContent = `${fahrenheit.toFixed(1)}°F`;
                        return `${fahrenheit.toFixed(1)}°F`;
                    });
                    
                    console.log("Updated Fahrenheit temperatures:", updatedCardTemps);
                    
                    // Update card weathers with converted temperatures
                    card_weathers.forEach((weatherElement, index) => {
                        weatherElement.textContent = updatedCardTemps[index];
                    });
                }})
                
                //for each of the cards
                for (let i = 0; i < days.length; i++) {
                    //update the day with the appropriate day STARTING FROM TODAY
                    // this  will be used right after the for loop
                    card_days[i].innerHTML = days[i];
                    // update card weather image
                    card_imgs[i].src = update_weather_img(daily_weather_codes[i], current_is_day);
                    //update min/max temps
                    card_weathers[i].innerHTML = `${daily_min_temp[i]}°C, ${daily_max_temp[i]}°C`;
                    // make the font smaller
                    card_weathers[i].style.fontSize = "14px";
                }
                
                //get date and time
                let today = new Date();
                // Use 'short' for 3-letter days
                let options = { weekday: "short" };
                // Update the card-day elements with today and the next 6 days
                // Start with today
                let dayOffset = 0;
                
                //for each card_day
                card_days.forEach((card) => {
                    // Get the day of the week for the current day offset
                    let day = new Date(today);
                    //get the corresponding day(starts with today)
                    day.setDate(today.getDate() + dayOffset);
                    //turn that into a 3-letter day string
                    let dayOfWeek = day.toLocaleDateString("en-GB", options);
                    
                    // Update the card-day withe corresponding day
                    card.innerHTML = dayOfWeek;
                    
                    // Increment the day offset for the next iteration/card
                    dayOffset++;
                });
                
            } 
        }
        // Call the watchLocation function when the page loads or when needed
        watchLocation();
    });