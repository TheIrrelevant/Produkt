import { useState } from 'react'
import type { Dispatch } from 'react'
import type { ProduktAction } from '../types/state'
import type { ContextPresets } from '../types/library'

interface Props {
  contextText: string
  dispatch: Dispatch<ProduktAction>
  presets: ContextPresets
}

export function SectionContext({ contextText, dispatch, presets }: Props) {
  const categories = Object.keys(presets)
  const [openCategory, setOpenCategory] = useState<string | null>(null)

  function appendPreset(text: string) {
    const separator = contextText.trim() ? '. ' : ''
    dispatch({ type: 'SET_CONTEXT_TEXT', text: contextText.trim() + separator + text })
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-ash/40 text-xs uppercase tracking-wider">
        Context Description
      </label>

      {/* Preset category chips */}
      <div className="flex flex-wrap gap-1.5">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setOpenCategory(openCategory === cat ? null : cat)}
            className={`px-2.5 py-1 text-xs rounded-full border transition-colors ${
              openCategory === cat
                ? 'border-ash/50 text-bone bg-ash/10'
                : 'border-ash/15 text-ash/40 hover:border-ash/30 hover:text-ash/60'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Expanded preset options */}
      {openCategory && (
        <div className="flex flex-wrap gap-1.5 step-enter">
          {presets[openCategory].map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => {
                appendPreset(preset)
                setOpenCategory(null)
              }}
              className="px-2.5 py-1 text-xs rounded-full border border-ash/10
                         text-ash/50 hover:border-ash/30 hover:text-bone
                         transition-colors"
            >
              {preset}
            </button>
          ))}
        </div>
      )}

      <textarea
        value={contextText}
        onChange={(e) => dispatch({ type: 'SET_CONTEXT_TEXT', text: e.target.value })}
        placeholder="Place this product inside a luxury jewelry box with champagne-toned background and soft premium lighting..."
        className="flex-1 min-h-[200px] bg-obsidian border border-ash/20 rounded-default p-4
                   text-bone text-sm placeholder:text-ash/30
                   focus:border-ash/50 focus:outline-none resize-none"
      />
    </div>
  )
}
