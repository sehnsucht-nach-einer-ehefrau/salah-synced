'use server'

import { db } from '@/db'
import { activities, meals, users } from '@/db/schema'
import { auth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { eq, and } from 'drizzle-orm'

const addActivitySchema = z.object({
  title: z.string().min(1),
  type: z.enum(['action', 'filler', 'downtime_duration', 'downtime_interrupt']),
  duration: z.number().optional(),
  interruptInterval: z.number().optional(),
})

export async function addActivity(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) {
    return { error: 'Not authenticated' }
  }

  const validatedFields = addActivitySchema.safeParse({
    title: formData.get('title'),
    type: formData.get('type'),
    duration: formData.get('duration') ? Number(formData.get('duration')) : undefined,
    interruptInterval: formData.get('interruptInterval') ? Number(formData.get('interruptInterval')) : undefined,
  })

  if (!validatedFields.success) {
    return { error: 'Invalid fields' }
  }

  const { title, type, duration, interruptInterval } = validatedFields.data

  await db.insert(activities).values({
    id: crypto.randomUUID(),
    userId: session.user.id,
    title,
    type,
    duration,
    interruptInterval,
  })

  revalidatePath('/')
}

export async function getActivities() {
  const session = await auth()
  if (!session?.user?.id) {
    return []
  }

  return db.select().from(activities).where(eq(activities.userId, session.user.id))
}

export async function deleteActivity(id: string) {
    const session = await auth()
    if (!session?.user?.id) {
        return { error: 'Not authenticated' }
    }

    await db.delete(activities).where(and(eq(activities.id, id), eq(activities.userId, session.user.id)));

    revalidatePath('/')
}

const addMealSchema = z.object({
    name: z.string().min(1),
    type: z.enum(['breakfast', 'lunch', 'dinner']),
});

export async function addMeal(formData: FormData) {
    const session = await auth()
    if (!session?.user?.id) {
        return { error: 'Not authenticated' }
    }

    const validatedFields = addMealSchema.safeParse({
        name: formData.get('name'),
        type: formData.get('type'),
    })

    if (!validatedFields.success) {
        return { error: 'Invalid fields' }
    }

    const { name, type } = validatedFields.data

    await db.insert(meals).values({
        id: crypto.randomUUID(),
        userId: session.user.id,
        name,
        type,
    })

    revalidatePath('/')
}

export async function getMeals() {
    const session = await auth()
    if (!session?.user?.id) {
        return []
    }

    return db.select().from(meals).where(eq(meals.userId, session.user.id))
}

export async function saveTelegramChatId(chatId: string) {
    const session = await auth()
    if (!session?.user?.id) {
        return { error: 'Not authenticated' }
    }

    await db.update(users).set({ telegramChatId: chatId }).where(eq(users.id, session.user.id));

    revalidatePath('/')
} 