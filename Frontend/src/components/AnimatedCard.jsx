import { motion } from "framer-motion";

// Simple card animation: fade in from below, slight scale on hover
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function AnimatedCard({ children, className = "" }) {
  return (
    <motion.div
      className={className}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      whileHover={{ scale: 1.03 }}
      viewport={{ once: true, amount: 0.2 }}
    >
      {children}
    </motion.div>
  );
}
