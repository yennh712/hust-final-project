import { supabase } from '@/lib/supabase'

export const getProductsService = async () => {
  const { data: products, error } = await supabase.from('products').select('*')
  
  if (!products) return { data: null, error }
  
  // Fetch variants for each product to calculate min price
  const productsWithVariants = await Promise.all(
    products.map(async (product) => {
      const { data: variants } = await supabase
        .from('variants')
        .select('attributes')
        .eq('product_id', product.id)
      
      return {
        ...product,
        variants: variants || []
      }
    })
  )
  
  return { data: productsWithVariants, error }
}

export const getProductDetailService = async (productId: string) => {

  const { data: product, error: productError } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId)
    .single()

  const { data: variants, error: variantsError } = await supabase
    .from('variants')
    .select('*')
    .eq('product_id', productId)

  const { data: mockups, error: mockupsError } = await supabase
    .from('mockups')
    .select('*')
    .eq('product_id', productId)

  const mockupIds = mockups?.map(m => m.id) || []

  const { data: printAreas } = await supabase
    .from('print_areas')
    .select('*')
    .in('mockup_id', mockupIds)

  return {
    data: {
      product,
      variants,
      mockups,
      printAreas
    },
    errors: {
      productError,
      variantsError,
      mockupsError
    }
  }
}