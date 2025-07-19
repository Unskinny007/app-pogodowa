"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { getWeatherBackground } from "~/utils/weather-backgrounds";
import { Shuffle } from "lucide-react";

const demoWeatherConditions = [
  { description: "clear sky", icon: "01d", name: "Clear Day" },
  { description: "clear sky", icon: "01n", name: "Clear Night" },
  { description: "few clouds", icon: "02d", name: "Few Clouds" },
  { description: "scattered clouds", icon: "03d", name: "Cloudy" },
  { description: "light rain", icon: "10d", name: "Light Rain" },
  { description: "thunderstorm", icon: "11d", name: "Thunderstorm" },
  { description: "snow", icon: "13d", name: "Snow" },
  { description: "mist", icon: "50d", name: "Misty" },
];

export function WeatherDemo() {
  const [currentDemo, setCurrentDemo] = useState(0);

  const nextDemo = () => {
    setCurrentDemo((prev) => (prev + 1) % demoWeatherConditions.length);
  };

  const currentCondition = demoWeatherConditions[currentDemo];
  const background = getWeatherBackground(
    currentCondition?.description,
    currentCondition?.icon
  );

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-white/30 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-gray-800">
          <span>Background Demo</span>
          <Button onClick={nextDemo} variant="outline" size="sm">
            <Shuffle className="h-4 w-4 mr-2" />
            Next Theme
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-gray-600">
            <strong>Current:</strong> {currentCondition?.name}
          </div>
          <div className="text-sm text-gray-600">
            <strong>Theme:</strong> {background.description}
          </div>
          <div 
            className={`h-24 rounded-lg ${background.gradient} flex items-center justify-center text-white font-semibold shadow-inner`}
          >
            Background Preview
          </div>
          <div className="text-xs text-gray-500">
            This background theme would be applied to the entire page when this weather condition is detected.
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 