#!/bin/bash
# Clean up previous builds
rm -rf .next
rm -rf node_modules
rm -rf .turbo
rm -rf .vercel

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the project
echo "Building project..."
npm run build

echo "Build complete!"
