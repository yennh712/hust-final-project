import { createVariant, updateVariant } from '@/services/variantService'

export const createVariantController = async (data: any) => {
  const { error } = await createVariant(data)

  if (error) return { error }
  return { success: true }
}

export const updateVariantController = async (id: string, data: any) => {
  const { error } = await updateVariant(id, data)

  if (error) return { error }
  return { success: true }
}

import { deleteVariant } from '@/services/variantService'

export const deleteVariantController = async (id: string) => {
  const { error } = await deleteVariant(id)

  if (error) return { error }
  return { success: true }
}