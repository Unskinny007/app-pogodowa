"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Search, X, MapPin, Home } from "lucide-react";
import { getFilteredCities } from "~/utils/city-suggestions";
import type { RecentSearch } from "~/types/weather";

interface CitySearchProps {
  onCitySelect: (city: string) => void;
  onClearSelection?: () => void;
  currentCity?: string;
}

export function CitySearch({ onCitySelect, onClearSelection, currentCity }: CitySearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("weather-recent-searches");
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (error) {
        console.error("Error loading recent searches:", error);
      }
    }
  }, []);

  // Save recent searches to localStorage
  useEffect(() => {
    localStorage.setItem("weather-recent-searches", JSON.stringify(recentSearches));
  }, [recentSearches]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      selectCity(searchTerm.trim());
    }
  };

  const selectCity = (cityName: string) => {
    addToRecentSearches(cityName);
    onCitySelect(cityName);
    setSearchTerm("");
    setSuggestions([]);
    setShowSuggestions(false);
    setActiveSuggestionIndex(-1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.length >= 2) {
      const filteredCities = getFilteredCities(value, 5);
      setSuggestions(filteredCities);
      setShowSuggestions(filteredCities.length > 0);
      setActiveSuggestionIndex(-1);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveSuggestionIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveSuggestionIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (activeSuggestionIndex >= 0) {
          selectCity(suggestions[activeSuggestionIndex]!);
        } else if (searchTerm.trim()) {
          selectCity(searchTerm.trim());
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setActiveSuggestionIndex(-1);
        break;
    }
  };

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow clicking on them
    setTimeout(() => {
      setShowSuggestions(false);
      setActiveSuggestionIndex(-1);
    }, 200);
  };

  const addToRecentSearches = (cityName: string) => {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const newSearch: RecentSearch = {
      id: Date.now(),
      name: cityName,
      time: timeString,
    };

    setRecentSearches(prev => {
      // Remove if already exists and add to beginning
      const filtered = prev.filter(search => 
        search.name.toLowerCase() !== cityName.toLowerCase()
      );
      return [newSearch, ...filtered].slice(0, 2); // Keep only 2 most recent
    });
  };

  const removeRecentSearch = (id: number) => {
    setRecentSearches(prev => prev.filter(search => search.id !== id));
  };

  const selectRecentSearch = (cityName: string) => {
    selectCity(cityName);
  };

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <Card className="bg-white/90 backdrop-blur-sm border-white/30 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <Search className="h-5 w-5" />
            Wyszukaj miasto
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-2">
            <div className="relative">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  type="text"
                  placeholder="Wpisz nazwę miasta..."
                  value={searchTerm}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  onBlur={handleInputBlur}
                  onFocus={() => {
                    if (suggestions.length > 0) {
                      setShowSuggestions(true);
                    }
                  }}
                  className="flex-1"
                />
                <Button type="submit" disabled={!searchTerm.trim()}>
                  Szukaj
                </Button>
              </div>
              
              {/* City Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-14 bg-white border border-gray-200 rounded-lg shadow-lg z-10 mt-1">
                  {suggestions.map((city, index) => (
                                         <button
                       key={city}
                       ref={el => { suggestionRefs.current[index] = el; }}
                       type="button"
                      onClick={() => selectCity(city)}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors ${
                        index === activeSuggestionIndex ? 'bg-blue-50 border-blue-200' : ''
                      } ${index === 0 ? 'rounded-t-lg' : ''} ${index === suggestions.length - 1 ? 'rounded-b-lg' : ''}`}
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-800">{city}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </form>
        </CardContent>
      </Card>



      {/* Recent Searches */}
      <Card className="bg-white/90 backdrop-blur-sm border-white/30 shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-800">Ostatnie wyszukiwania</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 min-h-[120px] flex flex-col">
            {recentSearches.length > 0 ? (
              recentSearches.slice(0, 2).map((search) => (
                <div
                  key={search.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <button
                    onClick={() => selectRecentSearch(search.name)}
                    className="flex-1 text-left"
                  >
                    <div className="font-medium text-gray-800">{search.name}</div>
                    <div className="text-sm text-gray-600">Wyszukano o {search.time}</div>
                  </button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeRecentSearch(search.id)}
                    className="h-8 w-8 p-0 text-gray-500 hover:text-red-600"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
                Brak ostatnich wyszukiwań
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 