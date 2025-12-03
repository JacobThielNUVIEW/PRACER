import React from 'react';

export function PrimaryButton({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className="px-8 py-4 rounded-lg font-bold uppercase tracking-wider
                 bg-rac-blue hover:bg-rac-blue-dark text-rac-text-main
                 shadow-[0_8px_32px_var(--rac-blue-glow)]
                 transition-all hover:scale-105 active:scale-95"
      {...props}
    >
      {children}
    </button>
  );
}
