import { supabase } from '@/lib/supabase'

export const getOrdersService = async () => {
  return await supabase.from('orders').select('*')
}

export const updateOrderStatusService = async (
  id: string,
  status: string,
  status_history: any
) => {
  return await supabase
    .from('orders')
    .update({
      status,
      status_history
    })
    .eq('id', id)
}

export const getOrderDetailService = async (id: string) => {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        product:products (
            *,
            mockups (*)
        ),
        variant:variants (*),
        design:designs (*)
      )
    `)
    .eq('id', id)
    .single()

  if (error) return { error }

  return {
    data: {
      order: data,
      items: data.order_items
    }
  }
}