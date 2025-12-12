
import React, { useState } from 'react';
import { Check, Plus, Trash2, Zap, RotateCcw, CalendarDays, Repeat } from 'lucide-react';

interface Habit {
  id: string;
  name: string;
  current: number;
  target: number;
  unit: string; // 'x', 'km', 'mins'
  frequency: 'daily' | 'weekly';
}

const INITIAL_HABITS: Habit[] = [
  { id: '1', name: 'Strength Work', current: 1, target: 3, unit: 'sess', frequency: 'weekly' },
  { id: '2', name: 'Daily Stretch', current: 1, target: 1, unit: 'days', frequency: 'daily' },
  { id: '3', name: 'Hydration', current: 2, target: 3, unit: 'L', frequency: 'daily' },
];

const HabitTracker: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>(INITIAL_HABITS);
  const [isAdding, setIsAdding] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitTarget, setNewHabitTarget] = useState('3');
  const [newHabitFreq, setNewHabitFreq] = useState<'daily' | 'weekly'>('weekly');

  const incrementHabit = (id: string) => {
    setHabits(habits.map(h => 
      h.id === id ? { ...h, current: Math.min(h.current + 1, h.target) } : h
    ));
  };

  const resetHabit = (id: string) => {
     setHabits(habits.map(h => 
      h.id === id ? { ...h, current: 0 } : h
    ));
  };

  const deleteHabit = (id: string) => {
    setHabits(habits.filter(h => h.id !== id));
  };

  const addNewHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;

    const newHabit: Habit = {
      id: Date.now().toString(),
      name: newHabitName,
      current: 0,
      target: parseInt(newHabitTarget) || 1,
      unit: 'x',
      frequency: newHabitFreq
    };

    setHabits([...habits, newHabit]);
    setNewHabitName('');
    setNewHabitTarget('3');
    setIsAdding(false);
  };

  const renderHabitRow = (habit: Habit) => {
    const percent = (habit.current / habit.target) * 100;
    const isComplete = habit.current >= habit.target;

    return (
      <div key={habit.id} className="group mb-3 last:mb-0">
        <div className="flex justify-between text-xs mb-1.5">
          <span className={`font-bold transition-colors ${isComplete ? 'text-green-600 line-through decoration-green-500/50' : 'text-slate-700'}`}>
            {habit.name}
          </span>
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
             {habit.current > 0 && (
                <button onClick={() => resetHabit(habit.id)} className="text-slate-400 hover:text-orange-500" title="Reset">
                   <RotateCcw className="w-3 h-3" />
                </button>
             )}
             <button onClick={() => deleteHabit(habit.id)} className="text-slate-400 hover:text-red-500" title="Delete">
                <Trash2 className="w-3 h-3" />
             </button>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
           <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden relative">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${isComplete ? 'bg-green-500' : 'bg-primary'}`} 
                style={{ width: `${Math.min(percent, 100)}%` }}
              ></div>
           </div>
           
           <div className="flex items-center gap-2 shrink-0 w-14 justify-end">
              <span className="text-[10px] text-slate-400 font-medium w-6 text-right">
                 {habit.current}/{habit.target}
              </span>
              <button 
                onClick={() => incrementHabit(habit.id)}
                disabled={isComplete}
                className={`w-5 h-5 rounded flex items-center justify-center transition-all shadow-sm ${
                   isComplete 
                   ? 'bg-green-100 text-green-600 cursor-default' 
                   : 'bg-white border border-gray-200 text-slate-400 hover:border-primary hover:text-primary active:scale-95'
                }`}
              >
                 {isComplete ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
              </button>
           </div>
        </div>
      </div>
    );
  };

  const dailyHabits = habits.filter(h => h.frequency === 'daily');
  const weeklyHabits = habits.filter(h => h.frequency === 'weekly');

  return (
    <div className="bg-white rounded-md shadow-sm border border-gray-200 p-4 font-sans">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-bold text-xs text-slate-500 uppercase tracking-wider flex items-center gap-2">
          <Zap className="w-3 h-3 text-secondary" /> Habit Lab
        </h4>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className={`text-primary hover:bg-blue-50 p-1 rounded transition-all ${isAdding ? 'bg-blue-50 text-blue-700' : ''}`}
        >
          <Plus className={`w-4 h-4 transition-transform ${isAdding ? 'rotate-45' : ''}`} />
        </button>
      </div>

      {isAdding && (
        <form onSubmit={addNewHabit} className="mb-6 bg-slate-50 p-3 rounded-lg border border-slate-100 animate-fade-in">
          <input 
            type="text" 
            placeholder="Habit name (e.g. Core)" 
            className="w-full text-sm bg-white border border-gray-200 rounded px-2 py-1.5 mb-2 focus:outline-none focus:border-primary text-slate-700"
            value={newHabitName}
            onChange={(e) => setNewHabitName(e.target.value)}
            autoFocus
          />
          <div className="flex gap-2 mb-2">
             <div className="relative flex-1">
                <input 
                  type="number" 
                  min="1"
                  max="100"
                  className="w-full text-sm bg-white border border-gray-200 rounded px-2 py-1.5 focus:outline-none focus:border-primary text-slate-700"
                  value={newHabitTarget}
                  onChange={(e) => setNewHabitTarget(e.target.value)}
                />
                <span className="absolute right-2 top-1.5 text-xs text-slate-400 font-medium pointer-events-none">times</span>
             </div>
             <select 
               className="flex-1 text-sm bg-white border border-gray-200 rounded px-2 py-1.5 focus:outline-none focus:border-primary text-slate-600 cursor-pointer"
               value={newHabitFreq}
               onChange={(e) => setNewHabitFreq(e.target.value as 'daily' | 'weekly')}
             >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
             </select>
          </div>
          <button type="submit" className="w-full bg-primary text-white text-xs font-bold py-1.5 rounded hover:bg-primary-hover shadow-sm transition-all">
             Commit to Goal
          </button>
        </form>
      )}

      <div className="space-y-6">
        {/* Daily Section */}
        {dailyHabits.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
              <CalendarDays className="w-3 h-3" /> Daily Rituals
            </div>
            <div className="space-y-3">
              {dailyHabits.map(renderHabitRow)}
            </div>
          </div>
        )}

        {/* Weekly Section */}
        {weeklyHabits.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
              <Repeat className="w-3 h-3" /> Weekly Targets
            </div>
            <div className="space-y-3">
              {weeklyHabits.map(renderHabitRow)}
            </div>
          </div>
        )}

        {habits.length === 0 && !isAdding && (
           <div className="text-center py-6 border-2 border-dashed border-gray-100 rounded-lg">
              <p className="text-xs text-slate-400 italic mb-2">No active habits.</p>
              <button 
                onClick={() => setIsAdding(true)}
                className="text-xs font-bold text-primary hover:underline"
              >
                Create your first habit
              </button>
           </div>
        )}
      </div>
    </div>
  );
};

export default HabitTracker;
