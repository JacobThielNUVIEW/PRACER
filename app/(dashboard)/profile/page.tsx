
'use client';

import React, { useState } from 'react';
import { 
  MapPin, 
  Calendar, 
  Link as LinkIcon, 
  Trophy, 
  Zap, 
  Footprints, 
  Flame, 
  Share2, 
  Award, 
  TrendingUp, 
  Clock, 
  Camera, 
  Medal,
  Headphones,
  Music,
  Plus,
  Edit3,
  Target,
  Heart,
  MessageCircle,
  Play
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  ResponsiveContainer, 
  YAxis 
} from 'recharts';
import { MOCK_PROFILE, MOCK_SHOES, MOCK_RACES, MOCK_AUDIO } from '../../../constants';
import { Button } from '../../../components/ui-kit';

export default function ProfilePage() {
  const [activeGearTab, setActiveGearTab] = useState<'shoes' | 'audio'>('shoes');

  // Find next "A" Race (Importance 5) or first confirmed
  const nextRace = MOCK_RACES
    .filter(r => r.status === 'Confirmed' && new Date(r.date) > new Date())
    .sort((a,b) => (b.importance - a.importance) || (new Date(a.date).getTime() - new Date(b.date).getTime()))[0];

  // Mock Annual Goal Data
  const annualGoal = 2500;
  const currentAnnual = 1840;
  const percentAnnual = Math.round((currentAnnual / annualGoal) * 100);
  const projectedAnnual = 2650; // Simple mock projection

  // Mock Photos with better placeholders
  const RECENT_PHOTOS = [
    { id: 1, url: 'https://images.unsplash.com/photo-1596727147705-54a9d6ed27e6?q=80&w=600&auto=format&fit=crop', likes: 45, comments: 3 },
    { id: 2, url: 'https://images.unsplash.com/photo-1552674605-46d536d232a3?q=80&w=600&auto=format&fit=crop', likes: 128, comments: 12 },
    { id: 3, url: 'https://images.unsplash.com/photo-1486218119243-13883505764c?q=80&w=600&auto=format&fit=crop', likes: 67, comments: 8 },
    { id: 4, url: 'https://images.unsplash.com/photo-1534438097545-a2c22c57f01b?q=80&w=600&auto=format&fit=crop', likes: 210, comments: 45 },
  ];

  // Helper to parse "3:10:20" or "18:45" to minutes for chart
  const parseTimeToMinutes = (timeStr: string) => {
    const parts = timeStr.split(':').map(Number);
    if (parts.length === 2) return parts[0] + parts[1]/60; // mm:ss -> minutes
    if (parts.length === 3) return parts[0]*60 + parts[1] + parts[2]/60; // hh:mm:ss -> minutes
    return 0;
  };

  return (
    <div className="space-y-8 pb-12 animate-fade-in font-sans">
      
      {/* 1. HERO SECTION */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative group">
        {/* Banner */}
        <div className="h-56 bg-hero-gradient relative overflow-hidden">
           <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
           <div className="absolute -bottom-10 -right-10 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl animate-pulse"></div>
           {/* Edit Cover Button */}
           <button className="absolute top-4 right-4 bg-black/30 hover:bg-black/50 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm transition-colors opacity-0 group-hover:opacity-100 flex items-center gap-2">
              <Camera className="w-3 h-3" /> Edit Cover
           </button>
        </div>
        
        <div className="px-8 pb-8">
           <div className="flex flex-col md:flex-row items-start md:items-end -mt-20 mb-6 gap-6">
              {/* Avatar */}
              <div className="w-36 h-36 rounded-full border-4 border-white bg-gray-200 shadow-xl overflow-hidden shrink-0 z-10 relative group/avatar">
                 <img src="https://picsum.photos/seed/alex/200" alt={MOCK_PROFILE.name} className="w-full h-full object-cover" />
                 <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity cursor-pointer">
                    <Edit3 className="w-8 h-8 text-white" />
                 </div>
              </div>
              
              {/* Main Info */}
              <div className="flex-1 min-w-0 pt-20 md:pt-0">
                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                       <h1 className="text-4xl font-black text-slate-900 tracking-tight">{MOCK_PROFILE.name}</h1>
                       <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 mt-2 font-medium">
                          <div className="flex items-center gap-1.5">
                             <MapPin className="w-4 h-4 text-slate-400" />
                             {MOCK_PROFILE.location}
                          </div>
                          <div className="flex items-center gap-1.5">
                             <Calendar className="w-4 h-4 text-slate-400" />
                             Joined 2023
                          </div>
                          <a href="#" className="flex items-center gap-1.5 text-primary hover:underline">
                             <LinkIcon className="w-4 h-4" />
                             pracer.com/alex
                          </a>
                       </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                       <Button variant="outline" className="gap-2 border-slate-300 text-slate-700">
                          <Share2 className="w-4 h-4" /> Share
                       </Button>
                       <Button className="gap-2 shadow-lg shadow-indigo-200">
                          Edit Profile
                       </Button>
                    </div>
                 </div>
              </div>
           </div>

           {/* Stats Row with Heatmap Visual */}
           <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100 border-t border-gray-100 pt-6">
              <div className="px-4 text-center group cursor-default">
                 <span className="block text-3xl font-black text-slate-900 group-hover:text-primary transition-colors">{MOCK_PROFILE.activitiesCount}</span>
                 <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Activities</span>
              </div>
              <div className="px-4 text-center group cursor-default">
                 <span className="block text-3xl font-black text-slate-900 group-hover:text-primary transition-colors">{MOCK_PROFILE.followers}</span>
                 <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Followers</span>
              </div>
              <div className="px-4 text-center">
                 <div className="flex items-center justify-center gap-1">
                     <span className="block text-3xl font-black text-orange-500">{MOCK_PROFILE.streakDays}</span>
                     <Flame className="w-6 h-6 text-orange-500 fill-orange-500 animate-pulse" />
                 </div>
                 <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Day Streak</span>
              </div>
              <div className="px-4 text-center flex flex-col items-center">
                 {/* Mini Heatmap Simulation */}
                 <div className="flex gap-0.5 mb-1">
                    {[...Array(7)].map((_, i) => (
                      <div key={i} className={`w-2 h-2 rounded-sm ${i > 1 ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                    ))}
                 </div>
                 <div className="flex gap-0.5">
                    {[...Array(7)].map((_, i) => (
                      <div key={i} className={`w-2 h-2 rounded-sm ${i < 5 ? 'bg-green-500' : 'bg-green-300'}`}></div>
                    ))}
                 </div>
                 <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Consistency</span>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
           
           {/* Next Race Card (Highlighted) */}
           {nextRace && (
             <div className="bg-slate-900 rounded-xl shadow-xl overflow-hidden text-white relative group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary opacity-20 rounded-bl-full -mr-10 -mt-10 group-hover:scale-110 transition-transform duration-500"></div>
                <div className="p-6 relative z-10">
                   <div className="flex items-center gap-2 mb-4 text-secondary">
                      <Medal className="w-5 h-5" />
                      <span className="text-xs font-bold uppercase tracking-widest">Next Major Race</span>
                   </div>
                   <h3 className="text-2xl font-black leading-tight mb-2">{nextRace.name}</h3>
                   <div className="flex items-center gap-2 text-slate-300 text-sm mb-6">
                      <MapPin className="w-4 h-4" /> {nextRace.location}
                      <span>•</span>
                      <Calendar className="w-4 h-4" /> {new Date(nextRace.date).toLocaleDateString()}
                   </div>
                   
                   <div className="flex items-end justify-between">
                      <div>
                         <span className="text-4xl font-black text-white">{nextRace.daysOut}</span>
                         <span className="text-xs text-slate-400 uppercase font-bold block">Days to Go</span>
                      </div>
                      {nextRace.targetPace && (
                        <div className="text-right">
                           <span className="text-xl font-bold text-white block">{nextRace.targetPace}</span>
                           <span className="text-xs text-slate-400 uppercase font-bold">Goal Pace</span>
                        </div>
                      )}
                   </div>
                </div>
                {/* Progress Bar for Training Block */}
                <div className="bg-slate-800 h-2 w-full">
                   <div className="bg-secondary h-full relative" style={{ width: '65%' }}>
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-white rounded-full shadow-md"></div>
                   </div>
                </div>
             </div>
           )}

           {/* Annual Goals - Enhanced */}
           <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                 <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" /> 2025 Goal
                 </h3>
                 <button className="text-xs font-bold text-slate-400 hover:text-primary transition-colors flex items-center gap-1">
                    <Edit3 className="w-3 h-3" /> Edit
                 </button>
              </div>
              
              <div className="relative pt-2">
                 <div className="flex items-end justify-between mb-2">
                    <div>
                       <span className="text-3xl font-black text-slate-900">{currentAnnual}<span className="text-sm font-medium text-slate-400 ml-1">km</span></span>
                       <span className="block text-xs font-bold text-green-600">On Track</span>
                    </div>
                    <div className="text-right">
                       <span className="text-sm font-bold text-slate-500">{percentAnnual}%</span>
                       <span className="block text-xs text-slate-400">of {annualGoal}km</span>
                    </div>
                 </div>
                 
                 {/* Progress Bar */}
                 <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden relative">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${percentAnnual}%` }}></div>
                    {/* Projection Marker */}
                    <div className="absolute top-0 bottom-0 w-0.5 bg-black/20" style={{ left: '70%' }} title="Today's Target"></div>
                 </div>
                 
                 <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
                    <div>
                       <p className="text-[10px] font-bold text-slate-400 uppercase">Projected</p>
                       <p className="text-sm font-black text-slate-900">{projectedAnnual} km</p>
                    </div>
                    <div>
                       <p className="text-[10px] font-bold text-slate-400 uppercase text-right">Weekly Req.</p>
                       <p className="text-sm font-black text-slate-900 text-right">42 km/wk</p>
                    </div>
                 </div>
              </div>
           </div>

           {/* About / Bio */}
           <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-bold text-slate-900 mb-4">Athlete Bio</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                 Marathoner chasing sub-3. Love early morning trails and post-run coffee. Based in Boulder, training for Boston 2025.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                 <span className="px-3 py-1 bg-gray-100 text-slate-600 text-xs font-bold rounded-full">Marathon</span>
                 <span className="px-3 py-1 bg-gray-100 text-slate-600 text-xs font-bold rounded-full">Trail</span>
                 <span className="px-3 py-1 bg-gray-100 text-slate-600 text-xs font-bold rounded-full">Early Bird</span>
              </div>
           </div>
        </div>

        {/* RIGHT COLUMN (8 Cols) */}
        <div className="lg:col-span-8 space-y-8">
           
           {/* The Trophy Case (PRs) */}
           <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="font-bold text-xl text-slate-900 flex items-center gap-2">
                    <Trophy className="w-6 h-6 text-yellow-500" /> Trophy Case
                 </h3>
                 <button className="text-xs font-bold text-primary hover:bg-blue-50 px-3 py-1 rounded transition-colors">
                    View Full History
                 </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {MOCK_PROFILE.prs.map((pr, i) => {
                    // Generate Mock History for visual
                    const currentMins = parseTimeToMinutes(pr.time);
                    const historyData = [
                       { i: 1, val: currentMins * 1.15 },
                       { i: 2, val: currentMins * 1.10 },
                       { i: 3, val: currentMins * 1.05 },
                       { i: 4, val: currentMins * 1.02 },
                       { i: 5, val: currentMins }, // Current PR
                    ];

                    return (
                        <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-primary/20 hover:shadow-md transition-all bg-slate-50/50 group">
                           <div>
                              <div className="flex items-center gap-2 mb-1">
                                 <div className={`p-1 rounded-full ${i === 0 ? 'bg-yellow-100 text-yellow-600' : 'bg-slate-200 text-slate-500'}`}>
                                    <Medal className="w-3 h-3" />
                                 </div>
                                 <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{pr.distance}</span>
                              </div>
                              <div className="flex items-baseline gap-2">
                                 <span className="text-2xl font-black text-slate-900 tracking-tight">{pr.time}</span>
                                 {i === 0 && <span className="text-[10px] font-bold text-yellow-600 bg-yellow-50 px-1.5 py-0.5 rounded border border-yellow-100">PB</span>}
                              </div>
                              <p className="text-[10px] text-slate-400 font-medium mt-1">{pr.date}</p>
                           </div>

                           {/* Mini Sparkline */}
                           <div className="h-12 w-24">
                              <ResponsiveContainer width="100%" height="100%">
                                 <LineChart data={historyData}>
                                    <Line 
                                       type="monotone" 
                                       dataKey="val" 
                                       stroke={i === 0 ? '#EAB308' : '#94A3B8'} 
                                       strokeWidth={2} 
                                       dot={false}
                                       isAnimationActive={true}
                                    />
                                    <YAxis domain={['dataMin', 'dataMax']} hide reversed /> 
                                 </LineChart>
                              </ResponsiveContainer>
                           </div>
                        </div>
                    );
                 })}
              </div>
           </div>

           {/* Recent Photos Grid - Enhanced */}
           <div>
              <h3 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
                 <Camera className="w-5 h-5 text-slate-500" /> Recent Snaps
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 h-48">
                 {RECENT_PHOTOS.map((photo) => (
                   <div key={photo.id} className="relative rounded-xl overflow-hidden group cursor-pointer shadow-sm">
                      <img src={photo.url} alt="Run photo" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-2 backdrop-blur-[2px]">
                         <div className="flex items-center gap-1 font-bold">
                            <Heart className="w-4 h-4 fill-white" /> {photo.likes}
                         </div>
                         <div className="flex items-center gap-1 text-xs">
                            <MessageCircle className="w-3 h-3" /> {photo.comments}
                         </div>
                      </div>
                   </div>
                 ))}
                 <div className="hidden md:flex relative rounded-xl border-2 border-dashed border-gray-200 items-center justify-center flex-col text-slate-400 hover:border-primary hover:text-primary hover:bg-blue-50/50 transition-all cursor-pointer">
                    <Plus className="w-8 h-8 mb-2" />
                    <span className="text-xs font-bold uppercase">Add Photo</span>
                 </div>
              </div>
           </div>

           {/* Interactive Gear Rotation */}
           <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 min-h-[300px]">
              <div className="flex items-center justify-between mb-6">
                 <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                    {activeGearTab === 'shoes' ? <Footprints className="w-5 h-5 text-slate-700" /> : <Headphones className="w-5 h-5 text-slate-700" />}
                    My Gear
                 </h3>
                 
                 {/* Tabs */}
                 <div className="bg-slate-100 p-1 rounded-lg flex items-center">
                    <button 
                      onClick={() => setActiveGearTab('shoes')}
                      className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-2 ${activeGearTab === 'shoes' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                       <Footprints className="w-3 h-3" /> Shoes
                    </button>
                    <button 
                      onClick={() => setActiveGearTab('audio')}
                      className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-2 ${activeGearTab === 'audio' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                       <Headphones className="w-3 h-3" /> Audio
                    </button>
                 </div>
              </div>

              {/* Shoes View */}
              {activeGearTab === 'shoes' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
                     {MOCK_SHOES.slice(0, 4).map((shoe) => (
                        <div key={shoe.id} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-primary/30 hover:shadow-md transition-all group bg-gray-50/50">
                           <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center shrink-0 shadow-sm p-1 border border-gray-100">
                              <img 
                                 src={`https://ui-avatars.com/api/?name=${shoe.brand}&background=random`} 
                                 alt={shoe.brand} 
                                 className="w-full h-full object-cover rounded opacity-90" 
                              />
                           </div>
                           <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start">
                                 <h4 className="font-bold text-slate-900 truncate group-hover:text-primary transition-colors">{shoe.name}</h4>
                                 {shoe.currentDistance > shoe.maxDistance * 0.9 && (
                                    <span className="w-2 h-2 rounded-full bg-red-500 ring-2 ring-red-100" title="Retire soon"></span>
                                 )}
                              </div>
                              <p className="text-xs text-slate-500 mb-2">{shoe.brand} • {shoe.type}</p>
                              <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                                 <div 
                                   className={`h-full rounded-full ${shoe.currentDistance > 400 ? 'bg-orange-500' : 'bg-primary'}`} 
                                   style={{ width: `${Math.min((shoe.currentDistance / shoe.maxDistance) * 100, 100)}%` }}
                                 ></div>
                              </div>
                              <div className="flex justify-between mt-1">
                                 <span className="text-[10px] text-slate-400 font-medium">{shoe.currentDistance} km</span>
                                 <span className="text-[10px] text-slate-400 font-medium">{Math.round((shoe.currentDistance/shoe.maxDistance)*100)}%</span>
                              </div>
                           </div>
                        </div>
                     ))}
                     <button className="flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed border-gray-200 text-slate-400 hover:border-primary hover:text-primary hover:bg-blue-50/50 transition-all">
                        <Plus className="w-5 h-5" />
                        <span className="font-bold text-sm">Add Shoe</span>
                     </button>
                  </div>
              )}

              {/* Audio View */}
              {activeGearTab === 'audio' && (
                  <div className="space-y-3 animate-fade-in">
                     {MOCK_AUDIO.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 p-3 rounded-lg border border-gray-100 hover:border-primary/30 hover:shadow-md transition-all group bg-white">
                           <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center shrink-0 shadow-sm text-white">
                              {item.type === 'Audiobook' ? <Headphones className="w-5 h-5" /> : <Music className="w-5 h-5" />}
                           </div>
                           <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start">
                                 <h4 className="font-bold text-slate-900 truncate group-hover:text-primary transition-colors">{item.title}</h4>
                                 {item.progress && (
                                    <span className="text-xs font-bold text-slate-400">{item.progress}%</span>
                                 )}
                              </div>
                              <p className="text-xs text-slate-500">{item.author} • {item.type}</p>
                              {item.progress && (
                                 <div className="w-full bg-gray-100 h-1 rounded-full mt-2 overflow-hidden">
                                    <div className="h-full bg-secondary" style={{ width: `${item.progress}%` }}></div>
                                 </div>
                              )}
                           </div>
                           <button className="p-2 text-slate-400 hover:text-primary hover:bg-slate-50 rounded-full transition-colors">
                              <Play className="w-4 h-4" />
                           </button>
                        </div>
                     ))}
                     <button className="w-full flex items-center justify-center gap-2 p-3 rounded-lg border-2 border-dashed border-gray-200 text-slate-400 hover:border-primary hover:text-primary hover:bg-blue-50/50 transition-all">
                        <Plus className="w-4 h-4" />
                        <span className="font-bold text-xs uppercase">Add Content</span>
                     </button>
                  </div>
              )}
           </div>

        </div>
      </div>
    </div>
  );
}
