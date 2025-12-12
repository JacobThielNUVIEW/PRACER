
import { Activity, AthleteProfile, Race, AthleteShort, Shoe, AudioItem, Challenge, Club, ClothingItem } from './types';

export const MOCK_PRS = [
  { distance: '5k', time: '18:45', date: 'Oct 12, 2023', activityId: '101' },
  { distance: '10k', time: '39:30', date: 'Sep 05, 2023', activityId: '102' },
  { distance: 'HM', time: '1:28:15', date: 'Mar 15, 2024', activityId: '103', isRecent: true },
  { distance: 'Marathon', time: '3:10:20', date: 'Nov 20, 2022', activityId: '104' },
];

export const MOCK_PROFILE: AthleteProfile = {
  name: "Alex Runner",
  location: "Boulder, CO",
  vdot: 54.2,
  weeklyGoal: 60,
  currentWeeklyDistance: 42.5,
  streakDays: 14,
  followers: 124,
  following: 85,
  activitiesCount: 342,
  prs: MOCK_PRS
};

const USER_ALEX: AthleteShort = { name: "Alex Runner", initials: "AR", isCurrentUser: true };
const USER_SARAH: AthleteShort = { name: "Sarah Sprint", initials: "SS", isCurrentUser: false };
const USER_MIKE: AthleteShort = { name: "Mike Marathon", initials: "MM", isCurrentUser: false };

export const MOCK_ACTIVITIES: Activity[] = [
  { 
    id: '1', 
    athlete: USER_ALEX,
    name: 'Morning Tempo Run', 
    date: 'Today at 6:30 AM', 
    distance: 12.5, 
    duration: 62, 
    type: 'Run', 
    elevation: 120, 
    vdotScore: 54, 
    activityScore: 82,
    pace: '4:58 /km',
    likes: 12,
    comments: 2,
    location: 'Boulder, CO',
    description: 'Felt strong on the hills today. Pracer AI suggested I push the pace on the last 2km.',
    source: 'Garmin',
    externalLink: 'https://connect.garmin.com',
    isSynced: true,
    metrics: { avgHr: 154, maxHr: 172, calories: 850 }
  },
  { 
    id: '2', 
    athlete: USER_SARAH,
    name: 'Recovery Ride', 
    date: 'Yesterday at 5:15 PM', 
    distance: 25.0, 
    duration: 55, 
    type: 'Ride', 
    elevation: 300,
    pace: '27.2 km/h',
    activityScore: 45,
    likes: 45,
    comments: 5,
    location: 'Denver, CO',
    source: 'Strava',
    externalLink: 'https://strava.com',
    isSynced: true,
    metrics: { avgWatts: 180, avgHr: 125 }
  },
  { 
    id: '3', 
    athlete: USER_ALEX,
    name: 'Track Tuesday Intervals', 
    date: 'Tuesday at 6:00 PM', 
    distance: 8.0, 
    duration: 45, 
    type: 'Run', 
    elevation: 10, 
    vdotScore: 56, 
    activityScore: 94,
    pace: '4:10 /km',
    likes: 28,
    comments: 4,
    location: 'Boulder High Track',
    source: 'Strava',
    externalLink: 'https://strava.com',
    isSynced: true,
    metrics: { avgHr: 168, maxHr: 185 }
  },
  { 
    id: '4', 
    athlete: USER_MIKE,
    name: 'Long Run Sunday', 
    date: 'Sunday at 7:00 AM', 
    distance: 22.0, 
    duration: 115, 
    type: 'Run', 
    elevation: 250, 
    vdotScore: 53, 
    activityScore: 88,
    pace: '5:14 /km',
    likes: 89,
    comments: 12,
    location: 'Golden, CO',
    source: 'Garmin',
    externalLink: 'https://connect.garmin.com',
    isSynced: true,
    metrics: { avgHr: 145, calories: 1600 }
  },
];

export const MOCK_RACES: Race[] = [
  // Upcoming
  { id: 'r1', name: 'Boston Marathon', date: '2025-04-15', distance: 'M', distanceKm: 42.2, targetPace: '4:30', location: 'Boston, MA', daysOut: 45, status: 'Confirmed', importance: 5 },
  { id: 'r2', name: 'Bolder Boulder', date: '2025-05-27', distance: '10k', distanceKm: 10, targetPace: '3:55', location: 'Boulder, CO', daysOut: 87, status: 'Confirmed', importance: 4 },
  { id: 'r3', name: 'Chicago Marathon', date: '2025-10-13', distance: 'M', distanceKm: 42.2, location: 'Chicago, IL', status: 'Wishlist', importance: 3 },
  { id: 'r4', name: 'Leadville 100', date: '2026-08-14', distance: '100M', distanceKm: 160, location: 'Leadville, CO', status: 'Wishlist', importance: 5 },
  
  // Historical
  { id: 'h1', name: 'Turkey Trot', date: '2023-11-23', distance: '5k', distanceKm: 5, resultTime: '18:45', location: 'Denver, CO', status: 'Completed', importance: 2 },
  { id: 'h2', name: 'Colfax Marathon', date: '2023-05-15', distance: 'M', distanceKm: 42.2, resultTime: '3:10:20', location: 'Denver, CO', status: 'Completed', importance: 4 },
  { id: 'h3', name: 'Garden of Gods', date: '2022-06-12', distance: '10M', distanceKm: 16, resultTime: '1:05:30', location: 'Colo Spgs, CO', status: 'Completed', importance: 3 },
  { id: 'h4', name: 'New York Marathon', date: '2022-11-06', distance: 'M', distanceKm: 42.2, resultTime: '3:25:10', location: 'New York, NY', status: 'Completed', importance: 5 },
];

export const CHART_DATA = [
  { name: 'W1', vdot: 51, volume: 40, pace: 5.30, intensity: 40 },
  { name: 'W2', vdot: 52, volume: 45, pace: 5.25, intensity: 55 },
  { name: 'W3', vdot: 51.5, volume: 38, pace: 5.35, intensity: 30 },
  { name: 'W4', vdot: 53, volume: 55, pace: 5.15, intensity: 75 },
  { name: 'W5', vdot: 54, volume: 50, pace: 5.10, intensity: 70 },
  { name: 'W6', vdot: 54.2, volume: 62, pace: 5.05, intensity: 85, race: 'Boston' }, // Race week
  { name: 'W7', vdot: 53.8, volume: 20, pace: 5.40, intensity: 20 },
  { name: 'W8', vdot: 54.5, volume: 45, pace: 5.10, intensity: 60 },
  { name: 'W9', vdot: 55, volume: 55, pace: 5.00, intensity: 80 },
];

// Personal Shoes
export const MOCK_SHOES: Shoe[] = [
  { id: 's1', name: 'Alphafly 3', brand: 'Nike', currentDistance: 42, maxDistance: 400, status: 'Active', type: 'Race', rating: 4.8 },
  { id: 's2', name: 'Triumph 21', brand: 'Saucony', currentDistance: 320, maxDistance: 800, status: 'Active', type: 'Daily', rating: 4.5 },
  { id: 's3', name: 'Speedgoat 5', brand: 'Hoka', currentDistance: 150, maxDistance: 600, status: 'Active', type: 'Trail', rating: 4.7 },
];

// Global Ranked Shoes
export const GLOBAL_RANKED_SHOES: Shoe[] = [
  { id: 'gs1', name: 'Alphafly 3', brand: 'Nike', currentDistance: 0, maxDistance: 0, status: 'Active', type: 'Race', globalRank: 1, rating: 4.9, reviewCount: 1240, image: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/28c11f71-2947-4c7b-832f-453ee4877332/alphafly-3-road-racing-shoes-X3m6d6.png' },
  { id: 'gs2', name: 'Vaporfly 3', brand: 'Nike', currentDistance: 0, maxDistance: 0, status: 'Active', type: 'Race', globalRank: 2, rating: 4.8, reviewCount: 980, image: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/4e84b726-0e36-4034-9721-399088675688/vaporfly-3-road-racing-shoes-xsDgvM.png' },
  { id: 'gs3', name: 'Endorphin Pro 4', brand: 'Saucony', currentDistance: 0, maxDistance: 0, status: 'Active', type: 'Race', globalRank: 3, rating: 4.7, reviewCount: 650 },
  { id: 'gs4', name: 'Superblast', brand: 'Asics', currentDistance: 0, maxDistance: 0, status: 'Active', type: 'Daily', globalRank: 4, rating: 4.9, reviewCount: 890 },
  { id: 'gs5', name: 'Adios Pro 3', brand: 'Adidas', currentDistance: 0, maxDistance: 0, status: 'Active', type: 'Race', globalRank: 5, rating: 4.6, reviewCount: 520 },
  { id: 'gs6', name: 'Novablast 4', brand: 'Asics', currentDistance: 0, maxDistance: 0, status: 'Active', type: 'Daily', globalRank: 6, rating: 4.5, reviewCount: 1100 },
];

export const GLOBAL_RANKED_CLOTHING: ClothingItem[] = [
  { id: 'c1', name: 'Van Cortlandt Short', brand: 'Tracksmith', type: 'Shorts', rating: 4.8, reviewCount: 450, globalRank: 1 },
  { id: 'c2', name: 'Race Singlet', brand: 'Soar', type: 'Singlet', rating: 4.9, reviewCount: 120, globalRank: 2 },
  { id: 'c3', name: '5" Session Shorts', brand: 'Ten Thousand', type: 'Shorts', rating: 4.6, reviewCount: 890, globalRank: 3 },
  { id: 'c4', name: 'Distance Half Tights', brand: 'Nike', type: 'Shorts', rating: 4.7, reviewCount: 340, globalRank: 4 },
];

export const MOCK_AUDIO: AudioItem[] = [
  { id: 'a1', title: 'Marathon Mindset', author: 'Dr. Run', type: 'Audiobook', progress: 45 },
  { id: 'a2', title: 'Cadence 180', author: 'Pracer Mix', type: 'Playlist', duration: '2h 15m' },
];

export const GLOBAL_RANKED_AUDIO: AudioItem[] = [
  { id: 'ga1', title: 'Born to Run', author: 'Christopher McDougall', type: 'Audiobook', votes: 15420, globalRank: 1 },
  { id: 'ga2', title: 'Can\'t Hurt Me', author: 'David Goggins', type: 'Audiobook', votes: 14200, globalRank: 2 },
  { id: 'ga3', title: 'Running Up That Hill', author: 'Spotify Mix', type: 'Playlist', votes: 8900, globalRank: 3 },
  { id: 'ga4', title: 'Endure', author: 'Alex Hutchinson', type: 'Audiobook', votes: 6700, globalRank: 4 },
];

export const MOCK_CHALLENGES: Challenge[] = [
  { id: 'c1', name: 'October 10k', type: 'Distance', participants: 124500, endDate: 'Oct 31' },
  { id: 'c2', name: 'Pracer Elevation', type: 'Climbing', participants: 45000, endDate: 'Oct 15' },
];

export const MOCK_CLUBS: Club[] = [
  { id: 'cl1', name: 'Boulder Track Club', members: 1240, location: 'Boulder, CO' },
  { id: 'cl2', name: 'Pracer Global', members: 5600, location: 'Worldwide' },
];
