import { motion } from 'framer-motion'

const SPRING = { type: 'spring', stiffness: 320, damping: 28 }

export default function CarouselCard({ plan, index, currentIndex, total, onClick }) {
  const offset = index - currentIndex
  const isActive = offset === 0

  const scaleVal = isActive ? 1.05 : 0.85
  const opacityVal = isActive ? 1 : 0.4
  const blurVal = isActive ? 0 : 3
  const saturateVal = isActive ? 1 : 0.35
  const rotateY = isActive ? 0 : offset < 0 ? -10 : 10
  const zIndex = isActive ? 5 : 1

  return (
    <motion.div
      className={`carousel-card ${isActive ? 'active' : ''}`}
      initial={false}
      animate={{
        scale: scaleVal,
        opacity: opacityVal,
        rotateY,
        filter: `blur(${blurVal}px) saturate(${saturateVal})`,
        zIndex,
      }}
      transition={SPRING}
      style={{
        cursor: isActive ? 'default' : 'pointer',
        backfaceVisibility: 'hidden',
      }}
      onClick={() => {
        if (!isActive) onClick(index)
      }}
    >
      <div className="carousel-card-inner">
        <div className="card-image-area">
          <div className="card-image-placeholder">
            <span className="card-icon">{index === 0 ? '🏋️' : index === 1 ? '🔥' : '🏆'}</span>
          </div>
        </div>
        <div className="card-body">
          <div className="card-plan-name">{plan.name}</div>
          <div className="card-plan-duration">{plan.duration}</div>
          <div className="card-price">
            <span className="card-currency">{plan.currency}</span> {plan.price.toLocaleString()}
          </div>
          <ul className="card-features">
            {plan.features.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
          <a
            href={plan.link || '/checkout'}
            className="btn btn-primary"
            onClick={(e) => {
              if (!isActive) {
                e.preventDefault()
              } else {
                const modal = document.getElementById('pricingModal')
                if (modal) {
                  modal.classList.remove('open')
                  document.body.style.overflow = ''
                }
              }
            }}
          >
            اختر الباقة
          </a>
        </div>
      </div>
    </motion.div>
  )
}
