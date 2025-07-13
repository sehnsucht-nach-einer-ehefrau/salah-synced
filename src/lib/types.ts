export interface Activity {
    id: string;
    userId: string;
    title: string;
    type: "action" | "filler" | "downtime_duration" | "downtime_interrupt";
    duration: number | null;
    interruptInterval: number | null;
}

export interface Meal {
    id: string;
    userId: string;
    name: string;
    type: "breakfast" | "lunch" | "dinner";
} 