import { supabase } from '@/lib/supabase'

export const getProductsService = async () => {
  return await supabase.from('products').select('*')
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

  return {
    data: {
      product,
      variants,
      mockups
    },
    errors: {
      productError,
      variantsError,
      mockupsError
    }
  }
}