"use client";

import { useState } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { addMeal } from '@/lib/actions';

interface Meal {
    id: string;
    userId: string;
    name: string;
    type: "breakfast" | "lunch" | "dinner";
}

interface MealManagerProps {
    meals: Meal[];
}

export default function MealManager({ meals }: MealManagerProps) {
  const [mealMode, setMealMode] = useState('maintenance');

  return (
    <div className="flex items-center space-x-2">
      <Popover.Root>
        <Popover.Trigger asChild>
          <button
            onClick={() => setMealMode('cutting')}
            className={`px-3 py-1 rounded-full text-sm ${mealMode === 'cutting' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Cutting
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content className="w-80 bg-white p-5 rounded-md shadow-lg" sideOffset={5}>
            <MealForm type="cutting" meals={meals} />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>

      <Popover.Root>
        <Popover.Trigger asChild>
          <button
            onClick={() => setMealMode('maintenance')}
            className={`px-3 py-1 rounded-full text-sm ${mealMode === 'maintenance' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
          >
            Maintenance
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content className="w-80 bg-white p-5 rounded-md shadow-lg" sideOffset={5}>
            <MealForm type="maintenance" meals={meals} />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
      
      <Popover.Root>
        <Popover.Trigger asChild>
          <button
            onClick={() => setMealMode('bulking')}
            className={`px-3 py-1 rounded-full text-sm ${mealMode === 'bulking' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
          >
            Bulking
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content className="w-80 bg-white p-5 rounded-md shadow-lg" sideOffset={5}>
            <MealForm type="bulking" meals={meals} />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
      
      <span className="text-gray-400">·</span>

      <Popover.Root>
        <Popover.Trigger asChild>
          <button className="px-3 py-1 rounded-full text-sm bg-gray-200">
            Log
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content className="w-80 bg-white p-5 rounded-md shadow-lg" sideOffset={5}>
            <MealForm type="log" meals={meals} />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
}

function MealForm({ type, meals }: { type: string, meals: Meal[] }) {
  const [breakfast, setBreakfast] = useState('');
  const [lunch, setLunch] = useState('');
  const [dinner, setDinner] = useState('');

  const handleAddMeal = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const createMeal = async (name: string, type: 'breakfast' | 'lunch' | 'dinner') => {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('type', type);
      await addMeal(formData);
    };

    if (breakfast) await createMeal(breakfast, 'breakfast');
    if (lunch) await createMeal(lunch, 'lunch');
    if (dinner) await createMeal(dinner, 'dinner');

    setBreakfast('');
    setLunch('');
    setDinner('');
  };

  return (
    <form onSubmit={handleAddMeal} className="space-y-4">
      <h3 className="text-lg font-semibold capitalize">{type} Meals</h3>
      <div>
        <label htmlFor="breakfast" className="block text-sm font-medium text-gray-700">Breakfast</label>
        <input type="text" id="breakfast" name="breakfast" value={breakfast} onChange={(e) => setBreakfast(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" />
      </div>
      <div>
        <label htmlFor="lunch" className="block text-sm font-medium text-gray-700">Lunch</label>
        <input type="text" id="lunch" name="lunch" value={lunch} onChange={(e) => setLunch(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" />
      </div>
      <div>
        <label htmlFor="dinner" className="block text-sm font-medium text-gray-700">Dinner</label>
        <input type="text" id="dinner" name="dinner" value={dinner} onChange={(e) => setDinner(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" />
      </div>
      <button type="submit" className="w-full py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
        Save Meals
      </button>

      <div className="mt-4">
        <h4 className="font-semibold">Logged Meals:</h4>
        <ul className="list-disc list-inside">
          {meals.filter(meal => meal.type === 'breakfast').map(meal => <li key={meal.id}>{meal.name} (Breakfast)</li>)}
          {meals.filter(meal => meal.type === 'lunch').map(meal => <li key={meal.id}>{meal.name} (Lunch)</li>)}
          {meals.filter(meal => meal.type === 'dinner').map(meal => <li key={meal.id}>{meal.name} (Dinner)</li>)}
        </ul>
      </div>
    </form>
  )
} 