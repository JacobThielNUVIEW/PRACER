import React from 'react'

export default function BrandHeader() {
  return (
    <header className="w-full border-b border-rac-border bg-rac-surface/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-[var(--rac-blue)]" />
          <div>
            <div className="text-lg font-black tracking-tight">PRACER</div>
            <div className="text-xs text-rac-text-muted uppercase">NEVER STOP</div>
          </div>
        </div>
        <nav className="text-sm text-rac-text-muted">Dashboard</nav>
      </div>
    </header>
  )
}
