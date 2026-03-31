import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaHeart, FaTrash, FaShoppingCart } from 'react-icons/fa';
import { fetchWishlist, removeFromWishlist } from '../slices/wishlistSlice';
import { addToCart } from '../slices/cartSlice';
import { toast } from 'react-toastify';

const Wishlist = () => {
  const dispatch = useDispatch();
  const { wishlist, loading } = useSelector((state) => state.wishlist);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchWishlist());
    }
  }, [dispatch, isAuthenticated]);

  const handleRemoveFromWishlist = (productId) => {
    dispatch(removeFromWishlist(productId));
    toast.success('Removed from wishlist');
  };

  const handleAddToCart = (productId) => {
    dispatch(addToCart({ productId, quantity: 1 }));
    toast.success('Added to cart');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FaHeart className="text-6xl text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Login to View Wishlist</h2>
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Wishlist</h1>

        {wishlist?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map((product) => (
              <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <Link to={`/products/${product._id}`}>
                  <img
                    src={product.images?.[0] || '/placeholder.jpg'}
                    alt={product.title}
                    className="w-full h-48 object-cover"
                  />
                </Link>
                <div className="p-4">
                  <Link to={`/products/${product._id}`}>
                    <h3 className="text-lg font-semibold hover:text-primary-600 truncate">
                      {product.title}
                    </h3>
                  </Link>
                  <div className="flex items-center mt-2">
                    <span className="text-xl font-bold text-primary-600">
                      ₹{product.discountPrice || product.price}
                    </span>
                    {product.discountPrice && (
                      <span className="ml-2 text-gray-500 line-through">
                        ₹{product.price}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                  </p>

                  <div className="flex items-center justify-between mt-4">
                    <button
                      onClick={() => handleRemoveFromWishlist(product._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                    <button
                      onClick={() => handleAddToCart(product._id)}
                      disabled={product.stock === 0}
                      className="flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      <FaShoppingCart className="mr-2" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FaHeart className="text-6xl text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your wishlist is empty</h2>
            <Link
              to="/products"
              className="inline-block px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
            >
              Start Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;

