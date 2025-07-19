"use client";

import { useState } from "react";
import { WeatherCard } from "~/components/weather/weather-card";
import { CitySearch } from "~/components/weather/city-search";
import { WeatherChart } from "~/components/weather/weather-chart";
import { HourlyForecast } from "~/components/weather/hourly-forecast";


import { getWeatherBackground } from "~/utils/weather-backgrounds";
import type { WeatherData } from "~/types/weather";

export default function Home() {
  const [selectedCity, setSelectedCity] = useState<string | undefined>();
  const [currentWeatherData, setCurrentWeatherData] = useState<WeatherData | null>(null);

  const handleClearSelection = () => {
    setSelectedCity(undefined);
  };

  const handleWeatherDataChange = (data: WeatherData | null) => {
    setCurrentWeatherData(data);
  };

  // Get dynamic background based on current weather
  const weatherBackground = getWeatherBackground(
    currentWeatherData?.weather[0]?.description,
    currentWeatherData?.weather[0]?.icon
  );

  return (
    <div className={`min-h-screen transition-all duration-1000 ease-in-out ${weatherBackground.gradient}`}>
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-white/30 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <WeatherCard 
            city={selectedCity} 
            onWeatherDataChange={handleWeatherDataChange}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left side - Search and Recent Searches */}
          <div className="space-y-6">
            <CitySearch 
              onCitySelect={setSelectedCity} 
              onClearSelection={handleClearSelection}
              currentCity={selectedCity}
            />
          </div>
          
          {/* Right side - Weather Chart */}
          <div>
            <WeatherChart city={selectedCity} />
          </div>
        </div>
      </main>

      {/* Footer - Hourly Forecast */}
      <HourlyForecast city={selectedCity} />
    </div>
  );
}
