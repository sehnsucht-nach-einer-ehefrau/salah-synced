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
      <h2 className="text-xl font-bold">Connect to Telegram</h2>
      <ol className="list-decimal list-inside mt-4 space-y-2">
        <li>Open Telegram and search for the "BotFather".</li>
        <li>Send <code>/newbot</code> to create a new bot.</li>
        <li>Follow the instructions and get your bot token.</li>
        <li>Search for your bot in Telegram and send it a message.</li>
        <li>Open a new tab and go to <code>https://api.telegram.org/botYOUR_BOT_TOKEN/getUpdates</code>.</li>
        <li>Find the "chat" object and copy the "id".</li>
      </ol>
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