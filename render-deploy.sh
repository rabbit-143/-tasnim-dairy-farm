#!/bin/bash
# Render Deployment Script for Tasnim Dairy Farm

# This script helps with initial Render deployment setup
# Run it locally before pushing to GitHub

echo "=================================================="
echo "Tasnim Dairy Farm - Render Deployment Setup"
echo "=================================================="
echo ""

# Check if required files exist
echo "Checking required files..."
if [ ! -f "backend/Procfile" ]; then
  echo "✗ Missing: backend/Procfile"
  exit 1
fi

if [ ! -f "backend/package.json" ]; then
  echo "✗ Missing: backend/package.json"
  exit 1
fi

if [ ! -f "backend/DATABASE_MIGRATION.sql" ]; then
  echo "✗ Missing: backend/DATABASE_MIGRATION.sql"
  exit 1
fi

echo "✓ All required files found"
echo ""

echo "Step 1: Create Neon PostgreSQL Database"
echo "  1. Go to https://neon.tech"
echo "  2. Create a new project named 'tasnim-dairy-farm-prd'"
echo "  3. Copy the CONNECTION STRING"
echo "  4. Run the SQL migration script from DATABASE_MIGRATION.sql"
echo ""

echo "Step 2: Deploy Backend on Render"
echo "  1. Go to https://render.com"
echo "  2. Create a NEW WEB SERVICE"
echo "  3. Connect your GitHub repository"
echo "  4. Use these settings:"
echo "     - Name: tasnim-dairy-farm-api"
echo "     - Build Command: cd backend && npm install"
echo "     - Start Command: cd backend && npm start"
echo "     - Root Directory: (leave blank)"
echo ""

echo "Step 3: Add Environment Variables on Render"
echo "  Add these environment variables in Render dashboard:"
echo "  - NODE_ENV: production"
echo "  - DATABASE_URL: (paste your Neon connection string)"
echo "  - CORS_ORIGIN: (your Netlify domain)"
echo ""

echo "Step 4: Deploy Frontend on Netlify"
echo "  1. Go to https://netlify.com"
echo "  2. Add new site → Import existing project"
echo "  3. Connect GitHub repository"
echo "  4. Build settings:"
echo "     - Build command: npm run build"
echo "     - Publish directory: dist"
echo ""

echo "Step 5: Add Environment Variable on Netlify"
echo "  - Key: VITE_API_BASE_URL"
echo "  - Value: (your Render API URL)"
echo ""

echo "=================================================="
echo "All files are ready for deployment!"
echo "Next: Push to GitHub and the services will auto-deploy"
echo "=================================================="
