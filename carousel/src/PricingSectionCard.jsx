import { motion } from 'framer-motion'

const SPRING = { type: 'spring', stiffness: 300, damping: 28 }

export default function PricingSectionCard({ plan, index, currentIndex, onClick }) {
  const offset = index - currentIndex
  const isActive = offset === 0
  const isVisible = Math.abs(offset) <= 1

  const staggerOrder = isActive ? 0 : offset === 1 ? 1 : offset === -1 ? 2 : 99
  const delay = staggerOrder * 0.12

  return (
    <motion.div
      className={`section-card ${isActive ? 'active' : ''}`}
      initial={{ opacity: 0, y: 60 }}
      animate={{
        opacity: isVisible ? 1 : 0,
        y: isVisible ? 0 : 40,
        scale: isVisible ? 1 : 0.8,
      }}
      transition={{
        default: { delay, ...SPRING },
        opacity: { delay, duration: 0.5, ease: 'easeOut' },
      }}
      whileHover={{
        y: -6,
        scale: 1.02,
        transition: { type: 'spring', stiffness: 400, damping: 20 },
      }}
      style={{
        cursor: 'pointer',
        backfaceVisibility: 'hidden',
        perspective: 800,
      }}
      onClick={() => { if (!isActive) onClick(index) }}
    >
      <div className="section-card-content">
        <div className="section-card-header">
          <motion.h3
            className="section-card-name"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + 0.1, duration: 0.4 }}
          >
            {plan.name}
          </motion.h3>
          <motion.span
            className="section-card-duration"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.2, duration: 0.4 }}
          >
            {plan.duration}
          </motion.span>
        </div>
        <motion.div
          className="section-card-pricing"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: delay + 0.15, type: 'spring', stiffness: 400, damping: 20 }}
        >
          <span className="section-card-currency">{plan.currency}</span>
          <span className="section-card-price">
            {plan.price.toLocaleString()}
          </span>
        </motion.div>
        <ul className="section-card-features">
          {plan.features.map((f, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: delay + 0.2 + i * 0.04, duration: 0.35 }}
            >
              {f}
            </motion.li>
          ))}
        </ul>
        <motion.a
          href={plan.link || '/checkout'}
          className="btn btn-primary"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delay + 0.3, duration: 0.4 }}
          onClick={(e) => { if (!isActive) e.preventDefault() }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          اشترك الآن
        </motion.a>
      </div>
    </motion.div>
  )
}
