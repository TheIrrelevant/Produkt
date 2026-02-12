import { useEffect } from 'react'
import type { Dispatch } from 'react'
import type { ProduktState, ProduktAction } from '../types/state'
import { ImageUpload } from './ui/ImageUpload'

interface Props {
  state: ProduktState
  dispatch: Dispatch<ProduktAction>
}

export function SectionReference({ state, dispatch }: Props) {
  useEffect(() => {
    return () => {
      if (state.referencePreview) {
        URL.revokeObjectURL(state.referencePreview)
      }
    }
  }, [state.referencePreview])

  return (
    <div className="flex flex-col gap-1.5 h-full">
      <label className="text-ash/40 text-xs uppercase tracking-wider">
        Reference
      </label>
      <ImageUpload
        preview={state.referencePreview}
        onUpload={(file, preview) =>
          dispatch({ type: 'SET_REFERENCE', file, preview })
        }
        onClear={() => dispatch({ type: 'CLEAR_REFERENCE' })}
      />
    </div>
  )
}
