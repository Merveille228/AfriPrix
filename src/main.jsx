import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

/* ── Appliquer le thème sauvegardé avant le premier rendu ── */
;(() => {
  const saved = localStorage.getItem('afriprix-theme') || 'system'
  if (saved === 'dark') {
    document.documentElement.classList.add('dark')
  } else if (saved === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.classList.add('dark')
  }
})()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
