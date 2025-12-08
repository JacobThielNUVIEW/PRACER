"use client"
import React from 'react'
export const dynamic = 'force-dynamic'

export default function AppError({ error }: { error: Error }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-xl text-center">
        <h2 className="text-2xl font-bold">Application error</h2>
        <p className="text-sm text-rac-text-muted mt-2">{error?.message || 'Unknown Error'}</p>
      </div>
    </div>
  )
}
