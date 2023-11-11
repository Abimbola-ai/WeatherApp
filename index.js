const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
require("dotenv").config();

const apiKey = process.env.API_KEY;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.get("/", function (req, res) {
  res.render("index", { weather: null, error: null });
});

app.post("/", function (req, res) {
  let city = req.body.city;
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

  request(url, function (error, response, body) {
    if (error) {
      res.render("index", { weather: null, error: "Error, please try again" });
      console.log("error: ", error);
    } else {
      let weather = JSON.parse(body);
      console.log("body: ", body);
      if (weather.main == undefined) {
        res.render("index", { weather: null, error: "Error, please try again" });
      } else {
        let place = `${weather.name}, ${weather.sys.country}`,
          weatherTimezone = `${new Date(weather.dt * 1000 - weather.timezone * 1000)}`;
        let weatherTemp = `${weather.main.temp}`,
          weatherPressure = `${weather.main.pressure}`,
          weatherIcon = `http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`;
        weatherDescription = `${weather.weather[0].description}`,
          humidity = `${weather.main.humidity}`,
          clouds = `${weather.clouds.all}`,
          visibility = `${weather.visibility}`;
        main = `${weather.weather[0].main}`,
          weatherFahrenheit = (weatherTemp * 9) / 5 + 32;

        // Round off the value of the degrees Fahrenheit to two decimal places
        function roundToTwo(num) {
          return +(Math.round(num + "e+2") + "e-2");
        }
        weatherFahrenheit = roundToTwo(weatherFahrenheit);

        res.render("index", {
          weather: weather,
          place: place,
          temp: weatherTemp,
          pressure: weatherPressure,
          icon: weatherIcon,
          description: weatherDescription,
          timezone: weatherTimezone,
          humidity: humidity,
          fahrenheit: weatherFahrenheit,
          clouds: clouds,
          visibility: visibility,
          main: main,
          error: null,
        });
      }
    }
  });
});

app.listen(port, () => {
  console.log("Server running on port " + port);
});
