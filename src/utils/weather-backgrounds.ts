export interface WeatherBackground {
  gradient: string;
  description: string;
}

export const getWeatherBackground = (
  weatherCondition?: string,
  icon?: string,
  isDay: boolean = true
): WeatherBackground => {
  if (!weatherCondition && !icon) {
    return {
      gradient: "bg-gradient-to-br from-blue-50 to-indigo-100",
      description: "Default"
    };
  }

  const condition = weatherCondition?.toLowerCase() || "";
  const weatherIcon = icon || "";

  // Check if it's day or night based on icon
  const isDaytime = !weatherIcon.includes('n');

  // Clear weather
  if (condition.includes("clear") || weatherIcon.includes("01")) {
    return isDaytime
      ? {
          gradient: "bg-gradient-to-br from-yellow-200 via-orange-200 to-red-200",
          description: "Clear Sky"
        }
      : {
          gradient: "bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900",
          description: "Clear Night"
        };
  }

  // Few clouds
  if (condition.includes("few clouds") || weatherIcon.includes("02")) {
    return isDaytime
      ? {
          gradient: "bg-gradient-to-br from-blue-200 via-sky-200 to-cyan-200",
          description: "Few Clouds"
        }
      : {
          gradient: "bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900",
          description: "Partly Cloudy Night"
        };
  }

  // Scattered/broken clouds
  if (
    condition.includes("clouds") ||
    condition.includes("overcast") ||
    weatherIcon.includes("03") ||
    weatherIcon.includes("04")
  ) {
    return {
      gradient: "bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500",
      description: "Cloudy"
    };
  }

  // Rain
  if (
    condition.includes("rain") ||
    condition.includes("drizzle") ||
    weatherIcon.includes("09") ||
    weatherIcon.includes("10")
  ) {
    return isDaytime
      ? {
          gradient: "bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600",
          description: "Rainy"
        }
      : {
          gradient: "bg-gradient-to-br from-blue-800 via-blue-900 to-slate-900",
          description: "Rainy Night"
        };
  }

  // Thunderstorm
  if (condition.includes("thunderstorm") || weatherIcon.includes("11")) {
    return {
      gradient: "bg-gradient-to-br from-gray-700 via-gray-800 to-black",
      description: "Thunderstorm"
    };
  }

  // Snow
  if (condition.includes("snow") || weatherIcon.includes("13")) {
    return isDaytime
      ? {
          gradient: "bg-gradient-to-br from-gray-100 via-blue-100 to-white",
          description: "Snowy"
        }
      : {
          gradient: "bg-gradient-to-br from-gray-600 via-slate-700 to-slate-800",
          description: "Snowy Night"
        };
  }

  // Mist/Fog/Haze
  if (
    condition.includes("mist") ||
    condition.includes("fog") ||
    condition.includes("haze") ||
    weatherIcon.includes("50")
  ) {
    return {
      gradient: "bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400",
      description: "Misty"
    };
  }

  // Default fallback
  return {
    gradient: "bg-gradient-to-br from-blue-50 to-indigo-100",
    description: "Default"
  };
};

// Animation classes for smooth transitions
export const weatherAnimations = {
  rain: "animate-pulse",
  thunderstorm: "animate-pulse",
  snow: "animate-bounce",
  clear: "",
  clouds: "",
  mist: "animate-pulse"
};

// Weather-specific overlay effects
export const getWeatherOverlay = (condition?: string): string => {
  if (!condition) return "";
  
  const conditionLower = condition.toLowerCase();
  
  if (conditionLower.includes("rain") || conditionLower.includes("drizzle")) {
    return "before:content-[''] before:absolute before:inset-0 before:bg-blue-900/10 before:backdrop-blur-[1px]";
  }
  
  if (conditionLower.includes("snow")) {
    return "before:content-[''] before:absolute before:inset-0 before:bg-white/20 before:backdrop-blur-[1px]";
  }
  
  if (conditionLower.includes("thunderstorm")) {
    return "before:content-[''] before:absolute before:inset-0 before:bg-gray-900/20 before:backdrop-blur-[1px]";
  }
  
  return "";
}; 