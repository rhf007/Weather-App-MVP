import { watchLocation } from './weather.js';
import { update_right } from './ui.js';
// Global variables
let isWeekView = false;
let isConverted = false;
let weatherData = null;

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
            isWeekView = (link.id === "week");
            if(weatherData){
                update_right(weatherData);
            }
        });
    });
    
    //cel/feh nav links
    let celFehLinks = document.querySelectorAll(".cel-feh");
    // main/big degree on the left
    let degreeElement = document.getElementById("degree");
    
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
                
                update_right(weatherData);
            }
            
        });
    });
    
    // Call the watchLocation function when the page loads
    watchLocation();
});

// Export global variables and functions for use in other modules
export { isWeekView, isConverted, weatherData };
// Set global function to update weather data
window.setWeatherData = function(data) {
    weatherData = data;
};