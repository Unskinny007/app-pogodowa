"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { api } from "~/trpc/react";
import type { WeatherData } from "~/types/weather";

interface WeatherCardProps {
  city?: string;
  onWeatherDataChange?: (data: WeatherData | null) => void;
}

export function WeatherCard({ city, onWeatherDataChange }: WeatherCardProps) {
  const [coordinates, setCoordinates] = useState<{lat: number; lon: number} | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [previousWeatherData, setPreviousWeatherData] = useState<WeatherData | null>(null);

  // Get weather by city or coordinates
  const { data: cityWeather, isLoading: cityLoading, error: cityError } = api.weather.getWeatherByCity.useQuery(
    { city: city || "Warsaw" },
    { enabled: !!city || !coordinates }
  );

  const { data: coordWeather, isLoading: coordLoading, error: coordError } = api.weather.getWeatherByCoords.useQuery(
    { lat: coordinates?.lat || 0, lon: coordinates?.lon || 0 },
    { enabled: !!coordinates && !city }
  );

  // Get user's location on component mount
  useEffect(() => {
    if (!city && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoordinates({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        (error) => {
          setLocationError("Unable to get location");
          console.error("Location error:", error);
        }
      );
    }
  }, [city]);

  const currentWeatherData = city ? cityWeather?.data : coordWeather?.data;
  const isLoading = city ? cityLoading : coordLoading;
  const error = city ? cityError : coordError;

  // Update previous data only when new data arrives
  useEffect(() => {
    if (currentWeatherData) {
      setPreviousWeatherData(currentWeatherData);
    }
  }, [currentWeatherData]);

  // Use current data if available, otherwise fall back to previous data
  const weatherData = currentWeatherData || previousWeatherData;

  // Notify parent component when weather data changes
  useEffect(() => {
    if (onWeatherDataChange) {
      onWeatherDataChange(currentWeatherData || null);
    }
  }, [currentWeatherData, onWeatherDataChange]);

  // Show initial loading only if no previous data exists
  if (isLoading && !weatherData) {
    return (
      <Card className="w-full bg-white/80 backdrop-blur-sm border-white/30 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            <span className="ml-4 text-gray-600">Ładowanie pogody...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !weatherData) {
    return (
      <Card className="w-full bg-white/80 backdrop-blur-sm border-white/30 shadow-sm">
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <h3 className="text-xl font-semibold mb-2">Błąd pobierania pogody</h3>
            <p>{error?.message || locationError || "Nie udało się pobrać danych pogodowych"}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full bg-white/80 backdrop-blur-sm border-white/30 shadow-sm relative">
      {/* Subtle loading indicator */}
      {isLoading && weatherData && (
        <div className="absolute top-2 right-2 z-10">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent bg-white/80 backdrop-blur-sm p-1 rounded-full shadow-sm"></div>
        </div>
      )}
      <CardContent className="p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          {/* Location */}
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-semibold text-gray-800">
              {weatherData.name}
            </h2>
            <p className="text-gray-600 mt-1">{weatherData.sys.country}</p>
          </div>

          {/* Main Weather Info */}
          <div className="flex items-center justify-center gap-8">
            <div className="text-center">
              <div className="text-6xl font-bold text-gray-800 leading-none">
                {Math.round(weatherData.main.temp)}°C
              </div>
              <div className="text-sm text-gray-600 mt-2">
                Odczuwalna: {Math.round(weatherData.main.feels_like)}°C
              </div>
            </div>
            
            <div className="text-center">
              <img 
                src={`https://openweathermap.org/img/wn/${weatherData.weather[0]?.icon}@4x.png`}
                alt={weatherData.weather[0]?.description || "Weather icon"}
                className="w-32 h-32 drop-shadow-lg"
              />
              <div className="text-lg text-gray-700 font-medium capitalize mt-2">
                {weatherData.weather[0]?.description}
              </div>
            </div>
          </div>

          {/* Weather Details */}
          <div className="space-y-2">
            <div className="flex justify-between items-center p-2 bg-white/70 rounded-lg backdrop-blur-sm">
              <span className="text-gray-600 font-medium">Wilgotność</span>
              <Badge variant="secondary" className="text-gray-800 text-sm">
                {weatherData.main.humidity}%
              </Badge>
            </div>
            
            <div className="flex justify-between items-center p-2 bg-white/70 rounded-lg backdrop-blur-sm">
              <span className="text-gray-600 font-medium">Ciśnienie</span>
              <Badge variant="secondary" className="text-gray-800 text-sm">
                {weatherData.main.pressure} hPa
              </Badge>
            </div>
            
            <div className="flex justify-between items-center p-2 bg-white/70 rounded-lg backdrop-blur-sm">
              <span className="text-gray-600 font-medium">Wiatr</span>
              <Badge variant="secondary" className="text-gray-800 text-sm">
                {Math.round(weatherData.wind?.speed || 0)} m/s
              </Badge>
            </div>
            
            <div className="flex justify-between items-center p-2 bg-white/70 rounded-lg backdrop-blur-sm">
              <span className="text-gray-600 font-medium">Widoczność</span>
              <Badge variant="secondary" className="text-gray-800 text-sm">
                {Math.round((weatherData.visibility || 0) / 1000)} km
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 