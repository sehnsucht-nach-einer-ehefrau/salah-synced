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