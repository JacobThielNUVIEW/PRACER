
'use client';

import React from 'react';
import { Link } from '../../lib/router-context';
import { Footprints, Headphones, Zap, User, Settings } from 'lucide-react';
import { MOCK_PROFILE } from '../../constants';
import HabitTracker from '../HabitTracker';

interface LeftSidebarProps {
  onViewChange?: (view: 'none' | 'my_shoes' | 'my_audio') => void;
  activeView?: string;
}

export default function LeftSidebar({ onViewChange, activeView }: LeftSidebarProps) {
  return (
    <div className="space-y-6">
       {/* Identity Card */}
       <div className="bg-surface rounded-md shadow-sm border border-gray-200 overflow-hidden">
          <div className="h-20 bg-hero-gradient relative">
             <div className="absolute -bottom-8 left-1/2 -translate-x-1/2">
                <Link href="/profile">
                  <div className="w-16 h-16 rounded-full border-4 border-white overflow-hidden bg-gray-100 cursor-pointer hover:opacity-90 transition-opacity">
                     <img src="https://picsum.photos/seed/alex/100" alt="Profile" className="w-full h-full object-cover" />
                  </div>
                </Link>
             </div>
          </div>
          <div className="pt-10 pb-4 text-center">
             <Link href="/profile">
               <h3 className="font-bold text-lg text-text-primary hover:text-primary transition-colors">{MOCK_PROFILE.name}</h3>
             </Link>
             <div className="flex justify-center gap-4 mt-3 text-sm border-t border-gray-100 pt-3 mx-4">
                <div className="flex flex-col">
                   <span className="font-bold text-text-primary">{MOCK_PROFILE.following}</span>
                   <span className="text-xs text-text-secondary">Following</span>
                </div>
                <div className="w-px bg-gray-200"></div>
                <div className="flex flex-col">
                   <span className="font-bold text-text-primary">{MOCK_PROFILE.followers}</span>
                   <span className="text-xs text-text-secondary">Followers</span>
                </div>
                <div className="w-px bg-gray-200"></div>
                <div className="flex flex-col">
                   <span className="font-bold text-text-primary">{MOCK_PROFILE.activitiesCount}</span>
                   <span className="text-xs text-text-secondary">Activities</span>
                </div>
             </div>
          </div>
       </div>

       {/* Training Stats */}
       <div className="bg-surface rounded-md shadow-sm border border-gray-200 p-4">
          <h4 className="font-bold text-xs text-text-secondary uppercase mb-3">Your Training</h4>
          <div className="space-y-4">
             <div>
                <div className="flex justify-between text-xs mb-1">
                   <span>Weekly Goal</span>
                   <span className="font-bold">{MOCK_PROFILE.currentWeeklyDistance} / {MOCK_PROFILE.weeklyGoal} km</span>
                </div>
                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                   <div className="h-full bg-primary" style={{ width: '70%' }}></div>
                </div>
             </div>
             
             <div className="flex items-center justify-between text-sm">
                 <span className="text-text-secondary">Pracer Score</span>
                 <span className="font-bold text-text-primary flex items-center gap-1">
                    <Zap className="w-3 h-3 text-secondary" /> 84
                 </span>
             </div>
          </div>
       </div>

       {/* New Habit Tracker Component */}
       <HabitTracker />

       {/* Navigation Links */}
       <div className="bg-surface rounded-md shadow-sm border border-gray-200 p-2 space-y-1">
          <Link href="/profile">
             <button className="w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 transition-colors flex items-center gap-2 text-text-secondary hover:text-text-primary">
               <User className="w-4 h-4" /> My Profile
             </button>
          </Link>
          <Link href="/settings">
             <button className="w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 transition-colors flex items-center gap-2 text-text-secondary hover:text-text-primary">
               <Settings className="w-4 h-4" /> Settings
             </button>
          </Link>
       </div>

       {/* Personal Inventory Links */}
       {onViewChange && (
         <div className="space-y-1">
            <button 
               onClick={() => onViewChange('my_shoes')} 
               className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-200 transition-colors flex items-center gap-2 ${activeView === 'my_shoes' ? 'font-bold text-primary bg-white shadow-sm' : 'text-text-secondary'}`}
            >
               <Footprints className="w-4 h-4" /> My Shoes
            </button>
            <button 
               onClick={() => onViewChange('my_audio')}
               className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-200 transition-colors flex items-center gap-2 ${activeView === 'my_audio' ? 'font-bold text-primary bg-white shadow-sm' : 'text-text-secondary'}`}
            >
               <Headphones className="w-4 h-4" /> My Audio
            </button>
         </div>
       )}
    </div>
  );
}
