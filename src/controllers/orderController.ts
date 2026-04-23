import { getOrdersService, updateOrderStatusService, getOrderDetailService } from '@/services/orderService.ts'

export const getOrdersController = async () => {
  return await getOrdersService()
}

export const updateOrderStatusController = async (
  id: string,
  status: string,
  history: any
) => {
  return await updateOrderStatusService(id, status, history)
}

export const getOrderDetailController = async (id: string) => {
  return await getOrderDetailService(id)
}