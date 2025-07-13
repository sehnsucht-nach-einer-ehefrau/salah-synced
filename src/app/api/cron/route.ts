import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { kv } from '@vercel/kv';
import { isNotNull } from "drizzle-orm";

async function sendTelegramMessage(chatId: string, text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
      }),
    });
    if (!response.ok) {
      const data = await response.json();
      console.error('Failed to send Telegram message:', data);
    }
  } catch (error) {
    console.error('Error sending Telegram message:', error);
  }
}

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', {
      status: 401,
    });
  }
  
  const usersToNotify = await db
    .select()
    .from(users)
    .where(isNotNull(users.telegramChatId));

  for (const user of usersToNotify) {
    if (user.telegramChatId) {
      // This is a simplified logic.
      // In a real application, we would need to determine the current activity
      // based on the schedule and prayer times.
      const currentActivity = "New Activity"; // Placeholder
      const lastActivity: string | null = await kv.get(`last_activity:${user.id}`);

      if (currentActivity !== lastActivity) {
        await sendTelegramMessage(user.telegramChatId, `Your new activity is: ${currentActivity}`);
        await kv.set(`last_activity:${user.id}`, currentActivity);
      }
    }
  }

  return NextResponse.json({ ok: true });
} 