import { supabase } from './supabaseClient'
import { productService } from './productService'

export const priceService = {
  // Ajouter un nouveau prix
  addPrice: async (priceData) => {
    const { productName, price, storeName, city, userId, imageUrl } = priceData

    // Vérifier si le produit existe, sinon le créer
    let product = await productService.checkProductExists(productName)
    if (!product) {
      product = await productService.createProduct(productName, imageUrl || null)
    } else if (imageUrl && !product.image_url) {
      // Mettre à jour l'image si le produit n'en a pas
      await supabase.from('products').update({ image_url: imageUrl }).eq('id', product.id)
    }

    // Vérifier si le magasin existe, sinon le créer
    let store = await priceService.checkStoreExists(storeName, city)
    if (!store) {
      store = await priceService.createStore(storeName, city)
    }

    const { data, error } = await supabase
      .from('prices')
      .insert([{
        product_id: product.id,
        store_id: store.id,
        price: parseFloat(price),
        user_id: userId,
        updated_at: new Date().toISOString()
      }])
      .select(`
        *,
        products!inner(name),
        stores!inner(name, city)
      `)
      .single()

    if (error) throw error
    return data
  },

  // Obtenir les prix pour un produit
  getPricesByProduct: async (productId, sortBy = 'price', sortOrder = 'asc', cityFilter = null) => {
    let query = supabase
      .from('prices')
      .select(`
        *,
        stores!inner(
          id,
          name,
          city,
          latitude,
          longitude
        )
      `)
      .eq('product_id', productId)

    if (cityFilter) {
      query = query.ilike('stores.city', `%${cityFilter}%`)
    }

    query = query.order(sortBy === 'price' ? 'price' : 'updated_at', { ascending: sortOrder === 'asc' })

    const { data, error } = await query
    if (error) throw error
    return data
  },

  // Mettre à jour un prix
  updatePrice: async (priceId, newPrice, userId) => {
    const { data, error } = await supabase
      .from('prices')
      .update({
        price: parseFloat(newPrice),
        user_id: userId,
        updated_at: new Date().toISOString()
      })
      .eq('id', priceId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Obtenir les prix ajoutés par un utilisateur
  getUserPrices: async (userId) => {
    const { data, error } = await supabase
      .from('prices')
      .select(`
        *,
        products!inner(name, image_url),
        stores!inner(name, city)
      `)
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })

    if (error) throw error
    return data
  },

  // Vérifier si un magasin existe
  checkStoreExists: async (storeName, city) => {
    const { data, error } = await supabase
      .from('stores')
      .select('id')
      .ilike('name', storeName)
      .ilike('city', city)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data
  },

  // Créer un nouveau magasin
  createStore: async (storeName, city) => {
    const { data, error } = await supabase
      .from('stores')
      .insert([{
        name: storeName,
        city: city,
        latitude: 0, // Valeurs par défaut, à mettre à jour avec la géolocalisation
        longitude: 0
      }])
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Obtenir tous les magasins pour la carte
  getAllStores: async () => {
    const { data, error } = await supabase
      .from('stores')
      .select('*')

    if (error) throw error
    return data
  },

  // Signaler un prix incorrect
  reportPrice: async (priceId, userId, reason) => {
    const { data, error } = await supabase
      .from('price_reports')
      .insert([{
        price_id: priceId,
        user_id: userId,
        reason: reason,
        created_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) throw error
    return data
  }
}
