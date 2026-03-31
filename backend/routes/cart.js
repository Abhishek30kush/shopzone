const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/cart
// @desc    Get user cart
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('cartItems.product');
    
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, cartItems: [], totalPrice: 0 });
    }
    
    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/cart/add
// @desc    Add item to cart
// @access  Private
router.post('/add', protect, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    
    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, cartItems: [], totalPrice: 0 });
    }

    // Check if item already in cart
    const itemIndex = cart.cartItems.findIndex(
      item => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      // Update quantity
      const newQuantity = cart.cartItems[itemIndex].quantity + quantity;
      
      if (newQuantity > product.stock) {
        return res.status(400).json({ message: 'Insufficient stock for this quantity' });
      }
      
      cart.cartItems[itemIndex].quantity = newQuantity;
    } else {
      // Add new item
      cart.cartItems.push({
        product: product._id,
        name: product.title,
        price: product.discountPrice || product.price,
        quantity,
        image: product.images[0]
      });
    }

    await cart.save();
    cart = await Cart.findOne({ user: req.user._id }).populate('cartItems.product');
    
    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/cart/update
// @desc    Update item quantity in cart
// @access  Private
router.put('/update', protect, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    
    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.cartItems.findIndex(
      item => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    if (quantity <= 0) {
      cart.cartItems.splice(itemIndex, 1);
    } else {
      if (quantity > product.stock) {
        return res.status(400).json({ message: 'Insufficient stock' });
      }
      cart.cartItems[itemIndex].quantity = quantity;
    }

    await cart.save();
    cart = await Cart.findOne({ user: req.user._id }).populate('cartItems.product');
    
    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/cart/remove/:productId
// @desc    Remove item from cart
// @access  Private
router.delete('/remove/:productId', protect, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.cartItems = cart.cartItems.filter(
      item => item.product.toString() !== req.params.productId
    );

    await cart.save();
    cart = await Cart.findOne({ user: req.user._id }).populate('cartItems.product');
    
    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/cart
// @desc    Clear cart
// @access  Private
router.delete('/', protect, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.cartItems = [];
    cart.totalPrice = 0;
    await cart.save();
    
    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

