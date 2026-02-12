import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export function PageLayout({ children }: Props) {
  return (
    <div className="min-h-screen flex flex-col bg-obsidian text-bone">
      <header className="px-4 sm:px-6 py-4 border-b border-ash/10">
        <div className="border-l-4 border-ash pl-3">
          <span className="text-ash font-black text-sm uppercase tracking-[4px]">
            Produkt
          </span>
          <span className="text-ash/30 text-[10px] ml-2">
            Product Context Engine v3.0
          </span>
        </div>
      </header>

      <main className="flex-1 overflow-auto px-4 sm:px-6">
        {children}
      </main>
    </div>
  )
}
