#!/bin/bash

# AmAha Docusaurus Build & Deploy Script

echo "🔨 Building Docusaurus documentation..."
npm run build

if [ $? -ne 0 ]; then
  echo "❌ Build failed"
  exit 1
fi

echo "✅ Build successful"
echo ""
echo "📤 Deploying to Firebase..."
echo ""
echo "Deploy options:"
echo "1. Deploy to /docs path (amaha.app/docs)"
echo "2. Deploy to separate docs site"
echo ""
echo "Run one of:"
echo ""
echo "  Option 1 (main app at root, docs at /docs):"
echo "  firebase deploy --only hosting:main"
echo ""
echo "  Option 2 (docs only):"
echo "  firebase deploy --only hosting:docs"
echo ""
