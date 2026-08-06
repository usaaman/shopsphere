const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const products = [
  {
    name: 'Wireless Bluetooth Headphones',
    description: 'Over-ear headphones with noise cancellation and 20-hour battery life.',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
    category: 'Electronics',
    stock: 25,
  },
  {
    name: 'Smart Watch',
    description: 'Fitness tracker with heart rate monitor and sleep tracking.',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
    category: 'Electronics',
    stock: 15,
  },
  {
    name: 'Men\'s Cotton T-Shirt',
    description: 'Comfortable 100% cotton t-shirt, available in multiple colors.',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
    category: 'Clothing',
    stock: 50,
  },
  {
    name: 'Running Shoes',
    description: 'Lightweight running shoes with breathable mesh design.',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
    category: 'Footwear',
    stock: 30,
  },
  {
    name: 'Leather Wallet',
    description: 'Genuine leather bifold wallet with RFID protection.',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500',
    category: 'Accessories',
    stock: 40,
  },
  {
    name: 'Stainless Steel Water Bottle',
    description: 'Insulated water bottle, keeps drinks cold for 24 hours.',
    price: 18.99,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500',
    category: 'Home & Kitchen',
    stock: 60,
  },
  {
    name: 'Backpack',
    description: 'Water-resistant laptop backpack with USB charging port.',
    price: 34.99,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
    category: 'Bags',
    stock: 20,
  },
  {
    name: 'Sunglasses',
    description: 'UV-protection polarized sunglasses with classic design.',
    price: 15.99,
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500',
    category: 'Accessories',
    stock: 35,
  },
  {
    name: 'Yoga Mat',
    description: 'Non-slip yoga mat with carrying strap, 6mm thick.',
    price: 22.99,
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500',
    category: 'Sports & Fitness',
    stock: 45,
  },
  {
    name: 'Wireless Mouse',
    description: 'Ergonomic wireless mouse with adjustable DPI settings.',
    price: 14.99,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500',
    category: 'Electronics',
    stock: 55,
  },
  {
    name: 'Coffee Mug',
    description: 'Ceramic coffee mug, dishwasher and microwave safe, 350ml.',
    price: 9.99,
    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500',
    category: 'Home & Kitchen',
    stock: 70,
  },
  {
    name: 'Denim Jacket',
    description: 'Classic blue denim jacket, unisex fit.',
    price: 45.99,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500',
    category: 'Clothing',
    stock: 18,
  },
  {
    name: 'Desk Lamp',
    description: 'LED desk lamp with adjustable brightness and USB port.',
    price: 27.99,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500',
    category: 'Home & Kitchen',
    stock: 25,
  },
  {
    name: 'Phone Case',
    description: 'Shockproof phone case with card holder.',
    price: 11.99,
    image: 'https://images.unsplash.com/photo-1601593346740-925612772716?w=500',
    category: 'Accessories',
    stock: 80,
  },
  {
    name: 'Bluetooth Speaker',
    description: 'Portable waterproof speaker with 12-hour playtime.',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500',
    category: 'Electronics',
    stock: 22,
  },
];

const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for Seeding...');

    await Product.deleteMany();
    console.log('Old products removed');

    await Product.insertMany(products);
    console.log(`${products.length} Products Imported Successfully!`);

    process.exit();
  } catch (error) {
    console.error('Error importing data:', error);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Product.deleteMany();
    console.log('All products removed');
    process.exit();
  } catch (error) {
    console.error('Error destroying data:', error);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}