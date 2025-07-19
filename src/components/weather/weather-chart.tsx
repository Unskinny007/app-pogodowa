"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Calendar, Thermometer } from "lucide-react";
import { api } from "~/trpc/react";
import type { ForecastItem, ForecastData } from "~/types/weather";

interface WeatherChartProps {
  city?: string;
}

export function WeatherChart({ city }: WeatherChartProps) {
  const [coordinates, setCoordinates] = useState<{lat: number; lon: number} | null>(null);
  const [previousForecastData, setPreviousForecastData] = useState<ForecastData | null>(null);

  // Get forecast by city or coordinates
  const { data: cityForecast, isLoading: cityLoading, error: cityError } = api.weather.getForecastByCity.useQuery(
    { city: city || "Warsaw" },
    { enabled: !!city || !coordinates }
  );

  const { data: coordForecast, isLoading: coordLoading, error: coordError } = api.weather.getForecastByCoords.useQuery(
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
          console.error("Location error:", error);
        }
      );
    }
  }, [city]);

  const currentForecastData = city ? cityForecast?.data : coordForecast?.data;
  const isLoading = city ? cityLoading : coordLoading;
  const error = city ? cityError : coordError;

  // Update previous data only when new data arrives
  useEffect(() => {
    if (currentForecastData) {
      setPreviousForecastData(currentForecastData);
    }
  }, [currentForecastData]);

  // Use current data if available, otherwise fall back to previous data
  const forecastData = currentForecastData || previousForecastData;

  // Show initial loading only if no previous data exists
  if (isLoading && !forecastData) {
    return (
      <Card className="bg-white/90 backdrop-blur-sm border-white/30 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <Calendar className="h-5 w-5" />
            Prognoza na 5 dni
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Ładowanie prognozy...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !forecastData) {
    return (
      <Card className="bg-white/90 backdrop-blur-sm border-white/30 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <Calendar className="h-5 w-5" />
            Prognoza na 5 dni
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-red-600 py-4">
            <p>Nie udało się pobrać prognozy</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Group forecast by day (take one entry per day)
  const dailyForecast = forecastData.list
    .filter((_, index) => index % 8 === 0) // Every 8th entry (every 24 hours)
    .slice(0, 5); // Take only 5 days



  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return "Dziś";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Jutro";
    } else {
      return date.toLocaleDateString('pl-PL', { weekday: 'short', day: 'numeric' });
    }
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-white/30 shadow-sm relative">
      {/* Subtle loading indicator */}
      {isLoading && forecastData && (
        <div className="absolute top-2 right-2 z-10">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent bg-white/80 backdrop-blur-sm p-1 rounded-full shadow-sm"></div>
        </div>
      )}
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-800">
          <Calendar className="h-5 w-5" />
          Prognoza na 5 dni
        </CardTitle>
      </CardHeader>
             <CardContent>
          {/* Daily forecast cards */}
          <div className="space-y-2">
            {dailyForecast.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white/70 rounded-lg backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="text-sm font-medium text-gray-700 min-w-[50px]">
                    {formatDate(item.dt)}
                  </div>
                  <img 
                    src={`https://openweathermap.org/img/wn/${item.weather[0]?.icon}.png`}
                    alt={item.weather[0]?.description || "Weather icon"}
                    className="w-8 h-8"
                  />
                  <div className="text-sm text-gray-600 capitalize">
                    {item.weather[0]?.description}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-gray-800">
                    <Thermometer className="h-3 w-3 mr-1" />
                    {Math.round(item.main.temp)}°C
                  </Badge>
                </div>
              </div>
            ))}
          </div>
      </CardContent>
    </Card>
  );
} 