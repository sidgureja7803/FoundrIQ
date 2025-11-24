#!/bin/bash

# Test local server before deploying
echo "🧪 Testing FoundrIQ Backend Locally"
echo "===================================="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found in server directory"
    echo "   Copy .env.example to .env and fill in your credentials"
    exit 1
fi

echo "✅ .env file found"
echo ""

# Check if node_modules exists
if [ ! -d node_modules ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo "✅ Dependencies installed"
echo ""

# Start server
echo "🚀 Starting server on http://localhost:5000"
echo "   Press Ctrl+C to stop"
echo ""

npm start
