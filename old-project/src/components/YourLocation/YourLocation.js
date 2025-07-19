import React, { useState, useEffect } from 'react';
import './YourLocation.css';

function YourLocation() {
  const [location, setLocation] = useState('Pobieranie lokalizacji...');

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Tu możesz dodać API call żeby pobrać nazwę miasta
          setLocation('Twoja lokalizacja');
        },
        (error) => {
          setLocation('Nie można pobrać lokalizacji');
        }
      );
    } else {
      setLocation('Geolokalizacja niedostępna');
    }
  }, []);

  return (
    <div className="your-location">
      <h3>📍 {location}</h3>
      {/* Tutaj możesz dodać więcej informacji o lokalizacji */}
    </div>
  );
}

export default YourLocation;
