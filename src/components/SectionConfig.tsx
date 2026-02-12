import type { Dispatch } from 'react'
import type { ProduktState, ProduktAction } from '../types/state'
import type { Library } from '../types/library'

interface Props {
  state: ProduktState
  dispatch: Dispatch<ProduktAction>
  lib: Library
}

const selectClass = `w-full bg-obsidian border border-ash/20 rounded-default px-4 py-3
  text-bone text-sm appearance-none cursor-pointer
  focus:border-ash/50 focus:outline-none
  hover:border-ash/40 transition-colors`

const selectBg = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M3 5l3 3 3-3' fill='none' stroke='%23E2E7E9' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat' as const,
  backgroundPosition: 'right 12px center',
}

export function SectionConfig({ state, dispatch, lib }: Props) {
  const productTypeIds = Object.keys(lib.productTypes)
  const genres = Object.keys(lib.photographers)
  const photographers = state.selectedGenre
    ? Object.keys(lib.photographers[state.selectedGenre])
    : []

  return (
    <div className="flex flex-col gap-4">
      {/* Product Type */}
      <div className="flex flex-col gap-1.5">
        <label className="text-ash/40 text-xs uppercase tracking-wider">
          Product Type
        </label>
        <select
          value={state.selectedProductTypeId ?? ''}
          onChange={(e) => {
            const id = e.target.value
            if (id) {
              dispatch({
                type: 'SET_PRODUCT_TYPE',
                id,
                productType: lib.productTypes[id],
              })
            }
          }}
          className={selectClass}
          style={selectBg}
        >
          <option value="" disabled>Select type...</option>
          {productTypeIds.map((id) => (
            <option key={id} value={id}>
              {lib.productTypes[id].label}
            </option>
          ))}
        </select>
      </div>

      {/* Photographer Toggle + Dropdowns */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="text-ash/40 text-xs uppercase tracking-wider">
            Photographer
          </label>
          <button
            type="button"
            onClick={() =>
              dispatch({ type: 'SET_USE_PHOTOGRAPHER', enabled: !state.usePhotographer })
            }
            className={`relative w-8 h-4 rounded-full transition-colors ${
              state.usePhotographer ? 'bg-ash' : 'bg-ash/20'
            }`}
          >
            <span
              className={`absolute top-0.5 w-3 h-3 rounded-full transition-transform ${
                state.usePhotographer
                  ? 'translate-x-4 bg-obsidian'
                  : 'translate-x-0.5 bg-ash/60'
              }`}
            />
          </button>
        </div>

        {state.usePhotographer ? (
          <div className="flex flex-col gap-2 step-enter">
            <select
              value={state.selectedGenre ?? ''}
              onChange={(e) => dispatch({ type: 'SET_GENRE', genre: e.target.value || '' })}
              className={selectClass}
              style={selectBg}
            >
              <option value="" disabled>Genre...</option>
              {genres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre} ({Object.keys(lib.photographers[genre]).length})
                </option>
              ))}
            </select>

            <select
              value={state.selectedPhotographerName ?? ''}
              onChange={(e) => {
                const name = e.target.value
                if (name && state.selectedGenre) {
                  dispatch({
                    type: 'SET_PHOTOGRAPHER',
                    name,
                    info: lib.photographers[state.selectedGenre][name],
                  })
                }
              }}
              disabled={!state.selectedGenre}
              className={`${selectClass} disabled:opacity-30 disabled:cursor-not-allowed`}
              style={selectBg}
            >
              <option value="" disabled>
                {state.selectedGenre ? 'Photographer...' : 'Select genre first'}
              </option>
              {photographers.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <p className="text-ash/30 text-xs py-2">Off</p>
        )}
      </div>

      {/* Photographer InfoBox — compact */}
      {state.selectedPhotographerInfo && (
        <div className="step-enter text-xs">
          <div className="flex flex-col gap-1 border border-ash/10 rounded-default p-3">
            <p className="text-ash/50"><span className="text-ash/30">Style:</span> {state.selectedPhotographerInfo.style}</p>
            <p className="text-ash/50"><span className="text-ash/30">Light:</span> {state.selectedPhotographerInfo.lighting}</p>
            <p className="text-ash/50"><span className="text-ash/30">Vibe:</span> {state.selectedPhotographerInfo.vibe}</p>
          </div>
        </div>
      )}
    </div>
  )
}
