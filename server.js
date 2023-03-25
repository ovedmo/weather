// Require node_modules
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();
const querystring = require('querystring');
// Configure dotenv package
require('dotenv').config();

// Set up our openweathermap API_KEY
const apiKey = `${process.env.API_KEY}`; 
//for test only, show api key
console.log(apiKey);

// Setup our express app and body-parser configurations
// Setup our javascript template view engine
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// Setup our default display on launch
app.get('/', function(req, res) {
    res.render('index', { weather: null, error: null });
});

// On a post request, the app shall data from OpenWeatherMap using the given arguments
app.post('/', function(req, res) {

    // Get city name passed in the form
    //be able using hebrew names
    let city = querystring.escape(req.body.city); 
    //just for test
    console.log(city);

    //the current code can get waether 3 hour interval
    //can be use to get 5-day forecast 
    //not supported in free version
    /*let url1 = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&cnt=7&appid=${apiKey}`;
    console.log(url1);
    request(url1, function(err, response, body) {
        if (err) {
            res.render('index', { weather: null, error: 'Error, please try again' });
        } else {
            let forcast = JSON.parse(body);
            console.log(forcast);
        }
    });*/

    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    console.log(url);
    // Request for data using the URL
    request(url, function(err, response, body) {
        // On return, check the json data fetched
        
        if (err) {
            console.log(err);
            res.render('index', { weather: null, error: "Error : please try again" });
        } else {
            let weather = JSON.parse(body);

            // output to make sure the data is what we want
            //just for test 
            console.log(weather);

            if (weather.main == undefined) {
                console.log(weather.message);
                res.render('index', { weather: null, error: weather.message });
            } else {
                // Prepare data for output
                let place = `${weather.name}, ${weather.sys.country}`,
                    weatherTemp = `${weather.main.temp}`,
                    weatherPressure = `${weather.main.pressure}`,
                    humidity = `${weather.main.humidity}`,
                    clouds = `${weather.clouds.all}`,  
                    visibility = `${weather.visibility}`,
                    condition = `${weather.weather[0].main}`,
                    weatherFahrenheit;
                    weatherFahrenheit = ((weatherTemp * 9 / 5) + 32);
                // round value of the degrees & fahrenheit
                function roundToTwo(num) {
                    return +(Math.round(num + "e+2") + "e-2");
                }
                weatherFahrenheit = roundToTwo(weatherFahrenheit);
                // We now render the data
                res.render('index', { weather: weather, place: place, temp: weatherTemp, pressure: weatherPressure,  humidity: humidity, fahrenheit: weatherFahrenheit, clouds: clouds, visibility: visibility, condition: condition, error: null });
            }
        }
    });
});

// port configurations
app.listen(5000, function() {
    console.log('Weather app listening on port 5000!');
});