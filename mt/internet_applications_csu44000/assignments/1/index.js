/*
 * CSU44000 - Weather API
 *
 * This is a simple Express API which will use the OpenWeather API
 * (https://openweathermap.org/api) to provide a simple 5 day forecast
 * to a web application which for any desired city.
 */
const cors = require('cors');
const express = require('express');
const path = require('path');
const axios = require('axios');

const app = express();
const port = 3000;

/*
 * OpenWeather API Constants
 *
 * 5 Day Forecast - https://openweathermap.org/forecast5
 * 
 */
const apiURL = "http://api.openweathermap.org/data/2.5"
const apiKEY = "3e2d927d4f28b456c6bc662f34350957"

let publicPath = path.resolve(__dirname, "public");

app.use(express.static(publicPath));
app.use(cors());

app.get('/', (req, res) => res.send('Hello World!'));

app.get('/forecast/:town', getForecast);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

function getForecast(req, res) {
    let town = req.params.town;
    console.log(`Generating weather forecast for town ${town}...`);

    let forecastSummary = {};
    let isRain = false;
    let forecastSentiment = null;

    axios.get(`${apiURL}/forecast?q=${town}&APPID=${apiKEY}`)
        .then(response => {
            let weatherData = response.data.list;

            // Loop over OpenWeather API response and extract data for each day
            for (weatherEntry in weatherData) {

                // Make the date look nicer for front-end
                let date = new Date(response.data.list[weatherEntry].dt * 1000);
                date.setHours(0, 0, 0, 0);
                date = date.toLocaleDateString();

                // First check if there is a date entry for the given date, if not create one
                if (!forecastSummary[date]) {
                    forecastSummary[date] = {
                        temperatures: [],
                        windSpeeds: [],
                        rainfallLevels: []
                    }
                }

                // Extract temperature and wind speed data
                forecastSummary[date].temperatures.push(weatherData[weatherEntry].main.temp);
                forecastSummary[date].windSpeeds.push(weatherData[weatherEntry].wind.speed);

                // Check if there is any rain
                if (weatherData[weatherEntry].rain && weatherData[weatherEntry].rain['3h']) {
                    isRain = true;
                    forecastSummary[date].rainfallLevels.push(weatherData[weatherEntry].rain['3h']);
                }
            }

            // When finished extracting data, calculate averages
            for (dateEntry in forecastSummary) {
                forecastSummary[dateEntry].averageTemp = convertKelvinToCelsius(getAverage(forecastSummary[dateEntry].temperatures));
                forecastSummary[dateEntry].averageWind = getAverage(forecastSummary[dateEntry].windSpeeds);
                forecastSummary[dateEntry].rainfallLevels = getSum(forecastSummary[dateEntry].rainfallLevels);
                forecastSummary[dateEntry].temperatureRange = getMinMax(forecastSummary[dateEntry].temperatures);
            }

            // Get overall temperature sentiment
            temperatureSummary = getTemperatureSummary(forecastSummary);

            console.log(forecastSummary);
            console.log(isRain);
            console.log(forecastSentiment);

            // Send good response with result
            res.status(200);
            res.json({
                forecastSummary: forecastSummary,
                isRain: isRain,
                temperatureSummary: temperatureSummary
            });
        })
        .catch(error => {
            console.error(error);
            res.status(400);
            res.json({
                error: "Bad Request!"
            });
        })
}

// Returns a forecast sentiment (cold, warm, hot) and absolute min and max
function getTemperatureSummary(forecastSummary) {
    let max = 0;
    let min = forecastSummary[Object.keys(forecastSummary)[0]].averageTemp;
    let sentiment = null;

    let minMaxObj = {};

    // Loop over every day getting the absolute min and max values
    for (dateEntry in forecastSummary) {
        minMaxObj = forecastSummary[dateEntry].temperatureRange;

        // Check if the max on this day is more than current max
        if (minMaxObj.max >= max)
            max = minMaxObj.max;

        // Check if the min on this day is more than current max
        if (minMaxObj.min <= min)
            min = minMaxObj.min;
    }

    console.log(`Overall max is ${max}`);
    console.log(`Overall min is ${min}`);

    if(max >= 20.0)
        sentiment = "hot";
    
    else if (max <= 20.0 && min >= 10.0)
        sentiment = "warm";
    
    else
        sentiment = "cold";

    return {
        sentiment: sentiment,
        max: max,
        min: min
    }
}

// Returns the min and max of an array of values
function getMinMax(array) {
    let max = 0;
    let min = array[0];

    for (let i = 0; i < array.length; i++) {
        if (array[i] >= max)
            max = array[i];
        else if (array[i] < min)
            min = array[i];
    }

    return {
        min: convertKelvinToCelsius(min),
        max: convertKelvinToCelsius(max)
    };
}

// Converts the temperature from Kelvin to Celsius
function convertKelvinToCelsius(kelvin) {
    if (kelvin < (0)) {
        return 'below absolute zero (0 K)';
    } else {
        let celciusVal = kelvin - 273.15
        return Math.round(celciusVal * 100) / 100;
    }
}

// Returns the sum of an array of values
function getSum(array) {

    if (array.length == 0)
        return 0;

    let total = 0;

    for (let i = 0; i < array.length; i++) {
        total += array[i];
    }

    return Math.round(total * 100) / 100;
}

// Returns the average value of an array of values
function getAverage(array) {
    let total = 0;

    for (let i = 0; i < array.length; i++) {
        total += array[i];
    }
    let avg = total / array.length;

    return Math.round(avg * 100) / 100;
}