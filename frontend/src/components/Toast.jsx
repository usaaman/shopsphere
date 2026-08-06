import { motion } from 'framer-motion';

const Toast = ({ message, type, onClose }) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <span className="text-success text-sm bg-success/15 w-6 h-6 flex items-center justify-center rounded-full">✓</span>;
      case 'error':
      case 'danger':
        return <span className="text-danger text-sm bg-danger/15 w-6 h-6 flex items-center justify-center rounded-full">✕</span>;
      case 'warning':
        return <span className="text-warning text-sm bg-warning/15 w-6 h-6 flex items-center justify-center rounded-full">⚠</span>;
      default:
        return <span className="text-primary-start text-sm bg-primary-start/15 w-6 h-6 flex items-center justify-center rounded-full">ℹ</span>;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="pointer-events-auto bg-white border border-border-light px-4 py-3 rounded-2xl shadow-md flex items-center gap-3.5 max-w-sm"
    >
      {getIcon()}
      <p className="text-xs font-semibold text-text-primary pr-4 leading-normal">{message}</p>
      <button onClick={onClose} className="text-[10px] text-text-secondary hover:text-text-primary ml-auto p-1 font-bold">
        ✕
      </button>
    </motion.div>
  );
};

export default Toast;
