#!/bin/bash
# Setup script for TextLayer OCR Frontend with Supabase & Stripe

echo "🚀 Setting up TextLayer OCR Frontend..."
echo ""

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "📝 Creating .env.local from .env.example..."
    cp .env.example .env.local
    echo "✅ .env.local created"
    echo ""
    echo "⚠️  Please update .env.local with your credentials:"
    echo "   - VITE_SUPABASE_URL"
    echo "   - VITE_SUPABASE_ANON_KEY"
    echo "   - VITE_STRIPE_PUBLIC_KEY"
    echo "   - VITE_API_URL"
else
    echo "✅ .env.local already exists"
fi

echo ""
echo "📦 Installing dependencies..."
npm install

echo ""
echo "✨ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update your environment variables in .env.local"
echo "2. Start the dev server: npm run dev"
echo "3. Open http://localhost:5173 in your browser"
echo ""
echo "📚 For more information, see INTEGRATION_GUIDE.md"
