"use client";

import { useState, useMemo } from 'react';
import { calculateSleep } from '@/lib/time';

interface PrayerTimesData {
  [key: string]: string;
}

interface SleepScheduleProps {
  prayerTimes: PrayerTimesData | null;
}

export default function SleepSchedule({ prayerTimes }: SleepScheduleProps) {
  const [sleepHours, setSleepHours] = useState(9);

  const schedule = useMemo(() => {
    if (!prayerTimes) return null;
    return calculateSleep(prayerTimes.Isha, prayerTimes.Sunrise, prayerTimes.Dhuhr, sleepHours);
  }, [prayerTimes, sleepHours]);

  const handleSleepHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSleepHours(Number(e.target.value));
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold">Sleep Schedule</h2>
      <div className="mt-4">
        <label htmlFor="sleep-hours" className="block text-sm font-medium text-gray-700">
          Desired sleep duration (hours)
        </label>
        <input
          type="range"
          id="sleep-hours"
          name="sleep-hours"
          min="4"
          max="12"
          step="0.5"
          value={sleepHours}
          onChange={handleSleepHoursChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        />
        <div className="text-center">{sleepHours} hours</div>
      </div>
      {schedule && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          <p>
            <strong>Night Sleep:</strong> {schedule.nightSleep.start} - {schedule.nightSleep.end} ({schedule.nightSleep.duration.toFixed(1)} hours)
          </p>
          {schedule.nap && (
            <p>
              <strong>Nap:</strong> {schedule.nap.start} - {schedule.nap.end} ({schedule.nap.duration.toFixed(1)} hours)
            </p>
          )}
        </div>
      )}
    </div>
  );
} 