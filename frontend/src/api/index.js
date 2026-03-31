import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Add token to requests
API.interceptors.request.use((req) => {
  if (localStorage.getItem('token')) {
    req.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
  }
  return req;
});

// Auth APIs
export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);
export const getProfile = () => API.get('/auth/profile');
export const updateProfile = (data) => API.put('/auth/profile', data);
export const updatePassword = (data) => API.put('/auth/password', data);

// Product APIs
export const getProducts = (params) => API.get('/products', { params });
export const getProduct = (id) => API.get(`/products/${id}`);
export const getFeaturedProducts = () => API.get('/products/featured');
export const getCategories = () => API.get('/products/categories');
export const getBrands = () => API.get('/products/brands');
export const createProduct = (data) => API.post('/products', data, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const updateProduct = (id, data) => API.put(`/products/${id}`, data, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const deleteProduct = (id) => API.delete(`/products/${id}`);
export const addReview = (id, data) => API.post(`/products/${id}/reviews`, data);

// Cart APIs
export const getCart = () => API.get('/cart');
export const addToCart = (data) => API.post('/cart/add', data);
export const updateCart = (data) => API.put('/cart/update', data);
export const removeFromCart = (productId) => API.delete(`/cart/remove/${productId}`);
export const clearCart = () => API.delete('/cart');

// Wishlist APIs
export const getWishlist = () => API.get('/wishlist');
export const addToWishlist = (productId) => API.post('/wishlist/add', { productId });
export const removeFromWishlist = (productId) => API.delete(`/wishlist/remove/${productId}`);

// Order APIs
export const createOrder = (data) => API.post('/orders/create', data);
export const getUserOrders = () => API.get('/orders/user');
export const getOrder = (id) => API.get(`/orders/${id}`);
export const getAllOrders = (params) => API.get('/orders/all', { params });
export const updateOrderStatus = (id, data) => API.put(`/orders/${id}/status`, data);
export const updatePaymentStatus = (id, data) => API.put(`/orders/${id}/payment`, data);
export const getOrderStats = () => API.get('/orders/stats/summary');

// Payment APIs
export const createPaymentOrder = (amount) => API.post('/payment/create-order', { amount });
export const verifyPayment = (data) => API.post('/payment/verify', data);
export const getPaymentKey = () => API.get('/payment/key');

export default API;

