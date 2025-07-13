import { auth } from "@/lib/auth"
import HomePageClient from "./HomePageClient";
import { getActivities, getMeals } from "@/lib/actions";

export default async function HomePageWrapper() {
  const session = await auth();
  const activities = await getActivities();
  const meals = await getMeals();
  return <HomePageClient session={session} activities={activities} meals={meals} />;
} 