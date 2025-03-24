#!/bin/bash

# Trade Arena Platform Deployment Script
# This script prepares and deploys the Trade Arena platform to Vercel

echo "=== Trade Arena Platform Deployment Script ==="
echo "Starting deployment at $(date)"
echo ""

# Install Vercel CLI if not already installed
echo "Checking for Vercel CLI..."
if ! command -v vercel &> /dev/null; then
  echo "Installing Vercel CLI..."
  npm install -g vercel
fi

# Build the project
echo "Building project..."
npm run build

# Check if build was successful
if [ ! -d "build" ]; then
  echo "Build failed. Please check for errors and try again."
  exit 1
fi

# Deploy to Vercel
echo "Deploying to Vercel..."
vercel --prod

echo ""
echo "Deployment completed at $(date)"
echo "=== End of Deployment Script ==="
