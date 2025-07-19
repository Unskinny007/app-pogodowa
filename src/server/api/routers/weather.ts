import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { env } from "~/env";
import type { WeatherData, WeatherResponse, ForecastData, ForecastResponse } from "~/types/weather";

const FORECAST_API_URL = "https://api.openweathermap.org/data/2.5/forecast";

export const weatherRouter = createTRPCRouter({
  getWeatherByCity: publicProcedure
    .input(z.object({ city: z.string().min(1) }))
    .query(async ({ input }): Promise<WeatherResponse> => {
      try {
        const response = await fetch(
          `${env.OPENWEATHER_API_URL}?q=${input.city}&appid=${env.OPENWEATHER_API_KEY}&units=metric&lang=pl`
        );
        
        if (!response.ok) {
          throw new Error("Weather data not found");
        }
        
        const data: WeatherData = await response.json();
        return { success: true, data };
      } catch (error) {
        return { 
          success: false, 
          error: error instanceof Error ? error.message : "Unknown error" 
        };
      }
    }),

  getWeatherByCoords: publicProcedure
    .input(z.object({ 
      lat: z.number(), 
      lon: z.number() 
    }))
    .query(async ({ input }): Promise<WeatherResponse> => {
      try {
        const response = await fetch(
          `${env.OPENWEATHER_API_URL}?lat=${input.lat}&lon=${input.lon}&appid=${env.OPENWEATHER_API_KEY}&units=metric&lang=pl`
        );
        
        if (!response.ok) {
          throw new Error("Weather data not found");
        }
        
        const data: WeatherData = await response.json();
        return { success: true, data };
      } catch (error) {
        return { 
          success: false, 
          error: error instanceof Error ? error.message : "Unknown error" 
        };
      }
    }),

  getForecastByCity: publicProcedure
    .input(z.object({ city: z.string().min(1) }))
    .query(async ({ input }): Promise<ForecastResponse> => {
      try {
        const response = await fetch(
          `${FORECAST_API_URL}?q=${input.city}&appid=${env.OPENWEATHER_API_KEY}&units=metric&lang=pl`
        );
        
        if (!response.ok) {
          throw new Error("Forecast data not found");
        }
        
        const data: ForecastData = await response.json();
        return { success: true, data };
      } catch (error) {
        return { 
          success: false, 
          error: error instanceof Error ? error.message : "Unknown error" 
        };
      }
    }),

  getForecastByCoords: publicProcedure
    .input(z.object({ 
      lat: z.number(), 
      lon: z.number() 
    }))
    .query(async ({ input }): Promise<ForecastResponse> => {
      try {
        const response = await fetch(
          `${FORECAST_API_URL}?lat=${input.lat}&lon=${input.lon}&appid=${env.OPENWEATHER_API_KEY}&units=metric&lang=pl`
        );
        
        if (!response.ok) {
          throw new Error("Forecast data not found");
        }
        
        const data: ForecastData = await response.json();
        return { success: true, data };
      } catch (error) {
        return { 
          success: false, 
          error: error instanceof Error ? error.message : "Unknown error" 
        };
      }
    }),
}); 