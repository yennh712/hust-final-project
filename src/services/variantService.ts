import { supabase } from '@/lib/supabase'

export const createVariant = async (payload: any) => {
  return await supabase.from('variants').insert([payload])
}

export const updateVariant = async (id: string, payload: any) => {
  return await supabase
    .from('variants')
    .update(payload)
    .eq('id', id)
}

export const deleteVariant = async (id: string) => {
  return await supabase
    .from('variants')
    .delete()
    .eq('id', id)
}