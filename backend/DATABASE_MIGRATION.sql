-- Tasnim Dairy Farm Production Database Schema
-- This script creates all tables for PostgreSQL (Neon)
-- Run this in Neon's SQL Editor or psql

-- Founders Table
CREATE TABLE IF NOT EXISTS founders (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  responsibilities JSONB DEFAULT '[]'::jsonb,
  image TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Blogs Table
CREATE TABLE IF NOT EXISTS blogs (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  date TEXT NOT NULL,
  image TEXT,
  seoTitle TEXT,
  metaDescription TEXT,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Gallery Table
CREATE TABLE IF NOT EXISTS gallery (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Farm Images', 'Cattle Images', 'Production Images', 'Events')),
  image TEXT NOT NULL,
  date TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Careers Table
CREATE TABLE IF NOT EXISTS careers (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL UNIQUE,
  department TEXT NOT NULL,
  vacancy INTEGER NOT NULL CHECK (vacancy > 0),
  deadline TEXT NOT NULL,
  requirements JSONB DEFAULT '[]'::jsonb,
  applyEmail TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Settings Table
CREATE TABLE IF NOT EXISTS settings (
  id SERIAL PRIMARY KEY,
  siteName TEXT NOT NULL,
  tagline TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  mapEmbed TEXT,
  facebook TEXT,
  instagram TEXT,
  whatsapp TEXT,
  youtube TEXT,
  linkedin TEXT,
  aboutContent TEXT,
  vision TEXT,
  mission JSONB DEFAULT '[]'::jsonb,
  visitors INTEGER DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contact Messages Table
CREATE TABLE IF NOT EXISTS contact_messages (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_blogs_category ON blogs(category);
CREATE INDEX IF NOT EXISTS idx_blogs_featured ON blogs(featured);
CREATE INDEX IF NOT EXISTS idx_gallery_category ON gallery(category);
CREATE INDEX IF NOT EXISTS idx_careers_active ON careers(active);
CREATE INDEX IF NOT EXISTS idx_contact_is_read ON contact_messages(is_read);

-- Insert default settings (only on first creation)
INSERT INTO settings (id, siteName, tagline, phone, email, address, mapEmbed, facebook, instagram, whatsapp, youtube, linkedin, aboutContent, vision, mission)
VALUES (
  1,
  'Tasnim Dairy Farm',
  'Pure Milk, Pure Promise',
  '+880 1700-000000',
  'info@tasnimdairyfarm.com',
  'Tasnim Dairy Farm Complex, Dhaka, Bangladesh',
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.902139408672!2d90.39919931498205!3d23.750945884591076!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8b087026b81%3A0x8fa563bbdd5904c2!2sDhaka!5e0!3m2!1sen!2sbd!4v1614930164854!5m2!1sen!2sbd',
  'https://facebook.com/tasnim-dairy-farm',
  'https://instagram.com/tasnim-dairy-farm',
  'https://wa.me/8801700000000',
  'https://youtube.com/@tasnim-dairy-farm',
  'https://linkedin.com/company/tasnim-dairy-farm',
  'Tasnim Dairy Farm was established on 14 February 2026 by four passionate founders with a vision to produce pure, safe, and high-quality milk while contributing to food security and sustainable agriculture.',
  'To become one of the most trusted dairy farms in Bangladesh and establish a globally recognized dairy supply network delivering pure milk to international markets.',
  '["Produce healthy and pure milk", "Maintain the highest farm hygiene standards", "Ensure animal welfare and ethical treatment", "Create meaningful employment opportunities", "Support sustainable agricultural practices", "Expand production capacity steadily", "Reach global dairy markets"]'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- Insert default founders (only on first creation)
INSERT INTO founders (name, role, responsibilities, image)
VALUES 
  ('Mobasshera Sultana', 'CEO & Founder', '["Strategic Leadership", "Farm Management", "Growth Planning"]'::jsonb, NULL),
  ('Johirul Islam', 'Co-Founder', '["Operations", "Expansion Planning", "Resource Management"]'::jsonb, NULL),
  ('Rakibul Hasan Rahat', 'Founder & Marketing Lead', '["Branding", "Marketing", "Public Relations"]'::jsonb, NULL),
  ('Anjhum Akter', 'Founder & Accountant', '["Financial Management", "Accounting", "Budget Planning"]'::jsonb, NULL)
ON CONFLICT DO NOTHING;
