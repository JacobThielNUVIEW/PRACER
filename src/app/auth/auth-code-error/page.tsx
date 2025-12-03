// src/app/auth/auth-code-error/page.tsx
export default function AuthCodeError() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="text-6xl">❌</div>
        <h1 className="text-3xl font-bold text-white">Authentication Error</h1>
        <p className="text-slate-300">
          Something went wrong during sign-in. Please try again.
        </p>
        <div className="space-y-3">
          <a
            href="/auth"
            className="block px-6 py-3 bg-strava-500 hover:bg-strava-600 text-white rounded-lg font-bold transition"
          >
            Try Again
          </a>
          <a
            href="/"
            className="block px-6 py-3 border border-gold-500 text-gold-500 hover:bg-gold-500/10 rounded-lg font-bold transition"
          >
            Back Home
          </a>
        </div>
      </div>
    </div>
  );
}
