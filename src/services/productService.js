import { supabase } from './supabaseClient'

export const productService = {
  // Uploader une image produit dans Supabase Storage
  // ⚠️ Créer le bucket "product-images" (public) dans Supabase Storage
  uploadProductImage: async (file) => {
    const ext  = file.name.split('.').pop()
    const name = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(name, file, { cacheControl: '3600', upsert: false })
    if (error) throw error
    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(data.path)
    return publicUrl
  },
  // Rechercher des produits par nom
  searchProducts: async (query) => {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        prices!inner(
          price,
          stores!inner(
            id,
            name,
            city
          )
        )
      `)
      .ilike('name', `%${query}%`)
      .limit(20)

    if (error) throw error
    return data
  },

  // Obtenir les produits populaires
  getPopularProducts: async () => {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        prices!inner(
          price,
          stores!inner(
            name,
            city
          )
        )
      `)
      .limit(10)

    if (error) throw error
    return data
  },

  // Obtenir un produit par son ID avec tous les prix
  getProductById: async (productId) => {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        prices!inner(
          id,
          price,
          updated_at,
          stores!inner(
            id,
            name,
            city,
            latitude,
            longitude
          )
        )
      `)
      .eq('id', productId)
      .single()

    if (error) throw error
    return data
  },

  // Créer un nouveau produit
  createProduct: async (productName, imageUrl = null) => {
    const row = { name: productName }
    if (imageUrl) row.image_url = imageUrl
    const { data, error } = await supabase
      .from('products')
      .insert([row])
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Vérifier si un produit existe
  checkProductExists: async (productName) => {
    const { data, error } = await supabase
      .from('products')
      .select('id')
      .ilike('name', productName)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data
  },

  // Obtenir tous les produits avec leurs meilleurs prix (page Marché)
  getAllProducts: async ({ search = '', category = null } = {}) => {
    let query = supabase
      .from('products')
      .select(`
        *,
        prices(
          id,
          price,
          stores(id, name, city)
        )
      `)
      .order('name')

    if (search) query = query.ilike('name', `%${search}%`)
    if (category) query = query.eq('category', category)

    const { data, error } = await query
    if (error) throw error
    return data || []
  },
}
