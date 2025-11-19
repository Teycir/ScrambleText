#!/bin/bash
set -e

echo "Cleaning dist..."
rm -f dist/popup.html dist/popup.css

echo "Building TypeScript..."
npx tsc

echo "Copying static files..."
cp extension/popup/popup.html dist/popup/
cp extension/popup/popup.css dist/popup/
cp extension/manifest.json dist/
cp -r extension/icons dist/

echo "Build complete! Load the 'dist' folder in Chrome."
