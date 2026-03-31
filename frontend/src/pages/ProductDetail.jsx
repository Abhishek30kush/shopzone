import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaStar, FaShoppingCart, FaHeart, FaRegHeart, FaMinus, FaPlus, FaShippingFast, FaShieldAlt, FaUndo } from 'react-icons/fa';
import { fetchProduct, addProductReview } from '../slices/productSlice';
import { addToCart } from '../slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../slices/wishlistSlice';
import { toast } from 'react-toastify';

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { product, loading } = useSelector((state) => state.products);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { wishlist } = useSelector((state) => state.wishlist);

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });

  const isInWishlist = wishlist?.some((item) => item._id === product?._id);

  useEffect(() => {
    dispatch(fetchProduct(id));
    window.scrollTo(0, 0);
  }, [dispatch, id]);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error('Please login to add to cart');
      return;
    }
    if (product.stock < quantity) {
      toast.error('Insufficient stock');
      return;
    }
    dispatch(addToCart({ productId: product._id, quantity }));
    toast.success('Added to cart');
  };

  const handleWishlistToggle = () => {
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

  const handleQuantityChange = (delta) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to submit review');
      return;
    }
    dispatch(addProductReview({ productId: product._id, ...reviewData }));
    toast.success('Review submitted');
    setReviewData({ rating: 5, comment: '' });
  };

  if (loading || !product) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <Link to="/" className="text-gray-500 hover:text-primary-600">Home</Link>
          <span className="mx-2 text-gray-500">/</span>
          <Link to="/products" className="text-gray-500 hover:text-primary-600">Products</Link>
          <span className="mx-2 text-gray-500">/</span>
          <span className="text-gray-900">{product.title}</span>
        </nav>

        {/* Product Details */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Images */}
            <div>
              <div className="mb-4">
                <img
                  src={product.images?.[selectedImage] || '/placeholder.jpg'}
                  alt={product.title}
                  className="w-full h-96 object-cover rounded-lg"
                />
              </div>
              {product.images?.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                        selectedImage === index ? 'border-primary-500' : 'border-transparent'
                      }`}
                    >
                      <img src={image} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
              
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={i < Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-300'} />
                  ))}
                </div>
                <span className="ml-2 text-gray-500">({product.numReviews} reviews)</span>
              </div>

              <div className="mb-4">
                {product.discountPrice ? (
                  <div className="flex items-center gap-4">
                    <span className="text-3xl font-bold text-primary-600">₹{product.discountPrice}</span>
                    <span className="text-xl text-gray-500 line-through">₹{product.price}</span>
                    <span className="bg-red-500 text-white text-sm px-2 py-1 rounded">
                      {Math.round((1 - product.discountPrice / product.price) * 100)}% OFF
                    </span>
                  </div>
                ) : (
                  <span className="text-3xl font-bold text-primary-600">₹{product.price}</span>
                )}
              </div>

              <p className="text-gray-600 mb-4">
                {product.stock > 0 ? (
                  <span className="text-green-500 font-semibold">In Stock ({product.stock} available)</span>
                ) : (
                  <span className="text-red-500 font-semibold">Out of Stock</span>
                )}
              </p>

              <p className="text-gray-700 mb-6">{product.description}</p>

              {/* Quantity */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                <div className="flex items-center">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="p-2 border border-gray-300 rounded-l-lg disabled:opacity-50"
                  >
                    <FaMinus />
                  </button>
                  <span className="px-4 py-2 border-t border-b border-gray-300">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock}
                    className="p-2 border border-gray-300 rounded-r-lg disabled:opacity-50"
                  >
                    <FaPlus />
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 mb-8">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 flex items-center justify-center px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  <FaShoppingCart className="mr-2" />
                  Add to Cart
                </button>
                <button
                  onClick={handleWishlistToggle}
                  className={`p-3 rounded-lg border-2 ${
                    isInWishlist
                      ? 'border-red-500 text-red-500 bg-red-50'
                      : 'border-gray-300 text-gray-500 hover:border-red-500 hover:text-red-500'
                  }`}
                >
                  {isInWishlist ? <FaHeart /> : <FaRegHeart />}
                </button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 border-t pt-6">
                <div className="text-center">
                  <FaShippingFast className="text-2xl text-primary-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Free Shipping</p>
                </div>
                <div className="text-center">
                  <FaShieldAlt className="text-2xl text-primary-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Secure Payment</p>
                </div>
                <div className="text-center">
                  <FaUndo className="text-2xl text-primary-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Easy Returns</p>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="border-t p-8">
            <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>

            {/* Review Form */}
            {isAuthenticated && (
              <form onSubmit={handleSubmitReview} className="mb-8 bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-4">Write a Review</h3>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewData({ ...reviewData, rating: star })}
                        className="text-2xl"
                      >
                        <FaStar className={star <= reviewData.rating ? 'text-yellow-400' : 'text-gray-300'} />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
                  <textarea
                    value={reviewData.comment}
                    onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    rows="3"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                >
                  Submit Review
                </button>
              </form>
            )}

            {/* Reviews List */}
            {product.reviews?.length > 0 ? (
              <div className="space-y-4">
                {product.reviews.map((review, index) => (
                  <div key={index} className="border-b pb-4">
                    <div className="flex items-center mb-2">
                      <span className="font-semibold mr-2">{review.name}</span>
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'} />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600">{review.comment}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No reviews yet. Be the first to review!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

