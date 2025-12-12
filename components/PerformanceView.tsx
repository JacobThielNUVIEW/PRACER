
import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Calendar, 
  Flame, 
  TrendingUp, 
  ArrowRight,
  ExternalLink,
  Target,
  Sparkles,
  Zap
} from 'lucide-react';
import ActivityChart from './ActivityChart';
import { MOCK_PROFILE, MOCK_ACTIVITIES, MOCK_RACES } from '../constants';
import { Card, CardHeader, CardTitle, CardContent, Button } from './ui-kit';

const PerformanceView: React.FC = () => {
  const [advice, setAdvice] = useState("Analyzing your consistency...");
  
  // Sort races
  const upcomingRaces = MOCK_RACES
    .filter(r => r.status === 'Confirmed' && new Date(r.date) > new Date())
    .sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  const nextRace = upcomingRaces[0];

  useEffect(() => {
    const streak = MOCK_PROFILE.streakDays;
    const likelihood = Math.min(70 + (streak * 2), 99);
    
    // Simulate AI Coach generation
    const timer = setTimeout(() => {
      setAdvice(`Streak check: ${streak} days. You are ${likelihood}% more likely to run tomorrow. Keep the chain alive.`);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="animate-fade-in space-y-8 pb-12 font-sans text-slate-900">
      
      {/* 1. HERO: PERSONAL RECORDS (The Trophy Case) */}
      <section>
        <div className="flex items-center justify-between mb-4">
           <h2 className="text-xl font-black text-slate-900 flex items-center gap-2 uppercase tracking-tight">
              <Trophy className="w-6 h-6 text-secondary" /> Hall of Fame
           </h2>
           <span className="text-xs font-bold text-slate-400">Lifetime Bests</span>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           {MOCK_PROFILE.prs.map((pr, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 relative overflow-hidden group hover:shadow-md transition-shadow">
                 <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Trophy className="w-12 h-12 text-secondary" />
                 </div>
                 <div className="relative z-10">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{pr.distance}</p>
                    <p className="text-3xl font-black text-slate-900 tracking-tighter mb-1">{pr.time}</p>
                    <p className="text-[10px] text-slate-500 font-medium">{pr.date}</p>
                 </div>
                 {/* Gold bar at bottom */}
                 <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-secondary to-orange-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
              </div>
           ))}
        </div>
      </section>

      {/* 2. COCKPIT: Race Predictor & Calendar */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         
         {/* LEFT: Race Predictor */}
         <Card className="border-indigo-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-10 -mt-10"></div>
            <CardHeader>
               <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" /> Race Predictor
               </CardTitle>
            </CardHeader>
            <CardContent>
               <div className="space-y-5 relative z-10">
                  <div className="flex items-center justify-between">
                     <div>
                        <p className="text-sm font-medium text-slate-500 mb-1">VDOT Score</p>
                        <p className="text-4xl font-black text-primary">{MOCK_PROFILE.vdot}</p>
                     </div>
                     <div className="text-right">
                        <p className="text-xs text-slate-400 mb-1">Marathon Potential</p>
                        <p className="text-2xl font-bold text-slate-900">2:58:14</p>
                     </div>
                  </div>
                  
                  <div className="space-y-3">
                     {[
                       { dist: '5k', time: '18:15', pace: '3:39/km' },
                       { dist: '10k', time: '38:40', pace: '3:52/km' },
                       { dist: 'Half', time: '1:25:30', pace: '4:03/km' }
                     ].map((pred, i) => (
                       <div key={i} className="flex items-center justify-between bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                          <span className="text-xs font-bold text-slate-500 w-12">{pred.dist}</span>
                          <span className="text-sm font-bold text-slate-900">{pred.time}</span>
                          <span className="text-xs font-medium text-slate-400">{pred.pace}</span>
                       </div>
                     ))}
                  </div>
               </div>
            </CardContent>
         </Card>

         {/* RIGHT: Upcoming Races */}
         <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
               <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-orange-500" /> Race Calendar
               </CardTitle>
               <Button variant="ghost" className="h-8 text-xs text-primary">Manage Races</Button>
            </CardHeader>
            <CardContent>
               <div className="space-y-4">
                  {upcomingRaces.slice(0, 3).map((race, i) => (
                     <div key={race.id} className="flex items-center gap-4 group">
                        <div className={`w-12 h-12 rounded-lg flex flex-col items-center justify-center border shrink-0 ${
                           i === 0 ? 'bg-orange-50 border-orange-100 text-orange-600' : 'bg-slate-50 border-slate-100 text-slate-500'
                        }`}>
                           <span className="text-[9px] font-bold uppercase">{new Date(race.date).toLocaleString('default', { month: 'short' })}</span>
                           <span className="text-lg font-black">{new Date(race.date).getDate()}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                           <h4 className="font-bold text-slate-900 truncate">{race.name}</h4>
                           <div className="flex items-center gap-2 text-xs text-slate-500">
                              <span>{race.distance}</span>
                              <span>•</span>
                              <span>{race.daysOut} days out</span>
                              {i === 0 && <span className="bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded-[3px] font-bold text-[9px] uppercase">A-Race</span>}
                           </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-primary transition-colors" />
                     </div>
                  ))}
                  {upcomingRaces.length === 0 && (
                     <div className="text-center py-6 text-slate-400 text-sm">No upcoming races. Time to sign up!</div>
                  )}
               </div>
            </CardContent>
         </Card>
      </section>

      {/* 3. TRAINING PROGRESSION (Graph) */}
      <section>
         <Card className="shadow-sm">
            <CardHeader>
               <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-500" /> Training Progression
               </CardTitle>
            </CardHeader>
            <CardContent>
               <ActivityChart />
            </CardContent>
         </Card>
      </section>

      {/* 4. THE HABIT LAB & RECENT ACTIVITY */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         
         {/* Habit Tracker / Little Coach */}
         <div className="lg:col-span-2 bg-slate-900 rounded-xl shadow-lg p-6 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-hero-gradient opacity-20"></div>
            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
               
               {/* Streak Visual */}
               <div className="text-center shrink-0">
                  <div className="w-24 h-24 rounded-full border-4 border-white/10 flex items-center justify-center relative mx-auto mb-2">
                     <Flame className="w-10 h-10 text-orange-500 animate-pulse" />
                     <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#FFD700" strokeWidth="2" strokeDasharray={`${Math.min(MOCK_PROFILE.streakDays * 5, 100)}, 100`} />
                     </svg>
                  </div>
                  <div className="text-3xl font-black text-white">{MOCK_PROFILE.streakDays} <span className="text-sm font-medium text-slate-400">Day Streak</span></div>
               </div>
               
               {/* Coach Insight */}
               <div className="flex-1 text-center md:text-left">
                  <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs font-bold text-secondary mb-3 backdrop-blur-sm">
                     <Sparkles className="w-3 h-3" /> Coach Pracer
                  </div>
                  <h3 className="text-xl font-bold mb-2">Momentum is building.</h3>
                  <p className="text-slate-300 text-sm leading-relaxed mb-4">
                     {advice}
                  </p>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                     <div className="bg-gradient-to-r from-orange-500 to-secondary h-full" style={{ width: '70%' }}></div>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2 text-right">70% Probability of running tomorrow</p>
               </div>
            </div>
         </div>

         {/* Recent Activities (Usable Links) */}
         <Card className="shadow-sm bg-slate-50 border-slate-200">
            <CardHeader className="pb-3">
               <CardTitle className="text-sm uppercase tracking-wider text-slate-500">Recent Logs</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="space-y-3">
                  {MOCK_ACTIVITIES.slice(0, 4).map((activity) => (
                     <a 
                       key={activity.id} 
                       href={activity.externalLink || '#'} 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="block bg-white p-3 rounded-lg border border-slate-200 hover:border-primary/50 hover:shadow-sm transition-all group"
                     >
                        <div className="flex justify-between items-start mb-1">
                           <span className="text-xs font-bold text-slate-900 group-hover:text-primary truncate max-w-[120px]">{activity.name}</span>
                           <span className="text-xs font-bold px-1.5 py-0.5 bg-slate-100 rounded text-slate-500">{activity.source}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-500">
                           <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-secondary" /> {activity.activityScore}</span>
                           <span>{activity.distance}km</span>
                           <span>{activity.pace}</span>
                        </div>
                     </a>
                  ))}
               </div>
               <Button variant="ghost" className="w-full mt-4 text-xs text-slate-500">View All History</Button>
            </CardContent>
         </Card>

      </section>
    </div>
  );
};

export default PerformanceView;
