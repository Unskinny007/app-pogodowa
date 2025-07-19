import React, { useState } from 'react';
import './SectionMain.css';

function Main() {
  const [activeView, setActiveView] = useState('weather'); // 'weather' lub 'map'

  return (
    <div className="main">
      {activeView === 'weather' ? (
        <div className="weather-content">
          <h2>Pogoda</h2>
          {/* Tutaj będzie komponent pogody */}
        </div>
      ) : (
        <div className="map-content">
          <h2>Mapa</h2>
          {/* Tutaj będzie komponent mapy */}
        </div>
      )}
    </div>
  );
}

export default Main;
