import React, { useState, useEffect } from "react";
import heavyRain from "../assets/heavy-rain.png";
import water from "../assets/water.png";
import wind from "../assets/wind.png";
import Temperature from "../assets/Temperature 02.png";
const API_KEY = import.meta.env.VITE_API_KEY;

import SearchBar from "../components/SearchBar";
import { getCoordinates, getWeather, getForecast, getUVIndex } from "../service/Weatherapi";

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
      setGroupedDays(grouped);
    }
  }, [forecast]);

  const handleSearch = async (city) => {
    if (!city) return;

    try {
      const { latitude, longitude } = await getCoordinates(city);

      const uvData = await getUVIndex(latitude, longitude);
      if (uvData && uvData.daily && uvData.daily.uv_index_max) {
        setUvIndex(uvData.daily.uv_index_max[0]);
      }

     

      const weatherData = await getWeather(city, API_KEY);
      setWeather(weatherData);

      const forecastData = await getForecast(city, API_KEY);
      setForecast(forecastData);

    } catch (error) {
      console.error("Error:", error);
    }
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
                {weather && weather.main.humidity}%</h3>
              <p className="text-xs m-0">Humidity</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <img className="w-12 h-12" src={wind} alt="Wind Icon" />
            <div>
              <h3 className="text-lg font-bold m-0 mb-1 leading-none">
                {weather && weather.wind.speed} km/h</h3>
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
              <h3 className="text-lg mb-2">{getDayName(day[0].dt)}</h3>
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
                {Math.round(Math.max(...day.map((item) => item.main.temp_max)))}°C
              </p>
            </div>
          ))}
        </div>

        <h2 className="text-xl mb-4">Today's Overview</h2>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-[#2D2F42] p-4 h-48 rounded-lg">
            <h3 className="text-sm mb-2">Air Quality Index</h3>
            <p className="text-2xl font-bold">53</p>
            <p className="text-green-400 text-sm">Good</p>
          </div>
          <div className="bg-[#2D2F42] p-4 h-48 rounded-lg">
            <h3 className="text-sm mb-2">UV Index</h3>
            <p className="text-2xl font-bold">{uvIndex}</p>
            <p className="text-yellow-400 text-sm">Moderate</p>
          </div>
          <div className="bg-[#2D2F42] p-4 h-48 rounded-lg">
            <h3 className="text-sm mb-2">Pressure (hpa)</h3>
            <p className="text-2xl font-bold">{weather && weather.main.pressure}</p>
            <p className="text-blue-400 text-sm">Normal</p>
          </div>
        </div>

        <div className="flex flex-row gap-4 w-full">
          <div className="bg-[#2D2F42] p-4 rounded-lg w-xl h-58 flex-1">
            <h3 className="text-sm mb-2">Precipitation</h3>
            <div className="h-full flex items-center justify-center text-gray-400 text-xs">
              Graph Here
            </div>
          </div>
          <div className="bg-[#2D2F42] p-4 rounded-lg w-65 h-58">
            <h3 className="text-sm mb-2">Sunrise & Sunset</h3>
            <p className="text-sm">🌅 Sunrise: {weather && new Date(weather.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            <p className="text-sm">🌇 Sunset: {weather && new Date(weather.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
