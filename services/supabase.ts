import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xdcbidkgehpssmybuwdk.supabase.co';
const supabaseKey = 'sb_publishable_1brJ7Jeiu3SdgCWou3N2kg_p7dD8Iyd';

export const supabase = createClient(supabaseUrl, supabaseKey);