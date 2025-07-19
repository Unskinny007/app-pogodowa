"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "~/components/ui/card";
import { MapPin, Loader2 } from "lucide-react";

export function LocationIndicator() {
  const [locationStatus, setLocationStatus] = useState<string>("Getting location...");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationStatus("📍 Using your current location");
          setIsLoading(false);
        },
        (error) => {
          setLocationStatus("📍 Location unavailable - showing default");
          setIsLoading(false);
        }
      );
    } else {
      setLocationStatus("📍 Geolocation not supported");
      setIsLoading(false);
    }
  }, []);

  return (
    <Card className="bg-white/60 backdrop-blur-sm border-white/30 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 text-gray-700">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <MapPin className="h-4 w-4" />
          )}
          <span className="font-medium">{locationStatus}</span>
        </div>
      </CardContent>
    </Card>
  );
} 