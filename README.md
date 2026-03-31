# E-commerce Website

A full-stack e-commerce application built with the MERN stack (MongoDB, Express, React, Node.js).

## Features

### User Features
- User registration and login with JWT authentication
- Product browsing with category filtering
- Product search functionality
- Product detail page with reviews and ratings
- Add to cart / Remove from cart
- Wishlist functionality
- Checkout system with multiple payment options
- Order history
- User profile management

### Admin Panel
- Dashboard with analytics (total sales, orders, revenue)
- Product management (add, edit, delete products)
- Order management (view orders, update order status)
- User management (view all users)

## Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Redux Toolkit
- React Router
- React Icons
- React Toastify

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- bcryptjs for password hashing
- Razorpay for payments
- Multer for image uploads

## Project Structure

```
ecommerce-project/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   └── Cart.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── cart.js
│   │   ├── orders.js
│   │   ├── wishlist.js
│   │   └── payment.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── uploadMiddleware.js
│   ├── uploads/
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── pages/admin/
│   │   ├── slices/
│   │   ├── layouts/
│   │   ├── routes/
│   │   ├── api/
│   │   ├── App.js
│   │   ├── index.js
│   │   └── store.js
│   ├── package.json
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── README.md
└── TODO.md
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=7d
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   ```

4. Start the backend server:
   ```bash
   npm start
   # or for development
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the frontend development server:
   ```bash
   npm start
   ```

4. Open your browser and visit:
   ```
   http://localhost:3000
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add to cart
- `DELETE /api/cart/remove/:productId` - Remove from cart

### Orders
- `POST /api/orders/create` - Create order
- `GET /api/orders/user` - Get user orders
- `GET /api/orders/all` - Get all orders (admin)
- `PUT /api/orders/status` - Update order status (admin)

### Wishlist
- `GET /api/wishlist` - Get user wishlist
- `POST /api/wishlist/add` - Add to wishlist
- `DELETE /api/wishlist/remove/:productId` - Remove from wishlist

### Payment
- `POST /api/payment/create-order` - Create Razorpay order
- `POST /api/payment/verify` - Verify payment

## Seed Data

To create sample data (admin user, regular user, and sample products), run:

```bash
cd backend
node seed.js
```

This will create:
- Admin user: admin@ecommerce.com / admin123
- Regular user: user@ecommerce.com / user123
- 12 sample products across various categories

## Deployment

### Backend (Render)
1. Push your code to GitHub
2. Create a new Web Service on Render
3. Connect your GitHub repository
4. Set the build command to `npm install`
5. Set the start command to `npm start`
6. Add environment variables in Render dashboard

### Frontend (Vercel)
1. Push your code to GitHub
2. Import your project on Vercel
3. Configure the build settings:
   - Build Command: `npm run build`
   - Output Directory: `build`
4. Add environment variables if needed

### Database (MongoDB Atlas)
1. Create a free cluster on MongoDB Atlas
2. Get your connection string
3. Add it to your backend environment variables

## License

MIT License

