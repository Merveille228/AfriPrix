import React, { useState, useMemo } from 'react'
import { motion as Motion } from 'framer-motion'
import { FiMapPin, FiSearch, FiFilter } from 'react-icons/fi'
import { usePrices } from '../hooks/usePrices'
import MapView from '../components/MapView'
import { TOGO_STORES } from '../data/togoStores'

/*  Conversion des données de référence  */
const DEFAULT_MAP_STORES = TOGO_STORES.filter(s => s.lat && s.lng).map((s, i) => ({
  id: `default-${i}`,
  name: s.name,
  city: s.city,
  quartier: s.quartier || '',
  type: s.type,
  latitude: s.lat,
  longitude: s.lng,
  isDefault: true,
}))

/*  Constantes UI  */
const TYPE_COLORS = {
  'Supermarché':  { chip: 'bg-blue-50 text-blue-700 border-blue-200',         dot: '#3b82f6' },
  'Marché':       { chip: 'bg-emerald-50 text-emerald-700 border-emerald-200',  dot: '#10b981' },
  'Pharmacie':    { chip: 'bg-rose-50 text-rose-700 border-rose-200',         dot: '#f43f5e' },
  'Hôpital':      { chip: 'bg-cyan-50 text-cyan-700 border-cyan-200',          dot: '#06b6d4' },
  'Électronique': { chip: 'bg-violet-50 text-violet-700 border-violet-200',   dot: '#8b5cf6' },
  'E-commerce':   { chip: 'bg-amber-50 text-amber-700 border-amber-200',      dot: '#f59e0b' },
}

const CITIES = [
  'Toutes',
  'Lomé', 'Tsévié', 'Aného', 'Vogan', 'Tabligbo',
  'Notsé', 'Atakpamé', 'Kpalimé', 'Badou',
  'Sokodé', 'Sotouboua', 'Tchamba',
  'Kara', 'Bassar', 'Bafilo',
  'Dapaong', 'Mango',
]
const TYPES  = ['Tous', 'Supermarché', 'Marché', 'Pharmacie', 'Hôpital', 'Électronique', 'E-commerce']

const CITY_VIEW = {
  'Lomé':      { center: [6.1279, 1.2228], zoom: 13 },
  'Tsévié':    { center: [6.4268, 1.2148], zoom: 14 },
  'Aného':     { center: [6.2340, 1.5950], zoom: 14 },
  'Vogan':     { center: [6.3167, 1.5333], zoom: 14 },
  'Tabligbo':  { center: [6.5667, 1.5000], zoom: 14 },
  'Notsé':     { center: [6.9500, 1.1833], zoom: 14 },
  'Atakpamé':  { center: [7.5333, 1.1333], zoom: 14 },
  'Kpalimé':   { center: [6.8999, 0.6239], zoom: 14 },
  'Badou':     { center: [7.5843, 0.5897], zoom: 14 },
  'Sokodé':    { center: [8.9833, 1.1333], zoom: 14 },
  'Sotouboua': { center: [8.5667, 0.9833], zoom: 14 },
  'Tchamba':   { center: [9.0333, 1.4333], zoom: 14 },
  'Kara':      { center: [9.5510, 1.1840], zoom: 14 },
  'Bassar':    { center: [9.2500, 0.7833], zoom: 14 },
  'Bafilo':    { center: [9.3500, 1.2667], zoom: 14 },
  'Dapaong':   { center: [10.8667, 0.2000], zoom: 14 },
  'Mango':     { center: [10.3594, 0.4697], zoom: 14 },
}

const MapPage = () => {
  const { useStores } = usePrices()
  const { data: dbStores } = useStores()

  const [search,     setSearch]     = useState('')
  const [activeCity, setActiveCity] = useState('Toutes')
  const [activeType, setActiveType] = useState('Tous')

  const allStores = useMemo(() => {
    const dbNames = new Set((dbStores || []).map(s => s.name?.toLowerCase()))
    const defaults = DEFAULT_MAP_STORES.filter(s => !dbNames.has(s.name.toLowerCase()))
    return [...(dbStores || []), ...defaults]
  }, [dbStores])

  const filtered = useMemo(() => {
    return allStores.filter(s => {
      const matchCity   = activeCity === 'Toutes' || s.city === activeCity
      const matchType   = activeType === 'Tous'   || s.type === activeType
      const q           = search.toLowerCase()
      const matchSearch = !q ||
        s.name?.toLowerCase().includes(q) ||
        s.city?.toLowerCase().includes(q) ||
        s.quartier?.toLowerCase().includes(q)
      return matchCity && matchType && matchSearch
    })
  }, [allStores, activeCity, activeType, search])

  const mapStores  = filtered.filter(s => s.latitude && s.longitude)
  const mapView    = activeCity !== 'Toutes' ? CITY_VIEW[activeCity] : { center: [8.0, 1.2], zoom: 7 }
  const communityN = (dbStores || []).filter(s => s.latitude && s.longitude).length

  const cityCount = (city) => city === 'Toutes'
    ? allStores.length
    : allStores.filter(s => s.city === city).length

  return (
    <div className="min-h-screen bg-slate-50 pt-16">

      {/*  En-tête */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7">
          <Motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
                <FiMapPin className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Carte des magasins  Togo</h1>
                <p className="text-sm text-slate-500 mt-0.5">
                  {allStores.length} magasins répertoriés
                  {communityN > 0 && (
                    <span className="ml-1 text-indigo-600 font-medium">
                      dont {communityN} ajouté{communityN > 1 ? 's' : ''} par la communauté
                    </span>
                  )}
                </p>
              </div>
            </div>
          </Motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">

        {/*  Filtres */}
        <Motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-3"
        >
          <div className="relative">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher un magasin, un quartier"
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
            />
          </div>

          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <FiMapPin className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Ville</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {CITIES.map(city => (
                <button
                  key={city}
                  onClick={() => setActiveCity(city)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    activeCity === city
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
                  }`}
                >
                  {city} <span className={activeCity === city ? 'text-indigo-200' : 'text-slate-400'}>({cityCount(city)})</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <FiFilter className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Type</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {TYPES.map(type => {
                const style = TYPE_COLORS[type]
                return (
                  <button
                    key={type}
                    onClick={() => setActiveType(type)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      activeType === type
                        ? (style ? style.chip + ' shadow-sm' : 'bg-slate-700 text-white border-slate-700')
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {type}
                  </button>
                )
              })}
            </div>
          </div>
        </Motion.div>

        {/*  Légende */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 px-1">
          {Object.entries(TYPE_COLORS).map(([type, style]) => (
            <div key={type} className="flex items-center gap-1.5">
              <span
                className="inline-block w-3 h-3 rounded-full border-2"
                style={{ borderColor: style.dot, background: style.dot + '25' }}
              />
              <span className="text-xs text-slate-500">{type}</span>
            </div>
          ))}
        </div>

        {/*  Carte */}
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden"
        >
          <MapView stores={mapStores} center={mapView.center} zoom={mapView.zoom} />
        </Motion.div>

        {/*  Résultat */}
        <div className="flex items-center justify-between px-1">
          <p className="text-sm text-slate-500">
            <span className="font-semibold text-slate-800">{filtered.length}</span> magasin{filtered.length > 1 ? 's' : ''} affiché{filtered.length > 1 ? 's' : ''}
          </p>
          {(search || activeCity !== 'Toutes' || activeType !== 'Tous') && (
            <button
              onClick={() => { setSearch(''); setActiveCity('Toutes'); setActiveType('Tous') }}
              className="text-xs text-indigo-600 hover:underline"
            >
              Réinitialiser les filtres
            </button>
          )}
        </div>

        {/*  Grille */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pb-10">
            {filtered.map(store => {
              const typeStyle = TYPE_COLORS[store.type]
              return (
                <Motion.div
                  key={store.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`bg-white rounded-2xl border p-4 shadow-sm hover:shadow-md transition-shadow ${
                    store.isDefault ? 'border-slate-100' : 'border-indigo-100'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-base font-bold"
                      style={{ background: typeStyle ? typeStyle.dot + '18' : '#f1f5f9', color: typeStyle?.dot || '#64748b' }}
                    >
                      {store.type === 'Supermarché'  ? 'S' :
                       store.type === 'Marché'        ? 'M' :
                       store.type === 'Pharmacie'     ? 'P' :
                       store.type === 'Hôpital'       ? 'H' :
                       store.type === 'Électronique'  ? 'E' :
                       store.type === 'E-commerce'    ? 'J' : '•'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-slate-800 truncate">{store.name}</div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {store.city}{store.quartier ? `  ${store.quartier}` : ''}
                      </div>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        {store.type && (
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${typeStyle?.chip || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                            {store.type}
                          </span>
                        )}
                        {!store.isDefault && (
                          <span className="text-xs text-indigo-600 font-medium"> Communauté</span>
                        )}
                      </div>
                    </div>
                  </div>
                </Motion.div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-16 text-slate-400">
            <FiMapPin className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="font-medium">Aucun magasin trouvé</p>
            <p className="text-sm mt-1">Essayez d&apos;autres filtres</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default MapPage