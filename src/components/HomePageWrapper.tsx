import { auth } from "@/lib/auth"
import HomePageClient from "./HomePageClient";
import { getActivities, getMeals } from "@/lib/actions";
import { Activity, Meal } from "@/lib/types";

export default async function HomePageWrapper() {
  const session = await auth();
  let allActivities: Activity[] = [];
  let meals: Meal[] = [];

  try {
    allActivities = await getActivities();
    meals = await getMeals();
  } catch (error) {
    console.error("Failed to fetch data:", error);
    // Passing empty arrays to the client to avoid crashing.
    // A more sophisticated error handling could be implemented here.
  }

  const actionAndFillerActivities = allActivities.filter(a => a.type === 'action' || a.type === 'filler');
  const downtimeActivities = allActivities.filter(a => a.type === 'downtime_duration' || a.type === 'downtime_interrupt');

  return (
    <HomePageClient
      session={session}
      actionAndFillerActivities={actionAndFillerActivities}
      downtimeActivities={downtimeActivities}
      meals={meals}
    />
  );
} 