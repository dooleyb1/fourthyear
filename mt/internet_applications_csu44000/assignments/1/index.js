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

    axios.get(`${apiURL}/weather?q=Dublin,Ireland&APPID=${apiKEY}`)
        .then(response => {
            console.log(response.data);

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