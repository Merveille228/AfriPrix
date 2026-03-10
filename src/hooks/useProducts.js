import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { productService } from '../services/productService'

export const useProduct = (productId) => {
  return useQuery({
    queryKey: ['product', productId],
    queryFn: () => productService.getProductById(productId),
    enabled: !!productId,
    staleTime: 5 * 60 * 1000,
  })
}

// Hook pour la page Marché — tous les produits avec filtres
export const useAllProducts = (filters = {}) => {
  return useQuery({
    queryKey: ['products', 'all', filters],
    queryFn: () => productService.getAllProducts(filters),
    staleTime: 3 * 60 * 1000,
  })
}

export const useProducts = (searchTerm = '') => {
  const queryClient = useQueryClient()

  // Produits populaires (page d'accueil sans recherche)
  const searchProducts = useQuery({
    queryKey: ['products', 'popular'],
    queryFn: () => productService.getPopularProducts(),
    staleTime: 5 * 60 * 1000,
  })

  // Recherche réactive au searchTerm
  const searchProductsQuery = useQuery({
    queryKey: ['products', 'search', searchTerm],
    queryFn: () => productService.searchProducts(searchTerm),
    enabled: searchTerm.length > 0,
    staleTime: 2 * 60 * 1000,
  })

  // Créer un produit
  const createProductMutation = useMutation({
    mutationFn: productService.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })

  return {
    searchProducts,
    searchProductsQuery,
    useProduct,
    createProduct: createProductMutation.mutate,
    isCreating: createProductMutation.isPending,
  }
}
