import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import app from './app.js';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;

import Product from './models/Product.js';

async function seedProducts() {
  const products = await Product.find({});
  
  // Only seed if the database is completely empty
  if (products.length === 0) {
    console.log('Seeding initial sample products...');
    const sampleProducts = [
      {
        name: 'Premium Cotton White Tee',
        description: 'A high-quality, 100% organic cotton white t-shirt. Perfect for everyday wear.',
        price: 2499,
        stock: 100,
        category: 'Fashion',
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop',
      },
      {
        name: 'Vintage Denim Jacket',
        description: 'Classic blue denim jacket with a vintage wash. Durable and timeless.',
        price: 7199,
        stock: 50,
        category: 'Fashion',
        image: 'https://images.unsplash.com/photo-1576905341935-5f1105df4365?q=80&w=800&auto=format&fit=crop',
      },
      {
        name: 'Elite Running Shoes',
        description: 'Lightweight and breathable running shoes with advanced cushioning technology.',
        price: 10399,
        stock: 30,
        category: 'Footwear',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop',
      },
      {
        name: 'Handcrafted Leather Wallet',
        description: 'Genuine leather wallet with a slim profile and RFID protection.',
        price: 3999,
        stock: 80,
        category: 'Accessories',
        image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=800&auto=format&fit=crop',
      },
      {
        name: 'Noise-Cancelling Headphones',
        description: 'Immersive sound quality with active noise cancellation and 40-hour battery life.',
        price: 19999,
        stock: 25,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop',
      },
      {
        name: 'Modern Smart Watch',
        description: 'Track your fitness, heart rate, and notifications with this sleek smart watch.',
        price: 15999,
        stock: 40,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop',
      },
      {
        name: 'Minimalist Urban Backpack',
        description: 'Water-resistant backpack with a dedicated laptop compartment and ergonomic design.',
        price: 6399,
        stock: 60,
        category: 'Accessories',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb94c6a62?q=80&w=800&auto=format&fit=crop',
      },
      {
        name: 'Essential Cotton Hoodie',
        description: 'Soft and cozy hoodie made from premium cotton blend. Ideal for layering.',
        price: 4799,
        stock: 70,
        category: 'Fashion',
        image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop',
      },
      {
        name: 'Professional DSLR Camera',
        description: 'Capture stunning photos and videos with this high-resolution DSLR camera.',
        price: 71999,
        stock: 15,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800&auto=format&fit=crop',
      },
      {
        name: 'Sleek Ultrabook Laptop',
        description: 'Powerful and portable ultrabook with a stunning display and long battery life.',
        price: 95999,
        stock: 20,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=800&auto=format&fit=crop',
      },
      {
        name: 'Wireless Gaming Mouse',
        description: 'Ultra-fast and responsive wireless gaming mouse with customizable RGB lighting.',
        price: 5599,
        stock: 50,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?q=80&w=800&auto=format&fit=crop',
      },
      {
        name: 'Mechanical Gaming Keyboard',
        description: 'Durable mechanical keyboard with tactile switches and per-key RGB backlighting.',
        price: 10399,
        stock: 35,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?q=80&w=800&auto=format&fit=crop',
      },
      {
        name: 'Portable Bluetooth Speaker',
        description: 'Compact and waterproof Bluetooth speaker with rich bass and 360-degree sound.',
        price: 3999,
        stock: 100,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1608156639585-34a0a56ee6c9?q=80&w=800&auto=format&fit=crop',
      },
      {
        name: 'Ergonomic Office Chair',
        description: 'Comfortable office chair with lumbar support and adjustable armrests.',
        price: 15999,
        stock: 25,
        category: 'Home',
        image: 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?q=80&w=800&auto=format&fit=crop',
      },
      {
        name: 'Designer Sunglasses',
        description: 'Stylish and polarized sunglasses with UV protection and a lightweight frame.',
        price: 11999,
        stock: 45,
        category: 'Accessories',
        image: 'https://images.unsplash.com/photo-1511499767390-a7335958beba?q=80&w=800&auto=format&fit=crop',
      },
      {
        name: 'Stainless Steel Water Bottle',
        description: 'Insulated water bottle that keeps drinks cold for 24 hours or hot for 12 hours.',
        price: 1999,
        stock: 150,
        category: 'Home',
        image: 'https://images.unsplash.com/photo-1602143393494-721d002d3405?q=80&w=800&auto=format&fit=crop',
      },
      {
        name: 'Yoga Mat with Carry Strap',
        description: 'Non-slip yoga mat with extra cushioning for a comfortable workout session.',
        price: 3199,
        stock: 60,
        category: 'Fitness',
        image: 'https://images.unsplash.com/photo-1592432676556-28456530adff?q=80&w=800&auto=format&fit=crop',
      },
      {
        name: 'Electric Coffee Grinder',
        description: 'Precision burr grinder for the perfect coffee grounds every time.',
        price: 6399,
        stock: 30,
        category: 'Home',
        image: 'https://images.unsplash.com/photo-1585515320310-259814833e62?q=80&w=800&auto=format&fit=crop',
      },
      {
        name: 'Ceramic Pour-Over Coffee Maker',
        description: 'Elegant ceramic dripper for brewing delicious pour-over coffee at home.',
        price: 2799,
        stock: 40,
        category: 'Home',
        image: 'https://images.unsplash.com/photo-1544787210-228394c3d3e2?q=80&w=800&auto=format&fit=crop',
      },
      {
        name: 'Smart Home Security Camera',
        description: 'Keep an eye on your home with this 1080p smart security camera with night vision.',
        price: 4799,
        stock: 50,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1557324232-b8917d3c3dcb?q=80&w=800&auto=format&fit=crop',
      },
      {
        name: 'Adjustable Dumbbell Set',
        description: 'Versatile dumbbell set that allows you to easily adjust the weight for your workouts.',
        price: 23999,
        stock: 15,
        category: 'Fitness',
        image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800&auto=format&fit=crop',
      },
      {
        name: 'Luxury Scented Candle',
        description: 'Hand-poured soy candle with a calming lavender and vanilla scent.',
        price: 1599,
        stock: 120,
        category: 'Home',
        image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=800&auto=format&fit=crop',
      },
    ];
    await Product.insertMany(sampleProducts);
    console.log('Sample products seeded');
  }
}

async function startServer() {
  // Connect to Database
  const mongoUri = process.env.MONGO_URI;
  if (mongoUri && !mongoUri.includes('your_mongodb_atlas_connection_string')) {
    await connectDB();
    // Auto-seeding disabled to allow user to manage their own data
    console.log('Database connected. Ready for user data.');
  } else {
    console.error('CRITICAL: MONGO_URI is missing or contains the placeholder string.');
    console.error('Please go to the "Secrets" panel in AI Studio and set MONGO_URI to your real MongoDB Atlas connection string.');
  }

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
