import React from 'react';
import Weather from '../Weather/Weather';

const Header: React.FC = () => {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-6">
        <Weather />
      </div>
    </header>
  );
};

export default Header;
