
export interface AthleteShort {
  name: string;
  avatar?: string;
  initials: string;
  isCurrentUser?: boolean;
}

export type ActivitySource = 'Strava' | 'Garmin' | 'Apple Health' | 'Manual';

export interface ActivityMetrics {
  avgHr?: number;
  maxHr?: number;
  avgWatts?: number;
  calories?: number;
  sufferScore?: number;
}

export interface Activity {
  id: string;
  athlete?: AthleteShort; 
  name: string;
  date: string; // ISO or relative string
  distance: number; // in km
  duration: number; // in minutes
  type: 'Run' | 'Ride' | 'Swim' | 'Workout';
  elevation: number; // in meters
  vdotScore?: number;
  activityScore?: number; // 0-100 Pracer Score
  pace?: string; // e.g. "4:30 /km"
  likes: number;
  comments: number;
  location?: string;
  description?: string;
  source?: ActivitySource;
  externalLink?: string; // Link to Strava/Garmin
  isSynced?: boolean;
  metrics?: ActivityMetrics;
}

export type RaceStatus = 'Wishlist' | 'Confirmed' | 'Completed';

export interface Race {
  id: string;
  name: string;
  date: string;
  distance: string; // "5k", "10k", "HM", "M", "50k"
  distanceKm: number; // for sorting/graphing
  targetPace?: string; 
  resultTime?: string; // For completed races
  location: string;
  daysOut?: number; // Calculated field
  status: RaceStatus;
  importance: number; // 1-5 (5 is A-Race)
}

export interface PersonalRecord {
  distance: string;
  time: string;
  date: string;
  activityId: string;
  isRecent?: boolean; // Achieved in last 3 months
}

export interface Shoe {
  id: string;
  name: string;
  brand: string;
  image?: string;
  currentDistance: number;
  maxDistance: number;
  status: 'Active' | 'Retired';
  type: 'Race' | 'Daily' | 'Trail' | 'Speed';
  // Ranking fields
  rating?: number;
  reviewCount?: number;
  globalRank?: number;
}

export interface ClothingItem {
  id: string;
  name: string;
  brand: string;
  type: 'Shorts' | 'Singlet' | 'Jacket' | 'Socks';
  image?: string;
  rating: number;
  reviewCount: number;
  globalRank: number;
}

export interface AudioItem {
  id: string;
  title: string;
  author: string;
  type: 'Audiobook' | 'Playlist' | 'Podcast';
  cover?: string;
  duration?: string;
  progress?: number;
  // Ranking fields
  votes?: number;
  globalRank?: number;
}

export interface Challenge {
  id: string;
  name: string;
  type: string;
  participants: number;
  endDate: string;
  image?: string;
  logo?: string;
}

export interface Club {
  id: string;
  name: string;
  members: number;
  location: string;
  isPrivate?: boolean;
}

export interface AthleteProfile {
  name: string;
  location: string;
  vdot: number;
  weeklyGoal: number; // km
  currentWeeklyDistance: number; // km
  streakDays: number;
  followers: number;
  following: number;
  activitiesCount: number;
  prs: PersonalRecord[];
}
