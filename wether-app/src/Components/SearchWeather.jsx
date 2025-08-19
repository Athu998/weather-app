import React, { useState, useEffect } from "react";
import "./Weather.css";

export default function SearchWeather() {
  const [city, setCity] = useState("");
  const [days, setDays] = useState(1);
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleSearch = async () => {
    if (!city) {
      setError("Please enter a city name");
      return;
    }
    if (!days || days <= 0) {
      setError("Please enter valid number of days");
      return;
    }

    setError("");
    setLoading(true);
    setWeather(null);

    try {
      const response = await fetch(
        `http://localhost:9090/weather/forecast?city=${city}&days=${days}`
      );
      if (!response.ok) throw new Error("City not found");
      const data = await response.json();
      setWeather(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="weather-container">
      {showWelcome ? (
        <div className="welcome-screen">
          <h1>🌤️ Welcome to Weather App!</h1>
          <p>Get instant forecasts of your city</p>
        </div>
      ) : (
        <div className="weather-content">
          {/* Search Bar */}
          <div className="search-bar">
            <input
              type="text"
              placeholder="Enter city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <input
              type="number"
              min="1"
              max="10"
              placeholder="Days"
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
            />
            <button onClick={handleSearch}>Search</button>
          </div>

          {error && <p className="error">{error}</p>}
          {loading && <p>Loading weather...</p>}

          {weather && !loading && (
            <div className="weather-card">
              {/* Current Weather */}
              <div className="current-weather">
                <h2>{weather.weatherResponse.city}</h2>
                <h1>{weather.weatherResponse.temperature}°C</h1>
                <p>{weather.weatherResponse.condition}</p>
                <p className="feels">
                  Feels like {weather.weatherResponse.temperature}°C
                </p>
              </div>

              {/* Hourly Forecast */}
              <div className="hourly-forecast">
                <h3>Hourly forecast</h3>
                <div className="hourly-scroll">
                  {weather.hourlyTemp &&
                    weather.hourlyTemp.map((h, index) => (
                      <div key={index} className="hour-card">
                        <p>{h.time}</p>
                        <p>{h.temp}°C</p>
                        <span>{h.condition}</span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Daily Forecast */}
              <div className="daily-forecast">
                <h3>{days}-Day Forecast</h3>
                {weather.dayTemp.map((day, index) => (
                  <div key={index} className="day-card">
                    <p>{day.date}</p>
                    <p>{day.avgTemp}°C</p>
                    <p>
                      ⬆ {day.maxTemp}°C | ⬇ {day.minTemp}°C
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
