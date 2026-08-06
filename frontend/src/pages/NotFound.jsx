import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md flex flex-col items-center gap-4"
      >
        <span className="text-8xl font-serif font-black text-primary tracking-tight">404</span>
        <h1 className="text-2xl font-serif font-bold text-primary mt-2">Page Not Found</h1>
        <p className="text-xs text-gray-500 font-light leading-relaxed">
          Sorry, the page you are looking for doesn't exist or has been relocated to another collection path.
        </p>
        <Link
          to="/"
          className="mt-4 bg-primary text-white text-xs font-semibold uppercase tracking-widest px-6 py-3 rounded-full hover:bg-primary/95 transition duration-150"
        >
          Back to Homepage
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
