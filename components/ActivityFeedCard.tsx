
import React from 'react';
import { Link } from '../lib/router-context';
import { Heart, MessageCircle, Share2, MoreHorizontal, ThumbsUp, Map, TrendingUp } from 'lucide-react';
import { Activity } from '../types';

interface ActivityFeedCardProps {
  activity: Activity;
}

const ActivityFeedCard: React.FC<ActivityFeedCardProps> = ({ activity }) => {
  // Logic to determine profile link (for demo, current user links to /profile, others could link to /profile/id)
  const profileLink = activity.athlete?.isCurrentUser ? '/profile' : '#';

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 mb-4 overflow-hidden group">
      
      {/* 1. Header */}
      <div className="p-4 pb-2 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Link href={profileLink} className="block">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-bold text-sm border border-slate-200 cursor-pointer hover:border-primary hover:text-primary transition-colors overflow-hidden">
               {activity.athlete?.avatar ? (
                 <img src={activity.athlete.avatar} alt={activity.athlete.name} className="w-full h-full object-cover" />
               ) : (
                 <span>{activity.athlete?.initials}</span>
               )}
            </div>
          </Link>
          <div>
            <Link href={profileLink} className="block">
              <h4 className="font-bold text-sm text-slate-900 hover:text-primary cursor-pointer transition-colors leading-tight">
                {activity.athlete?.name}
              </h4>
            </Link>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5 font-medium">
               <span>{activity.date}</span>
               <span className="w-0.5 h-0.5 bg-slate-400 rounded-full"></span>
               <span>{activity.location || 'Boulder, CO'}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
           {activity.source && (
             <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
               activity.source === 'Strava' ? 'text-orange-600 bg-orange-50' : 
               activity.source === 'Garmin' ? 'text-blue-600 bg-blue-50' : 
               'text-slate-600 bg-slate-100'
             }`}>
               {activity.source}
             </span>
           )}
           <button className="text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-100 transition-colors">
             <MoreHorizontal className="w-5 h-5" />
           </button>
        </div>
      </div>

      {/* 2. Content */}
      <div className="px-4 mb-3">
         <div className="flex items-center gap-2 mb-1">
            <span className="text-lg grayscale group-hover:grayscale-0 transition-all">
               {activity.type === 'Run' ? '🏃' : activity.type === 'Ride' ? '🚴' : '🏋️'}
            </span>
            <h3 className="font-bold text-lg text-slate-900 hover:text-primary cursor-pointer transition-colors">
               {activity.name}
            </h3>
         </div>
         {activity.description && (
            <p className="text-sm text-slate-600 leading-relaxed font-normal">{activity.description}</p>
         )}
      </div>

      {/* 3. Stats Row - Strava Style */}
      <div className="px-4 mb-4">
         <div className="flex flex-wrap gap-x-8 gap-y-2 text-slate-900">
            <div>
               <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Distance</span>
               <span className="text-xl font-light tracking-tight">{activity.distance}<span className="text-sm font-normal text-slate-500 ml-1">km</span></span>
            </div>
            <div>
               <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Pace</span>
               <span className="text-xl font-light tracking-tight">{activity.pace}</span>
            </div>
            <div>
               <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Time</span>
               <span className="text-xl font-light tracking-tight">
                  {Math.floor(activity.duration / 60)}<span className="text-sm font-normal text-slate-500">h</span> {activity.duration % 60}<span className="text-sm font-normal text-slate-500">m</span>
               </span>
            </div>
            {activity.metrics?.avgHr && (
               <div className="hidden sm:block">
                  <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">HR</span>
                  <div className="flex items-center gap-1">
                     <Heart className="w-3 h-3 text-red-500 fill-red-500" />
                     <span className="text-xl font-light tracking-tight">{activity.metrics.avgHr}</span>
                  </div>
               </div>
            )}
         </div>
      </div>

      {/* 4. Map View */}
      <div className="px-4 mb-4">
         <div className="w-full h-64 bg-slate-100 rounded-lg relative overflow-hidden cursor-pointer group/map border border-slate-200">
            {/* Map Background Pattern */}
            <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-multiply"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-100/50 to-transparent"></div>
            
            {/* Route Line Simulation */}
            <svg className="absolute inset-0 w-full h-full p-8 drop-shadow-xl" viewBox="0 0 100 100" preserveAspectRatio="none">
               <path d="M10,90 Q30,80 50,50 T90,10" fill="none" stroke="#FC4C02" strokeWidth="2" strokeLinecap="round" className="opacity-80 group-hover/map:opacity-100 transition-opacity" />
            </svg>

            <div className="absolute bottom-3 left-3 flex gap-2">
               <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold text-slate-600 shadow-sm border border-slate-200 flex items-center gap-1">
                  <Map className="w-3 h-3" /> Map View
               </span>
               {activity.elevation > 0 && (
                  <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold text-slate-600 shadow-sm border border-slate-200 flex items-center gap-1">
                     <TrendingUp className="w-3 h-3" /> {activity.elevation}m
                  </span>
               )}
            </div>
         </div>
      </div>

      {/* 5. Footer */}
      <div className="px-4 py-3 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
         <div className="flex items-center gap-4">
            <button className="flex items-center gap-1.5 text-slate-500 hover:text-orange-600 transition-colors group/btn">
               <ThumbsUp className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
               <span className="text-xs font-bold">{activity.likes}</span>
            </button>
            <button className="flex items-center gap-1.5 text-slate-500 hover:text-primary transition-colors group/btn">
               <MessageCircle className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
               <span className="text-xs font-bold">{activity.comments}</span>
            </button>
         </div>
         <button className="text-slate-400 hover:text-primary transition-colors p-1.5 hover:bg-slate-100 rounded-full">
            <Share2 className="w-4 h-4" />
         </button>
      </div>

    </div>
  );
};

export default ActivityFeedCard;
