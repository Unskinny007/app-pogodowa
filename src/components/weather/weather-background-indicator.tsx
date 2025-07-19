"use client";

import { Badge } from "~/components/ui/badge";
import { Card, CardContent } from "~/components/ui/card";
import { Palette } from "lucide-react";
import type { WeatherBackground } from "~/utils/weather-backgrounds";

interface WeatherBackgroundIndicatorProps {
  backgroundInfo: WeatherBackground;
}

export function WeatherBackgroundIndicator({ backgroundInfo }: WeatherBackgroundIndicatorProps) {
  return (
    <Card className="bg-white/60 backdrop-blur-sm border-white/30 shadow-sm">
      <CardContent className="p-3">
        <div className="flex items-center gap-2">
          <Palette className="h-4 w-4 text-gray-600" />
          <span className="text-sm text-gray-700 font-medium">Theme:</span>
          <Badge variant="secondary" className="text-xs">
            {backgroundInfo.description}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
} 