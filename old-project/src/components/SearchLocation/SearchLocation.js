import React, { useState } from 'react';
import LastSearching from '../LastSearching';
import './SearchLocation.css';

function SearchLocation() {
  const [city, setCity] = useState('');
  const [recentSearches, setRecentSearches] = useState([
    { id: 1, name: 'Warszawa', time: '2 min temu' },
    { id: 2, name: 'Kraków', time: '15 min temu' },
    { id: 3, name: 'Gdańsk', time: '1 godz. temu' }
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) {
      const newSearch = {
        id: Date.now(),
        name: city.trim(),
        time: 'teraz'
      };
      setRecentSearches([newSearch, ...recentSearches.slice(0, 4)]);
      setCity('');
    }
  };

  const removeSearch = (id) => {
    setRecentSearches(recentSearches.filter(search => search.id !== id));
  };

  const selectSearch = (cityName) => {
    setCity(cityName);
  };

  return (
    <div className="search-section">
      <form className="form" onSubmit={handleSubmit}>
        <label htmlFor="city">Miasto:</label>
        <input 
          id="city"
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Wpisz nazwę miasta..."
        />
      </form>
      
      <LastSearching 
        searches={recentSearches}
        onRemove={removeSearch}
        onSelect={selectSearch}
      />
    </div>
  );
}

export default SearchLocation;
