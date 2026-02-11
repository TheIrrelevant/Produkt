import type { Dispatch } from 'react'
import type { WizardState, WizardAction } from '../types/wizard'
import type { Library } from '../types/library'

interface Props {
  state: WizardState
  dispatch: Dispatch<WizardAction>
  lib: Library
}

export function StepOutput({ state: _state, dispatch: _dispatch, lib: _lib }: Props) {
  return (
    <div className="h-full flex items-center justify-center">
      <p className="text-ash/40 text-sm">Step 3 — Output (placeholder)</p>
    </div>
  )
}
