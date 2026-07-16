import { useState, useCallback, useEffect, useRef } from 'react'
import CarouselCard from './CarouselCard'

export default function PricingCarousel() {
  const [plans, setPlans] = useState([])
  const [currentIndex, setCurrentIndex] = useState(1)
  const containerRef = useRef(null)

  useEffect(() => {
    const data = window.__PRICING_DATA__
    if (data && data.length) {
      setPlans(data)
      setCurrentIndex(Math.floor(data.length / 2))
    }
  }, [])

  const goTo = useCallback((index) => {
    if (index < 0) index = plans.length - 1
    if (index >= plans.length) index = 0
    setCurrentIndex(index)
  }, [plans.length])

  const prev = useCallback(() => goTo(currentIndex - 1), [goTo, currentIndex])
  const next = useCallback(() => goTo(currentIndex + 1), [goTo, currentIndex])

  // Keyboard nav
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowRight') prev()
      if (e.key === 'ArrowLeft') next()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [prev, next])

  // Touch swipe support
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    let startX = 0
    const onTouchStart = (e) => { startX = e.touches[0].clientX }
    const onTouchEnd = (e) => {
      const diff = startX - e.changedTouches[0].clientX
      if (Math.abs(diff) > 50) {
        diff > 0 ? next() : prev()
      }
    }
    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchend', onTouchEnd, { passive: true })
    return () => {
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchend', onTouchEnd)
    }
  }, [prev, next])

  if (!plans.length) return null

  return (
    <div className="pricing-carousel-react">
      <div className="carousel-viewport" ref={containerRef}>
        <div className="carousel-stage">
          {plans.map((plan, i) => (
            <CarouselCard
              key={i}
              plan={plan}
              index={i}
              currentIndex={currentIndex}
              total={plans.length}
              onClick={goTo}
            />
          ))}
        </div>
      </div>
      <div className="carousel-controls">
        <button className="carousel-arrow prev" onClick={prev} aria-label="السابق">‹</button>
        <div className="carousel-dots">
          {plans.map((_, i) => (
            <button
              key={i}
              className={`carousel-dot ${i === currentIndex ? 'active' : ''}`}
              onClick={() => goTo(i)}
              aria-label={`الباقة ${i + 1}`}
            />
          ))}
        </div>
        <button className="carousel-arrow next" onClick={next} aria-label="التالي">›</button>
      </div>
    </div>
  )
}
