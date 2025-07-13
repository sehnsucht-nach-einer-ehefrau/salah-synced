"use client";

import { useLocation } from './LocationProvider';
import { useEffect } from 'react';

interface PrayerTimesData {
  [key: string]: string;
}

interface PrayerTimesProps {
  onPrayerTimesFetched: (times: PrayerTimesData) => void;
}

export default function PrayerTimes({ onPrayerTimesFetched }: PrayerTimesProps) {
  const { location, error } = useLocation();

  useEffect(() => {
    if (location) {
      const fetchPrayerTimes = async () => {
        try {
          const response = await fetch(`https://api.aladhan.com/v1/timings?latitude=${location.latitude}&longitude=${location.longitude}`);
          if (!response.ok) {
            throw new Error('Failed to fetch prayer times');
          }
          const data = await response.json();
          onPrayerTimesFetched(data.data.timings);
        } catch (err) {
          console.error(err);
        }
      };

      fetchPrayerTimes();
    }
  }, [location, onPrayerTimesFetched]);

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!location) {
    return null;
  }

  return null;
} 