import React from 'react'

export default function PageError() {
  return (
    React.createElement('div', { className: 'min-h-screen flex items-center justify-center p-8' },
      React.createElement('div', { className: 'max-w-xl text-center' },
        React.createElement('h2', { className: 'text-2xl font-bold' }, 'Application error'),
        React.createElement('p', { className: 'text-sm text-rac-text-muted mt-2' }, 'An error was detected — try reloading')
      )
    )
  )
}
