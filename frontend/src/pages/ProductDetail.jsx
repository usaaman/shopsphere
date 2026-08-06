import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import api from '../api/api';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { user, updateUser } = useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Review states
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewMessage, setReviewMessage] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const fetchProduct = async () => {
    try {
      const { data } = await api.get(`/products/${id}`);
      setProduct(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error loading product details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewMessage('');
    setReviewError('');

    if (rating === undefined || !comment.trim()) {
      setReviewError('Please select a rating and write a comment');
      return;
    }

    setReviewLoading(true);
    try {
      await api.post(`/products/${id}/reviews`, { rating, comment });
      setReviewMessage('Review submitted successfully');
      setComment('');
      setRating(5);
      fetchProduct(); // reload to get new average ratings
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setReviewLoading(false);
    }
  };

  const isWishlisted = user && user.wishlist && Array.isArray(user.wishlist)
    ? user.wishlist.some((itemId) => (typeof itemId === 'object' ? itemId._id : itemId) === id)
    : false;

  const handleWishlistToggle = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setWishlistLoading(true);
    try {
      const { data } = await api.post(`/auth/wishlist/${id}`);
      updateUser({ wishlist: data.wishlist });
    } catch (err) {
      console.error('Error updating wishlist:', err);
    } finally {
      setWishlistLoading(false);
    }
  };

  const renderStars = (ratingVal) => {
    const stars = [];
    const fullStars = Math.floor(ratingVal);
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`text-sm ${i <= fullStars ? 'text-[#D8C3A5]' : 'text-gray-200'}`}>
          ★
        </span>
      );
    }
    return stars;
  };

  if (loading) return <p className="text-center mt-10 text-gray-500 text-sm">Loading product details...</p>;
  if (error) return <p className="text-center mt-10 text-red-600 text-sm">{error}</p>;
  if (!product) return <p className="text-center mt-10 text-gray-500 text-sm">Product not found</p>;

  // Check if user has already reviewed the product
  const userHasReviewed = user && product.reviews
    ? product.reviews.some((r) => r.user.toString() === user._id.toString())
    : false;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Back link */}
      <Link to="/shop" className="text-xs font-semibold text-primary hover:underline mb-8 inline-block">
        &larr; Back to Shop Catalog
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        {/* Left: Product Image */}
        <div className="aspect-[4/5] bg-white rounded-3xl overflow-hidden border border-[#ECECEC] flex items-center justify-center relative shadow-sm">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right: Info */}
        <div className="flex flex-col gap-6">
          <div>
            <span className="text-[10px] text-secondary font-bold uppercase tracking-widest">
              {product.category}
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-primary mt-2 leading-tight">
              {product.name}
            </h1>

            {/* Rating count */}
            <div className="flex items-center gap-2 mt-3">
              <div className="flex">{renderStars(product.rating || 0)}</div>
              <span className="text-xs font-bold text-gray-700">
                {product.rating ? product.rating.toFixed(1) : '0.0'}
              </span>
              <span className="text-gray-200 text-xs">|</span>
              <span className="text-xs text-gray-500 font-light">
                {product.numReviews || 0} reviews
              </span>
            </div>
          </div>

          <p className="text-2xl font-black text-gray-900">
            ${product.price ? product.price.toFixed(2) : '0.00'}
          </p>

          <p className="text-xs text-gray-500 leading-relaxed font-light border-t border-[#ECECEC]/60 pt-6">
            {product.description}
          </p>

          {/* Stock & Quantity */}
          <div className="flex items-center gap-8 border-t border-[#ECECEC]/60 pt-6">
            <div className="flex flex-col gap-1.5">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Status</span>
              <span className={`text-[10px] font-extrabold px-3 py-1.5 rounded-full w-fit uppercase tracking-widest ${
                product.stock > 0 ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
              }`}>
                {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
              </span>
            </div>

            {product.stock > 0 && (
              <div className="flex flex-col gap-1.5">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Quantity</span>
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="border border-[#ECECEC] text-xs font-semibold text-gray-700 rounded-full px-4 py-1.5 bg-white focus:outline-none"
                >
                  {Array.from({ length: Math.min(product.stock, 10) }).map((_, idx) => (
                    <option key={idx} value={idx + 1}>
                      {idx + 1}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-4 border-t border-[#ECECEC]/60 pt-8 mt-auto">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`flex-grow py-3.5 rounded-full text-xs font-semibold uppercase tracking-widest transition duration-200 ${
                product.stock === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-primary text-white hover:bg-primary/95 shadow-sm'
              }`}
            >
              Add to Cart
            </button>

            <button
              onClick={handleWishlistToggle}
              disabled={wishlistLoading}
              className={`px-4 rounded-full border transition duration-200 ${
                isWishlisted
                  ? 'border-error/20 bg-error/10 text-error'
                  : 'border-[#ECECEC] text-gray-500 hover:bg-gray-50'
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill={isWishlisted ? '#E24A4A' : 'none'}
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke={isWishlisted ? '#E24A4A' : 'currentColor'}
                className="w-5 h-5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* REVIEWS */}
      <div className="border-t border-[#ECECEC] pt-12 mt-12">
        <h2 className="text-lg font-serif font-bold text-primary mb-8 uppercase tracking-widest">Reviews</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Summary Box */}
          <div className="bg-white border border-[#ECECEC] p-8 rounded-3xl h-fit flex flex-col items-center justify-center text-center shadow-sm">
            <span className="text-5xl font-serif font-bold text-primary">
              {product.rating ? product.rating.toFixed(1) : '0.0'}
            </span>
            <div className="flex my-3.5">{renderStars(product.rating || 0)}</div>
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Based on {product.reviews?.length || 0} reviews</p>
          </div>

          {/* Form and List */}
          <div className="md:col-span-2 flex flex-col gap-8">
            {user ? (
              userHasReviewed ? (
                <p className="text-xs font-semibold text-gray-500 bg-white p-5 rounded-2xl border border-[#ECECEC] shadow-sm">
                  You have already reviewed this product. Thank you!
                </p>
              ) : (
                <form onSubmit={handleReviewSubmit} className="bg-white border border-[#ECECEC] p-6 rounded-3xl shadow-sm flex flex-col gap-4">
                  <h3 className="font-serif font-bold text-primary text-sm">Leave feedback</h3>
                  {reviewMessage && <p className="bg-green-50 text-green-700 text-xs p-3 rounded-xl font-medium">{reviewMessage}</p>}
                  {reviewError && <p className="bg-red-50 text-red-700 text-xs p-3 rounded-xl font-medium">{reviewError}</p>}

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Rating</label>
                    <select
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                      className="border border-[#ECECEC] text-xs font-semibold text-gray-700 rounded-full px-4 py-2 bg-white focus:outline-none max-w-[150px]"
                    >
                      <option value={5}>5 - Excellent</option>
                      <option value={4}>4 - Good</option>
                      <option value={3}>3 - Average</option>
                      <option value={2}>2 - Poor</option>
                      <option value={1}>1 - Terrible</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Comment</label>
                    <textarea
                      placeholder="Share your experience with us..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={3}
                      className="border border-[#ECECEC] focus:border-primary focus:outline-none rounded-2xl p-4 text-xs resize-none transition bg-[#FAF8F4]"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={reviewLoading}
                    className="bg-primary hover:bg-primary/95 text-white font-semibold text-xs py-2.5 px-6 rounded-full transition duration-150 self-start uppercase tracking-wider disabled:opacity-50"
                  >
                    {reviewLoading ? 'Submitting...' : 'Submit'}
                  </button>
                </form>
              )
            ) : (
              <p className="text-xs text-gray-500 bg-white p-5 rounded-2xl border border-[#ECECEC] shadow-sm">
                Please{' '}
                <Link to="/login" className="text-primary font-bold hover:underline">
                  login
                </Link>{' '}
                to leave a review.
              </p>
            )}

            {/* List */}
            <div className="flex flex-col gap-5">
              {(!product.reviews || product.reviews.length === 0) ? (
                <p className="text-gray-400 text-xs font-light">No reviews posted yet.</p>
              ) : (
                product.reviews.map((r, idx) => (
                  <div key={idx} className="border-b border-[#ECECEC]/40 pb-5 last:border-b-0">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{r.name}</p>
                        <div className="flex my-0.5">{renderStars(r.rating)}</div>
                      </div>
                      <span className="text-[10px] text-gray-400">
                        {new Date(r.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed mt-2 font-light">{r.comment}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
