"use client";

import { useState } from 'react';
import { saveTelegramChatId } from '@/lib/actions';

export default function TelegramConnect() {
  const [chatId, setChatId] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveTelegramChatId(chatId);
    setChatId('');
  };

  return (
    <div className="p-5">
      <h3 className="text-lg font-medium">Connect to Telegram</h3>
      <p className="text-sm text-muted-foreground">
        Get notifications for your schedule by connecting your Telegram account.
      </p>
      <ol className="list-decimal list-inside mt-4 space-y-2">
        <li>Open Telegram and search for the &quot;Salah Synced&quot; bot.</li>
        <li>Start a chat with the bot and send the following command:</li>
        <pre className="bg-gray-100 p-2 rounded-md text-sm">
          <code>/connect {`{your-user-id}`}</code>
        </pre>
        <li>You will receive a confirmation message from the bot.</li>
      </ol>
      <div className="mt-4">
        <p className="text-sm">
          Your User ID is: <code className="bg-gray-100 p-1 rounded-md">{`{user-id}`}</code>
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          You can find your User ID in your profile settings.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div>
          <label htmlFor="chatId" className="block text-sm font-medium text-gray-700">
            Your Chat ID
          </label>
          <input
            type="text"
            id="chatId"
            value={chatId}
            onChange={(e) => setChatId(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Save Chat ID
        </button>
      </form>
    </div>
  );
} 