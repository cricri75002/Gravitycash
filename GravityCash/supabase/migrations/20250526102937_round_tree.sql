/*
  # Create transactions and accounts tables

  1. New Tables
    - `accounts`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `balance` (decimal)
      - `currency` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `transactions`
      - `id` (uuid, primary key)
      - `account_id` (uuid, references accounts)
      - `type` (text) - withdrawal, deposit, transfer
      - `method` (text) - card, iban, nfc, instant
      - `amount` (decimal)
      - `status` (text)
      - `reference` (text)
      - `created_at` (timestamp)
      - `metadata` (jsonb)

  2. Security
    - Enable RLS on both tables
    - Add policies for users to read their own data
    - Add policies for inserting transactions
*/

-- Create accounts table
CREATE TABLE IF NOT EXISTS accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  balance decimal NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'EUR',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT positive_balance CHECK (balance >= 0)
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id uuid REFERENCES accounts NOT NULL,
  type text NOT NULL CHECK (type IN ('withdrawal', 'deposit', 'transfer')),
  method text CHECK (method IN ('card', 'iban', 'nfc', 'instant')),
  amount decimal NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  reference text,
  created_at timestamptz DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb,
  CONSTRAINT valid_amount CHECK (amount != 0)
);

-- Enable RLS
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Accounts policies
CREATE POLICY "Users can view own accounts"
  ON accounts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Transactions policies
CREATE POLICY "Users can view own transactions"
  ON transactions
  FOR SELECT
  TO authenticated
  USING (
    account_id IN (
      SELECT id FROM accounts 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert transactions"
  ON transactions
  FOR INSERT
  TO authenticated
  WITH CHECK (
    account_id IN (
      SELECT id FROM accounts 
      WHERE user_id = auth.uid()
    )
  );

-- Function to process withdrawal
CREATE OR REPLACE FUNCTION process_withdrawal(
  p_account_id uuid,
  p_amount decimal,
  p_method text,
  p_reference text DEFAULT NULL,
  p_metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_transaction_id uuid;
BEGIN
  -- Check if account has sufficient balance
  IF NOT EXISTS (
    SELECT 1 FROM accounts 
    WHERE id = p_account_id 
    AND balance >= p_amount
  ) THEN
    RAISE EXCEPTION 'Insufficient funds';
  END IF;

  -- Create transaction
  INSERT INTO transactions (
    account_id,
    type,
    method,
    amount,
    status,
    reference,
    metadata
  ) VALUES (
    p_account_id,
    'withdrawal',
    p_method,
    p_amount,
    CASE 
      WHEN p_method = 'instant' THEN 'completed'
      ELSE 'pending'
    END,
    p_reference,
    p_metadata
  ) RETURNING id INTO v_transaction_id;

  -- Update account balance
  UPDATE accounts 
  SET 
    balance = balance - p_amount,
    updated_at = now()
  WHERE id = p_account_id;

  RETURN v_transaction_id;
END;
$$;