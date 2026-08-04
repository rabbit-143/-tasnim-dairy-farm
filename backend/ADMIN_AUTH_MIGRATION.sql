-- Tasnim Dairy Farm Admin Authentication Migration
-- This script adds secure admin authentication with hashed passwords
-- Replaces hardcoded credentials with database-backed authentication

-- Admins Table - Secure credential storage
CREATE TABLE IF NOT EXISTS admins (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login_at TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_admins_username ON admins(username);
CREATE INDEX IF NOT EXISTS idx_admins_role ON admins(role);

-- Add constraint to ensure role is valid
ALTER TABLE admins 
ADD CONSTRAINT check_admin_role 
CHECK (role IN ('admin', 'super_admin'));

-- Migration complete
-- Next step: Run the seed script to create the first admin account
-- Command: npm run seed:admin