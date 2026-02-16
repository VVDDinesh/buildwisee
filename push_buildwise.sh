#!/bin/bash

COMMIT_MSG="${1:-Update BuildWise project}"

echo "🚀 Starting BuildWise Git Push..."

git add .
if [ $? -ne 0 ]; then
  echo "❌ Failed to stage files"
  exit 1
fi

git commit -m "$COMMIT_MSG"
if [ $? -ne 0 ]; then
  echo "⚠️  Nothing to commit or commit failed"
fi

git push origin main
if [ $? -ne 0 ]; then
  echo "❌ Push failed"
  exit 1
fi

echo "✅ Successfully pushed to GitHub!"
echo ""
echo "📝 Latest commit:"
git log -1 --oneline
