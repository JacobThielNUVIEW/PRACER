import React from 'react'
export const dynamic = 'force-dynamic'

export default function GlobalError() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-xl text-center">
        <h2 className="text-2xl font-bold">Something went wrong</h2>
        <p className="text-sm text-rac-text-muted mt-2">We detected an error on this request. Try refreshing the page.</p>
      </div>
    </div>
  )
}
