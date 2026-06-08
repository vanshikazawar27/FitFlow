import { motion } from "framer-motion";

// Variants for container animation with staggered children
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      when: "beforeChildren",
    },
  },
};

/**
 * AnimatedContainer – wrap children to animate them on mount.
 * Accepts optional className for styling.
 */
export default function AnimatedContainer({ children, className = "" }) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {children}
    </motion.div>
  );
}
