import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'

interface Props { children: ReactNode }
interface State { hasError: boolean; message: string }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: '' }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[Produkt] Render error:', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-full flex flex-col items-center justify-center gap-4 p-8">
          <h2 className="font-warbler text-3xl text-bone">Something broke</h2>
          <p className="text-ash/60 text-sm max-w-md text-center">{this.state.message}</p>
          <button
            onClick={() => this.setState({ hasError: false, message: '' })}
            className="mt-4 px-6 py-2 bg-ash text-obsidian rounded-default font-medium text-sm uppercase tracking-wider"
          >
            Try Again
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
