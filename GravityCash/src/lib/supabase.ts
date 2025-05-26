import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function processWithdrawal(
  accountId: string,
  amount: number,
  method: 'card' | 'iban' | 'nfc' | 'instant',
  reference?: string,
  metadata: Record<string, any> = {}
) {
  const { data, error } = await supabase
    .rpc('process_withdrawal', {
      p_account_id: accountId,
      p_amount: amount,
      p_method: method,
      p_reference: reference,
      p_metadata: metadata
    });

  if (error) throw error;
  return data;
}