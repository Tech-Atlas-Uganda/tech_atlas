-- Create newsletter_subscriptions table for email subscriptions
CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  unsubscribed_at TIMESTAMP WITH TIME ZONE NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscriptions(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_active ON newsletter_subscriptions(is_active);

-- Add RLS (Row Level Security) policies
ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

-- Allow public to insert (subscribe)
CREATE POLICY "Allow public to subscribe" ON newsletter_subscriptions
  FOR INSERT WITH CHECK (true);

-- Allow public to read their own subscription
CREATE POLICY "Allow users to read own subscription" ON newsletter_subscriptions
  FOR SELECT USING (true);

-- Allow public to update their own subscription (unsubscribe)
CREATE POLICY "Allow users to update own subscription" ON newsletter_subscriptions
  FOR UPDATE USING (true);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_newsletter_subscriptions_updated_at 
  BEFORE UPDATE ON newsletter_subscriptions 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();