import { createClient } from 'npm:@supabase/supabase-js@2.39.7';
import { jsforce } from 'npm:jsforce@1.11.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const SALESFORCE_URL = 'https://ability-business-6526.lightning.force.com';
const SALESFORCE_USERNAME = Deno.env.get('SALESFORCE_USERNAME');
const SALESFORCE_PASSWORD = Deno.env.get('SALESFORCE_PASSWORD');
const SALESFORCE_TOKEN = Deno.env.get('SALESFORCE_TOKEN');

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const conn = new jsforce.Connection({
      loginUrl: SALESFORCE_URL
    });

    await conn.login(SALESFORCE_USERNAME, SALESFORCE_PASSWORD + SALESFORCE_TOKEN);

    const { action } = await req.json();

    let data;
    switch (action) {
      case 'getAccounts':
        data = await conn.query('SELECT Id, Name, Balance__c FROM Account');
        break;
      case 'getTransactions':
        data = await conn.query('SELECT Id, Amount__c, Type__c, Status__c FROM Transaction__c');
        break;
      default:
        throw new Error('Invalid action');
    }

    return new Response(
      JSON.stringify(data),
      { 
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    );
  }
});