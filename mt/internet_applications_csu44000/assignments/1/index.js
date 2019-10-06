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

app.get('/random/:min/:max', sendRandom);

app.get('/forecast/:town', getForecast);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

function getForecast(req, res) {
    let town = req.params.town;
    console.log(`Generating weather forecast for town ${town}...`);

    forecastSummary = {};

    axios.get(`${apiURL}/forecast?q=${town}&APPID=${apiKEY}`)
        .then(response => {
            let weatherData = response.data.list;

            // Loop over OpenWeather API response and extract data
            for (weatherEntry in weatherData) {
                let date = new Date(response.data.list[weatherEntry].dt * 1000);
                date.setHours(0, 0, 0, 0);

                // First check if there is a date entry for the given date
                if (!forecastSummary[date]) {
                    forecastSummary[date] = {
                        temperatures: [],
                        windSpeeds: [],
                        rainfallLevels: []
                    }
                }

                // Extract temperature and win data
                forecastSummary[date].temperatures.push(weatherData[weatherEntry].main.temp);
                forecastSummary[date].windSpeeds.push(weatherData[weatherEntry].wind.speed);

                // Check if there is any rain
                if (weatherData[weatherEntry].rain) {
                    forecastSummary[date].rainfallLevels.push(weatherData[weatherEntry].rain['3h']);
                }
            }

            // When finished extracting data, calculate averages
            for(dateEntry in forecastSummary){
                forecastSummary[dateEntry].averageTemp = getAverage(forecastSummary[dateEntry].temperatures);
                forecastSummary[dateEntry].averageWind = getAverage(forecastSummary[dateEntry].windSpeeds);
                forecastSummary[dateEntry].rainfallLevels = getSum(forecastSummary[dateEntry].rainfallLevels);
                forecastSummary[dateEntry].temperatureRange = getMinMax(forecastSummary[dateEntry].temperatures)
            }

            console.log(forecastSummary);

            // Send good response with result
            res.status(200);
            res.json({
                result: response.data
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

// Returns the min and max of an array of values
function getMinMax(array) {
    var max = 0;
    var min = array[0];

    for (var i = 0; i < array.length; i++) {
        if(array[i] >= max)
            max = array[i];
        else if(array[i] < min)
            min = array[i];
    }

    return {
        min: min,
        max: max
    };
}

// Returns the sum of an array of values
function getSum(array) {
    var total = 0;

    for (var i = 0; i < array.length; i++) {
        total += array[i];
    }

    return total;
}

// Returns the average value of an array of values
function getAverage(array) {
    var total = 0;

    for (var i = 0; i < array.length; i++) {
        total += array[i];
    }
    var avg = total / array.length;

    return avg;
}

function sendRandom(req, res) {
    let min = parseInt(req.params.min);
    let max = parseInt(req.params.max);

    // Handle bad parameter request
    if (isNaN(min) || isNaN(max)) {
        res.status(400);
        res.json({
            error: "Bad Request!"
        });

        return;
    }

    // Generate random numbers
    console.log(`Generating random number between ${min} & ${max}...`);
    let result = Math.round((Math.random() * (max - min) + min));
    console.log(`Random number generated ${result}`);

    // Send good response with result
    res.status(200);
    res.json({
        result: result
    });

    return;
}