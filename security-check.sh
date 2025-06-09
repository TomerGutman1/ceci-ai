#!/bin/bash

echo "🔍 Pre-upload Security Check..."

# Check for sensitive files
echo "Checking for sensitive files..."

if [ -f ".env" ] || [ -f ".env.local" ] || [ -f "server/.env" ] || [ -f "server/.env.local" ]; then
    echo "⚠️  WARNING: Found .env files! Make sure they are in .gitignore"
fi

# Check for API keys in code
echo "Scanning for exposed API keys..."
grep -r "sk-proj-" . --exclude-dir=node_modules --exclude-dir=.git --exclude="*.md" | grep -v ".env.example"

if [ $? -eq 0 ]; then
    echo "❌ FOUND EXPOSED API KEYS! Fix before uploading!"
else
    echo "✅ No exposed API keys found"
fi

# Check for Supabase keys
grep -r "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9" . --exclude-dir=node_modules --exclude-dir=.git --exclude="*.md" | grep -v ".env.example"

if [ $? -eq 0 ]; then
    echo "❌ FOUND EXPOSED SUPABASE KEYS! Fix before uploading!"
else
    echo "✅ No exposed Supabase keys found"
fi

echo "Check complete!"
