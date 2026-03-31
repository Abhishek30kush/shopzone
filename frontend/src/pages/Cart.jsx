import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaTrash, FaMinus, FaPlus, FaShoppingCart } from 'react-icons/fa';
import { fetchCart, updateCartQuantity, removeFromCart, clearCart } from '../slices/cartSlice';
import { toast } from 'react-toastify';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart, loading } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
    }
  }, [dispatch, isAuthenticated]);

  const handleQuantityChange = (productId, quantity, currentStock) => {
    if (quantity < 1) return;
    if (quantity > currentStock) {
      toast.error('Insufficient stock');
      return;
    }
    dispatch(updateCartQuantity({ productId, quantity }));
  };

  const handleRemoveItem = (productId) => {
    dispatch(removeFromCart(productId));
    toast.success('Item removed from cart');
  };

  const handleClearCart = () => {
    dispatch(clearCart());
    toast.success('Cart cleared');
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FaShoppingCart className="text-6xl text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Login to View Cart</h2>
          <Link
            to="/login"
            className="inline-block px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        {cart?.cartItems?.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              {cart.cartItems.map((item) => (
                <div key={item.product} className="bg-white rounded-lg shadow-md p-6 mb-4">
                  <div className="flex gap-4">
                    <Link to={`/products/${item.product}`}>
                      <img
                        src={item.image || '/placeholder.jpg'}
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    </Link>
                    <div className="flex-1">
                      <Link to={`/products/${item.product}`} className="text-lg font-semibold hover:text-primary-600">
                        {item.name}
                      </Link>
                      <p className="text-gray-500 mt-1">₹{item.price}</p>
                      
                      <div className="flex items-center justify-between mt-4">
                        {/* Quantity */}
                        <div className="flex items-center">
                          <button
                            onClick={() => handleQuantityChange(item.product, item.quantity - 1, item.product?.stock || 100)}
                            disabled={item.quantity <= 1}
                            className="p-2 border border-gray-300 rounded-l-lg disabled:opacity-50"
                          >
                            <FaMinus />
                          </button>
                          <span className="px-4 py-2 border-t border-b border-gray-300">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.product, item.quantity + 1, item.product?.stock || 100)}
                            className="p-2 border border-gray-300 rounded-r-lg"
                          >
                            <FaPlus />
                          </button>
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() => handleRemoveItem(item.product)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={handleClearCart}
                className="text-red-500 hover:text-red-700 mt-4"
              >
                Clear Cart
              </button>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                
                <div className="space-y-3 border-b pb-4 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal ({cart.cartItems.length} items)</span>
                    <span>₹{cart.totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-green-500">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (10%)</span>
                    <span>₹{(cart.totalPrice * 0.1).toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex justify-between mb-4">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-lg font-bold text-primary-600">
                    ₹{(cart.totalPrice + cart.totalPrice * 0.1).toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full py-3 bg-primary-500 text-white font-semibold rounded-lg hover:bg-primary-600 transition-colors"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <FaShoppingCart className="text-6xl text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <Link
              to="/products"
              className="inline-block px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
            >
              Continue Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;

