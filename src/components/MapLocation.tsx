
import React from 'react';
import appConfig from '../config/appConfig';

interface MapLocationProps {
  latitude: number;
  longitude: number;
  height?: string;
  zoom?: number;
}

const MapLocation: React.FC<MapLocationProps> = ({ 
  latitude = appConfig.business.latitude,
  longitude = appConfig.business.longitude,
  height = '200px',
  zoom = 15 
}) => {
  // Using OpenStreetMap to avoid API key requirements
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.01}%2C${latitude - 0.01}%2C${longitude + 0.01}%2C${latitude + 0.01}&layer=mapnik&marker=${latitude}%2C${longitude}`;
  
  return (
    <div className="w-full overflow-hidden rounded-lg shadow-sm">
      <iframe
        title="Localização da Barbearia"
        width="100%"
        height={height}
        className="border-0"
        src={mapUrl}
      />
      <div className="mt-2 text-sm text-center">
        <a 
          href={`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`}
          target="_blank" 
          rel="noopener noreferrer"
          className="text-barber-accent hover:underline"
        >
          Ver no Google Maps
        </a>
      </div>
    </div>
  );
};

export default MapLocation;
