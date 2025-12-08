import React from 'react'

export default function ServerError() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-xl text-center">
        <h2 className="text-2xl font-bold">Server error</h2>
        <p className="text-sm text-rac-text-muted mt-2">We encountered an error — try again later.</p>
      </div>
    </div>
  )
}
