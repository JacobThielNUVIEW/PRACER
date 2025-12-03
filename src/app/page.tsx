import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-rac-depth flex flex-col items-center justify-center px-6 overflow-hidden relative">
      {/* Background gradient glow */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(249,115,22,0.04), rgba(14,165,233,0.02))', filter: 'blur(36px)' }} />

      <div className="relative z-10 text-center max-w-5xl space-y-16">
        {/* Hero */}
        <div className="space-y-8">
          <h1 className="text-6xl md:text-8xl font-hud font-extrabold tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-rac-blue to-rac-signal">REACELAY</span>
          </h1>
          <p className="text-xl md:text-2xl text-rac-text-muted font-medium leading-relaxed">
            Adaptive training that learns from every run.
            <br />
            <span className="text-rac-signal font-semibold">No fluff. Just faster.</span>
          </p>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-8 justify-center items-center mt-12">
          <Link
            href="/auth"
            className="flex items-center justify-center gap-3 bg-gradient-to-r from-rac-blue to-rac-signal text-rac-depth px-10 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg"
          >
            Get Started
          </Link>
          <Link
            href="/dashboard"
            className="px-8 py-4 border-2 border-rac-signal text-rac-signal rounded-2xl font-bold text-lg hover:bg-rac-signal hover:text-rac-depth transition-all duration-300 shadow-md"
          >
            Enter Dashboard →
          </Link>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap gap-4 justify-center mt-12">
          {['Live VDOT Tracking', 'Weekly Adaptation', 'Race Predictor', 'Premium Precision', 'Garmin + Whoop Fusion'].map((f) => (
            <span key={f} className="px-4 py-2 bg-rac-surface/60 border border-rac-border rounded-full text-rac-text-muted text-sm">
              {f}
            </span>
          ))}
        </div>
      </div>
    </main>
  );
}
