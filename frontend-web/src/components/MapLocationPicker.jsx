import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapPin } from 'lucide-react';

// Fix for default Leaflet marker icon not loading in Webpack/Vite
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const MapEvents = ({ setPosition }) => {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
};

const MapRecenter = ({ position }) => {
  const map = useMapEvents({});
  useEffect(() => {
    if (position) {
      // Use setView instead of flyTo to prevent animation conflicts while dragging
      map.setView(position, map.getZoom(), { animate: false });
    }
  }, [position, map]);
  return null;
};

const MapLocationPicker = ({ onLocationChange, initialPosition }) => {
  // Default to Colombo, Sri Lanka if no initial position provided
  const defaultPosition = initialPosition || [6.9271, 79.8612];
  const [position, setPosition] = useState(defaultPosition);

  // Update position if initialPosition prop changes externally
  useEffect(() => {
    if (initialPosition) {
      // Only update if the new position is significantly different to prevent infinite loops / dragging stutters
      const diffLat = Math.abs(initialPosition[0] - position[0]);
      const diffLng = Math.abs(initialPosition[1] - position[1]);
      if (diffLat > 0.0001 || diffLng > 0.0001) {
        setPosition(initialPosition);
      }
    }
  }, [initialPosition]);

  useEffect(() => {
    if (onLocationChange) {
      onLocationChange({ lat: position[0], lng: position[1] });
    }
  }, [position, onLocationChange]);

  return (
    <div className="w-full">
      <div className="flex items-center text-sm text-gray-500 font-medium mb-3">
        <MapPin size={16} className="mr-1 text-primary" />
        Click anywhere on the map or drag the pin to set your exact location.
      </div>
      
      <div className="h-64 sm:h-72 w-full rounded-2xl overflow-hidden border-2 border-gray-100 shadow-inner relative z-0">
        <MapContainer 
          center={defaultPosition} 
          zoom={12} 
          scrollWheelZoom={false} 
          className="h-full w-full"
        >
          <MapRecenter position={position} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapEvents setPosition={setPosition} />
          
          <Marker 
            position={position} 
            draggable={true}
            eventHandlers={{
              dragend: (e) => {
                const marker = e.target;
                const newPos = marker.getLatLng();
                setPosition([newPos.lat, newPos.lng]);
              },
            }}
          />
        </MapContainer>
      </div>
      
      <div className="mt-3 flex justify-between items-center bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
        <span className="text-xs font-bold text-gray-500">Selected Coordinates:</span>
        <span className="text-xs font-mono text-gray-700 bg-white px-2 py-1 rounded shadow-sm border border-gray-200">
          {position[0].toFixed(4)}, {position[1].toFixed(4)}
        </span>
      </div>
    </div>
  );
};

export default MapLocationPicker;
