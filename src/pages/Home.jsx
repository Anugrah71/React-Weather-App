import React from "react";
import { useState, useEffect } from "react";
import heavyRain from "../assets/heavy-rain.png";
import water from "../assets/water.png";
import wind from "../assets/wind.png";
import Temperature from "../assets/Temperature 02.png";

import SearchBar from "../components/SearchBar";

const Home = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [groupedDays, setGroupedDays] = useState([]);
  const [uvIndex , setUvIndex] = useState(null);

  const defaultCity = "Kozhikode";
  const date = new Date(weather?.dt * 1000);

  const weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const dayName = weekDays[date.getDay()];
  console.log("Day Name:", dayName);

  const getDayName = (dt) => {
    const date = new Date(dt * 1000);
    return date.toLocaleDateString("en-US", { weekday: "short" });
  };

  const groupByDay = (list) => {
    const days = {};

    list.forEach((item) => {
      const date = new Date(item.dt * 1000).toDateString();
      if (!days[date]) {
        days[date] = [];
      }
      days[date].push(item);
    });

    return Object.values(days).slice(0, 5);
  };
  useEffect(() => {
    handleSearch(defaultCity);
  }, []);

  useEffect(() => {
    if (forecast) {
      const grouped = groupByDay(forecast.list);
      console.log("Grouped days:", grouped);
      setGroupedDays(grouped);
    }
  }, [forecast]);

  const handleSearch = async (city) => {
    if (!city) return;

    fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`)
      .then((response) => response.json())
      .then((geoData) => {
        if (geoData.results && geoData.results.length > 0) {
          const { latitude, longitude } = geoData.results[0];

          
          const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=uv_index_max&hourly=temperature_2m
`;
console.log("Weather URL:><<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>", weatherUrl);

          return fetch(weatherUrl);
        } else {
          throw new Error("City not found");
        }
      })
      .then((response) => response.json())
      .then((weatherData) => {
        console.log("Weather Data>>>>>>>>>>>>>>>>>>>>>>>>:", weatherData);
        if (weatherData && weatherData.daily && weatherData.daily.uv_index_max) {
          setUvIndex(weatherData.daily.uv_index_max[0]);
          console.log("UV Index:", weatherData.daily.uv_index_max[0]);
        }

      })
      .catch((error) => {
        console.error("Error:", error);
      });

    const API_KEY = import.meta.env.VITE_API_KEY;

    console.log("Searching for:", city, API_KEY);
    const WeatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
    );
    const WeatherData = await WeatherResponse.json();
    setWeather(WeatherData);
    console.log("Weather data:", WeatherData);
    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
    );
    const forecastData = await forecastResponse.json();
    setForecast(forecastData);
  };
  return (
    <div className="flex flex-row gap-2 p-4 w-full h-screen bg-gray-100 items-stretch">
      {/* Left Panel */}
      <div className="bg-[#5F6086] flex flex-col items-center gap-8 text-white w-[400px] pl-8 pr-8 pt-4 pb-4 rounded-lg h-full">
        <SearchBar city={city} setCity={setCity} handleSearch={handleSearch} />

        <img
          className="w-40 h-40 object-cover "
          src={
            weather &&
            new URL(
              `../assets/${weather?.weather[0]?.main}.png`,
              import.meta.url
            ).href
          }
          alt="Weather Icon"
        />

        <h2 className="text-6xl font-normal ">
          {weather && Math.round(weather.main.temp)}°C
        </h2>
        <div className="w-full ">
          <div className="flex flex-row justify-between w-full text-sm mb-2">
            <h3 className="text-2xl font-bold">{weather && weather.name}</h3>
            <h3 className="text-2xl font-bold">{dayName}</h3>
          </div>

          <div className="w-full h-[4px] bg-white rounded-full " />
        </div>
        {forecast && forecast.list && (
          <div className="space-y-2 mt-4 w-full ">
            <div className="flex items-center gap-2">
              <img className="w-6 h-6" src={Temperature} alt="Min Temp" />
              <p className="text-sm m-0">
                Min Temperature -{" "}
                {Math.round(
                  Math.min(...forecast.list.map((item) => item.main.temp_min))
                )}
                °C
              </p>
            </div>
            <div className="flex items-center gap-2">
              <img className="w-6 h-6" src={Temperature} alt="Max Temp" />
              <p className="text-sm m-0">
                Max Temperature -{" "}
                {Math.round(
                  Math.max(...forecast.list.map((item) => item.main.temp_max))
                )}
                °C
              </p>
            </div>
          </div>
        )}
        <div className="flex flex-row gap-6 bg-[#2D2F42] mt-8  rounded-xl p-3 w-full">
          <div className="flex items-center gap-3">
            <img className="w-12 h-12" src={water} alt="Humidity Icon" />
            <div>
              <h3 className="text-lg font-bold m-0 mb-1 leading-none">
                {weather && weather.main.humidity}%
              </h3>
              <p className="text-xs m-0">Humidity</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <img className="w-12 h-12" src={wind} alt="Wind Icon" />
            <div>
              <h3 className="text-lg font-bold m-0 mb-1 leading-none">
                {weather && weather.wind.speed} km/h
              </h3>
              <p className="text-xs m-0">Wind Speed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="bg-[#5F6086] flex-1 p-4 rounded-lg h-full text-white">
        <div className="flex flex-row gap-3 justify-between mb-6">
          {groupedDays.map((day, idx) => (
            <div
              key={idx}
              className="bg-[#2D2F42] flex flex-col items-center justify-around rounded-lg p-3 h-40 w-40"
            >
              <h3 className="text-lg mb-2">
                {getDayName(day[0].dt)} {console.log("Days:", groupedDays)}
              </h3>

              <img
                className="w-20 h-20 "
                src={
                  day &&
                  new URL(
                    `../assets/${day[0].weather[0].main}.png`,
                    import.meta.url
                  ).href
                }
                alt="Weather Icon"
              />
              <p className="text-lg">
                {Math.round(Math.max(...day.map((item) => item.main.temp_max)))}
                °C
              </p>
            </div>
          ))}
        </div>

        {/* Today’s Overview */}
        <h2 className="text-xl mb-4">Today's Overview</h2>
        <div className="grid grid-cols-3 gap-4 mb-6">
          {/* Air Quality */}
          <div className="bg-[#2D2F42] p-4 h-48 rounded-lg">
            <h3 className="text-sm mb-2">Air Quality Index</h3>
            <p className="text-2xl font-bold">53</p>
            <p className="text-green-400 text-sm">Good</p>
          </div>
          {/* UV Index */}
          <div className="bg-[#2D2F42] p-4 h-48 rounded-lg">
            <h3 className="text-sm mb-2">UV Index</h3>
            <p className="text-2xl font-bold">{uvIndex}</p>
            <p className="text-yellow-400 text-sm">Moderate</p>
          </div>
          {/* Pressure */}
          <div className="bg-[#2D2F42] p-4 h-48 rounded-lg">
            <h3 className="text-sm mb-2">Pressure (hpa)</h3>
            <p className="text-2xl font-bold">
              {weather && weather?.main?.pressure}
            </p>
            <p className="text-blue-400 text-sm">Normal</p>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="flex flex-row gap-4 w-full">
          {/* Precipitation */}
          <div className="bg-[#2D2F42] p-4 rounded-lg w-xl h-58 flex-1">
            <h3 className="text-sm mb-2">Precipitation</h3>
            <div className="h-full flex items-center justify-center text-gray-400 text-xs">
              Graph Here
            </div>
          </div>
          {/* Sunrise & Sunset */}
          <div className="bg-[#2D2F42] p-4 rounded-lg w-65 h-58">
            <h3 className="text-sm mb-2">Sunrise & Sunset</h3>
            <p className="text-sm">🌅 Sunrise: 7:06 AM</p>
            <p className="text-sm">🌇 Sunset: 7:03 PM</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
