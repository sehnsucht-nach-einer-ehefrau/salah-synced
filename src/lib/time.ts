import { parse, differenceInMinutes, addMinutes, format } from 'date-fns';

export function parseTime(timeStr: string): Date {
  return parse(timeStr, 'HH:mm', new Date());
}

export function calculateSleep(
  ishaTime: string,
  sunriseTime: string,
  dhuhrTime: string,
  desiredSleepHours: number
): { nightSleep: { start: string; end: string; duration: number }; nap: { start: string; end: string; duration: number } | null } {
  const desiredSleepMinutes = desiredSleepHours * 60;

  const sleepStart = addMinutes(parseTime(ishaTime), 30);
  const sleepEnd = addMinutes(parseTime(sunriseTime), -10);

  let nightSleepDuration = differenceInMinutes(sleepEnd, sleepStart);
  if (nightSleepDuration < 0) {
    // Handle overnight case
    nightSleepDuration += 24 * 60;
  }
  
  const sleepDeficit = Math.max(0, desiredSleepMinutes - nightSleepDuration);

  let nap = null;
  if (sleepDeficit > 0) {
    const napStart = addMinutes(parseTime(dhuhrTime), 30);
    const napEnd = addMinutes(napStart, sleepDeficit);
    nap = {
      start: format(napStart, 'h:mm a'),
      end: format(napEnd, 'h:mm a'),
      duration: sleepDeficit / 60,
    };
  }

  return {
    nightSleep: {
      start: format(sleepStart, 'h:mm a'),
      end: format(sleepEnd, 'h:mm a'),
      duration: nightSleepDuration / 60,
    },
    nap,
  };
}

export function calculateNextPrayer(prayerTimes: { [key: string]: string }) {
  const now = new Date();
  let nextPrayer = null;
  let minDiff = Infinity;

  const prayerOrder = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

  for (const prayerName of prayerOrder) {
    const prayerTimeStr = prayerTimes[prayerName];
    if (prayerTimeStr) {
      const prayerTime = parseTime(prayerTimeStr);
      let diff = differenceInMinutes(prayerTime, now);
      if (diff < 0) {
        diff += 24 * 60; // handle prayers for the next day
      }

      if (diff < minDiff) {
        minDiff = diff;
        nextPrayer = {
          name: prayerName,
          time: prayerTimeStr,
          in: formatDuration(minDiff),
        };
      }
    }
  }

  // Check for sunrise as a special case if needed, but for now, we focus on the 5 daily prayers.
  // The logic for next day's Fajr is implicitly handled by the positive diff logic.

  return nextPrayer;
}

function formatDuration(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
} 