# Weather App

A modern weather application built with Next.js, TypeScript, Tailwind CSS, shadcn/ui, and tRPC.

## Features

- 🌤️ Current weather display with temperature, humidity, pressure, wind, and visibility
- 🎨 **Dynamic weather-based backgrounds** - Background changes based on current weather conditions
- 📍 Automatic geolocation support
- 🔍 **City search with autocomplete** - Smart suggestions for Polish cities
- 📝 Recent searches with local storage
- 📊 **5-day weather forecast** - Clean list view of upcoming weather
- ⏰ **Hourly forecast footer** - Next few hours weather preview
- 📱 Fully responsive design
- 🎨 Beautiful UI with shadcn/ui components
- ⚡ Fast API calls with tRPC
- 🇵🇱 **Polish language** throughout the interface

## Tech Stack

- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **API**: tRPC for type-safe API calls
- **Weather Data**: OpenWeatherMap API
- **Icons**: Lucide React

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   - The app currently uses a dummy API key for demonstration
   - For production, replace the API key in `src/server/api/routers/weather.ts` with your OpenWeatherMap API key

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Application Structure

- `src/components/weather/` - Weather-related components
  - `weather-card.tsx` - Main weather display component
  - `city-search.tsx` - City search with autocomplete suggestions
  - `weather-chart.tsx` - 5-day forecast component
  - `hourly-forecast.tsx` - Footer with next few hours forecast
  - `location-indicator.tsx` - Location status indicator
- `src/utils/` - Utility functions
  - `weather-backgrounds.ts` - Background theme logic and mappings
  - `city-suggestions.ts` - Polish cities database for autocomplete
- `src/server/api/routers/weather.ts` - tRPC weather API router with forecast endpoints
- `src/types/weather.ts` - TypeScript type definitions

## API Usage

The app uses the OpenWeatherMap API to fetch weather data:
- Weather by city name
- Weather by coordinates (latitude/longitude)
- Automatic fallback to Warsaw if location access is denied

## Features in Detail

### Weather Display
- Large temperature display with "feels like" temperature
- Weather icon and description
- Detailed weather metrics in organized cards

### Dynamic Backgrounds
- **Sunny Weather**: Warm yellow-orange gradients
- **Clear Night**: Deep indigo-purple gradients
- **Cloudy**: Gray gradient variations
- **Rainy**: Blue gradient themes
- **Stormy**: Dark dramatic gradients
- **Snowy**: Light gray-white gradients
- **Misty/Foggy**: Soft gray transitions
- **Smooth Transitions**: 1-second animated transitions between themes

### Location Services
- Automatic geolocation detection
- Fallback to default city (Warsaw) if location is unavailable
- Manual city search override

### Recent Searches
- Stores last 5 searched cities in localStorage
- Quick access to recently searched locations
- Remove individual search history items

### Responsive Design
- Mobile-first approach
- Adapts layout for desktop, tablet, and mobile
- Consistent styling across all devices
