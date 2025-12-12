
import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  List, 
  BarChart2, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  MapPin, 
  Activity as ActivityIcon,
  X,
  Share2,
  MessageCircle,
  ThumbsUp,
  Filter,
  MoreHorizontal,
  Zap,
  Heart,
  CheckCircle2,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  Info,
  Trophy,
  TrendingUp,
  Timer
} from 'lucide-react';
import { 
  ComposedChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend
} from 'recharts';
import { MOCK_ACTIVITIES } from '../constants';
import PerformanceView from './PerformanceView';
import { Button, Card, CardHeader, CardTitle, CardContent } from './ui-kit';

// --- DATA: TRAINING PLAN ---
const TRAINING_PLAN = [
  { week: '16', range: '12/15 - 12/21', mon: 'E 6 mi', tue: 'T 6 mi', wed: 'R 3 mi', thu: 'E 5 mi', fri: 'Rest', sat: 'LR 20 mi w/ 8 mi @ M', sun: 'R 4 mi' },
  { week: '17', range: '12/22 - 12/28', mon: 'E 5 mi', tue: 'I 6×800m', wed: 'R 3 mi', thu: 'E 4 mi', fri: 'Rest', sat: 'LR 13 mi', sun: 'R 3 mi' },
  { week: '18', range: '12/29 - 1/4',   mon: 'E 4 mi', tue: 'T 3 mi', wed: 'R 2 mi', thu: 'E 3 mi', fri: 'Rest', sat: 'LR 10 mi', sun: 'R 2 mi' },
  { week: '19', range: '1/5 - 1/11',    mon: 'E 3 mi', tue: 'Strides', wed: 'R 2 mi', thu: 'E 2 mi', fri: 'Rest', sat: 'LR 6 mi', sun: 'R 1 mi' },
  { week: '20', range: '1/12 - 1/18',   mon: 'R 2 mi', tue: 'Strides', wed: 'R 2 mi', thu: 'E 1 mi', fri: 'Rest', sat: 'Shakeout 2 mi', sun: 'R 1 mi' },
  { week: '21', range: '1/19 - 1/25',   mon: 'R 1 mi', tue: 'Rest', wed: 'Rest', thu: 'Rest', fri: 'Travel', sat: 'Shakeout 1 mi', sun: 'GULF SHORES RACE' },
  { week: 'RECOVERY', range: '1/26 - 2/8',    mon: 'Rest', tue: 'E 2 mi', wed: 'XT 30m', thu: 'E 3 mi', fri: 'Rest', sat: 'E 4 mi', sun: 'R 2 mi' },
  { week: 'BASE 1', range: '2/9 - 2/15',   mon: 'E 5 mi', tue: 'T 4 mi', wed: 'E 3 mi', thu: 'E 6 mi', fri: 'Rest', sat: 'LR 10 mi', sun: 'R 3 mi' },
  { week: 'BASE 2', range: '2/16 - 2/22',   mon: 'E 6 mi', tue: 'I 5×1000m', wed: 'R 3 mi', thu: 'E 7 mi', fri: 'Rest', sat: 'LR 13 mi', sun: 'R 4 mi' },
  { week: 'BUILD', range: '2/23 - 5/3',   mon: 'VDOT 60 Matrix', tue: 'T/I Work', wed: 'Recovery', thu: 'M/E Runs', fri: 'Rest', sat: '18-22 mi LR', sun: 'Recovery', label: 'PITTSBURGH BUILD' },
];

const DAY_FOCUS_NOTES = [
  { day: 'MONDAY', focus: 'Aerobic Consistency', weight: 'Medium', desc: 'Easy effort (E pace) to start the week and recover from Sunday. Maximize volume at low effort.' },
  { day: 'TUESDAY', focus: 'Speed/Threshold', weight: 'High', desc: 'The key speed day. Alternate between Threshold (T) and Interval (I) paces to raise your lactate threshold.' },
  { day: 'WEDNESDAY', focus: 'Active Recovery', weight: 'Low', desc: 'Short Recovery (R) pace to flush legs and reduce fatigue from Tuesday\'s hard effort.' },
  { day: 'THURSDAY', focus: 'Mid-Week Endurance', weight: 'Medium', desc: 'Easy effort (E pace) to add volume to the week. Often used to practice fueling/hydration.' },
  { day: 'FRIDAY', focus: 'Rest', weight: 'Highest', desc: 'Mandatory full rest. Crucial for muscle repair and glycogen storage for the weekend Long Run.' },
  { day: 'SATURDAY', focus: 'Marathon Specificity', weight: 'Highest', desc: 'The Long Run (LR). Focus on time-on-feet, durability, and GI Practice.' },
  { day: 'SUNDAY', focus: 'Recovery', weight: 'Low', desc: 'Very short, slow Recovery (R) pace to promote blood flow.' },
];

// --- RACE HISTORY DATA ---
// VDOT approximated based on Jack Daniels VDOT tables
const RACE_HISTORY = [
  { id: 1, date: '2024-05-05', name: 'Pittsburgh Marathon', distance: 'Marathon', time: '3:25:55', pace: '7:51/mi', vdot: 46.8, type: 'M', displayDate: 'May 2024' },
  { id: 2, date: '2025-03-15', name: 'St. Patrick\'s 5k', distance: '5k', time: '18:22', pace: '5:44/mi', vdot: 55.2, type: '5k', displayDate: 'Mar 2025' },
  { id: 3, date: '2025-05-04', name: 'Pittsburgh Marathon', distance: 'Marathon', time: '2:59:59', pace: '6:52/mi', vdot: 53.6, type: 'M', displayDate: 'May 2025' },
  { id: 4, date: '2025-11-09', name: 'Pitt 10 Miler', distance: '10 Miler', time: '1:01:48', pace: '6:06/mi', vdot: 51.5, type: '10M', displayDate: 'Nov 2025' },
].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());

type ViewMode = 'calendar' | 'list' | 'analysis';

const TrainingLogView: React.FC = () => {
  const [view, setView] = useState<ViewMode>('calendar');
  const [selectedActivity, setSelectedActivity] = useState<any>(null);

  // Parse distance from string "E 6 mi" -> 6
  const parseDist = (str: string) => {
    if (!str || str === 'Rest' || str === 'Travel' || str.includes('RACE') || str.includes('Matrix')) return 0;
    const rangeMatch = str.match(/(\d+)-(\d+)/);
    if (rangeMatch) {
       return (parseFloat(rangeMatch[1]) + parseFloat(rangeMatch[2])) / 2;
    }
    const match = str.match(/(\d+(\.\d+)?)/);
    return match ? parseFloat(match[0]) : 0;
  };

  // Mock Actual logic
  const getMockActual = (planStr: string, weekIdx: number, dayIdx: number) => {
    if (weekIdx > 3) return null; 
    const planned = parseDist(planStr);
    if (planned === 0) return null;
    const seed = (weekIdx * 7) + dayIdx;
    const variant = seed % 5; 
    if (variant === 0) return planned; 
    if (variant === 1) return planned + 1.2; 
    if (variant === 2) return Math.max(0, planned - 0.8); 
    if (variant === 3) return planned; 
    return planned + 0.2; 
  };

  const getScoreStatus = (planned: number, actual: number) => {
    const diff = actual - planned;
    const ratio = actual / planned;
    if (ratio >= 0.9 && ratio <= 1.1) return 'perfect';
    if (diff > 0) return 'over';
    return 'under';
  };

  const renderCurrentWeek = () => {
    // Simulating Week 18 as current week
    const currentWeek = TRAINING_PLAN[2]; 
    const dayKeys = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
    
    return (
      <Card className="mb-8 border-indigo-100 bg-gradient-to-r from-slate-50 to-indigo-50/30">
         <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
               <div>
                  <div className="flex items-center gap-2 mb-1">
                     <span className="bg-indigo-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded uppercase">Current</span>
                     <h3 className="text-lg font-black text-slate-900 uppercase">Week {currentWeek.week}</h3>
                  </div>
                  <p className="text-sm text-slate-500 font-medium">{currentWeek.range}</p>
               </div>
               <div className="text-right">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Weekly Volume</div>
                  <div className="text-xl font-black text-slate-900">24 <span className="text-sm font-medium text-slate-500">/ 42 mi</span></div>
               </div>
            </div>
         </CardHeader>
         <CardContent>
            <div className="grid grid-cols-7 gap-2">
               {dayKeys.map((key, i) => {
                  const plan = (currentWeek as any)[key];
                  const dist = parseDist(plan);
                  const isRest = plan === 'Rest';
                  // Simulating Today is Wednesday (index 2)
                  const isToday = i === 2;
                  const isPast = i < 2;

                  return (
                     <div 
                        key={key} 
                        className={`
                           rounded-lg p-3 border flex flex-col justify-between min-h-[100px] relative overflow-hidden group transition-all
                           ${isToday ? 'bg-white border-primary shadow-md ring-1 ring-primary' : 
                             isPast ? 'bg-slate-50 border-gray-200 opacity-70' : 
                             'bg-white border-gray-200 hover:border-primary/50'}
                        `}
                     >  
                        {isToday && <div className="absolute top-0 right-0 bg-primary text-white text-[8px] font-bold px-1.5 py-0.5 rounded-bl">TODAY</div>}
                        
                        <div>
                           <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">{key}</div>
                           <div className={`font-bold text-sm leading-tight ${isRest ? 'text-slate-400 italic' : 'text-slate-900'}`}>
                              {plan}
                           </div>
                        </div>

                        {!isRest && (
                           <div className="mt-3">
                              {isPast ? (
                                 <div className="flex items-center gap-1 text-xs font-bold text-green-600">
                                    <CheckCircle2 className="w-3.5 h-3.5" /> Done
                                 </div>
                              ) : isToday ? (
                                 <Button size="sm" className="w-full h-7 text-[10px] bg-primary hover:bg-primary-dark">Log Run</Button>
                              ) : (
                                 <div className="text-[10px] font-bold text-slate-400 border border-dashed border-slate-200 rounded px-1.5 py-0.5 inline-block">
                                    {dist} mi
                                 </div>
                              )}
                           </div>
                        )}
                     </div>
                  )
               })}
            </div>
         </CardContent>
      </Card>
    );
  };

  const renderCalendar = () => {
    const MAX_DAILY_SCALE = 22; 
    const MAX_WEEKLY_SCALE = 65; 

    // Transform Data for the Chart to allow multiple lines with nulls
    const chartData = RACE_HISTORY.map(r => ({
      ...r,
      vdotM: r.type === 'M' ? r.vdot : null,
      vdot5k: r.type === '5k' ? r.vdot : null,
      vdot10M: r.type === '10M' ? r.vdot : null,
    }));

    return (
      <div className="space-y-8">
        {/* CURRENT WEEK ZOOM */}
        {renderCurrentWeek()}

        {/* FULL CALENDAR */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden font-sans">
          <div className="flex flex-col md:flex-row items-center justify-between p-4 border-b border-gray-200 gap-4">
             <div className="flex items-center gap-4">
                <h2 className="text-lg font-black text-slate-900 tracking-tight uppercase flex items-center gap-2">
                   <CalendarIcon className="w-5 h-5 text-primary" /> Gulf Shores Build
                </h2>
                <div className="flex gap-1">
                   <button className="p-1 hover:bg-slate-100 rounded text-slate-500"><ChevronLeft className="w-5 h-5" /></button>
                   <button className="p-1 hover:bg-slate-100 rounded text-slate-500"><ChevronRight className="w-5 h-5" /></button>
                </div>
             </div>
             <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-gray-100">
                   <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-500" /> Target</span>
                   <span className="w-px h-3 bg-gray-300 mx-1"></span>
                   <span className="flex items-center gap-1"><ArrowUp className="w-3 h-3 text-orange-500" /> +1 Bump</span>
                   <span className="w-px h-3 bg-gray-300 mx-1"></span>
                   <span className="flex items-center gap-1"><ArrowDown className="w-3 h-3 text-red-500" /> -1 Miss</span>
                </div>
                <Button variant="outline" className="text-xs h-8 gap-2">
                   <Filter className="w-3 h-3" /> Filter
                </Button>
             </div>
          </div>

          <div className="grid grid-cols-8 border-b border-gray-200 bg-slate-50">
             {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Summary'].map((d, i) => (
                <div key={d} className={`py-3 text-center text-[10px] font-extrabold text-slate-500 uppercase tracking-widest ${i === 7 ? 'bg-slate-100 border-l border-gray-200' : ''}`}>
                   {d}
                </div>
             ))}
          </div>

          <div className="flex flex-col divide-y divide-gray-100">
             {TRAINING_PLAN.map((week, wIdx) => {
                const dayKeys = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
                let planTotal = 0;
                let actualTotal = 0;
                
                const dayNodes = dayKeys.map((key, dIdx) => {
                   const planStr = (week as any)[key];
                   const plannedDist = parseDist(planStr);
                   const actualDist = getMockActual(planStr, wIdx, dIdx);
                   
                   planTotal += plannedDist;
                   if (actualDist !== null) actualTotal += actualDist;

                   const isRest = planStr === 'Rest' || planStr === 'Travel';
                   const isRace = planStr.includes('RACE');
                   const score = actualDist !== null ? getScoreStatus(plannedDist, actualDist) : null;
                   const barValue = actualDist !== null ? actualDist : plannedDist;
                   const barHeight = Math.min((barValue / MAX_DAILY_SCALE) * 100, 100); 

                   return (
                      <div key={dIdx} className={`relative group p-2 min-h-[120px] flex flex-col justify-between overflow-hidden transition-colors ${isRest ? 'bg-slate-50/40' : 'hover:bg-slate-50'} ${isRace ? 'bg-yellow-50/50' : ''}`}>
                         <div className="relative z-10">
                            <div className="flex justify-between items-start mb-1">
                               <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded truncate max-w-full ${
                                  isRace ? 'bg-secondary text-slate-900 border border-yellow-200 shadow-sm' : 
                                  isRest ? 'text-slate-400 italic' :
                                  'text-slate-500 bg-slate-100/50 border border-transparent group-hover:border-gray-200'
                               }`}>
                                  {planStr}
                               </span>
                            </div>
                         </div>

                         {!isRest && barValue > 0 && (
                            <div className="absolute bottom-0 left-0 right-0 flex justify-center items-end pb-0 pointer-events-none">
                               <div 
                                  className={`w-5 rounded-t-sm transition-all duration-500 relative group/bar ${
                                     actualDist !== null 
                                     ? (score === 'over' ? 'bg-orange-400' : score === 'under' ? 'bg-red-400' : 'bg-primary') 
                                     : 'bg-white border-2 border-dashed border-slate-200 opacity-60'
                                  }`}
                                  style={{ height: `${Math.max(barHeight, 15)}px` }}
                               ></div>
                            </div>
                         )}

                         <div className="relative z-10 flex flex-col items-center pb-1">
                            {actualDist !== null ? (
                               <div className="flex flex-col items-center gap-1 bg-white/90 backdrop-blur-sm p-1.5 rounded-lg border border-gray-100 shadow-sm">
                                  <div className="text-xs font-black text-slate-900 leading-none">{actualDist.toFixed(1)}</div>
                                  <div className={`flex items-center justify-center w-5 h-5 rounded-full ${score === 'perfect' ? 'bg-green-100 text-green-600' : score === 'over' ? 'bg-orange-100 text-orange-600' : 'bg-red-100 text-red-600'}`}>
                                     {score === 'perfect' && <CheckCircle2 className="w-3.5 h-3.5" />}
                                     {score === 'over' && <span className="text-[10px] font-black">+1</span>}
                                     {score === 'under' && <span className="text-[10px] font-black">-1</span>}
                                  </div>
                               </div>
                            ) : null}
                         </div>
                      </div>
                   );
                });

                return (
                   <div key={wIdx} className="grid grid-cols-8 divide-x divide-gray-100 border-b border-gray-50 last:border-0">
                      {dayNodes}
                      <div className="bg-slate-50/50 p-3 flex flex-col justify-center border-l border-gray-100 relative group">
                         <div className="text-right space-y-3">
                            <div>
                               <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Week {week.label ? '' : week.week}</p>
                               {week.label && <p className="text-[9px] font-black text-primary uppercase tracking-wider mb-0.5">{week.label}</p>}
                               <div className="text-[10px] text-slate-500 font-medium whitespace-nowrap">{week.range}</div>
                            </div>
                            <div>
                               <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Volume</p>
                               <div className="flex items-baseline justify-end gap-1">
                                  {actualTotal > 0 && (
                                     <>
                                        <span className={`text-lg font-black ${actualTotal > planTotal * 1.1 ? 'text-orange-500' : 'text-slate-900'}`}>
                                            {actualTotal.toFixed(0)}
                                        </span>
                                        <span className="text-xs text-slate-400">/</span>
                                     </>
                                  )}
                                  <span className="text-sm font-bold text-slate-500">{Math.round(planTotal)}</span>
                                  <span className="text-[9px] font-medium text-slate-400">mi</span>
                               </div>
                               <div className="w-full bg-gray-200 h-1.5 rounded-full mt-1 overflow-hidden flex">
                                  <div className={`h-full ${actualTotal > 0 ? (actualTotal > planTotal ? 'bg-orange-500' : 'bg-slate-900') : 'bg-slate-300 opacity-50'}`} style={{ width: `${Math.min(((actualTotal || planTotal) / MAX_WEEKLY_SCALE) * 100, 100)}%` }}></div>
                               </div>
                            </div>
                         </div>
                      </div>
                   </div>
                );
             })}
          </div>
        </div>

        {/* NOTES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <Card className="md:col-span-2 bg-slate-900 text-white border-slate-800 shadow-xl">
              <CardHeader>
                 <CardTitle className="flex items-center gap-2 text-white">
                    <Zap className="w-5 h-5 text-secondary" /> Training Philosophy
                 </CardTitle>
              </CardHeader>
              <CardContent>
                 <div className="grid gap-3">
                    {DAY_FOCUS_NOTES.map((note) => (
                       <div key={note.day} className="flex gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors group border border-transparent hover:border-white/10">
                          <div className="w-28 shrink-0">
                             <div className="text-xs font-bold text-secondary mb-1">{note.day}</div>
                             <div className={`text-[9px] font-bold px-1.5 py-0.5 rounded w-fit uppercase tracking-wide ${note.weight === 'Highest' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : note.weight === 'High' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : note.weight === 'Medium' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-slate-700 text-slate-400'}`}>
                                {note.weight} Load
                             </div>
                          </div>
                          <div>
                             <h4 className="font-bold text-sm text-white mb-1 group-hover:text-primary transition-colors">{note.focus}</h4>
                             <p className="text-xs text-slate-400 leading-relaxed opacity-80">{note.desc}</p>
                          </div>
                       </div>
                    ))}
                 </div>
              </CardContent>
           </Card>

           <div className="space-y-6">
               <Card>
                  <CardHeader>
                     <CardTitle className="text-xs uppercase tracking-widest text-slate-400 font-bold">Block Focus</CardTitle>
                  </CardHeader>
                  <CardContent>
                     <div className="text-center py-4">
                        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                           <ActivityIcon className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="font-black text-xl text-slate-900 mb-1">Pittsburgh Build</h3>
                        <p className="text-sm text-slate-500 font-medium">VDOT 60 Matrix</p>
                        <div className="mt-6 flex justify-between text-xs border-t border-gray-100 pt-4">
                           <div className="text-center">
                              <span className="block font-black text-slate-900 text-lg">12</span>
                              <span className="text-slate-400 font-bold uppercase text-[10px]">Weeks</span>
                           </div>
                           <div className="text-center">
                              <span className="block font-black text-slate-900 text-lg">55</span>
                              <span className="text-slate-400 font-bold uppercase text-[10px]">Avg Mi</span>
                           </div>
                           <div className="text-center">
                              <span className="block font-black text-slate-900 text-lg">3:05</span>
                              <span className="text-slate-400 font-bold uppercase text-[10px]">Goal</span>
                           </div>
                        </div>
                     </div>
                  </CardContent>
               </Card>
               <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-5 shadow-sm">
                  <h4 className="font-bold text-yellow-800 flex items-center gap-2 mb-2 text-sm">
                     <Info className="w-4 h-4" /> Coach's Note
                  </h4>
                  <p className="text-xs text-yellow-700 leading-relaxed font-medium">
                     Prioritize sleep during weeks 18-20. Fatigue will peak.
                  </p>
               </div>
           </div>
        </div>

        {/* RACE PERFORMANCE ANALYSIS */}
        <div className="space-y-4">
           <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                 <Trophy className="w-6 h-6 text-secondary" /> Race Performance & VDOT Progression
              </h3>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">Normalized VDOT Score</span>
           </div>
           
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Chart */}
              <Card className="lg:col-span-2 shadow-sm">
                 <CardContent className="h-80 pt-6">
                    <ResponsiveContainer width="100%" height="100%">
                       <ComposedChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                          <XAxis 
                             dataKey="displayDate" 
                             axisLine={false} 
                             tickLine={false} 
                             tick={{fontSize: 10, fontWeight: 700, fill: '#64748B'}} 
                             dy={10}
                          />
                          <YAxis 
                             domain={['dataMin - 2', 'dataMax + 2']} 
                             axisLine={false} 
                             tickLine={false} 
                             tick={{fontSize: 10, fill: '#64748B'}}
                             label={{ value: 'VDOT Score', angle: -90, position: 'insideLeft', style: {fontSize: 10, fill: '#94A3B8'} }}
                          />
                          <Tooltip 
                             cursor={{ stroke: '#007BFF', strokeWidth: 1, strokeDasharray: '3 3' }}
                             contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                             formatter={(value: any, name: any, props: any) => [
                                <div>
                                   <span className="font-bold">{value}</span> VDOT
                                   <div className="text-[10px] font-normal text-slate-500 mt-1">{props.payload.time} ({props.payload.pace})</div>
                                </div>, 
                                props.payload.distance
                             ]}
                          />
                          <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                          
                          {/* Marathon Line */}
                          <Line 
                             type="monotone" 
                             dataKey="vdotM" 
                             name="Marathon" 
                             stroke="#007BFF" 
                             strokeWidth={2} 
                             connectNulls
                             dot={{ r: 4, fill: '#007BFF', strokeWidth: 0 }} 
                             activeDot={{ r: 6 }}
                          />
                          
                          {/* 5k Points (Line with no stroke) */}
                          <Line 
                             type="monotone" 
                             dataKey="vdot5k"
                             name="5k" 
                             stroke="none"
                             dot={{ r: 4, fill: '#10B981', strokeWidth: 0 }}
                             activeDot={{ r: 6 }}
                          />

                          {/* 10M Points (Line with no stroke) */}
                          <Line 
                             type="monotone" 
                             dataKey="vdot10M"
                             name="10 Miler" 
                             stroke="none"
                             dot={{ r: 4, fill: '#F59E0B', strokeWidth: 0 }}
                             activeDot={{ r: 6 }}
                          />
                       </ComposedChart>
                    </ResponsiveContainer>
                 </CardContent>
              </Card>

              {/* Race List Table */}
              <Card>
                 <CardHeader>
                    <CardTitle className="text-sm uppercase tracking-wider text-slate-500">History Log</CardTitle>
                 </CardHeader>
                 <CardContent className="p-0">
                    <div className="divide-y divide-gray-100">
                       {RACE_HISTORY.slice().reverse().map((race) => (
                          <div key={race.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                             <div>
                                <h4 className="text-sm font-bold text-slate-900">{race.name}</h4>
                                <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                                   <span>{race.displayDate}</span>
                                   <span>•</span>
                                   <span>{race.distance}</span>
                                </div>
                             </div>
                             <div className="text-right">
                                <div className="text-sm font-black text-slate-900">{race.time}</div>
                                <div className="flex items-center justify-end gap-1 text-xs font-bold text-primary">
                                   <TrendingUp className="w-3 h-3" /> {race.vdot}
                                </div>
                             </div>
                          </div>
                       ))}
                    </div>
                 </CardContent>
              </Card>
           </div>
        </div>

      </div>
    );
  };

  const renderList = () => (
     <div className="space-y-4">
        {MOCK_ACTIVITIES.map((activity) => (
           <div 
             key={activity.id} 
             onClick={() => setSelectedActivity(activity)}
             className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md hover:border-primary/30 transition-all cursor-pointer group flex items-center gap-6"
           >
              <div className="w-16 flex-shrink-0 text-center border-r border-gray-100 pr-4">
                 <span className="block text-xs font-bold text-slate-400 uppercase">
                    {activity.date.split(' ')[0] === 'Today' ? 'Today' : 'Oct 12'}
                 </span>
                 <span className="block text-xl font-black text-slate-900 mt-1">
                    {activity.type === 'Run' ? <ActivityIcon className="w-6 h-6 mx-auto text-primary" /> : <ActivityIcon className="w-6 h-6 mx-auto text-orange-500" />}
                 </span>
              </div>
              <div className="flex-1 min-w-0">
                 <h4 className="font-bold text-lg text-slate-900 group-hover:text-primary transition-colors">{activity.name}</h4>
                 <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {activity.duration}m</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {activity.location || 'Boulder, CO'}</span>
                 </div>
              </div>
              <div className="grid grid-cols-3 gap-8 text-right pr-4">
                 <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase">Distance</span>
                    <span className="block text-lg font-bold text-slate-900">{activity.distance} <span className="text-xs font-normal">km</span></span>
                 </div>
                 <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase">Pace</span>
                    <span className="block text-lg font-bold text-slate-900">{activity.pace}</span>
                 </div>
                 <div className="hidden md:block">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase">Score</span>
                    <span className="block text-lg font-bold text-secondary flex items-center justify-end gap-1"><Zap className="w-3 h-3" /> {activity.activityScore}</span>
                 </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
           </div>
        ))}
     </div>
  );

  return (
    <div className="font-sans text-slate-900 relative">
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-8">
         <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
               Training Log
            </h1>
            <p className="text-slate-500 font-medium">Track, analyze, and optimize your daily efforts.</p>
         </div>
         <div className="bg-white p-1 rounded-lg border border-gray-200 shadow-sm flex">
            <button onClick={() => setView('calendar')} className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-md transition-all ${view === 'calendar' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}>
               <CalendarIcon className="w-4 h-4" /> <span className="hidden sm:inline">Calendar</span>
            </button>
            <button onClick={() => setView('list')} className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-md transition-all ${view === 'list' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}>
               <List className="w-4 h-4" /> <span className="hidden sm:inline">List</span>
            </button>
            <button onClick={() => setView('analysis')} className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-md transition-all ${view === 'analysis' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}>
               <BarChart2 className="w-4 h-4" /> <span className="hidden sm:inline">Analysis</span>
            </button>
         </div>
      </div>

      <div className="animate-fade-in">
         {view === 'calendar' && renderCalendar()}
         {view === 'list' && renderList()}
         {view === 'analysis' && <PerformanceView />}
      </div>

      {selectedActivity && (
         <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setSelectedActivity(null)}></div>
            <div className="relative w-full max-w-md bg-white h-full shadow-2xl overflow-y-auto animate-fade-in">
               <div className="h-48 bg-slate-100 relative group cursor-pointer">
                  <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-multiply"></div>
                  <button onClick={() => setSelectedActivity(null)} className="absolute top-4 right-4 z-20 bg-white/90 p-2 rounded-full hover:bg-white shadow-sm transition-colors">
                     <X className="w-5 h-5 text-slate-900" />
                  </button>
                  <svg className="absolute inset-0 w-full h-full p-10" viewBox="0 0 100 100" preserveAspectRatio="none">
                     <path d="M10,90 Q30,60 50,50 T90,10" fill="none" stroke="#FC4C02" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  <div className="absolute bottom-4 left-4 bg-white/90 px-3 py-1 rounded text-xs font-bold shadow-sm">
                     <MapPin className="w-3 h-3 inline mr-1" /> Map View
                  </div>
               </div>
               <div className="p-6 space-y-6">
                  <div>
                     <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-500 uppercase">{selectedActivity.date || 'Scheduled'}</span>
                        <div className="flex gap-2">
                           <button className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><Share2 className="w-4 h-4" /></button>
                           <button className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><MoreHorizontal className="w-4 h-4" /></button>
                        </div>
                     </div>
                     <h2 className="text-2xl font-black text-slate-900 leading-tight mb-2">{selectedActivity.name}</h2>
                     <p className="text-slate-600 text-sm">{selectedActivity.description || "No description provided for this activity."}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="bg-slate-50 p-4 rounded-xl border border-gray-100">
                        <p className="text-xs font-bold text-slate-400 uppercase">Distance</p>
                        <p className="text-2xl font-black text-slate-900">{selectedActivity.distance} <span className="text-sm font-medium text-slate-500">km</span></p>
                     </div>
                     <div className="bg-slate-50 p-4 rounded-xl border border-gray-100">
                        <p className="text-xs font-bold text-slate-400 uppercase">Pace</p>
                        <p className="text-2xl font-black text-slate-900">{selectedActivity.pace} <span className="text-sm font-medium text-slate-500">/km</span></p>
                     </div>
                  </div>
                  {selectedActivity.status !== 'planned' && (
                     <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-5 text-white flex items-center justify-between shadow-lg">
                        <div>
                           <p className="text-xs font-bold text-slate-400 uppercase mb-1">Pracer Score</p>
                           <p className="text-3xl font-black text-white">{selectedActivity.activityScore || 85}</p>
                        </div>
                        <div className="text-right">
                           <div className="inline-flex items-center gap-1 bg-white/10 px-2 py-1 rounded text-xs font-bold text-secondary mb-1">
                              <Zap className="w-3 h-3" /> AI Analysis
                           </div>
                        </div>
                     </div>
                  )}
                  {selectedActivity.status === 'planned' && (
                     <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
                        <h4 className="font-bold text-primary mb-2 flex items-center gap-2"><ActivityIcon className="w-4 h-4" /> Coach's Plan</h4>
                        <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
                           <li>Warm up: 10 mins easy</li>
                           <li>Main Set: Maintain {selectedActivity.paceRange}</li>
                        </ul>
                     </div>
                  )}
               </div>
               <div className="p-4 border-t border-gray-100 bg-slate-50 flex items-center justify-between sticky bottom-0">
                  <div className="flex items-center gap-4">
                     <button className="flex items-center gap-1.5 text-slate-500 hover:text-orange-600 transition-colors">
                        <ThumbsUp className="w-4 h-4" /> <span className="text-xs font-bold">{selectedActivity.likes || 0}</span>
                     </button>
                     <button className="flex items-center gap-1.5 text-slate-500 hover:text-primary transition-colors">
                        <MessageCircle className="w-4 h-4" /> <span className="text-xs font-bold">{selectedActivity.comments || 0}</span>
                     </button>
                  </div>
                  {selectedActivity.status !== 'planned' && <Button size="sm">View on Strava</Button>}
                  {selectedActivity.status === 'planned' && <Button size="sm">Mark as Complete</Button>}
               </div>
            </div>
         </div>
      )}
    </div>
  );
};

export default TrainingLogView;
