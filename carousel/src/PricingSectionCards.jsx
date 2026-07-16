import { useState, useCallback, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import PricingSectionCard from './PricingSectionCard'

export default function PricingSectionCards() {
  const [plans, setPlans] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const viewportRef = useRef(null)
  const [vpWidth, setVpWidth] = useState(0)

  useEffect(() => {
    const data = window.__PRICING_DATA__
    if (data && data.length) {
      setPlans(data)
      setCurrentIndex(Math.floor(data.length / 2))
    }
  }, [])

  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      setVpWidth(viewportRef.current?.offsetWidth || window.innerWidth)
    }
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    if (viewportRef.current) {
      setVpWidth(viewportRef.current.offsetWidth)
    }
  }, [plans])

  const goTo = useCallback((index) => {
    if (index < 0) index = plans.length - 1
    if (index >= plans.length) index = 0
    setCurrentIndex(index)
  }, [plans.length])

  const prev = useCallback(() => goTo(currentIndex - 1), [goTo, currentIndex])
  const next = useCallback(() => goTo(currentIndex + 1), [goTo, currentIndex])

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowRight') prev()
      if (e.key === 'ArrowLeft') next()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [prev, next])

  useEffect(() => {
    const el = viewportRef.current
    if (!el || !isMobile) return
    let startX = 0
    const onTouchStart = (e) => { startX = e.touches[0].clientX }
    const onTouchEnd = (e) => {
      const diff = startX - e.changedTouches[0].clientX
      if (Math.abs(diff) > 50) diff > 0 ? next() : prev()
    }
    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchend', onTouchEnd, { passive: true })
    return () => {
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchend', onTouchEnd)
    }
  }, [prev, next, isMobile])

  if (!plans.length) return null

  const slideX = isMobile ? -(currentIndex * vpWidth) : 0

  return (
    <div className="pricing-section-cards">
      <div className="section-cards-arrows">
        <button className="section-arrow section-arrow-prev" onClick={prev} aria-label="السابق">›</button>
      </div>

      <div className="section-cards-viewport" ref={viewportRef}>
        <motion.div
          className="section-cards-track"
          initial={false}
          animate={{ x: slideX }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          {plans.map((plan, i) => (
            <div key={i} className="section-card-wrapper">
              <PricingSectionCard
                plan={plan}
                index={i}
                currentIndex={currentIndex}
                onClick={goTo}
              />
            </div>
          ))}
        </motion.div>
      </div>

      <div className="section-cards-arrows">
        <button className="section-arrow section-arrow-next" onClick={next} aria-label="التالي">‹</button>
      </div>

      <div className="section-cards-dots">
        {plans.map((_, i) => (
          <button
            key={i}
            className={`section-dot ${i === currentIndex ? 'active' : ''}`}
            onClick={() => goTo(i)}
            aria-label={`الباقة ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
