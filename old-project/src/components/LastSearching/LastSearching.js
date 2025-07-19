import React from 'react';
import './LastSearching.css';

function LastSearching({ searches, onRemove, onSelect }) {
  // Ogranicz do 2 ostatnich elementów
  const limitedSearches = searches.slice(0, 2);

  if (limitedSearches.length === 0) {
    return (
      <div className="last-searching">
        <h4>Ostatnio wyszukiwane:</h4>
        <div className="no-searches">Brak ostatnich wyszukiwań</div>
      </div>
    );
  }

  return (
    <div className="last-searching">
      <h4>Ostatnio wyszukiwane:</h4>
      {limitedSearches.map((search) => (
        <div key={search.id} className="search-item">
          <div 
            className="search-item-content"
            onClick={() => onSelect(search.name)}
          >
            <div className="search-item-name">{search.name}</div>
            <div className="search-item-time">{search.time}</div>
          </div>
          <button 
            className="search-item-remove"
            onClick={() => onRemove(search.id)}
            type="button"
            aria-label={`Usuń ${search.name}`}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

export default LastSearching;
