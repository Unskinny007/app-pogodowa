import React, { useState, useEffect } from 'react';
import './Weather.css';

const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_KEY = 'd9bdd209513f088eb7a6ec299a076e34'; // Zastąp swoim kluczem
  const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

  useEffect(() => {
    getCurrentLocationWeather();
  }, []);

  const getCurrentLocationWeather = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherByCoords(latitude, longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
          fetchWeatherByCity('Warsaw');
        }
      );
    } else {
      fetchWeatherByCity('Warsaw');
    }
  };

  const fetchWeatherByCoords = async (lat, lon) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=pl`
      );
      
      if (!response.ok) {
        throw new Error('Weather data not found');
      }
      
      const data = await response.json();
      setWeatherData(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherByCity = async (city) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_URL}?q=${city}&appid=${API_KEY}&units=metric&lang=pl`
      );
      
      if (!response.ok) {
        throw new Error('Weather data not found');
      }
      
      const data = await response.json();
      setWeatherData(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="weather-container">
        <div className="weather-loading">
          <div className="loading-spinner"></div>
          <p>Ładowanie pogody...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="weather-container">
        <div className="weather-error">
          <h3>Błąd pobierania pogody</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!weatherData) {
    return (
      <div className="weather-container">
        <div className="weather-no-data">
          <p>Brak danych pogodowych</p>
        </div>
      </div>
    );
  }

  return (
    <div className="weather-container">
      <div className="weather-main">
        <div className="weather-location">
          <h2>{weatherData.name}</h2>
          <p>{weatherData.sys.country}</p>
        </div>
        
        <div className="weather-current">
          <div className="weather-temp-section">
            <div className="weather-temp">
              {Math.round(weatherData.main.temp)}°C
            </div>
            <div className="weather-feels-like">
              Odczuwalna: {Math.round(weatherData.main.feels_like)}°C
            </div>
          </div>
          
          <div className="weather-icon-section">
            <img 
              src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png`}
              alt={weatherData.weather[0].description}
              className="weather-icon"
            />
            <div className="weather-description">
              {weatherData.weather[0].description}
            </div>
          </div>
        </div>
        
        <div className="weather-details">
          <div className="weather-detail-item">
            <span className="detail-label">Wilgotność</span>
            <span className="detail-value">{weatherData.main.humidity}%</span>
          </div>
          <div className="weather-detail-item">
            <span className="detail-label">Ciśnienie</span>
            <span className="detail-value">{weatherData.main.pressure} hPa</span>
          </div>
          <div className="weather-detail-item">
            <span className="detail-label">Wiatr</span>
            <span className="detail-value">{Math.round(weatherData.wind?.speed || 0)} m/s</span>
          </div>
          <div className="weather-detail-item">
            <span className="detail-label">Widoczność</span>
            <span className="detail-value">{Math.round((weatherData.visibility || 0) / 1000)} km</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Weather;
