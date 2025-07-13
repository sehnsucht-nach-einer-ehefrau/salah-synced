"use client";

import { useState } from 'react';
import { addActivity, deleteActivity } from '@/lib/actions';
import { Activity } from '@/lib/types';

interface ActivityManagerProps {
    activities: Activity[];
}

export default function ActivityManager({ activities }: ActivityManagerProps) {
  const [newActivityTitle, setNewActivityTitle] = useState('');
  const [newActivityType, setNewActivityType] = useState('action');
  const [newActivityDuration, setNewActivityDuration] = useState(30);

  const handleAddActivity = async (formData: FormData) => {
    const result = await addActivity(formData);
    if (result?.error) {
      alert(result.error);
    } else {
      setNewActivityTitle('');
      setNewActivityType('action');
      setNewActivityDuration(30);
    }
  };

  const handleDeleteActivity = async (id: string) => {
    const result = await deleteActivity(id);
    if (result?.error) {
      alert(result.error);
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold">Activities</h2>
      <ul className="mt-4 space-y-2">
        {activities.map((activity) => (
          <li key={activity.id} className="p-4 bg-gray-100 rounded-lg flex justify-between items-center">
            <div>
              <p className="font-semibold">{activity.title}</p>
              <p className="text-sm text-gray-500">
                {activity.type} {activity.type === 'action' && `(${activity.duration} mins)`}
              </p>
            </div>
            <form action={() => handleDeleteActivity(activity.id)}>
              <button type="submit" className="text-red-500 hover:text-red-700">Delete</button>
            </form>
          </li>
        ))}
      </ul>
      <form action={handleAddActivity} className="mt-4 space-y-4">
        <h3 className="text-lg font-semibold">Add New Activity</h3>
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={newActivityTitle}
            onChange={(e) => setNewActivityTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">
            Type
          </label>
          <select
            id="type"
            name="type"
            value={newActivityType}
            onChange={(e) => setNewActivityType(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="action">Action</option>
            <option value="filler">Filler</option>
          </select>
        </div>
        {newActivityType === 'action' && (
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
              Duration (minutes)
            </label>
            <input
              type="number"
              id="duration"
              name="duration"
              value={newActivityDuration}
              onChange={(e) => setNewActivityDuration(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
        )}
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add Activity
        </button>
      </form>
    </div>
  );
} 