import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';
import api from '../api/api';
import ProductCard from '../components/ProductCard';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { user, updateUser } = useContext(AuthContext);
  const { showToast } = useContext(ToastContext);

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Variant mock states
  const [selectedColor, setSelectedColor] = useState('Default');
  const [selectedSize, setSelectedSize] = useState('M');

  // Accordion Toggles
  const [activeAccordion, setActiveAccordion] = useState(null); // 'shipping', 'returns', 'specs'

  // Review states
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const fetchProduct = async () => {
    try {
      const { data } = await api.get(`/products/${id}`);
      setProduct(data);

      // Fetch related items matching category
      const relRes = await api.get('/products', { params: { category: data.category, pageSize: 4 } });
      setRelatedProducts((relRes.data.products || relRes.data || []).filter((p) => p._id !== data._id));
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

  const handleWishlistToggle = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setWishlistLoading(true);
    try {
      const { data } = await api.post(`/auth/wishlist/${id}`);
      updateUser({ wishlist: data.wishlist });
      showToast('Wishlist updated');
    } catch (err) {
      console.error('Error updating wishlist:', err);
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (rating === undefined || !comment.trim()) {
      showToast('Please select a rating and enter a comment', 'danger');
      return;
    }

    setReviewLoading(true);
    try {
      await api.post(`/products/${id}/reviews`, { rating, comment });
      showToast('Review submitted successfully');
      setComment('');
      setRating(5);
      fetchProduct(); // reload averages
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to submit review', 'danger');
    } finally {
      setReviewLoading(false);
    }
  };

  const isWishlisted = user && user.wishlist && Array.isArray(user.wishlist)
    ? user.wishlist.some((itemId) => (typeof itemId === 'object' ? itemId._id : itemId) === id)
    : false;

  const renderStars = (ratingVal) => {
    const stars = [];
    const fullStars = Math.floor(ratingVal);
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`text-sm ${i <= fullStars ? 'text-[#F59E0B]' : 'text-gray-200'}`}>
          ★
        </span>
      );
    }
    return stars;
  };

  const toggleAccordion = (name) => {
    setActiveAccordion(activeAccordion === name ? null : name);
  };

  if (loading) return <p className="text-center mt-10 text-text-secondary text-sm">Loading product details...</p>;
  if (error) return <p className="text-center mt-10 text-danger text-sm">{error}</p>;
  if (!product) return <p className="text-center mt-10 text-text-secondary text-sm">Product not found</p>;

  const userHasReviewed = user && product.reviews
    ? product.reviews.some((r) => r.user.toString() === user._id.toString())
    : false;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col gap-16">

      {/* Back button */}
      <div>
        <Link to="/shop" className="text-xs font-semibold text-primary-start hover:underline">
          &larr; Back to Shop Catalog
        </Link>
      </div>

      {/* Main product layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left: Image Gallery */}
        <div className="flex flex-col gap-4">
          <div className="aspect-[4/4.5] bg-white rounded-3xl overflow-hidden border border-border-light flex items-center justify-center p-4 shadow-sm">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-2xl animate-fade-in" />
          </div>

          {/* Gallery Thumbnails Slider Mock */}
          <div className="flex gap-3">
            {[product.image, product.image].map((img, idx) => (
              <div key={idx} className="w-16 h-16 rounded-xl overflow-hidden border border-primary-start/20 cursor-pointer p-1 bg-white">
                <img src={img} alt="Thumbnail" className="w-full h-full object-cover rounded-lg" />
              </div>
            ))}
          </div>
        </div>

        {/* Right: Info */}
        <div className="flex flex-col gap-6">
          <div>
            <span className="text-[10px] text-primary-start font-bold uppercase tracking-widest bg-primary-start/10 px-3 py-1 rounded-full w-fit">
              {product.category}
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-text-primary mt-4 leading-tight">
              {product.name}
            </h1>

            {/* Rating summary */}
            <div className="flex items-center gap-2 mt-3">
              <div className="flex">{renderStars(product.rating || 0)}</div>
              <span className="text-xs font-bold text-text-primary">
                {product.rating ? product.rating.toFixed(1) : '0.0'}
              </span>
              <span className="text-gray-250 text-xs">|</span>
              <span className="text-xs text-text-secondary font-light">
                {product.numReviews || 0} customer reviews
              </span>
            </div>
          </div>

          <p className="text-2xl font-black text-text-primary">
            ${product.price ? product.price.toFixed(2) : '0.00'}
          </p>

          <p className="text-xs text-text-secondary leading-relaxed font-light border-t border-border-light/60 pt-6">
            {product.description}
          </p>

          {/* Variants selectors (Mock Colors & Sizes) */}
          <div className="flex flex-col gap-4 border-t border-border-light/60 pt-6">
            {/* Colors */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[9px] font-bold text-text-secondary uppercase tracking-widest">Color Options</span>
              <div className="flex gap-2">
                {['Default', 'Space Gray', 'Midnight Blue'].map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`text-[10px] font-bold px-3.5 py-1.5 rounded-full border transition ${selectedColor === color
                        ? 'border-primary-start bg-primary-start/5 text-primary-start font-black'
                        : 'border-border-light text-text-secondary hover:bg-gray-50'
                      }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[9px] font-bold text-text-secondary uppercase tracking-widest">Size Options</span>
              <div className="flex gap-2">
                {['S', 'M', 'L', 'XL'].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`w-9 h-9 flex items-center justify-center text-[10px] font-bold rounded-full border transition ${selectedSize === size
                        ? 'border-primary-start bg-primary-start/5 text-primary-start font-black'
                        : 'border-border-light text-text-secondary hover:bg-gray-50'
                      }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Qty & Stock status */}
          <div className="flex items-center gap-8 border-t border-border-light/60 pt-6">
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-bold text-text-secondary uppercase tracking-widest">Inventory</span>
              <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full w-fit uppercase tracking-widest ${product.stock > 0 ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
                }`}>
                {product.stock > 0 ? `In Stock (${product.stock})` : 'Sold Out'}
              </span>
            </div>

            {product.stock > 0 && (
              <div className="flex flex-col gap-1">
                <span className="text-[9px] font-bold text-text-secondary uppercase tracking-widest">Quantity</span>
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="border border-border-light text-xs font-semibold text-text-primary rounded-full px-4 py-1.5 bg-white focus:outline-none focus:border-primary-start"
                >
                  {Array.from({ length: Math.min(product.stock, 5) }).map((_, idx) => (
                    <option key={idx} value={idx + 1}>{idx + 1}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-4 border-t border-border-light/60 pt-8 mt-auto">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`flex-grow py-3.5 rounded-full text-xs font-semibold uppercase tracking-widest transition duration-200 shadow-sm ${product.stock === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-primary-start to-primary-end hover:opacity-95 text-white'
                }`}
            >
              Add to Bag
            </button>

            <button
              onClick={handleWishlistToggle}
              disabled={wishlistLoading}
              className={`px-4 rounded-full border transition duration-200 ${isWishlisted
                  ? 'border-danger/25 bg-danger/10 text-danger'
                  : 'border-border-light text-text-secondary hover:bg-gray-50'
                }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill={isWishlisted ? '#EF4444' : 'none'}
                viewBox="0 0 24 24"
                strokeWidth={1.8}
                stroke={isWishlisted ? '#EF4444' : 'currentColor'}
                className="w-5 h-5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
              </svg>
            </button>
          </div>

          {/* 360-Ready Accordion Disclosures */}
          <div className="flex flex-col border border-border-light rounded-2xl overflow-hidden mt-4">
            {/* Shipping specs */}
            <div className="border-b border-border-light last:border-b-0">
              <button
                type="button"
                onClick={() => toggleAccordion('shipping')}
                className="w-full flex justify-between items-center p-4 text-left font-bold text-xs text-text-primary hover:bg-bg-soft/40 transition"
              >
                <span>Shipping Info</span>
                <span>{activeAccordion === 'shipping' ? '−' : '+'}</span>
              </button>
              {activeAccordion === 'shipping' && (
                <div className="p-4 bg-bg-soft/30 border-t border-border-light text-xs text-text-secondary leading-relaxed font-light">
                  Enjoy free shipping globally on all purchases exceeding $50. Shipping logistics are handled securely with real-time tracking coordinates sent upon courier dispatch.
                </div>
              )}
            </div>

            {/* Returns specs */}
            <div className="border-b border-border-light last:border-b-0">
              <button
                type="button"
                onClick={() => toggleAccordion('returns')}
                className="w-full flex justify-between items-center p-4 text-left font-bold text-xs text-text-primary hover:bg-bg-soft/40 transition"
              >
                <span>Return Policy</span>
                <span>{activeAccordion === 'returns' ? '−' : '+'}</span>
              </button>
              {activeAccordion === 'returns' && (
                <div className="p-4 bg-bg-soft/30 border-t border-border-light text-xs text-text-secondary leading-relaxed font-light">
                  We verify customer satisfaction credentials with a clear 30-day return policy window. Contact support channels for direct prepaid return labels.
                </div>
              )}
            </div>

            {/* Technical Specs */}
            <div className="border-b border-border-light last:border-b-0">
              <button
                type="button"
                onClick={() => toggleAccordion('specs')}
                className="w-full flex justify-between items-center p-4 text-left font-bold text-xs text-text-primary hover:bg-bg-soft/40 transition"
              >
                <span>Technical Specifications</span>
                <span>{activeAccordion === 'specs' ? '−' : '+'}</span>
              </button>
              {activeAccordion === 'specs' && (
                <div className="p-4 bg-bg-soft/30 border-t border-border-light text-xs text-text-secondary leading-relaxed font-light flex flex-col gap-2">
                  <p><strong>Item ID:</strong> {product._id}</p>
                  <p><strong>Category classification:</strong> {product.category}</p>
                  <p><strong>Available Stock status:</strong> In Stock ({product.stock})</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="flex flex-col gap-6 border-t border-border-light pt-12">
          <div>
            <h2 className="text-xl font-bold text-text-primary tracking-tight">Related Products</h2>
            <p className="text-xs text-text-secondary font-light mt-0.5">Other selections in the {product.category} collection</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((prod) => (
              <ProductCard key={prod._id} product={prod} />
            ))}
          </div>
        </section>
      )}

      {/* CUSTOMER REVIEWS */}
      <div className="border-t border-border-light pt-12">
        <h2 className="text-sm font-bold text-text-primary mb-8 uppercase tracking-widest">Customer Reviews</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Rating Summary Box */}
          <div className="bg-white border border-border-light p-8 rounded-2xl h-fit flex flex-col items-center justify-center text-center shadow-sm">
            <span className="text-4xl font-extrabold text-text-primary">
              {product.rating ? product.rating.toFixed(1) : '0.0'}
            </span>
            <div className="flex my-3">{renderStars(product.rating || 0)}</div>
            <p className="text-[9px] text-text-secondary font-bold uppercase tracking-wider">Based on {product.reviews?.length || 0} reviews</p>
          </div>

          <div className="md:col-span-2 flex flex-col gap-8">
            {user ? (
              userHasReviewed ? (
                <p className="text-xs font-semibold text-text-secondary bg-white p-5 rounded-2xl border border-border-light shadow-sm">
                  You have already reviewed this product. Thank you!
                </p>
              ) : (
                <form onSubmit={handleReviewSubmit} className="bg-white border border-border-light p-6 rounded-2xl shadow-sm flex flex-col gap-4">
                  <h3 className="font-bold text-text-primary text-xs">Share Your Feedback</h3>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-bold text-text-secondary uppercase tracking-widest">Rating</label>
                    <select
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                      className="border border-border-light text-xs font-semibold text-text-primary rounded-full px-4 py-2 bg-white focus:outline-none max-w-[150px] focus:border-primary-start"
                    >
                      <option value={5}>5 - Excellent</option>
                      <option value={4}>4 - Good</option>
                      <option value={3}>3 - Average</option>
                      <option value={2}>2 - Poor</option>
                      <option value={1}>1 - Terrible</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-bold text-text-secondary uppercase tracking-widest">Comment</label>
                    <textarea
                      placeholder="Comment details..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={3}
                      className="border border-border-light focus:border-primary-start focus:outline-none rounded-2xl p-4 text-xs resize-none transition bg-bg-soft"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={reviewLoading}
                    className="bg-gradient-to-r from-primary-start to-primary-end hover:opacity-95 text-white font-semibold text-xs py-2.5 px-6 rounded-full transition duration-150 self-start uppercase tracking-widest disabled:opacity-50"
                  >
                    {reviewLoading ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              )
            ) : (
              <p className="text-xs text-text-secondary bg-white p-5 rounded-2xl border border-border-light shadow-sm">
                Please{' '}
                <Link to="/login" className="text-primary-start font-bold hover:underline">
                  login
                </Link>{' '}
                to leave a review.
              </p>
            )}

            {/* List */}
            <div className="flex flex-col gap-5">
              {(!product.reviews || product.reviews.length === 0) ? (
                <p className="text-text-secondary text-xs font-light">No reviews posted yet.</p>
              ) : (
                product.reviews.map((r, idx) => (
                  <div key={idx} className="border-b border-border-light pb-5 last:border-b-0">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <p className="text-xs font-bold text-text-primary">{r.name}</p>
                        <div className="flex my-0.5">{renderStars(r.rating)}</div>
                      </div>
                      <span className="text-[10px] text-text-secondary">
                        {new Date(r.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed mt-2 font-light">{r.comment}</p>
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
