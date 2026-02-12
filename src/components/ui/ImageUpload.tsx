import { useState, useRef, useCallback } from 'react'

const ACCEPT = 'image/jpeg,image/png,image/webp'

interface ImageUploadProps {
  preview: string | null
  onUpload: (file: File, preview: string) => void
  onClear: () => void
}

export function ImageUpload({ preview, onUpload, onClear }: ImageUploadProps) {
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.match(/^image\/(jpeg|png|webp)$/)) return
      if (preview) URL.revokeObjectURL(preview)
      const url = URL.createObjectURL(file)
      onUpload(file, url)
    },
    [onUpload, preview],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragging(false)
      const file = e.dataTransfer.files[0]
      if (file) handleFile(file)
    },
    [handleFile],
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) handleFile(file)
    },
    [handleFile],
  )

  // Preview state
  if (preview) {
    return (
      <div className="relative group rounded-card overflow-hidden bg-obsidian border border-ash/10">
        <img
          src={preview}
          alt="Product reference"
          className="w-full aspect-[4/3] object-contain"
        />
        <button
          type="button"
          onClick={onClear}
          className="absolute top-2 right-2 w-8 h-8 bg-obsidian/80 text-bone rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-sm"
        >
          ✕
        </button>
      </div>
    )
  }

  // Empty / drag state
  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`aspect-[4/3] flex flex-col items-center justify-center gap-3 rounded-card cursor-pointer transition-colors border border-dashed ${
        dragging ? 'border-ash bg-ash/5' : 'border-ash/30 hover:border-ash/50'
      }`}
    >
      <span className="text-3xl text-ash/40">↑</span>
      <p className="text-ash/60 text-sm">Drop product image here</p>
      <p className="text-ash/30 text-xs">or click to browse</p>
      <p className="text-ash/20 text-xs mt-1">JPG, PNG, WebP</p>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        onChange={handleChange}
        className="hidden"
      />
    </div>
  )
}
