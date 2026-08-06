import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-primary text-white border-t border-primary/20">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Info */}
          <div className="flex flex-col gap-5">
            <Link to="/" className="text-white text-3xl font-serif font-bold tracking-tight">
              verdora
            </Link>
            <p className="text-xs text-gray-300 leading-relaxed font-sans font-light">
              Better choices. Beautiful living. Curated organic products for a sustainable, refined, and luxury lifestyle.
            </p>
            <div className="flex gap-4 mt-1">
              <a href="#" className="hover:text-accent transition-colors duration-200 text-sm">
                <span className="sr-only">Facebook</span>
                Facebook
              </a>
              <a href="#" className="hover:text-accent transition-colors duration-200 text-sm">
                <span className="sr-only">Instagram</span>
                Instagram
              </a>
              <a href="#" className="hover:text-accent transition-colors duration-200 text-sm">
                <span className="sr-only">Pinterest</span>
                Pinterest
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-4">
            <h4 className="text-white text-xs font-semibold uppercase tracking-widest font-sans">Shopping</h4>
            <ul className="flex flex-col gap-2.5 text-xs text-gray-300 font-light">
              <li><Link to="/shop" className="hover:text-accent transition-colors duration-150">Shop All</Link></li>
              <li><Link to="/cart" className="hover:text-accent transition-colors duration-150">View Cart</Link></li>
              <li><Link to="/wishlist" className="hover:text-accent transition-colors duration-150">My Wishlist</Link></li>
              <li><Link to="/orders" className="hover:text-accent transition-colors duration-150">My Orders</Link></li>
            </ul>
          </div>

          {/* Customer Support */}
          <div className="flex flex-col gap-4">
            <h4 className="text-white text-xs font-semibold uppercase tracking-widest font-sans">Support</h4>
            <ul className="flex flex-col gap-2.5 text-xs text-gray-300 font-light">
              <li><a href="#" className="hover:text-accent transition-colors duration-150">Contact Us</a></li>
              <li><a href="#" className="hover:text-accent transition-colors duration-150">Shipping Info</a></li>
              <li><a href="#" className="hover:text-accent transition-colors duration-150">Return Policy</a></li>
              <li><a href="#" className="hover:text-accent transition-colors duration-150">FAQ</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="flex flex-col gap-4">
            <h4 className="text-white text-xs font-semibold uppercase tracking-widest font-sans">Join the Verdora Circle</h4>
            <p className="text-xs text-gray-300 leading-relaxed font-light">
              Subscribe to get exclusive notifications on special arrivals, luxury offers, and news.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2 mt-2">
              <input
                type="email"
                placeholder="Email Address"
                required
                className="w-full bg-[#325A47] border border-transparent text-white px-4 py-2.5 rounded-full text-xs focus:outline-none focus:border-accent placeholder-gray-400"
              />
              <button
                type="submit"
                className="bg-accent hover:bg-accent/95 text-primary text-xs font-semibold uppercase tracking-wider px-5 py-2.5 rounded-full transition duration-150"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Panel */}
        <div className="border-t border-white/10 mt-16 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-gray-400 font-light">
          <p>&copy; {new Date().getFullYear()} Verdora Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
