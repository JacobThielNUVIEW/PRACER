
import React, { useState } from 'react';
import { 
  Calendar, 
  MapPin, 
  Trophy, 
  Star, 
  Plus, 
  MoreHorizontal, 
  TrendingUp,
  Globe,
  Plane,
  Flag,
  ListFilter,
  BarChart2,
  Timer
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, Legend } from 'recharts';
import { MOCK_RACES } from '../constants';
import { Button, Card, CardHeader, CardTitle, CardContent } from './ui-kit';

const RacesView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'history'>('upcoming');
  const [filter, setFilter] = useState<'all' | 'confirmed' | 'wishlist'>('all');
  
  // Chart State
  const [chartMode, setChartMode] = useState<'volume' | 'performance'>('volume');
  const [performanceDistance, setPerformanceDistance] = useState<string>('M');

  // Sort logic
  const upcomingRaces = MOCK_RACES.filter(r => r.status !== 'Completed').sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const historyRaces = MOCK_RACES.filter(r => r.status === 'Completed').sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  const displayedRaces = activeTab === 'upcoming' 
    ? upcomingRaces.filter(r => filter === 'all' || r.status.toLowerCase() === filter)
    : historyRaces;

  // --- CHART DATA PREPARATION ---

  // 1. Volume Data (Distance over time)
  const volumeData = [...historyRaces].reverse().map(r => ({
     name: new Date(r.date).getFullYear().toString() + (historyRaces.length > 5 ? '' : `-${new Date(r.date).getMonth()+1}`),
     dateFull: r.date,
     distance: r.distanceKm,
     label: r.distance,
     raceName: r.name
  }));

  // 2. Performance Data (Time trends for specific distance)
  // Helper to parse "3:10:20" or "18:45" to minutes
  const parseResultToMinutes = (timeStr?: string) => {
    if (!timeStr) return 0;
    const parts = timeStr.split(':').map(Number);
    if (parts.length === 2) return parts[0] + parts[1]/60; // mm:ss -> minutes
    if (parts.length === 3) return parts[0]*60 + parts[1] + parts[2]/60; // hh:mm:ss -> minutes
    return 0;
  };

  // Get available distances for filter buttons
  const availableDistances = Array.from(new Set(historyRaces.map(r => r.distance)));

  const performanceData = historyRaces
    .filter(r => r.distance === performanceDistance)
    .sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()) // Oldest first for line chart
    .map(r => ({
      name: new Date(r.date).toLocaleDateString(undefined, { month: 'short', year: '2-digit' }),
      minutes: parseResultToMinutes(r.resultTime),
      resultTime: r.resultTime,
      raceName: r.name
    }));

  const BUCKET_LIST = [
    { name: 'UTMB', location: 'Chamonix, France', dist: '170km', img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=600' },
    { name: 'Tokyo Marathon', location: 'Tokyo, Japan', dist: '42.2km', img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=600' },
  ];

  return (
    <div className="animate-fade-in space-y-8 pb-12 font-sans text-slate-900">
      
      {/* 1. MASTER HEADER */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
         <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
               Race Control <Globe className="w-6 h-6 text-primary" />
            </h1>
            <p className="text-slate-500 font-medium">Manage your calendar, wishlist, and results.</p>
         </div>
         <div className="flex gap-2">
            <Button className="gap-2 bg-primary shadow-lg shadow-blue-200 hover:bg-primary-hover">
               <Plus className="w-4 h-4" /> Add Race
            </Button>
         </div>
      </div>

      {/* 2. MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         
         {/* LEFT: Race List Management (8 Cols) */}
         <div className="lg:col-span-8 space-y-6">
            
            {/* Filters & Tabs */}
            <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
               <div className="flex gap-1">
                  <button 
                    onClick={() => setActiveTab('upcoming')}
                    className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${activeTab === 'upcoming' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                     Upcoming
                  </button>
                  <button 
                    onClick={() => setActiveTab('history')}
                    className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${activeTab === 'history' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                     History
                  </button>
               </div>
               
               {activeTab === 'upcoming' && (
                  <div className="flex items-center gap-2 border-l border-gray-200 pl-4">
                     <ListFilter className="w-4 h-4 text-slate-400" />
                     <select 
                       className="text-xs font-bold text-slate-600 bg-transparent outline-none cursor-pointer"
                       value={filter}
                       onChange={(e) => setFilter(e.target.value as any)}
                     >
                        <option value="all">All Races</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="wishlist">Wishlist</option>
                     </select>
                  </div>
               )}
            </div>

            {/* List */}
            <div className="space-y-4">
               {displayedRaces.map((race) => (
                  <div key={race.id} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                     {/* Importance Indicator */}
                     <div className="absolute top-3 right-3 flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                           <Star key={i} className={`w-3 h-3 ${i < race.importance ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                        ))}
                     </div>

                     <div className="flex flex-col md:flex-row md:items-center gap-6 relative z-10">
                        {/* Date Box */}
                        <div className={`w-16 h-16 rounded-xl flex flex-col items-center justify-center border shrink-0 shadow-sm ${
                           race.status === 'Confirmed' ? 'bg-blue-50 border-blue-100 text-primary' : 
                           race.status === 'Completed' ? 'bg-slate-50 border-slate-100 text-slate-700' : 
                           'bg-yellow-50 border-yellow-100 text-yellow-600'
                        }`}>
                           <span className="text-[10px] font-bold uppercase">{new Date(race.date).toLocaleString('default', { month: 'short' })}</span>
                           <span className="text-xl font-black">{new Date(race.date).getDate()}</span>
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                           <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors">{race.name}</h3>
                              {race.status === 'Wishlist' && <span className="text-[10px] font-bold bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full uppercase">Wishlist</span>}
                           </div>
                           <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 font-medium">
                              <div className="flex items-center gap-1">
                                 <MapPin className="w-3.5 h-3.5" /> {race.location}
                              </div>
                              <div className="flex items-center gap-1">
                                 <Flag className="w-3.5 h-3.5" /> {race.distance}
                              </div>
                           </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-gray-100 pt-3 md:pt-0 md:pl-4 mt-3 md:mt-0">
                           {race.status === 'Confirmed' ? (
                              <div className="text-center md:text-right">
                                 <span className="block text-2xl font-black text-slate-900 leading-none">{race.daysOut}</span>
                                 <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wide">Days Out</span>
                              </div>
                           ) : race.status === 'Completed' ? (
                              <div className="text-center md:text-right">
                                 <span className="block text-xl font-bold text-slate-900">{race.resultTime}</span>
                                 <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wide">Result</span>
                              </div>
                           ) : (
                              <Button variant="outline" className="text-xs h-8">Move to Active</Button>
                           )}
                           <button className="hidden md:block p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full">
                              <MoreHorizontal className="w-5 h-5" />
                           </button>
                        </div>
                     </div>
                  </div>
               ))}
               
               {displayedRaces.length === 0 && (
                  <div className="text-center py-12 bg-white rounded-xl border border-gray-200 border-dashed">
                     <p className="text-slate-400 font-medium">No races found in this category.</p>
                     <Button variant="ghost" className="mt-2 text-primary">Browse Global Events</Button>
                  </div>
               )}
            </div>
         </div>

         {/* RIGHT: Analytics & Bucket List (4 Cols) */}
         <div className="lg:col-span-4 space-y-6">
            
            {/* Interactive Lifetime Graph */}
            <Card className="shadow-sm border-gray-200">
               <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                     <CardTitle className="text-sm uppercase tracking-wider text-slate-500 flex items-center gap-2">
                        {chartMode === 'volume' ? <TrendingUp className="w-4 h-4" /> : <Timer className="w-4 h-4" />}
                        {chartMode === 'volume' ? 'Lifetime Volume' : 'Race Performance'}
                     </CardTitle>
                     {/* Toggle Buttons */}
                     <div className="flex bg-slate-100 rounded p-0.5">
                        <button 
                          onClick={() => setChartMode('volume')}
                          className={`p-1 rounded text-xs font-bold transition-all ${chartMode === 'volume' ? 'bg-white shadow text-primary' : 'text-slate-400'}`}
                          title="View Distance Volume"
                        >
                           <BarChart2 className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => setChartMode('performance')}
                          className={`p-1 rounded text-xs font-bold transition-all ${chartMode === 'performance' ? 'bg-white shadow text-primary' : 'text-slate-400'}`}
                          title="View Performance Trends"
                        >
                           <TrendingUp className="w-3.5 h-3.5" />
                        </button>
                     </div>
                  </div>
               </CardHeader>
               
               <CardContent>
                  {/* Distance Selector for Performance Mode */}
                  {chartMode === 'performance' && (
                     <div className="flex gap-1 mb-4 overflow-x-auto scrollbar-hide pb-1">
                        {availableDistances.map(dist => (
                           <button
                              key={dist}
                              onClick={() => setPerformanceDistance(dist)}
                              className={`px-2 py-1 text-[10px] font-bold rounded-full border transition-colors whitespace-nowrap ${
                                 performanceDistance === dist 
                                 ? 'bg-primary text-white border-primary' 
                                 : 'bg-white text-slate-500 border-slate-200 hover:border-primary/50'
                              }`}
                           >
                              {dist}
                           </button>
                        ))}
                     </div>
                  )}

                  <div className="h-40 w-full">
                     <ResponsiveContainer width="100%" height="100%">
                        {chartMode === 'volume' ? (
                           <AreaChart data={volumeData}>
                              <defs>
                                 <linearGradient id="colorDist" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#007BFF" stopOpacity={0.4}/>
                                    <stop offset="95%" stopColor="#007BFF" stopOpacity={0}/>
                                 </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E9ECEF" />
                              <XAxis 
                                 dataKey="name" 
                                 axisLine={false} 
                                 tickLine={false} 
                                 tick={{ fontSize: 10, fill: '#94A3B8' }} 
                              />
                              <YAxis hide domain={[0, 'auto']} />
                              <Tooltip 
                                 contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                 formatter={(value: any) => [`${value} km`, 'Distance']}
                                 labelStyle={{ color: '#64748B', marginBottom: '0.25rem', fontSize: '10px', fontWeight: 'bold' }}
                              />
                              <Area type="monotone" dataKey="distance" stroke="#007BFF" strokeWidth={2} fillOpacity={1} fill="url(#colorDist)" />
                           </AreaChart>
                        ) : (
                           <LineChart data={performanceData}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E9ECEF" />
                              <XAxis 
                                 dataKey="name" 
                                 axisLine={false} 
                                 tickLine={false} 
                                 tick={{ fontSize: 10, fill: '#94A3B8' }} 
                              />
                              <YAxis 
                                 domain={['dataMin - 5', 'dataMax + 5']} 
                                 hide={false}
                                 axisLine={false}
                                 tickLine={false}
                                 width={25}
                                 tick={{ fontSize: 9, fill: '#94A3B8' }}
                              />
                              <Tooltip 
                                 contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                 formatter={(value: any, name: any, props: any) => [props.payload.resultTime, 'Time']}
                                 labelStyle={{ color: '#64748B', marginBottom: '0.25rem', fontSize: '10px', fontWeight: 'bold' }}
                              />
                              <Line 
                                 type="monotone" 
                                 dataKey="minutes" 
                                 stroke="#FC4C02" 
                                 strokeWidth={2} 
                                 dot={{ r: 3, fill: '#FC4C02', strokeWidth: 0 }}
                                 activeDot={{ r: 5 }}
                              />
                           </LineChart>
                        )}
                     </ResponsiveContainer>
                  </div>
                  
                  {/* Legend / Info */}
                  <div className="mt-2 text-center">
                     {chartMode === 'performance' && performanceData.length < 2 && (
                        <p className="text-[10px] text-slate-400 italic">Complete more {performanceDistance} races to see trends.</p>
                     )}
                     {chartMode === 'performance' && performanceData.length >= 2 && (
                        <p className="text-[10px] text-green-600 font-bold flex items-center justify-center gap-1">
                           <TrendingUp className="w-3 h-3" /> 
                           Trend: {(performanceData[0].minutes - performanceData[performanceData.length-1].minutes).toFixed(1)} mins improvement
                        </p>
                     )}
                  </div>
               </CardContent>
            </Card>

            {/* Bucket List */}
            <div className="bg-slate-900 rounded-xl shadow-lg p-6 text-white overflow-hidden relative">
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
               <div className="relative z-10">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                     <Plane className="w-5 h-5 text-secondary" /> Dream List
                  </h3>
                  <div className="space-y-4">
                     {BUCKET_LIST.map((race, i) => (
                        <div key={i} className="flex items-center gap-3 group cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors">
                           <div className="w-10 h-10 rounded-lg bg-slate-800 overflow-hidden border border-slate-700 group-hover:border-secondary transition-colors">
                              <img src={race.img} alt={race.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                           </div>
                           <div className="flex-1">
                              <h4 className="font-bold text-sm text-slate-100 group-hover:text-white">{race.name}</h4>
                              <p className="text-xs text-slate-400">{race.location}</p>
                           </div>
                           <Plus className="w-4 h-4 text-slate-500 group-hover:text-secondary" />
                        </div>
                     ))}
                  </div>
                  <Button className="w-full mt-6 bg-slate-800 hover:bg-slate-700 text-xs border border-slate-700">Explore Global Races</Button>
               </div>
            </div>

         </div>
      </div>
    </div>
  );
};

export default RacesView;
