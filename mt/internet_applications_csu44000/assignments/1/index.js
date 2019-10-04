/*
 * CSU44000 - Weather API
 *
 * This is a simple Express API which will use the OpenWeather API
 * (https://openweathermap.org/api) to provide a simple 5 day forecast
 * to a web application which for any desired city.
 */
const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))