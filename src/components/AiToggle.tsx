// src/components/AiToggle.tsx
'use client';
import { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { createClient } from '@/lib/supabase/client';

export default function AiToggle({ initialValue, userId }: { initialValue: boolean; userId: string }) {
  const [enabled, setEnabled] = useState(initialValue);
  const [loading, setLoading] = useState(false);

  const handleToggle = async (checked: boolean) => {
    setLoading(true);
    const supabase = createClient();
    
    await supabase
      .from('profiles')
      .update({ ai_coaching_enabled: checked })
      .eq('id', userId);

    setEnabled(checked);
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <h4 className="text-lg font-medium text-white">AI Coach Polish</h4>
        <p className="text-sm text-slate-400">
          {enabled 
            ? "ON → Smarter, personalized motivation using only your VDOT score" 
            : "OFF → Pure Jack Daniels training. No data sent to AI."}
        </p>
      </div>
      
      <div className="flex items-center gap-4 ml-8">
        {loading && <div className="skeleton h-10 w-20" />}
        {!loading && (
          <Switch 
            checked={enabled} 
            onCheckedChange={handleToggle}
            className="data-[state=checked]:bg-race-blue"
          />
        )}
      </div>
    </div>
  );
}