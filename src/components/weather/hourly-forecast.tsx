"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Clock, Droplets } from "lucide-react";
import { api } from "~/trpc/react";
import type { ForecastItem, ForecastData } from "~/types/weather";

interface HourlyForecastProps {
  city?: string;
}

export function HourlyForecast({ city }: HourlyForecastProps) {
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

  if (error || !forecastData) {
    return null; // Don't show footer if error or no data at all
  }

  // Get next 4 periods (12 hours ahead, every 3 hours)
  const hourlyForecast = forecastData.list.slice(0, 4);

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    const now = new Date();
    const diffHours = Math.round((date.getTime() - now.getTime()) / (1000 * 60 * 60));
    
    if (diffHours <= 0) {
      return "Teraz";
    } else if (diffHours <= 3) {
      return `Za ${diffHours}h`;
    } else {
      return date.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
    }
  };

  const getWeatherCondition = (weatherMain: string) => {
    switch (weatherMain.toLowerCase()) {
      case 'clear':
        return 'Słonecznie';
      case 'clouds':
        return 'Pochmurno';
      case 'rain':
        return 'Deszczowo';
      case 'drizzle':
        return 'Mżawka';
      case 'thunderstorm':
        return 'Burza';
      case 'snow':
        return 'Śnieg';
      case 'mist':
      case 'fog':
        return 'Mgła';
      default:
        return weatherMain;
    }
  };

  return (
    <footer className="bg-white/80 backdrop-blur-sm border-t border-white/30 shadow-sm mt-6">
      <div className="container mx-auto px-4 py-4">
        <Card className="bg-white/60 backdrop-blur-sm border-white/30 shadow-sm relative">
          {/* Subtle loading indicator */}
          {isLoading && forecastData && (
            <div className="absolute top-2 right-2 z-10">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent bg-white/80 backdrop-blur-sm p-1 rounded-full shadow-sm"></div>
            </div>
          )}
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-gray-800 text-lg">
              <Clock className="h-5 w-5" />
              Najbliższe godziny
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {hourlyForecast.map((item, index) => (
                <div key={index} className="text-center space-y-2">
                  <div className="text-sm font-medium text-gray-600">
                    {formatTime(item.dt)}
                  </div>
                  
                  <div className="flex justify-center">
                    <img 
                      src={`https://openweathermap.org/img/wn/${item.weather[0]?.icon}.png`}
                      alt={item.weather[0]?.description || "Weather icon"}
                      className="w-12 h-12"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-sm font-semibold text-gray-800">
                      {Math.round(item.main.temp)}°C
                    </div>
                    
                    <Badge variant="outline" className="text-xs px-2 py-1">
                      {getWeatherCondition(item.weather[0]?.main || '')}
                    </Badge>
                    
                    {item.weather[0]?.main?.toLowerCase().includes('rain') && (
                      <div className="flex items-center justify-center gap-1 text-xs text-blue-600">
                        <Droplets className="h-3 w-3" />
                        <span>{item.main.humidity}%</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </footer>
  );
} 