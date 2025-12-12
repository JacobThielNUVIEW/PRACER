
'use client';

import React from 'react';
import { Trophy, Shield } from 'lucide-react';
import { MOCK_CHALLENGES } from '../../constants';

export default function RightSidebar() {
  return (
    <div className="space-y-6">
       <div className="bg-surface rounded-md shadow-sm border border-gray-200 p-4">
          <h4 className="font-bold text-sm text-text-primary mb-2">Start Your Free Trial</h4>
          <p className="text-xs text-text-secondary mb-3">Get advanced analysis, race predictions, and AI coaching.</p>
          <button className="w-full py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded transition-colors uppercase tracking-wide">
             Try Pracer Premium
          </button>
       </div>

       <div className="bg-surface rounded-md shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
             <h4 className="font-bold text-xs text-text-secondary uppercase">Challenges</h4>
             <span className="text-xs text-primary hover:underline cursor-pointer">View All</span>
          </div>
          <div className="space-y-4">
             {MOCK_CHALLENGES.map(challenge => (
               <div key={challenge.id} className="flex gap-3 items-center group cursor-pointer">
                  <div className="w-10 h-10 bg-gray-100 rounded border border-gray-200 flex items-center justify-center shrink-0 group-hover:border-primary transition-colors">
                     {challenge.type === 'Distance' ? <Trophy className="w-5 h-5 text-gray-400" /> : <Shield className="w-5 h-5 text-gray-400" />}
                  </div>
                  <div className="min-w-0">
                     <p className="font-bold text-sm text-text-primary truncate group-hover:text-primary transition-colors">{challenge.name}</p>
                     <p className="text-xs text-text-secondary">{challenge.endDate}</p>
                  </div>
               </div>
             ))}
          </div>
       </div>

       <div className="flex flex-wrap gap-x-4 gap-y-2 text-[11px] text-text-secondary px-2">
          <a href="#" className="hover:underline">About</a>
          <a href="#" className="hover:underline">Help</a>
          <a href="#" className="hover:underline">Careers</a>
          <a href="#" className="hover:underline">Terms</a>
          <a href="#" className="hover:underline">Privacy</a>
          <span>© 2025 Pracer</span>
       </div>
    </div>
  );
}
