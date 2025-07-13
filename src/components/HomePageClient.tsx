"use client";

import { useState } from 'react';
import { signOut } from "next-auth/react"
import type { Session } from "next-auth"
import Link from "next/link"
import { FaRegCalendarAlt, FaCog, FaDollarSign, FaShareAlt, FaMapMarkerAlt, FaMoon, FaSun } from "react-icons/fa";
import * as Popover from '@radix-ui/react-popover';
import PrayerTimes from "@/components/PrayerTimes";
import SleepSchedule from "@/components/SleepSchedule";
import ActivityManager from './ActivityManager';
import MealManager from './MealManager';
import TelegramConnect from './TelegramConnect';
import DowntimeManager from './DowntimeManager';
import { Activity, Meal } from '@/lib/types';
import Clock from './Clock';

interface PrayerTimesData {
  [key: string]: string;
}

interface HomePageClientProps {
  session: Session | null;
  activities: Activity[];
  meals: Meal[];
}

export default function HomePageClient({ session, activities, meals }: HomePageClientProps) {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimesData | null>(null);
  const [isDowntime, setIsDowntime] = useState(false);

  const toggleDowntime = () => {
    setIsDowntime(!isDowntime);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Salah Synced',
        text: 'Check out this awesome scheduling app!',
        url: window.location.href,
      })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error));
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (!session?.user) {
    return (
      <div>
        <p>You are not logged in.</p>
        <Link href="/login">Login</Link>
      </div>
    )
  }

  return (
    <div className={`w-full max-w-4xl mx-auto p-4 ${isDowntime ? 'dark' : ''}`}>
      {/* Header Buttons */}
      <div className="flex justify-center items-center space-x-4 mb-4">
        <Popover.Root>
          <Popover.Trigger asChild>
            <button className="text-gray-500 hover:text-gray-700"><FaCog className="inline-block mr-1" /> Telegram</button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content className="w-[500px] bg-white p-5 rounded-md shadow-lg" sideOffset={5}>
              <TelegramConnect />
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
        <span className="text-gray-400">·</span>
        <a href="https://www.buymeacoffee.com/example" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-700"><FaDollarSign className="inline-block mr-1" /> Donate</a>
        <span className="text-gray-400">·</span>
        <button onClick={handleShare} className="text-gray-500 hover:text-gray-700"><FaShareAlt className="inline-block mr-1" /> Share</button>
      </div>

      {/* Main Card */}
      <div className={`rounded-lg shadow-lg p-6 ${isDowntime ? 'bg-gray-800 text-white' : 'bg-white'}`}>
        <div className="flex justify-between items-start">
          {/* Top Left Icon */}
          <Popover.Root>
            <Popover.Trigger asChild>
              <button className="text-gray-500 hover:text-gray-700">
                <FaRegCalendarAlt size={24} />
              </button>
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content
                className="w-96 bg-white p-5 rounded-md shadow-lg"
                sideOffset={5}
              >
                <ActivityManager activities={activities.filter(a => a.type === 'action' || a.type === 'filler')} />
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>

          {/* Top Right Icons */}
          <MealManager meals={meals} />
        </div>

        {/* Card Content */}
        <div className="text-center my-16">
          <h1 className="text-4xl font-bold">{isDowntime ? 'Downtime.' : 'Free time.'}</h1>
          {!isDowntime && <p className="text-gray-500 mt-2">Next: Fajr in 3h 21m</p>}
        </div>
        {!isDowntime && <SleepSchedule prayerTimes={prayerTimes} />}
        {isDowntime && <DowntimeManager activities={activities} />}
      </div>

      {/* Footer */}
      <div className="flex justify-center items-center space-x-4 mt-4 text-sm text-gray-500">
        <button className="hover:text-gray-700"><FaMapMarkerAlt className="inline-block mr-1" /> New York, USA</button>
        <span className="text-gray-400">·</span>
        <Clock />
        <span className="text-gray-400">·</span>
        <button onClick={toggleDowntime} className="hover:text-gray-700">
          {isDowntime ? <FaSun className="inline-block mr-1" /> : <FaMoon className="inline-block mr-1" />}
          {isDowntime ? 'Exit Downtime' : 'Enter Downtime'}
        </button>
      </div>
       <button
        onClick={() => signOut()}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
      >
        Sign out
      </button>
      <PrayerTimes onPrayerTimesFetched={setPrayerTimes} />
    </div>
  )
} 