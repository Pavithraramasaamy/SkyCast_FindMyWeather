# SkyCast - Find My Weather
## Date:20-072025
## Objective:
To build a responsive single-page application using React that allows users to enter a city name and retrieve real-time weather information using the OpenWeatherMap API. This project demonstrates the use of Axios for API calls, React Router for navigation, React Hooks for state management, controlled components with validation, and basic styling with CSS.
## Tasks:

#### 1. Project Setup
Initialize React app.

Install necessary dependencies: npm install axios react-router-dom

#### 2. Routing
Set up BrowserRouter in App.js.

Create two routes:

/ – Home page with input form.

/weather – Page to display weather results.

#### 3. Home Page (City Input)
Create a controlled input field for the city name.

Add validation to ensure the input is not empty.

On valid form submission, navigate to /weather and store the city name.

#### 4. Weather Page (API Integration)
Use Axios to fetch data from the OpenWeatherMap API using the city name.

Show temperature, humidity, wind speed, and weather condition.

Convert and display temperature in both Celsius and Fahrenheit using useMemo.

#### 5. React Hooks
Use useState for managing city, weather data, and loading state.

Use useEffect to trigger the Axios call on page load.

Use useCallback to optimize form submit handler.

Use useMemo for temperature conversion logic.

#### 6. UI Styling (CSS)
Create a responsive and clean layout using CSS.

Style form, buttons, weather display cards, and navigation links.

## Programs:

## Home.jsx:
```

import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const [city, setCity] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (!city.trim()) {
        setError("Please enter a city name.");
        return;
      }
      setError("");
      sessionStorage.setItem("city", city.trim());
      navigate("/weather");
    },
    [city, navigate]
  );

  return (
    <div className="container">
      <form className="form-box" onSubmit={handleSubmit}>
        <h1>Find My Weather</h1>
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={e => setCity(e.target.value)}
          className="city-input"
        />
        {error && <div className="error">{error}</div>}
        <button type="submit">Get Weather</button>
      </form>
    </div>
  );
}

export default Home;


```
## Weather.jsx:

```
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

```

## App.css:
```
body {
  margin: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(to top right, #6ee7b7 0%, #3b82f6 100%);
  min-height: 100vh;
}

.navbar {
  background: #064e3b;
  color: #fff;
  padding: 1.5rem 1rem;
  font-size: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  font-weight: bold;
  letter-spacing: 1px;
}

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 75vh;
  padding: 1rem;
}

.form-box {
  background: #f0fdf4;
  padding: 2.5rem 3rem;
  border-radius: 16px;
  box-shadow: 0 6px 32px rgba(0, 0, 0, 0.15);
  max-width: 420px;
  width: 100%;
}

.form-box h1 {
  margin-bottom: 1.5rem;
  color: #047857;
  text-align: center;
  font-size: 2rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.15);
}

.city-input {
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border-radius: 8px;
  border: 1px solid #a7f3d0;
  font-size: 1rem;
}

button[type="submit"],
.back-btn {
  background: #059669;
  color: #fff;
  padding: 0.7rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  margin-top: 0.5rem;
  transition: background 0.2s;
}

button[type="submit"]:hover,
.back-btn:hover {
  background: #047857;
}

.back-btn {
  margin-top: 2rem;
  margin-bottom: 1.5rem;
}

.weather-card {
  background: #ecfdf5;
  padding: 2rem;
  border-radius: 18px;
  box-shadow: 0 6px 28px rgba(0, 0, 0, 0.1);
  max-width: 460px;
  width: 100%;
  text-align: left;
  color: #064e3b;
  margin-top: 1.25rem;
  font-size: 1.1rem;
}

.weather-card h2 {
  color: #065f46;
  margin-bottom: 1rem;
  text-align: center;
  font-size: 1.5rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-shadow: 1px 1px 1px rgba(0,0,0,0.1);
}

.error {
  color: #b91c1c;
  padding: 0.5rem 0 0.5rem 0.5rem;
  font-size: 1rem;
}

.loader {
  color: #065f46;
  font-size: 1.5rem;
  font-weight: 600;
  text-align: center;
  margin-top: 1rem;
}

@media (max-width: 600px) {
  .form-box,
  .weather-card {
    padding: 1.25rem;
  }
  .container {
    min-height: 90vh;
  }
}


```

## App.jsx:
```
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./assets/Home";
import Weather from "./assets/Weather";
import "./App.css";

function App() {
  return (
    <Router>
      <div>
        <nav className="navbar">
          <h2>SkyCast </h2>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/weather" element={<Weather />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

```

## index.jsx:
```
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
reportWebVitals();

```

## Output:

<img width="1917" height="1015" alt="image" src="https://github.com/user-attachments/assets/ce662a3d-d871-403c-80c8-4bfc0a72beee" />


<img width="1919" height="1020" alt="Screenshot 2025-07-20 134746" src="https://github.com/user-attachments/assets/dabce9eb-7cad-409b-a9b6-0932b8a71488" />


## Result:
A responsive single-page application using React that allows users to enter a city name and retrieve real-time weather information using the OpenWeatherMap API has been built successfully. 
