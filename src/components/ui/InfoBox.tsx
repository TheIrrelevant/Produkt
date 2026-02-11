interface InfoBoxProps {
  items: Array<{ label: string; value: string }>
}

export function InfoBox({ items }: InfoBoxProps) {
  return (
    <div className="bg-ash/5 border border-ash/10 rounded-default p-4 flex flex-col gap-2">
      {items.map((item) => (
        <div key={item.label} className="flex items-baseline gap-3">
          <span className="text-ash/40 text-xs uppercase tracking-wider min-w-[70px]">
            {item.label}
          </span>
          <span className="text-bone text-sm">{item.value}</span>
        </div>
      ))}
    </div>
  )
}
