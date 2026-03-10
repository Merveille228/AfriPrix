import React, { useRef, useState } from 'react'
import { AnimatePresence, motion as Motion } from 'framer-motion'
import { FiUpload, FiX, FiImage } from 'react-icons/fi'

const MAX_SIZE_MB = 3

const ProductImageUpload = ({ onFile, existingUrl = null }) => {
  const [preview, setPreview] = useState(existingUrl)
  const [error, setError]     = useState('')
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef(null)

  const handle = (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Veuillez choisir une image (JPG, PNG, WEBP).')
      return
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`L'image ne doit pas dépasser ${MAX_SIZE_MB} Mo.`)
      return
    }
    setError('')
    const url = URL.createObjectURL(file)
    setPreview(url)
    onFile(file)
  }

  const clear = () => {
    setPreview(null)
    onFile(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="space-y-2">
      <AnimatePresence mode="wait">
        {preview ? (
          <Motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full aspect-video rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100"
          >
            <img src={preview} alt="Aperçu" className="w-full h-full object-contain" />
            <button
              type="button"
              onClick={clear}
              className="absolute top-2 right-2 w-7 h-7 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-colors"
            >
              <FiX className="w-4 h-4 text-slate-700" />
            </button>
          </Motion.div>
        ) : (
          <Motion.button
            key="dropzone"
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => { e.preventDefault(); setDragging(false); handle(e.dataTransfer.files[0]) }}
            className={`w-full aspect-video rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-3 transition-colors ${
              dragging ? 'border-indigo-400 bg-indigo-50' : 'border-slate-200 bg-slate-50 hover:border-indigo-300 hover:bg-indigo-50/40'
            }`}
          >
            <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center">
              <FiImage className="w-6 h-6 text-slate-400" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-slate-700">
                <span className="text-indigo-600">Choisir une photo</span> ou glisser ici
              </p>
              <p className="text-xs text-slate-400 mt-0.5">JPG, PNG, WEBP · max {MAX_SIZE_MB} Mo</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-white px-3 py-1.5 rounded-full border border-slate-100">
              <FiUpload className="w-3 h-3" />
              Optionnel — aide les autres à identifier le produit
            </div>
          </Motion.button>
        )}
      </AnimatePresence>

      {error && <p className="text-xs text-red-500 flex items-center gap-1">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handle(e.target.files[0])}
      />
    </div>
  )
}

export default ProductImageUpload
