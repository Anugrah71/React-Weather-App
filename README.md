# Weather App

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS"/>
  <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite"/>
  <img src="https://img.shields.io/badge/MUI-007FFF?style=for-the-badge&logo=mui&logoColor=white" alt="MUI X"/>
</p>
<div>
  <img src='./src/assets/Screenshot%202025-09-23%20142908.png'>
</div>

A modern, responsive weather dashboard built with **React** and **Tailwind CSS**.  
This app provides real-time weather, air quality, UV index, pressure, sunrise/sunset, and 5-day forecasts with dynamic backgrounds that change based on time of day and weather conditions.

---

## Features

- **Real-time Weather Data:**Get the latest current weather and hourly forecasts for any city
- **Search any city** using OpenWeather & Open-Meteo APIs
- **Current Weather:** Temperature, Humidity, Wind Speed, Pressure
- **24-Hour Temperature Chart** with custom tick scaling
- **5-Day Forecast** (grouped by day)
- **Dynamic Backgrounds** (Morning, Afternoon, Evening, Night)
- **Air Quality Index (AQI)** with status colors (Good / Moderate / Poor)
- **UV Index** with safety levels
- **Sunrise & Sunset** times
- **Responsive design** for mobile, tablet, and desktop

---

## Tech Stack

- **Frontend:** React, Tailwind CSS
- **State Management:** React Hooks (`useState`, `useEffect`)
- **Charting:** MUI X Charts (`LineChart`)
- **APIs:**
  - OpenWeatherMap API (Weather, Forecast, Air Pollution)
  - Open-Meteo API (UV Index, Hourly Forecast, Geocoding)

---

## Project Structure

```
src/
│── assets/                  # Weather icons & images
│   ├── air-pollution.png
│   ├── barometer.png
│   ├── uv.png
│   ├── water.png
│   ├── wind.png
│   └── Temperature 02.png
│
│── components/              # Reusable components
│   ├── SearchBar.jsx
│   └── TemperatureChart.jsx
│
│── service/                 # API service functions
│   └── Weatherapi.js
│
│── pages/
│   └── Home.jsx             # Main Dashboard page
│
│── App.jsx
│── main.jsx
│── index.css
```

---

## Installation & Setup

1. **Clone the repo**

   ```sh
   git clone https://github.com/Anugrah71/React-Weather-App.git
   cd weather-app
   ```

2. **Install dependencies**

   ```sh
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory and add your API key:

   ```
   VITE_API_KEY=your_openweather_api_key
   ```

4. **Run the project locally**
   ```sh
   npm run dev
   ```

---

## Deployment (Vercel)

1. **Set Environment Variable**  
   In your Vercel dashboard, add `VITE_API_KEY` in Project Settings → Environment Variables.

2. **Build & Output Settings**

   - Build Command: `vite build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **vercel.json**  
   Add this file to your project root for SPA routing:
   ```json
   {
     "rewrites": [{ "source": "/(.*)", "destination": "/" }]
   }
   ```

---

## UI Highlights

- **Dynamic Gradient Backgrounds:** Changes based on time of day and weather type.
- **Responsive Layout:** Mobile-friendly and desktop-optimized.
- **Charts:** Visualize temperature trends with interactive charts.

---

## Future Improvements

- Add more weather parameters (visibility, feels-like temperature)
- Location-based search (auto-detect user location)
- Save recent searches in local storage
- Dark/Light mode toggle

---

## Screenshots

_Add screenshots here to showcase your app UI._

---

## License

MIT
