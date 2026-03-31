import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaHeart, FaShoppingCart, FaStar, FaRegHeart } from 'react-icons/fa';
import { addToCart } from '../slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../slices/wishlistSlice';
import { toast } from 'react-toastify';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { wishlist } = useSelector((state) => state.wishlist);

  const isInWishlist = wishlist?.some((item) => item._id === product._id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to add to cart');
      return;
    }
    dispatch(addToCart({ productId: product._id, quantity: 1 }));
    toast.success('Added to cart');
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to add to wishlist');
      return;
    }
    if (isInWishlist) {
      dispatch(removeFromWishlist(product._id));
      toast.success('Removed from wishlist');
    } else {
      dispatch(addToWishlist(product._id));
      toast.success('Added to wishlist');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <Link to={`/products/${product._id}`}>
        <div className="relative h-64 overflow-hidden">
          <img
            src={product.images?.[0] || '/placeholder.jpg'}
            alt={product.title}
            className="w-full h-full object-cover product-image"
          />
          {product.discountPrice && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              SALE
            </span>
          )}
          {product.isFeatured && (
            <span className="absolute top-2 right-2 bg-primary-500 text-white text-xs font-bold px-2 py-1 rounded">
              FEATURED
            </span>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link to={`/products/${product._id}`}>
          <h3 className="text-lg font-semibold text-gray-800 hover:text-primary-600 truncate">
            {product.title}
          </h3>
        </Link>

        <div className="flex items-center mt-1">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                className={i < Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-300'}
              />
            ))}
          </div>
          <span className="text-gray-500 text-sm ml-2">({product.numReviews} reviews)</span>
        </div>

        <div className="flex items-center mt-2">
          {product.discountPrice ? (
            <>
              <span className="text-xl font-bold text-primary-600">₹{product.discountPrice}</span>
              <span className="ml-2 text-gray-500 line-through">₹{product.price}</span>
            </>
          ) : (
            <span className="text-xl font-bold text-primary-600">₹{product.price}</span>
          )}
        </div>

        <p className="text-sm text-gray-500 mt-1">
          {product.stock > 0 ? (
            <span className="text-green-500">In Stock ({product.stock})</span>
          ) : (
            <span className="text-red-500">Out of Stock</span>
          )}
        </p>

        <div className="flex items-center justify-between mt-4">
          <button
            onClick={handleWishlistToggle}
            className={`p-2 rounded-full transition-colors ${
              isInWishlist
                ? 'bg-red-100 text-red-500'
                : 'bg-gray-100 text-gray-500 hover:text-red-500'
            }`}
          >
            {isInWishlist ? <FaHeart /> : <FaRegHeart />}
          </button>

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <FaShoppingCart className="mr-2" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

