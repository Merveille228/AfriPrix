import React, { useState } from 'react'

const PriceList = ({ prices, onReportPrice, onUpdatePrice, user }) => {
  const [sortBy, setSortBy] = useState('price')
  const [sortOrder, setSortOrder] = useState('asc')
  const [cityFilter, setCityFilter] = useState('')

  if (!prices || prices.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Aucun prix trouvé pour ce produit.
      </div>
    )
  }

  // Filtrer par ville
  const filteredPrices = cityFilter
    ? prices.filter(price => 
        price.stores.city.toLowerCase().includes(cityFilter.toLowerCase())
      )
    : prices

  // Trier les prix
  const sortedPrices = [...filteredPrices].sort((a, b) => {
    let aValue, bValue
    
    if (sortBy === 'price') {
      aValue = a.price
      bValue = b.price
    } else if (sortBy === 'date') {
      aValue = new Date(a.updated_at)
      bValue = new Date(b.updated_at)
    } else {
      return 0
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <div className="space-y-4">
      {/* Filtres et tri */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trier par
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => handleSort('price')}
                className={`px-3 py-1 rounded-md text-sm ${
                  sortBy === 'price' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 border border-gray-300'
                }`}
              >
                Prix {sortBy === 'price' && (sortOrder === 'asc' ? '↑' : '↓')}
              </button>
              <button
                onClick={() => handleSort('date')}
                className={`px-3 py-1 rounded-md text-sm ${
                  sortBy === 'date' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 border border-gray-300'
                }`}
              >
                Date {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
              </button>
            </div>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filtrer par ville
            </label>
            <input
              type="text"
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              placeholder="Entrez une ville..."
              className="w-full px-3 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Liste des prix */}
      <div className="space-y-2">
        {sortedPrices.map((price) => (
          <div
            key={price.id}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">{price.stores.name}</h4>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {price.stores.city}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      {price.price.toFixed(2)}€
                    </div>
                    <div className="text-xs text-gray-500">
                      Mis à jour le {formatDate(price.updated_at)}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    Ajouté par {price.users.email}
                  </span>
                  <div className="flex gap-2">
                    {user && (
                      <>
                        <button
                          onClick={() => onUpdatePrice(price.id)}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => onReportPrice(price.id)}
                          className="text-sm text-red-600 hover:text-red-800"
                        >
                          Signaler
                        </button>
                      </>
                    )}
                    <button
                      className="text-sm text-gray-600 hover:text-gray-800"
                    >
                      Contacter
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredPrices.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Aucun prix trouvé pour les filtres sélectionnés.
        </div>
      )}
    </div>
  )
}

export default PriceList
