import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { priceService } from '../services/priceService'

export const usePrices = () => {
  const queryClient = useQueryClient()

  // Obtenir les prix pour un produit
  const useProductPrices = (productId, sortBy = 'price', sortOrder = 'asc', cityFilter = null) => {
    return useQuery({
      queryKey: ['prices', productId, sortBy, sortOrder, cityFilter],
      queryFn: () => priceService.getPricesByProduct(productId, sortBy, sortOrder, cityFilter),
      enabled: !!productId,
      staleTime: 2 * 60 * 1000, // 2 minutes
    })
  }

  // Obtenir les prix de l'utilisateur
  const useUserPrices = (userId) => {
    return useQuery({
      queryKey: ['userPrices', userId],
      queryFn: () => priceService.getUserPrices(userId),
      enabled: !!userId,
      staleTime: 5 * 60 * 1000, // 5 minutes
    })
  }

  // Obtenir tous les magasins
  const useStores = () => {
    return useQuery({
      queryKey: ['stores'],
      queryFn: priceService.getAllStores,
      staleTime: 10 * 60 * 1000, // 10 minutes
    })
  }

  // Ajouter un prix
  const addPriceMutation = useMutation({
    mutationFn: priceService.addPrice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prices'] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['userPrices'] })
    },
  })

  // Mettre à jour un prix
  const updatePriceMutation = useMutation({
    mutationFn: ({ priceId, newPrice, userId }) => priceService.updatePrice(priceId, newPrice, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prices'] })
      queryClient.invalidateQueries({ queryKey: ['userPrices'] })
    },
  })

  // Signaler un prix
  const reportPriceMutation = useMutation({
    mutationFn: ({ priceId, userId, reason }) => priceService.reportPrice(priceId, userId, reason),
  })

  return {
    useProductPrices,
    useUserPrices,
    useStores,
    addPrice: addPriceMutation.mutate,
    addPriceAsync: addPriceMutation.mutateAsync,
    isAddingPrice: addPriceMutation.isPending,
    updatePrice: updatePriceMutation.mutate,
    isUpdatingPrice: updatePriceMutation.isPending,
    reportPrice: reportPriceMutation.mutate,
    isReportingPrice: reportPriceMutation.isPending,
  }
}
