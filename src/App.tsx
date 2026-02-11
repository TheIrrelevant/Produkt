import { useWizardReducer } from './components/useWizardReducer'
import { WizardShell } from './components/WizardShell'
import { ErrorBoundary } from './components/ErrorBoundary'
import type { WizardStep } from './types/wizard'
import { WizardStep as WS } from './types/wizard'
import { isStepComplete, canNavigateToStep } from './engine/validation'
import { useLibrary } from './data/useLibrary'
import { StepReference } from './components/StepReference'
import { StepContext } from './components/StepContext'
import { StepOutput } from './components/StepOutput'

export default function App() {
  const [state, dispatch] = useWizardReducer()
  const lib = useLibrary()

  function handleNext() {
    if (state.currentStep < 2 && isStepComplete(state, state.currentStep)) {
      dispatch({ type: 'SET_STEP', step: (state.currentStep + 1) as WizardStep })
    }
  }

  function handleBack() {
    if (state.currentStep > 0) {
      dispatch({ type: 'SET_STEP', step: (state.currentStep - 1) as WizardStep })
    }
  }

  function handleStepClick(step: WizardStep) {
    if (canNavigateToStep(state, step)) {
      dispatch({ type: 'SET_STEP', step })
    }
  }

  function renderStep() {
    switch (state.currentStep) {
      case WS.Reference:
        return <StepReference state={state} dispatch={dispatch} />
      case WS.Context:
        return <StepContext state={state} dispatch={dispatch} lib={lib} />
      case WS.Output:
        return <StepOutput state={state} dispatch={dispatch} lib={lib} />
    }
  }

  return (
    <WizardShell
      state={state}
      onNext={handleNext}
      onBack={handleBack}
      onStepClick={handleStepClick}
    >
      <ErrorBoundary>
        {renderStep()}
      </ErrorBoundary>
    </WizardShell>
  )
}
