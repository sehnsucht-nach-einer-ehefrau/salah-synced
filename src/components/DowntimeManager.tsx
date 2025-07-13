"use client";

import { useState } from 'react';
import { addActivity, deleteActivity } from '@/lib/actions';
import { Activity } from '@/lib/types';

interface DowntimeManagerProps {
    activities: Activity[];
}

export default function DowntimeManager({ activities }: DowntimeManagerProps) {
  const [interruptsEnabled, setInterruptsEnabled] = useState(true);
  
  const durationActivities = activities.filter(a => a.type === 'downtime_duration');
  const interruptActivities = activities.filter(a => a.type === 'downtime_interrupt');

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Downtime Activities</h2>
        <div className="flex items-center space-x-2">
          <label htmlFor="interrupts-enabled" className="text-sm">Enable Interrupts</label>
          <input
            type="checkbox"
            id="interrupts-enabled"
            checked={interruptsEnabled}
            onChange={() => setInterruptsEnabled(!interruptsEnabled)}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-8 mt-4">
        <div>
          <h3 className="font-semibold">Duration Activities</h3>
          <ActivityForm type="downtime_duration" />
          <ul className="mt-4 space-y-2">
            {durationActivities.map(activity => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-semibold">Interrupt Activities</h3>
          <ActivityForm type="downtime_interrupt" />
           <ul className="mt-4 space-y-2">
            {interruptActivities.map(activity => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function ActivityForm({ type }: { type: 'downtime_duration' | 'downtime_interrupt' }) {
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState(30);
  const [interruptInterval, setInterruptInterval] = useState(5);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('type', type);
    if (type === 'downtime_duration') {
      formData.append('duration', String(duration));
    } else {
      formData.append('interruptInterval', String(interruptInterval));
    }
    await addActivity(formData);
    setTitle('');
  };
  
  return (
    <form onSubmit={handleSubmit} className="mt-2 p-4 border rounded-lg">
      <input
        type="text"
        placeholder="Activity title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />
      {type === 'downtime_duration' && (
        <input
          type="number"
          placeholder="Duration (mins)"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          className="w-full p-2 border rounded mt-2"
          required
        />
      )}
      {type === 'downtime_interrupt' && (
        <input
          type="number"
          placeholder="Interrupt Interval (mins)"
          value={interruptInterval}
          onChange={(e) => setInterruptInterval(Number(e.target.value))}
          className="w-full p-2 border rounded mt-2"
          required
        />
      )}
      <button type="submit" className="w-full p-2 mt-2 bg-blue-500 text-white rounded">Add</button>
    </form>
  )
}

function ActivityItem({ activity }: { activity: Activity }) {
  const handleDelete = async () => {
    await deleteActivity(activity.id);
  };

  return (
    <div className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100">
      <div>
        <p className="font-semibold">{activity.title}</p>
        <p className="text-sm text-gray-400">
          {activity.type === 'downtime_duration' ? `${activity.duration} mins` : `every ${activity.interruptInterval} mins`}
        </p>
      </div>
      <form action={handleDelete}>
        <button type="submit" className="text-red-500 hover:text-red-400">Delete</button>
      </form>
    </div>
  )
} 