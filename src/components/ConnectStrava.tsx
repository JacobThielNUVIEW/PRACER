// src/components/ConnectStrava.tsx
'use client';

export default function ConnectStrava() {
  const linkStrava = () => {
    // This URL tells Strava where to send the user back after login
    const redirectUri = `${window.location.origin}/api/link-strava`;

    const url = `https://www.strava.com/oauth/authorize?` +
      `client_id=172017&` +
      `response_type=code&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `approval_prompt=force&` +
      `scope=activity:read_all,profile:read_all`;

    window.location.href = url;
  };

  return (
    <button
      onClick={linkStrava}
      className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-gold to-orange text-slate-900 px-12 py-6 rounded-2xl font-bold text-xl hover:shadow-2xl hover:shadow-gold/20 hover:scale-105 transition-all duration-300 shadow-lg"
    >
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7.008 13.828h4.172" />
      </svg>
      Connect Strava
    </button>
  );
}