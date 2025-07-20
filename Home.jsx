
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
