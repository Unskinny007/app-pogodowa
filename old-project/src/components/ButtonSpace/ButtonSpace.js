import React from 'react';
import './ButtonSpace.css';

function ButtonSpace({ onWeatherClick, onMapClick }) {
  return (
    <div className="btn-space">
      <button 
        className="btn1"
        onClick={onWeatherClick}
        type="button"
      >
        Pogoda
      </button>
      <button 
        className="btn2"
        onClick={onMapClick}
        type="button"
      >
        Geomapa
      </button>
    </div>
  );
}

export default ButtonSpace;
