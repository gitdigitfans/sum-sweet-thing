import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import PricingCarousel from './PricingCarousel'
import PricingSectionCards from './PricingSectionCards'

const modalRoot = document.getElementById('react-carousel-root')
if (modalRoot) {
  createRoot(modalRoot).render(
    <StrictMode>
      <PricingCarousel />
    </StrictMode>
  )
}

const sectionRoot = document.getElementById('pricing-section-root')
if (sectionRoot) {
  createRoot(sectionRoot).render(
    <StrictMode>
      <PricingSectionCards />
    </StrictMode>
  )
}
