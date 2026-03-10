import React, { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import SearchBar from '../components/SearchBar'
import ProductCard from '../components/ProductCard'
import { useProducts } from '../hooks/useProducts'

const Home = () => {
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get('q')
  const { searchProducts, searchProductsQuery } = useProducts()
  
  const isSearchMode = !!searchQuery
  const { data: products, isLoading, error } = isSearchMode 
    ? searchProductsQuery
    : searchProducts

  useEffect(() => {
    if (searchQuery) {
      searchProductsQuery.refetch({ queryKey: ['products', 'search', searchQuery] })
    }
  }, [searchQuery, searchProductsQuery])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              AfriPrix - Comparez les prix locaux
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Trouvez les meilleurs prix pour vos produits préférés dans les magasins près de chez vous
            </p>
            <SearchBar />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isSearchMode && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Résultats pour "{searchQuery}"
            </h2>
          </div>
        )}

        {!isSearchMode && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Produits populaires
            </h2>
          </div>
        )}

        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Chargement...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="text-red-800">
              Une erreur est survenue: {error.message}
            </div>
          </div>
        )}

        {products && products.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {products && products.length === 0 && !isLoading && (
          <div className="text-center py-12 text-gray-500">
            {isSearchMode 
              ? `Aucun produit trouvé pour "${searchQuery}"`
              : 'Aucun produit disponible pour le moment.'
            }
          </div>
        )}
      </div>
    </div>
  )
}

export default Home
