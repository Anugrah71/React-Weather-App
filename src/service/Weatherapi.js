

export const getCoordinates = async (city) => {
  const response = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
  );
  const data = await response.json();

  if (data.results && data.results.length > 0) {
    const { latitude, longitude } = data.results[0];
    return { latitude, longitude };
  } else {
    throw new Error("City not found");
  }
};

export const getWeather = async (city, apiKey) => {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
  );
  return response.json();
};

export const getForecast = async (city, apiKey) => {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`
  );
  return response.json();
};

export const getUVIndex = async (latitude, longitude) => {
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=uv_index_max&hourly=temperature_2m`
  );
  return response.json();
};
