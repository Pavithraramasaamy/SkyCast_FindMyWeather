import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const OPEN_WEATHER_API_KEY = "bd5e378503939ddaee76f12ad7a97608";

function Weather() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedCity = sessionStorage.getItem("city");
    if (!storedCity) {
      navigate("/");
      return;
    }

    setLoading(true);
    setError("");
    setWeather(null);

    const fetchWeather = async () => {
      try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          storedCity
        )}&appid=${OPEN_WEATHER_API_KEY}&units=metric`;
        const response = await axios.get(url);
        setWeather(response.data);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setError("City not found! Try another city.");
        } else if (err.response && err.response.status === 401) {
          setError("Invalid API key.");
        } else {
          setError("Failed to fetch weather data. Try again later.");
        }
      }
      setLoading(false);
    };

    fetchWeather();
  }, [navigate]);

  const temps = useMemo(() => {
    if (!weather) return {};
    const celsius = weather.main.temp;
    const fahrenheit = (celsius * 9) / 5 + 32;
    return {
      celsius: celsius.toFixed(1),
      fahrenheit: fahrenheit.toFixed(1),
    };
  }, [weather]);

  return (
    <div className="container">
      <button className="back-btn" onClick={() => navigate("/")}>⬅ Back</button>
      {loading ? (
        <div className="loader">Loading...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : weather ? (
        <div className="weather-card">
          <h2>
            Weather in {weather.name}, {weather.sys.country}
          </h2>
          <p>
            <strong>Condition:</strong> {weather.weather[0].main} (
            {weather.weather[0].description})
          </p>
          <p>
            <strong>Temperature:</strong> {temps.celsius}°C / {temps.fahrenheit}°F
          </p>
          <p>
            <strong>Humidity:</strong> {weather.main.humidity}%
          </p>
          <p>
            <strong>Wind Speed:</strong> {weather.wind.speed} m/s
          </p>
        </div>
      ) : null}
    </div>
  );
}

export default Weather;