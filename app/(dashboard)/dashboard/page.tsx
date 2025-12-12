
'use client';

import React, { useState } from 'react';
import { Link } from '../../../lib/router-context';
import { Plus, Footprints, Shirt, Headphones, Map as MapIcon, Star, Eye, Heart, TrendingUp } from 'lucide-react';
import LeftSidebar from '../../../components/layout/LeftSidebar';
import RightSidebar from '../../../components/layout/RightSidebar';
import ActivityFeedCard from '../../../components/ActivityFeedCard';
import { 
  MOCK_ACTIVITIES, 
  MOCK_SHOES, 
  MOCK_AUDIO, 
  GLOBAL_RANKED_SHOES, 
  GLOBAL_RANKED_CLOTHING, 
  GLOBAL_RANKED_AUDIO 
} from '../../../constants';

export default function DashboardPage() {
  const [feedView, setFeedView] = useState<'activity' | 'global_shoes' | 'global_clothing' | 'global_audio' | 'global_map'>('activity');
  const [personalView, setPersonalView] = useState<'none' | 'my_shoes' | 'my_audio' | 'my_map'>('none');

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
       {/* LEFT SIDEBAR */}
       <div className="hidden md:block md:col-span-3 lg:col-span-3">
          <LeftSidebar 
            activeView={personalView}
            onViewChange={(view) => {
              setPersonalView(view);
              if (view !== 'none') setFeedView('activity');
            }}
          />
       </div>

       {/* CENTER FEED */}
       <div className="col-span-1 md:col-span-9 lg:col-span-6">
          
          {/* Global Discovery Navigation */}
          <div className="bg-surface border border-gray-200 rounded-lg p-2 mb-4 flex gap-1 shadow-sm overflow-x-auto scrollbar-hide">
             {[
               { id: 'activity', label: 'Feed' },
               { id: 'global_shoes', label: 'Shoes', icon: Footprints },
               { id: 'global_clothing', label: 'Clothing', icon: Shirt },
               { id: 'global_audio', label: 'Audio', icon: Headphones },
               { id: 'global_map', label: 'Heatmap', icon: MapIcon }
             ].map(tab => {
                const Icon = tab.icon;
                const isActive = feedView === (tab.id as any);
                return (
                   <button 
                     key={tab.id}
                     onClick={() => { setFeedView(tab.id as any); setPersonalView('none'); }}
                     className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-md whitespace-nowrap transition-all ${
                       isActive 
                       ? 'bg-primary text-white shadow-sm' 
                       : 'text-text-secondary hover:bg-gray-100 hover:text-text-primary'
                     }`}
                   >
                      {Icon && <Icon className="w-4 h-4" />}
                      {tab.label}
                   </button>
                );
             })}
          </div>

          {/* 1. ACTIVITY FEED */}
          {feedView === 'activity' && personalView === 'none' && (
             <>
                <div className="bg-surface border border-gray-200 rounded-lg p-4 mb-4 flex gap-3 shadow-sm items-center cursor-pointer hover:bg-gray-50 transition-colors">
                   <Link href="/profile" className="shrink-0">
                     <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden hover:opacity-90 transition-opacity">
                        <img src="https://picsum.photos/seed/alex/100" alt="Profile" className="w-full h-full object-cover" />
                     </div>
                   </Link>
                   <div className="flex-1">
                      <input 
                        type="text" 
                        placeholder="What's your latest effort?" 
                        className="w-full bg-transparent border-none outline-none text-sm placeholder:text-gray-500"
                        readOnly
                      />
                   </div>
                   <Plus className="w-5 h-5 text-primary" />
                </div>
                {MOCK_ACTIVITIES.map(activity => (
                   <ActivityFeedCard key={activity.id} activity={activity} />
                ))}
             </>
          )}

          {/* 2. PERSONAL INVENTORY VIEWS */}
          {personalView === 'my_shoes' && (
             <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center justify-between mb-2">
                   <h2 className="text-xl font-bold">My Gear Rotation</h2>
                   <button className="text-sm text-primary font-bold">+ Add Shoe</button>
                </div>
                {MOCK_SHOES.map(shoe => (
                   <div key={shoe.id} className="bg-surface p-5 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between">
                      <div>
                         <p className="font-bold text-lg">{shoe.name}</p>
                         <p className="text-sm text-text-secondary">{shoe.brand} • {shoe.type}</p>
                      </div>
                      <div className="text-right">
                         <p className="font-bold text-xl">{shoe.currentDistance} <span className="text-sm font-normal text-text-secondary">km</span></p>
                         <div className="w-24 h-1.5 bg-gray-100 rounded-full mt-2 overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: `${(shoe.currentDistance / shoe.maxDistance) * 100}%` }}></div>
                         </div>
                      </div>
                   </div>
                ))}
             </div>
          )}

          {/* 3. GLOBAL RANKING VIEWS */}
          {feedView === 'global_shoes' && personalView === 'none' && (
             <div className="space-y-4">
                <div className="flex items-center justify-between">
                   <h2 className="text-xl font-bold flex items-center gap-2"><Footprints className="w-5 h-5" /> Top Rated Shoes</h2>
                   <button className="text-xs font-bold text-text-secondary bg-gray-100 px-3 py-1 rounded-full">All Time</button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                   {GLOBAL_RANKED_SHOES.map((shoe) => (
                      <div key={shoe.id} className="bg-surface rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow group relative">
                         <div className="absolute top-2 left-2 bg-black/80 text-white text-xs font-bold w-6 h-6 rounded flex items-center justify-center z-10 shadow-lg border border-white/20">
                            {shoe.globalRank}
                         </div>
                         <div className="aspect-[4/3] bg-gray-100 relative">
                            {shoe.image ? (
                               <img src={shoe.image} alt={shoe.name} className="w-full h-full object-cover mix-blend-multiply" />
                            ) : (
                               <div className="w-full h-full flex items-center justify-center text-gray-300">
                                  <Footprints className="w-12 h-12" />
                               </div>
                            )}
                         </div>
                         <div className="p-3">
                            <h4 className="font-bold text-sm text-text-primary leading-tight mb-1">{shoe.name}</h4>
                            <p className="text-xs text-text-secondary mb-2">{shoe.brand}</p>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          )}

          {feedView === 'global_clothing' && personalView === 'none' && (
             <div className="space-y-4">
                <div className="flex items-center justify-between">
                   <h2 className="text-xl font-bold flex items-center gap-2"><Shirt className="w-5 h-5" /> Trending Gear</h2>
                   <button className="text-xs font-bold text-text-secondary bg-gray-100 px-3 py-1 rounded-full">This Season</button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                   {GLOBAL_RANKED_CLOTHING.map((item) => (
                      <div key={item.id} className="bg-surface rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow group relative">
                         <div className="absolute top-2 left-2 bg-black/80 text-white text-xs font-bold w-6 h-6 rounded flex items-center justify-center z-10 shadow-lg border border-white/20">
                            {item.globalRank}
                         </div>
                         <div className="aspect-[4/3] bg-gray-100 relative flex items-center justify-center text-gray-300">
                            <Shirt className="w-12 h-12" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                               <button className="bg-white/90 p-2 rounded-full text-text-primary hover:text-primary"><Eye className="w-5 h-5" /></button>
                               <button className="bg-white/90 p-2 rounded-full text-text-primary hover:text-red-500"><Heart className="w-5 h-5" /></button>
                            </div>
                         </div>
                         <div className="p-3">
                            <h4 className="font-bold text-sm text-text-primary leading-tight mb-1">{item.name}</h4>
                            <p className="text-xs text-text-secondary mb-2">{item.brand}</p>
                            <div className="flex items-center justify-between">
                               <div className="flex items-center gap-1 text-xs font-bold text-primary">
                                  <Star className="w-3 h-3 fill-primary" /> {item.rating}
                               </div>
                               <span className="text-[10px] text-text-secondary">{item.reviewCount} reviews</span>
                            </div>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          )}

          {feedView === 'global_audio' && personalView === 'none' && (
             <div className="space-y-6">
                <div className="flex items-center justify-between">
                   <h2 className="text-xl font-bold flex items-center gap-2"><Headphones className="w-5 h-5" /> Top Motivation</h2>
                </div>
                {GLOBAL_RANKED_AUDIO.map((item, idx) => (
                   <div key={item.id} className="flex items-center gap-4 bg-surface p-4 rounded-lg border border-gray-200 shadow-sm hover:border-primary/30 transition-colors">
                      <span className="text-2xl font-black text-gray-200 w-8 text-center">{item.globalRank}</span>
                      <div className="w-16 h-16 bg-gray-800 rounded flex items-center justify-center text-white shrink-0">
                         <Headphones className="w-8 h-8" />
                      </div>
                      <div className="flex-1 min-w-0">
                         <h4 className="font-bold text-text-primary text-lg truncate">{item.title}</h4>
                         <p className="text-sm text-text-secondary">{item.author}</p>
                         <div className="flex items-center gap-4 mt-2">
                             <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">{item.type}</span>
                             <span className="text-xs text-text-secondary">{item.votes?.toLocaleString()} votes</span>
                         </div>
                      </div>
                      <button className="p-2 hover:bg-gray-100 rounded-full text-text-secondary">
                         <TrendingUp className="w-5 h-5" />
                      </button>
                   </div>
                ))}
             </div>
          )}

          {feedView === 'global_map' && personalView === 'none' && (
             <div className="bg-surface h-96 rounded-lg border border-gray-200 flex items-center justify-center text-text-secondary">
                <div className="text-center">
                   <MapIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                   <p className="font-bold text-lg">Global Heatmap</p>
                   <p className="text-xs">Visualizing 1.2M runs worldwide</p>
                </div>
             </div>
          )}
       </div>

       {/* RIGHT SIDEBAR */}
       <div className="hidden lg:block lg:col-span-3">
          <RightSidebar />
       </div>
    </div>
  );
}
