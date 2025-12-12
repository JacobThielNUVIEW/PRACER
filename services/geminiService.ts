import { AthleteProfile, Activity } from "../types";

// MOCK SERVICE - No external dependencies to ensure UI stability
// You can uncomment the real API call when you deploy with a valid API_KEY

export const getCoachingAdvice = async (
  profile: AthleteProfile,
  recentActivity: Activity
): Promise<string> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  // Return dynamic mock data based on inputs
  if (profile.streakDays > 5) {
    return `You're on fire, ${profile.name.split(' ')[0]}! A ${profile.streakDays}-day streak makes you ${Math.min(70 + profile.streakDays * 2, 99)}% more likely to hit your weekly goal. Keep this momentum.`;
  }
  
  if (recentActivity.distance > 15) {
    return `Solid long effort on that ${recentActivity.distance}km run. Recovery is your priority now—hydrate and sleep well to bank those fitness gains.`;
  }

  return "Consistency is the foundation of performance. Great job getting out there today. Never Stop.";
};