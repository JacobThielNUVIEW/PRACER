import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-6 overflow-hidden relative">
      {/* Background gradient glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-transparent to-orange/10 blur-3xl" />

      <div className="relative z-10 text-center max-w-5xl space-y-16">
        {/* Hero */}
        <div className="space-y-8">
          <h1 className="text-7xl md:text-9xl font-black tracking-tighter">
            <span className="bg-gradient-to-r from-gold via-orange to-gold bg-clip-text text-transparent animate-pulse">
              NeverStop
            </span>
          </h1>
          <p className="text-2xl md:text-4xl text-slate-300 font-light leading-relaxed">
            Adaptive training that learns from every run.<br />
            <span className="text-gold font-medium">No fluff. Just faster.</span>
          </p>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-8 justify-center items-center mt-20">
          <Link
            href="/auth"
            className="flex items-center justify-center gap-3 bg-gradient-to-r from-gold to-orange text-slate-900 px-12 py-6 rounded-2xl font-bold text-xl hover:shadow-2xl hover:shadow-gold/20 hover:scale-105 transition-all duration-300 shadow-lg"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7.008 13.828h4.172" />
            </svg>
            Get Started
          </Link>
          <Link
            href="/dashboard"
            className="px-12 py-6 border-4 border-gold text-gold rounded-2xl font-bold text-xl hover:bg-gold hover:text-slate-950 transition-all duration-300 shadow-2xl"
          >
            Enter Dashboard →
          </Link>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap gap-4 justify-center mt-20">
          {['Live VDOT Tracking', 'Weekly Adaptation', 'Race Predictor', 'Premium Precision', 'Garmin + Whoop Fusion'].map((f) => (
            <span key={f} className="px-6 py-3 bg-slate-900/70 backdrop-blur border border-slate-800 rounded-full text-slate-300 text-sm">
              {f}
            </span>
          ))}
        </div>
      </div>
    </main>
  );
}
