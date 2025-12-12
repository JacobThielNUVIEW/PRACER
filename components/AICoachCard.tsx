import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';
import { getCoachingAdvice } from '../services/geminiService';
import { AthleteProfile, Activity } from '../types';

interface AICoachCardProps {
  profile: AthleteProfile;
  latestActivity: Activity;
}

const AICoachCard: React.FC<AICoachCardProps> = ({ profile, latestActivity }) => {
  const [advice, setAdvice] = useState<string>("Analyzing your performance data...");
  const [loading, setLoading] = useState<boolean>(false);

  const fetchAdvice = async () => {
    setLoading(true);
    const result = await getCoachingAdvice(profile, latestActivity);
    setAdvice(result);
    setLoading(false);
  };

  useEffect(() => {
    fetchAdvice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bg-hero-gradient rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
      {/* Abstract Background Element */}
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-secondary opacity-20 rounded-full blur-xl"></div>
      
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-secondary" />
          <h3 className="font-bold text-lg tracking-wide">COACH PRACER</h3>
        </div>
        <button 
          onClick={fetchAdvice}
          disabled={loading}
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
          aria-label="Refresh Advice"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
      
      <div className="relative z-10 min-h-[60px]">
        <p className="text-lg font-medium leading-relaxed font-sans">
          "{advice}"
        </p>
      </div>
      
      <div className="mt-4 flex items-center gap-2 text-sm text-blue-100 font-light relative z-10">
        <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
        <span>AI Analysis based on recent activity</span>
      </div>
    </div>
  );
};

export default AICoachCard;