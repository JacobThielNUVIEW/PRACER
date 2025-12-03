import React from 'react'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode
}

export default function PrimaryButton({ children, className = '', ...rest }: Props) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 px-6 py-3 bg-[var(--rac-blue)] hover:bg-[var(--rac-blue-glow)] text-white rounded-xl font-bold transition ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}

