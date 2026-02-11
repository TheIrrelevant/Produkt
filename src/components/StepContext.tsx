import type { Dispatch } from 'react'
import type { WizardState, WizardAction } from '../types/wizard'
import type { Library } from '../types/library'
import { SelectCard } from './ui/SelectCard'
import { InfoBox } from './ui/InfoBox'

interface Props {
  state: WizardState
  dispatch: Dispatch<WizardAction>
  lib: Library
}

export function StepContext({ state, dispatch, lib }: Props) {
  const genres = Object.keys(lib.photographers)

  const photographers = state.selectedGenre
    ? Object.keys(lib.photographers[state.selectedGenre])
    : []

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6">
      {/* Heading */}
      <div>
        <h2 className="font-warbler text-2xl text-bone">Context Transformation</h2>
        <p className="text-ash/60 text-sm mt-1">
          Describe the new context for your product.
        </p>
      </div>

      {/* Context Text Area */}
      <textarea
        value={state.contextText}
        onChange={(e) => dispatch({ type: 'SET_CONTEXT_TEXT', text: e.target.value })}
        placeholder="Show this gold necklace on a female model's neck with soft studio lighting..."
        rows={6}
        className="w-full bg-obsidian border border-ash/20 rounded-default p-4
                   text-bone text-sm placeholder:text-ash/30
                   focus:border-ash/50 focus:outline-none resize-none"
      />

      {/* Separator */}
      <div className="border-t border-ash/10" />

      {/* Photographer Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-warbler text-lg text-bone">Photographer Style</h3>
            <p className="text-ash/40 text-xs mt-0.5">Optional</p>
          </div>

          {/* Toggle */}
          <button
            type="button"
            onClick={() =>
              dispatch({ type: 'SET_USE_PHOTOGRAPHER', enabled: !state.usePhotographer })
            }
            className={`relative w-10 h-5 rounded-full transition-colors ${
              state.usePhotographer ? 'bg-ash' : 'bg-ash/20'
            }`}
          >
            <span
              className={`absolute top-0.5 w-4 h-4 rounded-full transition-transform ${
                state.usePhotographer
                  ? 'translate-x-5 bg-obsidian'
                  : 'translate-x-0.5 bg-ash/60'
              }`}
            />
          </button>
        </div>

        {state.usePhotographer && (
          <div className="flex flex-col gap-4 step-enter">
            <p className="text-ash/50 text-sm">
              Apply photographer&apos;s visual DNA
            </p>

            {/* Genre + Photographer side by side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Genre Selector */}
              <div className="flex flex-col gap-2">
                <span className="text-ash/40 text-xs uppercase tracking-wider">
                  Genre
                </span>
                <div className="flex flex-col gap-2">
                  {genres.map((genre) => (
                    <SelectCard
                      key={genre}
                      label={genre}
                      description={`${Object.keys(lib.photographers[genre]).length} artists`}
                      isSelected={state.selectedGenre === genre}
                      onClick={() => dispatch({ type: 'SET_GENRE', genre })}
                    />
                  ))}
                </div>
              </div>

              {/* Photographer Selector */}
              {state.selectedGenre && (
                <div className="flex flex-col gap-2 step-enter">
                  <span className="text-ash/40 text-xs uppercase tracking-wider">
                    Photographer
                  </span>
                  <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1">
                    {photographers.map((name) => (
                      <SelectCard
                        key={name}
                        label={name}
                        description={lib.photographers[state.selectedGenre!][name].style}
                        isSelected={state.selectedPhotographerName === name}
                        onClick={() =>
                          dispatch({
                            type: 'SET_PHOTOGRAPHER',
                            name,
                            info: lib.photographers[state.selectedGenre!][name],
                          })
                        }
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* InfoBox — selected photographer details */}
            {state.selectedPhotographerInfo && (
              <div className="step-enter">
                <InfoBox
                  items={[
                    { label: 'Style', value: state.selectedPhotographerInfo.style },
                    { label: 'Lighting', value: state.selectedPhotographerInfo.lighting },
                    { label: 'Vibe', value: state.selectedPhotographerInfo.vibe },
                  ]}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
