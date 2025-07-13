"use client";

import { createContext, useContext, useEffect, useState } from 'react';

interface Location {
  latitude: number;
  longitude: number;
}

interface LocationContextType {
  location: Location | null;
  error: string | null;
}

const LocationContext = createContext<LocationContextType>({
  location: null,
  error: null,
});

export const useLocation = () => useContext(LocationContext);

export const LocationProvider = ({ children }: { children: React.ReactNode }) => {
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    const onSuccess = (position: GeolocationPosition) => {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    };

    const onError = (error: GeolocationPositionError) => {
      setError(`Failed to get location: ${error.message}`);
    };

    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  }, []);

  return (
    <LocationContext.Provider value={{ location, error }}>
      {children}
    </LocationContext.Provider>
  );
}; 