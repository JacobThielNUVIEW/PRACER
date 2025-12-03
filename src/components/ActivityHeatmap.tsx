import React from 'react';
import { IMAGES } from '@/lib/constants';

type Score = { date?: string; score?: number; value?: number };

export default function ActivityHeatmap({ scores = [] }: { scores?: Score[] }) {
  // build a quick map of dates -> score
  const scoresMap = React.useMemo(() => {
    const m = new Map<string, Score>();
    (scores || []).forEach((s: Score) => {
      if (!s) return;
      let d = (s.date || '').slice(0, 10);
      if (!d && typeof s.value === 'string') {
        d = (s.value as unknown as string).slice(0, 10);
      }
      if (d) m.set(d, s);
    });
    return m;
  }, [scores]);

  // last 30 days
  const days = React.useMemo(() => {
    const out: string[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      out.push(d.toISOString().slice(0, 10));
    }
    return out;
  }, []);

  return (
    <div className="w-full">
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const s = scoresMap.get(day);
          const value = s ? (s.score ?? (s as any).value ?? 1) : 0;
          const cls = value > 0 ? 'bg-rac-signal' : 'bg-slate-800/50';
          return (
            <div
              key={day}
              className={`${cls} w-6 h-6 rounded-sm border border-slate-800/30`} 
              title={`${day} - ${value}`}
            />
          );
        })}
      </div>
      {(!scores || scores.length === 0) && (
        <div className="mt-3 text-sm text-slate-500">No scores yet — connect Strava and start training.</div>
      )}
    </div>
  );
}
