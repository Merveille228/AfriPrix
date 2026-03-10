import React, { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const TYPE_STYLE = {
  'Supermarché':  { color: '#3b82f6', bg: '#eff6ff', letter: 'S' },
  'Marché':       { color: '#10b981', bg: '#ecfdf5', letter: 'M' },
  'Pharmacie':    { color: '#f43f5e', bg: '#fff1f2', letter: 'P' },
  'Hôpital':      { color: '#06b6d4', bg: '#ecfeff', letter: 'H' },
  'Électronique': { color: '#8b5cf6', bg: '#f5f3ff', letter: 'E' },
  'E-commerce':   { color: '#f59e0b', bg: '#fffbeb', letter: 'J' },
}

const makeIcon = (type) => {
  const style = TYPE_STYLE[type] || { color: '#64748b', bg: '#f8fafc', letter: '' }
  return L.divIcon({
    className: '',
    html: `<div style="
      width:34px;height:34px;border-radius:50%;
      background:${style.bg};border:2.5px solid ${style.color};
      display:flex;align-items:center;justify-content:center;
      font-weight:700;font-size:13px;color:${style.color};
      box-shadow:0 2px 8px rgba(0,0,0,.18);
    ">${style.letter}</div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -20],
  })
}

const MapView = ({ stores, center = [6.1279, 1.2228], zoom = 12 }) => {
  const containerRef   = useRef(null)
  const mapRef         = useRef(null)
  const markersRef     = useRef([])

  /*  Initialisation Leaflet  */
  useEffect(() => {
    if (mapRef.current || !containerRef.current) return

    mapRef.current = L.map(containerRef.current, {
      center,
      zoom,
      zoomControl: true,
      scrollWheelZoom: true,
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: ' <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(mapRef.current)

    /* Fix tuiles grises dans les SPAs  force le recalcul de la taille */
    setTimeout(() => mapRef.current?.invalidateSize(), 100)

    return () => {
      mapRef.current?.remove()
      mapRef.current = null
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /*  Sync centre/zoom quand la ville change  */
  useEffect(() => {
    if (!mapRef.current) return
    mapRef.current.setView(center, zoom, { animate: true, duration: 0.6 })
  }, [center, zoom])

  /*  Mise à jour des marqueurs  */
  useEffect(() => {
    if (!mapRef.current) return

    markersRef.current.forEach(m => m.remove())
    markersRef.current = []

    if (!stores || stores.length === 0) return

    const bounds = []

    stores.forEach(store => {
      if (store.latitude == null || store.longitude == null) return

      const style       = TYPE_STYLE[store.type] || { color: '#64748b' }
      const quartierHtml = store.quartier
        ? `<div style="font-size:11px;color:#94a3b8;margin-top:1px;">${store.quartier}</div>`
        : ''
      const communityHtml = !store.isDefault
        ? `<span style="display:inline-block;background:#eef2ff;color:#4f46e5;font-size:10px;padding:1px 6px;border-radius:99px;font-weight:600;margin-top:4px;"> Communauté</span>`
        : ''

      const popup = L.popup({ maxWidth: 230 }).setContent(`
        <div style="font-family:system-ui,sans-serif;padding:4px 2px;">
          <div style="font-weight:700;font-size:14px;color:#1e293b;">${store.name}</div>
          <div style="font-size:12px;color:#64748b;margin-top:2px;">${store.city}</div>
          ${quartierHtml}
          <div style="margin-top:7px;display:flex;flex-wrap:wrap;gap:4px;align-items:center;">
            <span style="background:${style.color}18;color:${style.color};font-size:11px;padding:2px 8px;border-radius:99px;font-weight:600;border:1px solid ${style.color}40;">${store.type || 'Magasin'}</span>
            ${communityHtml}
          </div>
        </div>
      `)

      const marker = L.marker([store.latitude, store.longitude], {
        icon: makeIcon(store.type),
        title: store.name,
      }).bindPopup(popup).addTo(mapRef.current)

      markersRef.current.push(marker)
      bounds.push([store.latitude, store.longitude])
    })

    /* Ajuste la vue pour voir tous les marqueurs, sauf si la ville est déjà définie */
    if (bounds.length === 0) return
    if (bounds.length === 1) {
      mapRef.current.setView(bounds[0], 15, { animate: true })
    } else {
      mapRef.current.fitBounds(bounds, { padding: [48, 48], maxZoom: 14, animate: true })
    }
  }, [stores])

  return (
    <div style={{ height: '500px' }} className="w-full rounded-2xl overflow-hidden">
      <div ref={containerRef} className="w-full h-full" />
    </div>
  )
}

export default MapView