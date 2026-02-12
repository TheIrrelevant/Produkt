import { useProduktReducer } from './components/useProduktReducer'
import { PageLayout } from './components/PageLayout'
import { ErrorBoundary } from './components/ErrorBoundary'
import { SectionReference } from './components/SectionReference'
import { SectionConfig } from './components/SectionConfig'
import { SectionContext } from './components/SectionContext'
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

            {/* Right: Context Text + Presets */}
            <SectionContext
              contextText={state.contextText}
              dispatch={dispatch}
              presets={lib.contextPresets}
            />
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
