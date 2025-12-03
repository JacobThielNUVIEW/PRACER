"use client"

import React from 'react'

type State = { hasError: boolean }

export default class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: any, info: any) {
    console.error('ErrorBoundary caught:', error, info)
  }

  handleReload = () => {
    if (typeof window !== 'undefined') window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-8">
          <div className="max-w-xl text-center">
            <h2 className="text-2xl font-bold">Sync failed — retrying...</h2>
            <p className="text-sm text-rac-text-muted mt-2">Please reload to try again.</p>
            <div className="mt-6">
              <button onClick={this.handleReload} className="px-4 py-2 rounded bg-[var(--rac-blue)] text-white">Reload</button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
