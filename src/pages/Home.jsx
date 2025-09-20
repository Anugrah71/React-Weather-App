import { useState, useEffect } from "react";
import airPollution from "../assets/air-pollution.png";
import barometer from "../assets/barometer.png";
import uvindex from "../assets/uv.png";
import water from "../assets/water.png";
import wind from "../assets/wind.png";
import Temperature from "../assets/Temperature 02.png";
import TemperatureChart from "../components/TemperatureChart";
const API_KEY = import.meta.env.VITE_API_KEY;

import SearchBar from "../components/SearchBar";
import {
  getCoordinates,
  getWeather,
  getForecast,
  getUVIndex,
  getAirQuality,
} from "../service/Weatherapi";

const Home = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [groupedDays, setGroupedDays] = useState([]);
  const [airQuality, setAirQuality] = useState(null);
  const [uvIndex, setUvIndex] = useState(null);
  const [hourlyData, setHourlyData] = useState([]);

  const defaultCity = "Kozhikode";
  const date = new Date(weather?.dt * 1000);
  console.log(">>>>>>>>>>>>>", date);

  const weatherEmojis = {
    Clear: "☀️",
    Clouds: "☁️",
    Rain: "🌧️",
    Drizzle: "🌦️",
    Thunderstorm: "⛈️",
    Snow: "❄️",
    Mist: "🌫️",
    Smoke: "💨",
    Haze: "🌁",
    Dust: "🏜️",
    Fog: "🌫️",
    Sand: "🏜️",
    Ash: "🌋",
    Squall: "🌬️",
    Tornado: "🌪️",
  };

  const weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const airQualityLevels = {
    1: { label: "Good", color: "text-green-400" },
    2: { label: "Fair", color: "text-yellow-400" },
    3: { label: "Moderate", color: "text-orange-400" },
    4: { label: "Poor", color: "text-red-400" },
    5: { label: "Very Poor", color: "text-red-600" },
  };
  const dayName = weekDays[date.getDay()];

  const getDayName = (dt) => {
    const date = new Date(dt * 1000);
    return date.toLocaleDateString("en-US", { weekday: "short" });
  };
  const getDayMonth = (dt) => {
    const date = new Date(dt * 1000);
    return date.toLocaleDateString("en-US", { day: "numeric" });
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

      const hourlyData = uvData.hourly.time.map((time, index) => ({
        time: new Date(time).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        temperature: uvData.hourly.temperature_2m[index],
        precipitation: uvData.hourly.precipitation[index],
      }));
      setHourlyData(hourlyData);
      console.log(">>>>>>>>>>>", hourlyData);

      const weatherData = await getWeather(city, API_KEY);
      setWeather(weatherData);

      const airQualityData = await getAirQuality(latitude, longitude, API_KEY);
      setAirQuality(airQualityData);

      const forecastData = await getForecast(city, API_KEY);
      setForecast(forecastData);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-2 p-4 w-full min-h-screen bg-red-900 items-stretch">
      {/* Left Panel */}
      <div className="bg-[#5F6086] flex flex-col items-center gap-8 text-white justify-center pl-8 pr-8 pt-4 pb-4 rounded-lg w-full md:w-[400px] h-full">
        <SearchBar city={city} setCity={setCity} handleSearch={handleSearch} />

        <p className="text-9xl">{weatherEmojis[weather?.weather[0]?.main]}</p>

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
        <div className="flex flex-row gap-4 justify-between  mb-6 overflow-x-auto md:overflow-x-visible">
          {groupedDays.map((day, idx) => (
            <div
              key={idx}
              className="bg-[#2D2F42] flex flex-1 flex-col items-center  justify-center rounded-lg p-4 "
            >
              <div className="w-full flex justify-between">
                <h3 className="text-xl mb-2">{getDayName(day[0].dt)}</h3>
                <h3 className="text-xl mb-2">{getDayMonth(day[0].dt)}</h3>
              </div>
              <div className="flex flex-row justify-between w-full ">
                <p className="text-6xl flex items-start">
                  {weatherEmojis[day[0].weather[0].main]}
                </p>
                <div>
                  <p className="text-lg">
                    {Math.round(
                      Math.min(...day.map((item) => item.main.temp_min))
                    )}
                    °C
                  </p>
                  <p className="text-lg">
                    {Math.round(
                      Math.max(...day.map((item) => item.main.temp_max))
                    )}
                    °C
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-xl mb-4">Today's Overview</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-[#2D2F42] p-4 h-48 rounded-lg relative">
            <h3 className="text-sm mb-2">Air Quality Index</h3>

            <p className={"text-4xl font-bold mt-6"}>
              {airQuality && airQuality.list[0].main.aqi}
            </p>
            <p
              className={`${
                airQuality &&
                airQualityLevels[airQuality.list[0].main.aqi].color
              } text-lg font-bold mt-6`}
            >
              {(airQuality &&
                airQualityLevels[airQuality.list[0].main.aqi].label) ||
                "Loading..."}
            </p>
            <img
              src={airPollution}
              alt=""
              className="absolute bottom-4 right-4 "
            />
          </div>
          <div className="bg-[#2D2F42] p-4 h-48 rounded-lg relative">
            <h3 className="text-sm mb-4">UV Index</h3>
            <p className="text-4xl font-bold mt-6">{uvIndex}</p>
            <p
              className={`${
                uvIndex
                  ? uvIndex >= 0 && uvIndex <= 2
                    ? "text-green-400"
                    : uvIndex > 2 && uvIndex <= 5
                    ? "text-yellow-400"
                    : "text-red-400"
                  : ""
              } text-lg mt-6 font-bold`}
            >
              {uvIndex
                ? uvIndex >= 0 && uvIndex <= 2
                  ? "Good"
                  : uvIndex > 2 && uvIndex <= 5
                  ? "Moderate"
                  : "High"
                : "Loading..."}
            </p>
            <img src={uvindex} alt="" className="absolute bottom-4 right-4 " />
          </div>
          <div className="bg-[#2D2F42] p-4 h-48 rounded-lg relative">
            <h3 className="text-sm  mb-4">Pressure (hpa)</h3>
            <p className="text-4xl font-bold mt-6">
              {weather && weather.main.pressure}
            </p>
            <p
              className={`text-lg font-bold mt-6 ${
                weather &&
                weather.main.pressure >= 1010 &&
                weather.main.pressure <= 1020
                  ? "text-green-400"
                  : weather &&
                    (weather.main.pressure < 1000 ||
                      weather.main.pressure > 1030)
                  ? "text-red-400"
                  : "text-white-400"
              }`}
            >
              {weather?.main?.pressure
                ? weather.main.pressure >= 1010 && weather.main.pressure <= 1020
                  ? "Good"
                  : weather.main.pressure < 1000 || weather.main.pressure > 1030
                  ? "High"
                  : "Moderate"
                : "Loading..."}
            </p>
            <img
              src={barometer}
              alt=""
              className="absolute bottom-4 right-4 "
            />
          </div>

          <div className="bg-[#2D2F42] p-4 rounded-lg block sm:hidden">
            <h3 className="text-sm mb-2">Sunrise & Sunset</h3>
            <div className="flex items-center gap-3 mb-2 sm:mb-4">
              <span className="text-4xl md:text-6xl ">🌅</span>
              <p className="text-36">
                {" "}
                Sunrise:{" "}
                {weather &&
                  new Date(weather.sys.sunrise * 1000).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-4xl sm:text-6xl ">🌇</span>
              <p className="text-36">
                {" "}
                Sunset:{" "}
                {weather &&
                  new Date(weather.sys.sunset * 1000).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-row gap-4 w-full">
          <div className="bg-[#2D2F42] p-4 rounded-lg w-screen sm:w-lg sm:h-58 flex-1">
            <h3 className="text-sm mb-2">Precipitation</h3>
            <div className="sm:h-48 sm:w-150 flex items-center justify-center text-gray-400 text-xs">
              {/* <TemperatureChart hourlyData={hourlyData} /> */}
            </div>
          </div>
          <div className="bg-[#2D2F42] p-4 block hidden sm:block rounded-lg w-65 h-58">
            <h3 className="text-sm mb-2">Sunrise & Sunset</h3>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-6xl ">🌅</span>
              <p className="text-36">
                {" "}
                Sunrise:{" "}
                {weather &&
                  new Date(weather.sys.sunrise * 1000).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-6xl ">🌇</span>
              <p className="text-36">
                {" "}
                Sunset:{" "}
                {weather &&
                  new Date(weather.sys.sunset * 1000).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
