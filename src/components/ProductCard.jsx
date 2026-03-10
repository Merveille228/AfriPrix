import React from 'react'
import { useNavigate } from 'react-router-dom'

const ProductCard = ({ product }) => {
  const navigate = useNavigate()

  if (!product) return null

  // Calculer le prix le plus bas
  const lowestPrice = product.prices && product.prices.length > 0 
    ? Math.min(...product.prices.map(p => p.price))
    : null

  const storeCount = product.prices ? product.prices.length : 0

  const handleViewDetails = () => {
    navigate(`/product/${product.id}`)
  }

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-4 border border-gray-200">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-900 capitalize">
          {product.name}
        </h3>
        {lowestPrice && (
          <span className="text-green-600 font-bold text-lg">
            {lowestPrice.toFixed(2)}€
          </span>
        )}
      </div>
      
      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
        <span className="flex items-center">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          {storeCount} magasin{storeCount > 1 ? 's' : ''}
        </span>
      </div>

      <button
        onClick={handleViewDetails}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium"
      >
        Voir détails
      </button>
    </div>
  )
}

export default ProductCard
