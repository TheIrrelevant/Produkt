import { useProduktReducer } from './components/useProduktReducer'
import { PageLayout } from './components/PageLayout'
import { ErrorBoundary } from './components/ErrorBoundary'
import { SectionReference } from './components/SectionReference'
import { SectionConfig } from './components/SectionConfig'
import { SectionOutput } from './components/SectionOutput'
import { useLibrary } from './data/useLibrary'

export default function App() {
  const [state, dispatch] = useProduktReducer()
  const lib = useLibrary()

  return (
    <PageLayout>
      <ErrorBoundary>
        <div className="max-w-7xl mx-auto flex flex-col gap-6 py-6">
          {/* Top: 3-column input area */}
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_1fr] gap-6">
            {/* Left: Reference Image */}
            <SectionReference state={state} dispatch={dispatch} />

            {/* Center: Product Type + Photographer */}
            <SectionConfig state={state} dispatch={dispatch} lib={lib} />

            {/* Right: Context Text */}
            <div className="flex flex-col gap-1.5">
              <label className="text-ash/40 text-xs uppercase tracking-wider">
                Context Description
              </label>
              <textarea
                value={state.contextText}
                onChange={(e) => dispatch({ type: 'SET_CONTEXT_TEXT', text: e.target.value })}
                placeholder="Place this product inside a luxury jewelry box with champagne-toned background and soft premium lighting..."
                className="flex-1 min-h-[200px] bg-obsidian border border-ash/20 rounded-default p-4
                           text-bone text-sm placeholder:text-ash/30
                           focus:border-ash/50 focus:outline-none resize-none"
              />
            </div>
          </div>

          {/* Separator */}
          <div className="border-t border-ash/10" />

          {/* Bottom: Output + Buttons */}
          <SectionOutput state={state} dispatch={dispatch} />
        </div>
      </ErrorBoundary>
    </PageLayout>
  )
}
