import { getProductsService } from '@/services/productService.ts'
import { getProductDetailService } from '@/services/productService.ts'

export const getProductsController = async () => {
  const { data, error } = await getProductsService()
  return { data, error }
}

export const getProductDetailController = async (productId: string) => {
  return await getProductDetailService(productId)
}