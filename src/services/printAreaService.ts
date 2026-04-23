import { supabase } from '@/lib/supabase'

export const createPrintArea = async (data: any) => {
  return await supabase
    .from('print_areas')
    .insert([data])
}