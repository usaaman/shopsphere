import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45 }}
        className="max-w-md flex flex-col items-center gap-4"
      >
        <span className="text-7xl font-extrabold bg-gradient-to-r from-primary-start to-primary-end bg-clip-text text-transparent tracking-tight">404</span>
        <h1 className="text-xl font-bold text-text-primary mt-2">Page Not Found</h1>
        <p className="text-xs text-text-secondary font-light leading-relaxed">
          Sorry, the page path you requested could not be resolved in Shopsphere collections.
        </p>
        <Link
          to="/"
          className="mt-4 bg-gradient-to-r from-primary-start to-primary-end hover:opacity-95 text-white text-xs font-semibold uppercase tracking-widest px-7 py-3.5 rounded-full shadow-md transition"
        >
          Back to Homepage
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
