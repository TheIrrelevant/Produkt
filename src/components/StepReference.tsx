import type { Dispatch } from 'react'
import type { WizardState, WizardAction } from '../types/wizard'
import { ImageUpload } from './ui/ImageUpload'

interface Props {
  state: WizardState
  dispatch: Dispatch<WizardAction>
}

export function StepReference({ state, dispatch }: Props) {
  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      <div>
        <h2 className="font-warbler text-2xl text-bone">Reference Product</h2>
        <p className="text-ash/60 text-sm mt-1">
          Upload your product image. The AI will analyze it to maintain 100% product identity in the new context.
        </p>
      </div>

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
