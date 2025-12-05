import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export default function Logo({ className = "", size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Racelay Logo"
    >
      {/* A solid, fast, italicized R shape */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6 4H16.5C22.299 4 27 8.02944 27 13C27 16.7166 24.6983 19.9135 21.0569 21.3533L27.6464 28H21.232L15.5 22H11.5L10 28H4L10 4ZM12.5 10L11 16H16.5C18.433 16 20 14.6569 20 13C20 11.3431 18.433 10 16.5 10H12.5Z"
        fill="currentColor"
      />
    </svg>
  );
}
