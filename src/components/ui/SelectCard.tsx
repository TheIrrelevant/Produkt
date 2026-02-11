interface SelectCardProps {
  label: string
  description?: string
  isSelected: boolean
  onClick: () => void
}

export function SelectCard({ label, description, isSelected, onClick }: SelectCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left px-4 py-3 rounded-default border transition-colors ${
        isSelected
          ? 'border-ash bg-ash/10 text-bone'
          : 'border-ash/20 text-ash/60 hover:border-ash/40 hover:text-bone'
      }`}
    >
      <span className="text-sm font-medium">{label}</span>
      {description && (
        <span className="block text-xs mt-0.5 text-ash/40 truncate">{description}</span>
      )}
    </button>
  )
}
