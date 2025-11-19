#!/bin/bash
set -e

echo "Building TypeScript..."
npx tsc

echo "Copying static files..."
mkdir -p dist/popup dist/content
cp extension/popup/popup.html dist/popup/
cp extension/popup/popup.css dist/popup/
cp extension/manifest.json dist/
cp -r extension/icons dist/

echo "Build complete! Load the 'dist' folder in Chrome."
