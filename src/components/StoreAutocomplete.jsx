import React, { useState, useRef, useEffect } from 'react'
import { FiMapPin, FiChevronDown, FiPlus } from 'react-icons/fi'
import { TOGO_STORES } from '../data/togoStores'

const TYPE_COLORS = {
  'Supermarché':  'bg-blue-50 text-blue-700 border-blue-100',
  'Marché':       'bg-emerald-50 text-emerald-700 border-emerald-100',
  'Pharmacie':    'bg-rose-50 text-rose-700 border-rose-100',
  'Électronique': 'bg-violet-50 text-violet-700 border-violet-100',
  'E-commerce':   'bg-amber-50 text-amber-700 border-amber-100',
}

const StoreAutocomplete = ({ value, onChange, placeholder = 'Nom du magasin…' }) => {
  const [open, setOpen]       = useState(false)
  const [query, setQuery]     = useState(value || '')
  const [prevValue, setPrevValue] = useState(value)
  const ref                   = useRef(null)

  // Fermer le dropdown en cliquant dehors
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Synchroniser query quand la prop value change (pattern React recommandé)
  if (prevValue !== value) {
    setPrevValue(value)
    setQuery(value || '')
  }

  const filtered = query.trim().length > 0
    ? TOGO_STORES.filter(s =>
        s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.city.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8)
    : TOGO_STORES.slice(0, 6)

  const select = (store) => {
    setQuery(store.name)
    onChange({ name: store.name, city: store.city, lat: store.lat, lng: store.lng })
    setOpen(false)
  }

  const handleInput = (e) => {
    setQuery(e.target.value)
    onChange({ name: e.target.value, city: '' })
    setOpen(true)
  }

  return (
    <div ref={ref} className="relative">
      <div className="relative">
        <FiMapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={handleInput}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-3 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white shadow-sm"
        />
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
        >
          <FiChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {open && (
        <div className="absolute z-50 mt-1.5 w-full bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
          {query.trim().length === 0 && (
            <div className="px-3 py-2 text-xs text-slate-400 font-medium border-b border-slate-100">
              Magasins populaires au Togo
            </div>
          )}

          <ul className="max-h-60 overflow-y-auto py-1">
            {filtered.map((store) => (
              <li key={`${store.name}-${store.city}`}>
                <button
                  type="button"
                  onClick={() => select(store)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 text-left transition-colors"
                >
                  <FiMapPin className="w-4 h-4 text-slate-400 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-800 truncate">{store.name}</div>
                    <div className="text-xs text-slate-400">{store.city}</div>
                  </div>
                  <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full border font-medium ${TYPE_COLORS[store.type] || 'bg-slate-50 text-slate-600 border-slate-100'}`}>
                    {store.type}
                  </span>
                </button>
              </li>
            ))}

            {/* Option "nouveau magasin" */}
            {query.trim().length > 0 && !TOGO_STORES.find(s => s.name.toLowerCase() === query.toLowerCase()) && (
              <li>
                <button
                  type="button"
                  onClick={() => { onChange({ name: query, city: '' }); setOpen(false) }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-indigo-50 text-left transition-colors border-t border-slate-100"
                >
                  <FiPlus className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span className="text-sm text-indigo-600 font-medium">
                    Ajouter "{query}" comme nouveau magasin
                  </span>
                </button>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  )
}

export default StoreAutocomplete
