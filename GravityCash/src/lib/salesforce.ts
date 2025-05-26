import { supabase } from './supabase';

export async function fetchSalesforceData(action: 'getAccounts' | 'getTransactions') {
  const { data: { url } } = await supabase.functions.invoke('salesforce-sync', {
    body: { action }
  });
  
  if (!url) throw new Error('Failed to fetch Salesforce data');
  
  return url;
}

export async function syncAccountData() {
  const accounts = await fetchSalesforceData('getAccounts');
  return accounts;
}

export async function syncTransactionHistory() {
  const transactions = await fetchSalesforceData('getTransactions');
  return transactions;
}