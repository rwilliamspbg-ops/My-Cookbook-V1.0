-- Database migrations for Stripe webhook integration
-- Run this to add webhook tracking and subscription fields to users table

-- Add Stripe subscription fields to users table if they don't exist
ALTER TABLE users ADD COLUMN stripe_customer_id TEXT UNIQUE;
ALTER TABLE users ADD COLUMN stripe_subscription_id TEXT;
ALTER TABLE users ADD COLUMN subscription_tier TEXT DEFAULT 'free';
ALTER TABLE users ADD COLUMN subscription_status TEXT DEFAULT 'inactive';
ALTER TABLE users ADD COLUMN subscription_start_date INTEGER;
ALTER TABLE users ADD COLUMN subscription_end_date INTEGER;

-- Create usage_tracking table if it doesn't exist
CREATE TABLE IF NOT EXISTS usage_tracking (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL UNIQUE,
  action_type TEXT NOT NULL, -- 'ai_parse', 'recipe_create', etc.
  month TEXT NOT NULL, -- Format: YYYY-MM
  count INTEGER DEFAULT 0,
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER DEFAULT (strftime('%s', 'now')),
  FOREIGN KEY (user_id) REFERENCES users(id),
  UNIQUE(user_id, action_type, month)
);

-- Create payment_history table for transaction logs
CREATE TABLE IF NOT EXISTS payment_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  stripe_event_id TEXT UNIQUE,
  event_type TEXT NOT NULL, -- 'checkout.session.completed', 'invoice.paid', etc.
  amount_paid INTEGER, -- in cents
  subscription_tier TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- 'success', 'failed', 'pending'
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create indices for common queries
CREATE INDEX IF NOT EXISTS idx_users_stripe_customer_id ON users(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_users_subscription_status ON users(subscription_status);
CREATE INDEX IF NOT EXISTS idx_usage_tracking_user_month ON usage_tracking(user_id, month);
CREATE INDEX IF NOT EXISTS idx_payment_history_user_id ON payment_history(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_history_stripe_event_id ON payment_history(stripe_event_id);
