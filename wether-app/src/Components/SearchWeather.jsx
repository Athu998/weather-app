import React, { useState, useEffect } from "react";
import "./Weather.css"; 

export default function SearchWeather() {
  const [city, setCity] = useState("");
  const [days, setDays] = useState(1); // NEW: default to 1 day
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

  const getBackground = () => {
    if (!weather) return "url('https://source.unsplash.com/1600x900/?nature,sky')";
    const condition = weather.weatherResponse.condition.toLowerCase();
    if (condition.includes("cloud")) return "url('https://source.unsplash.com/1600x900/?cloudy')";
    if (condition.includes("rain")) return "url('https://source.unsplash.com/1600x900/?rain')";
    if (condition.includes("sun") || condition.includes("clear")) return "url('https://source.unsplash.com/1600x900/?sunny')";
    return "url('https://source.unsplash.com/1600x900/?weather')";
  };

  return (
    <div className="weather-app" style={{ backgroundImage: getBackground() }}>
      {showWelcome ? (
        <div className="welcome-screen">
          <h1>🌤️ Welcome to Weather App!</h1>
          <p>Get instant forecasts of your city</p>
        </div>
      ) : (
        <div className="content">
          <h2>Weather App</h2>
          <input
            type="text"
            placeholder="Enter city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <div className="days-selector">
            <button onClick={() => setDays(1)} className={days === 1 ? "active" : ""}>1 Day</button>
            <button onClick={() => setDays(2)} className={days === 2 ? "active" : ""}>2 Days</button>
            <button onClick={() => setDays(3)} className={days === 3 ? "active" : ""}>3 Days</button>
          </div>
          <button onClick={handleSearch}>Search</button>

          {error && <p className="error">{error}</p>}

          {loading && (
            <div className="loader">
              <div className="spinner"></div>
              <p>Fetching weather...</p>
            </div>
          )}

          {weather && !loading && (
            <div className="weather-card fade-in">
              <h3>
                {weather.weatherResponse.city},{" "}
                {weather.weatherResponse.country}
              </h3>
              <p>Condition: {weather.weatherResponse.condition}</p>
              <p>Temperature: {weather.weatherResponse.temperature} °C</p>

              <h4>Daily Forecast:</h4>
              {weather.dayTemp.map((day, index) => (
                <div key={index} className="forecast-day">
                  <p>{day.date}</p>
                  <p>🌡️ Avg: {day.avgTemp} °C</p>
                  <p>⬆️ Max: {day.maxTemp} °C | ⬇️ Min: {day.minTemp} °C</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
