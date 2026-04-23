import { createPrintArea } from '@/services/printAreaService'

export const createPrintAreaController = async (data: any) => {
  const { error } = await createPrintArea(data)

  if (error) return { error }
  return { success: true }
}