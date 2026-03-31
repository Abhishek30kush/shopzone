const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    console.log('Cleared existing data');

    // Create Admin User
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@ecommerce.com',
      password: 'admin123',
      role: 'admin',
      address: {
        street: '123 Admin Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        zipCode: '400001',
        country: 'India'
      },
      phone: '+91-9876543210'
    });
    console.log('Admin user created:', adminUser.email);

    // Create Regular User
    const regularUser = await User.create({
      name: 'John Doe',
      email: 'user@ecommerce.com',
      password: 'user123',
      role: 'user',
      address: {
        street: '456 User Lane',
        city: 'Delhi',
        state: 'Delhi',
        zipCode: '110001',
        country: 'India'
      },
      phone: '+91-9876543211'
    });
    console.log('Regular user created:', regularUser.email);

    // Create Sample Products
    const sampleProducts = [
      {
        title: 'Smartphone Pro Max',
        description: 'Latest flagship smartphone with amazing camera and performance. Features 6.7-inch display, 128GB storage, and 5G connectivity.',
        price: 999,
        discountPrice: 899,
        category: 'Electronics',
        images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500'],
        stock: 50,
        rating: 4.5,
        numReviews: 120,
        brand: 'TechBrand',
        isFeatured: true,
        reviews: []
      },
      {
        title: 'Wireless Bluetooth Headphones',
        description: 'Premium noise-cancelling headphones with 30-hour battery life and crystal clear audio quality.',
        price: 299,
        discountPrice: 249,
        category: 'Electronics',
        images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'],
        stock: 100,
        rating: 4.3,
        numReviews: 85,
        brand: 'SoundMax',
        isFeatured: true,
        reviews: []
      },
      {
        title: 'Classic Denim Jacket',
        description: 'Stylish denim jacket perfect for any casual occasion. Made with premium quality fabric.',
        price: 89,
        discountPrice: 69,
        category: 'Clothing',
        images: ['https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500'],
        stock: 75,
        rating: 4.2,
        numReviews: 45,
        brand: 'FashionHub',
        isFeatured: true,
        reviews: []
      },
      {
        title: 'Running Shoes Ultra',
        description: 'Professional running shoes with advanced cushioning and breathable mesh upper.',
        price: 149,
        discountPrice: 119,
        category: 'Sports',
        images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500'],
        stock: 60,
        rating: 4.6,
        numReviews: 200,
        brand: 'SportPro',
        isFeatured: true,
        reviews: []
      },
      {
        title: 'Organic Green Tea',
        description: 'Premium organic green tea leaves from the finest gardens. Rich in antioxidants.',
        price: 25,
        discountPrice: 19,
        category: 'Food',
        images: ['https://images.unsplash.com/photo-1556881286-fc6915169721?w=500'],
        stock: 200,
        rating: 4.1,
        numReviews: 30,
        brand: 'TeaGarden',
        isFeatured: false,
        reviews: []
      },
      {
        title: 'Modern LED Desk Lamp',
        description: 'Adjustable LED desk lamp with multiple brightness levels and USB charging port.',
        price: 59,
        discountPrice: 45,
        category: 'Home & Garden',
        images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500'],
        stock: 80,
        rating: 4.4,
        numReviews: 65,
        brand: 'HomeLight',
        isFeatured: false,
        reviews: []
      },
      {
        title: 'Bestseller Novel Collection',
        description: 'Collection of 5 bestselling novels from renowned authors. Perfect for book lovers.',
        price: 79,
        discountPrice: 59,
        category: 'Books',
        images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500'],
        stock: 120,
        rating: 4.7,
        numReviews: 150,
        brand: 'BookWorld',
        isFeatured: true,
        reviews: []
      },
      {
        title: 'Wireless Gaming Mouse',
        description: 'High-performance gaming mouse with RGB lighting and programmable buttons.',
        price: 79,
        discountPrice: 59,
        category: 'Electronics',
        images: ['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500'],
        stock: 90,
        rating: 4.5,
        numReviews: 95,
        brand: 'GamePro',
        isFeatured: false,
        reviews: []
      },
      {
        title: 'Cotton T-Shirt Pack',
        description: 'Pack of 3 premium cotton t-shirts in assorted colors. Comfortable and durable.',
        price: 39,
        discountPrice: 29,
        category: 'Clothing',
        images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500'],
        stock: 150,
        rating: 4.0,
        numReviews: 75,
        brand: 'BasicWear',
        isFeatured: false,
        reviews: []
      },
      {
        title: 'Yoga Mat Premium',
        description: 'Extra thick yoga mat with non-slip surface. Eco-friendly material.',
        price: 45,
        discountPrice: 35,
        category: 'Sports',
        images: ['https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500'],
        stock: 100,
        rating: 4.3,
        numReviews: 55,
        brand: 'YogaFit',
        isFeatured: false,
        reviews: []
      },
      {
        title: 'Smart Watch Series 5',
        description: 'Advanced smartwatch with health monitoring, GPS, and water resistance.',
        price: 349,
        discountPrice: 299,
        category: 'Electronics',
        images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'],
        stock: 40,
        rating: 4.8,
        numReviews: 180,
        brand: 'TechBrand',
        isFeatured: true,
        reviews: []
      },
      {
        title: 'Wooden Coffee Table',
        description: 'Elegant wooden coffee table with modern design. Perfect for living room.',
        price: 199,
        discountPrice: 159,
        category: 'Home & Garden',
        images: ['https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=500'],
        stock: 25,
        rating: 4.2,
        numReviews: 35,
        brand: 'HomeStyle',
        isFeatured: false,
        reviews: []
      }
    ];

    await Product.insertMany(sampleProducts);
    console.log('Sample products created');

    console.log('\n=== Seed Data Created Successfully ===');
    console.log('Admin Login:');
    console.log('  Email: admin@ecommerce.com');
    console.log('  Password: admin123');
    console.log('\nUser Login:');
    console.log('  Email: user@ecommerce.com');
    console.log('  Password: user123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
