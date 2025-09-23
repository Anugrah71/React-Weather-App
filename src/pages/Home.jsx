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
  OpenMeteo,
  getAirQuality,
} from "../service/Weatherapi";

const Home = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [groupedDays, setGroupedDays] = useState([]);
  const [airQuality, setAirQuality] = useState(null);
  const [uvIndex, setUvIndex] = useState(null);
  const [OpenMeteoApi, setOpenMeteoApi] = useState(null);
  const [hourlyData, setHourlyData] = useState([]);

  const defaultCity = "Kozhikode";
  const date = new Date(weather?.dt * 1000);




const weatherIcons = {
  "01d": "☀️",  
  "01n": "🌙",  
  "02d": "🌤️", 
  "02n": "🌤️", 
  "03d": "☁️",  
  "03n": "☁️",
  "04d": "☁️",  
  "04n": "☁️",
  "09d": "🌧️", 
  "09n": "🌧️",
  "10d": "🌦️", 
  "10n": "🌧️", 
  "11d": "⛈️", 
  "11n": "⛈️",
  "13d": "❄️",
  "13n": "❄️",
  "50d": "🌫️", 
  "50n": "🌫️", 
};




const getBackgroundGradient = (weather) => {
  if (!weather || !weather.weather || !weather.weather[0]) return "#5F6086";

  const main = weather.weather[0].main; // Clear, Clouds, Rain...
  const currentTime = weather.dt;      
  const sunrise = weather.sys.sunrise;
  const sunset = weather.sys.sunset;

  // Determine time of day
  let timeOfDay = "day"; 
  const noon = sunrise + (sunset - sunrise) / 2;
  const oneHour = 3600;

  if (currentTime >= sunrise && currentTime < noon) timeOfDay = "morning";
  else if (currentTime >= noon && currentTime < sunset) timeOfDay = "afternoon";
  else if (currentTime >= sunset - oneHour && currentTime <= sunset + oneHour) timeOfDay = "evening";
  else timeOfDay = "night";

  // Gradient mapping
  const gradients = {
    morning: {
      Clear: "linear-gradient(135deg, #f9d423, #ff4e50)",
      Clouds: "linear-gradient(135deg, #a1c4fd, #c2e9fb)",
      Rain: "linear-gradient(135deg, #6a11cb, #2575fc)",   
    },
    afternoon: {
      Clear: "linear-gradient(135deg, #fceabb, #f8b500)",
      Clouds: "linear-gradient(135deg, #667db6, #0082c8)",
      Rain: "linear-gradient(135deg, #373b44, #4286f4)",
    },
    evening: {
      Clear: "linear-gradient(135deg, #ff7e5f, #feb47b)",  
      Clouds: "linear-gradient(135deg, #ff9966, #ff5e62)", 
      Rain: "linear-gradient(135deg, #4b79a1, #283e51)",  
    },
    night: {
      Clear: "linear-gradient(135deg, #141e30, #243b55)",
      Clouds: "linear-gradient(135deg, #283048, #859398)",
      Rain: "linear-gradient(135deg, #232526, #414345)",
    },
  };


  return gradients[timeOfDay][main] || gradients[timeOfDay]["Clear"];
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

    const openMeteoData = await OpenMeteo(latitude, longitude);
    setOpenMeteoApi(openMeteoData);

    setUvIndex(openMeteoData.daily.uv_index_max[0]);

    const minutelyData = openMeteoData.minutely_15.time.map((time, index) => ({
      time: new Date(time).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      temperature: openMeteoData.minutely_15.temperature_2m[index],
      precipitation: openMeteoData.minutely_15.precipitation[index],
    }));
    setHourlyData(minutelyData);

    const weatherData = await getWeather(city, API_KEY);
    setWeather(weatherData);

    const airQualityData = await getAirQuality(latitude, longitude, API_KEY);
    setAirQuality(airQualityData);

    const forecastData = await getForecast(city, API_KEY);
    setForecast(forecastData);
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
};

  return (
    <div
      className="flex flex-col md:flex-row gap-2 p-2 sm:p-4 w-full min-h-screen sm:h-screen  items-stretch"
      style={{ background: getBackgroundGradient(weather) }}
    >
      {/* Left Panel */}
      <div className="bg-[#FFFFFF]/30 shadow-sm shadow-white/50  flex flex-col  items-center gap-8 text-white justify-center pl-8 pr-8 pt-4 pb-4 rounded-lg w-full md:w-[400px] h-full">
        <SearchBar city={city} setCity={setCity} handleSearch={handleSearch} />

<p className="text-8xl sm:text-10xl md:text-11xl">{weatherIcons[weather?.weather[0]?.icon]}</p>


        <h2 className="text-6xl font-normal text-black ">
          {weather && Math.round(weather.main.temp)}°C
        </h2>
        <div className="w-full ">
          <div className="flex flex-row justify-between w-full text-sm mb-2">
            <h3 className="text-2xl font-bold text-black">{weather && weather.name}</h3>
            <h3 className="text-2xl font-bold text-black">{dayName}</h3>
          </div>

          <div className="w-full h-[4px] bg-white rounded-full " />
        </div>
        {forecast && forecast.list && (
          <div className="space-y-2 mt-4 w-full ">
            <div className="flex items-center gap-2">
              <img className="w-6 h-6" src={Temperature} alt="Min Temp" />
              <p className="text-lg m-0 text-black">
                Min Temperature -{" "}
                {Math.round(
                  Math.min(...forecast.list.map((item) => item.main.temp_min))
                )}
                °C
              </p>
            </div>
            <div className="flex items-center gap-2">
              <img className="w-6 h-6 text-black" src={Temperature} alt="Max Temp" />
              <p className="text-lg m-0 text-black">
                Max Temperature -{" "}
                {Math.round(
                  Math.max(...forecast.list.map((item) => item.main.temp_max))
                )}
                °C
              </p>
            </div>
          </div>
        )}
        <div className="flex flex-row gap-6 bg-[#FFFFFF]/30 shadow-sm shadow-white/50 mt-8  rounded-xl p-3 w-full">
          <div className="flex items-center gap-3">
            <img className="w-12 h-12" src={water} alt="Humidity Icon" />
            <div>
              <h3 className="text-lg font-bold m-0 mb-1 leading-none text-black">
                {weather && weather.main.humidity}%
              </h3>
              <p className="text-sm m-0 text-black">Humidity</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <img className="w-12 h-12" src={wind} alt="Wind Icon" />
            <div>
              <h3 className="text-lg font-bold m-0 mb-1 leading-none text-black">
                {weather && weather.wind.speed} km/h
              </h3>
              <p className="text-sm text-black m-0">Wind Speed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="bg-[#FFFFFF]/40 shadow-sm shadow-white/50 flex-1 p-4 rounded-lg h-full text-white">
        <div className="flex flex-row gap-4 justify-between  mb-6 overflow-x-auto md:overflow-x-visible">
          {groupedDays.map((day, idx) => (
            <div
              key={idx}
              className="bg-[#FFFFFF]/50 opacity-80 flex flex-1 flex-col items-center  justify-center rounded-lg p-4 "
            >
              <div className="w-full flex justify-between">
                <h3 className="text-xl mb-2 text-black">{getDayName(day[0].dt)}</h3>
                <h3 className="text-xl mb-2 text-black">{getDayMonth(day[0].dt)}</h3>
              </div>
              <div className="flex flex-row justify-between w-full ">
                <p className="text-6xl flex items-start ">
                  {weatherIcons[weather?.weather[0]?.icon]}
                </p>
                <div>
                  <p className="text-lg text-black">
                    {Math.round(
                      Math.min(...day.map((item) => item.main.temp_min))
                    )}
                    °C
                  </p>
                  <p className="text-lg text-black">
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
        {/* Today's Overview */}
        <h2 className="text-xl mb-4 text-black">Today's Overview</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6">
          <div className="bg-[#FFFFFF]/30 shadow-sm shadow-white/50 p-4 h-48 rounded-lg relative">
            <h3 className="text-lg mb-2 text-normal text-black">Air Quality Index</h3>

            <p className={"text-4xl font-bold mt-6 text-black"}>
              {airQuality && airQuality.list[0].main.aqi}
            </p>
            <p
              className={`${
                airQuality
                  ? airQuality.list[0].main.aqi < 2
                    ? "text-green-500"
                    : airQuality.list[0].main.aqi < 4
                    ? "text-yellow-500"
                    : "text-red-500"
                  : ""
              } text-lg font-bold mt-6 `}
            >
              {airQuality
                ? airQuality.list[0].main.aqi < 2
                  ? "Good"
                  : airQuality.list[0].main.aqi < 4
                  ? "Moderate"
                  : "Poor"
                : "Loading..."}
            </p>
            <img
              src={airPollution}
              alt=""
              className="absolute bottom-4 right-1 sm:bottom-4 sm:right-4 "
            />
          </div>
          <div className="bg-[#FFFFFF]/30 shadow-sm shadow-white/50 p-4 h-48 rounded-lg relative">
            <h3 className="text-lg text-normal mb-4 text-black">UV Index</h3>
            <p className="text-4xl font-bold mt-6 text-black">{uvIndex}</p>
            <p
              className={`${
                uvIndex
                  ? uvIndex >= 0 && uvIndex <= 2
                    ? "text-green-500"
                    : uvIndex > 2 && uvIndex <= 5
                    ? "text-yellow-500"
                    : "text-red-500"
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
          <div className="bg-[#FFFFFF]/30 shadow-sm shadow-white/50 p-4 h-48 rounded-lg relative">
            <h3 className="text-lg text-normal  mb-4 text-black">Pressure (hpa)</h3>
            <p className="text-4xl font-bold mt-6 text-black">
              {weather && weather.main.pressure}
            </p>
            <p
              className={`text-lg font-bold mt-6 ${
                weather &&
                weather.main.pressure >= 1010 &&
                weather.main.pressure <= 1020
                  ? "text-green-500"
                  : weather &&
                    (weather.main.pressure < 1000 ||
                      weather.main.pressure > 1030)
                  ? "text-red-500"
                  : "text-yellow-500"
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
              className="absolute bottom-4 right-1 sm:bottom-4 sm:right-4"
            />
          </div>

          <div className="bg-[#FFFFFF]/30 shadow-sm shadow-white/50 p-4 rounded-lg block sm:hidden">
            <h3 className="text-sm mb-2 text-black">Sunrise & Sunset</h3>
            <div className="flex items-center gap-3 mb-2 sm:mb-4">
              <span className="text-4xl md:text-6xl ">🌅</span>
              <p className="text-36 text-black">
               
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
              <p className="text-36 text-black">
                
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
          <div className="bg-[#FFFFFF]/30 shadow-sm shadow-white/50 p-4 rounded-lg w-screen sm:w-lg sm:h-58 flex-1">
           
              { <TemperatureChart hourlyData={hourlyData} />}
           
          </div>
          <div className="bg-[#FFFFFF]/30 shadow-sm shadow-white/50 p-4 block hidden sm:block rounded-lg w-65 h-58">
            <h3 className="text-sm mb-2 text-black">Sunrise & Sunset</h3>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-6xl ">🌅</span>
              <p className="text-36 text-black">
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
              <p className="text-36 text-black">
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
