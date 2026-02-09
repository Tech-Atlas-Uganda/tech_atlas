#!/bin/bash

echo "🚀 Tech Atlas - Railway Deployment Script"
echo "=========================================="
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo "📦 Initializing git repository..."
    git init
fi

# Check if remote exists
if ! git remote | grep -q origin; then
    echo "❓ Enter your GitHub repository URL:"
    read REPO_URL
    git remote add origin $REPO_URL
fi

# Add all files
echo "📝 Adding files to git..."
git add .

# Commit
echo "💾 Committing changes..."
git commit -m "Deploy to Railway - $(date +%Y-%m-%d)"

# Push to GitHub
echo "⬆️  Pushing to GitHub..."
git push -u origin main

echo ""
echo "✅ Code pushed to GitHub!"
echo ""
echo "📋 Next Steps:"
echo "1. Go to https://railway.app"
echo "2. Click 'New Project'"
echo "3. Select 'Deploy from GitHub repo'"
echo "4. Choose your tech-atlas repository"
echo "5. Add environment variables (see RAILWAY_DEPLOYMENT.md)"
echo "6. Deploy!"
echo ""
echo "📖 Full guide: See RAILWAY_DEPLOYMENT.md"
