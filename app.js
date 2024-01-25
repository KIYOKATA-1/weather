'use strict';
const express = require("express");
const axios = require("axios");
const app = express();
const server = require('http').createServer(app);
const transliteration = require('transliteration');

app.set("view engine", "ejs");

app.use('/public', express.static(__dirname + '/public'));
console.log(__dirname);

app.get("/", (req, res) => {
    res.render("index", { weather: null, error: null });
  });
  

app.get("/weather", async (req, res) => {
  const city = req.query.city;
  const apiKey = "c5b472fbf9019782c20663ffa0f33561";

  const latinCity = transliteration.transliterate(city);


  const APIUrl = `https://api.openweathermap.org/data/2.5/weather?q=${latinCity}&units=metric&appid=${apiKey}`;
  let weather;
  let error = null;
  try {
    const response = await axios.get(APIUrl);
    weather = response.data;
    console.log(weather);
    console.log(weather.coord);

    const sunriseTimestamp = new Date(weather.sys.sunrise * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    const sunsetTimestamp = new Date(weather.sys.sunset * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

    weather.sunrise = sunriseTimestamp;
    weather.sunset = sunsetTimestamp;

    
    const feelsLike = response.data.main.feels_like;
    const maxTemperature = response.data.main.temp_max;

    weather.main.temp_max = maxTemperature;
    weather.main.feels_like = feelsLike;
    
  } catch (error) {
    weather = null;
    error = "Error, Please try again";
  }
  res.render("index", { weather, error });
});

const port = process.env.PORT || 3000;
app.listen(port,'127.0.0.1', () => {
  console.log(`App is running on port ${port}`);
});