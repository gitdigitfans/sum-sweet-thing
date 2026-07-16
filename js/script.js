// ─── Scroll Reveal ───
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px 50px 0px' });

  reveals.forEach(el => observer.observe(el));
}

// ─── Testimonials Slider ───
function initSlider() {
  const track = document.querySelector('.testimonials-track');
  const dots = document.querySelectorAll('.slider-dot');
  const prevBtn = document.querySelector('.slider-btn.prev');
  const nextBtn = document.querySelector('.slider-btn.next');
  if (!track || !dots.length) return;

  let current = 0;
  const total = dots.length;

  function goTo(index) {
    current = index;
    const cards = track.querySelectorAll('.testimonial-card');
    if (!cards.length) return;
    const cardWidth = cards[0].offsetWidth + 32; // card + gap
    track.style.transform = `translateX(calc(-${current} * (100% / ${Math.min(3, cards.length)} + 1rem)))`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  if (prevBtn) prevBtn.addEventListener('click', () => goTo(current > 0 ? current - 1 : total - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goTo(current < total - 1 ? current + 1 : 0));
  dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

  // Auto slide
  let interval = setInterval(() => goTo(current < total - 1 ? current + 1 : 0), 5000);
  track.addEventListener('mouseenter', () => clearInterval(interval));
  track.addEventListener('mouseleave', () => {
    clearInterval(interval);
    interval = setInterval(() => goTo(current < total - 1 ? current + 1 : 0), 5000);
  });

  goTo(0);
}

// ─── Navbar Scroll ───
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });
}

// ─── Mobile Toggle ───
function initMobileToggle() {
  const toggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (!toggle || !navLinks) return;

  toggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  // Close on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

// ─── Counter Animation ───
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.getAttribute('data-target'));
        const duration = 2000;
        const start = performance.now();

        function update(time) {
          const elapsed = time - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          entry.target.textContent = Math.floor(eased * target);
          if (progress < 1) requestAnimationFrame(update);
          else entry.target.textContent = target;
        }

        requestAnimationFrame(update);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

// ─── Experience Accordion ───
function toggleAccordion(btn) {
  const isOpen = btn.getAttribute('aria-expanded') === 'true';
  const body = btn.nextElementSibling;
  if (isOpen) {
    btn.setAttribute('aria-expanded', 'false');
    body.classList.remove('open');
    body.style.maxHeight = '0';
    body.style.opacity = '0';
  } else {
    btn.setAttribute('aria-expanded', 'true');
    body.classList.add('open');
    body.style.maxHeight = body.scrollHeight + 60 + 'px';
    body.style.opacity = '1';
  }
}

function initResultsLightbox() {
  const lightbox = document.getElementById('resultsLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  if (!lightbox || !lightboxImg) return;

  const cards = document.querySelectorAll('.results-card');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const images = [];
  let currentIndex = 0;
  let touchStartX = 0;

  cards.forEach(card => {
    const img = card.querySelector('img');
    if (img) images.push(img.src);
  });

  function open(index) {
    currentIndex = index;
    lightboxImg.src = images[currentIndex];
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function navigate(dir) {
    currentIndex = (currentIndex + dir + images.length) % images.length;
    lightboxImg.src = images[currentIndex];
  }

  cards.forEach((card, i) => {
    card.addEventListener('click', () => open(i));
  });

  // Duplicate track for seamless marquee loop (clones do NOT open lightbox)
  const track = document.getElementById('resultsTrack');
  if (track && cards.length) {
    const clone = track.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    Array.from(clone.children).forEach(c => c.classList.add('results-card--clone'));
    Array.from(track.parentNode.children).forEach(() => {});
    // Append clone children into the same track so translateX(-50%) loops seamlessly
    Array.from(clone.children).forEach(child => track.appendChild(child));
  }

  if (closeBtn) closeBtn.addEventListener('click', close);
  if (prevBtn) prevBtn.addEventListener('click', () => navigate(-1));
  if (nextBtn) nextBtn.addEventListener('click', () => navigate(1));

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') navigate(-1);
    if (e.key === 'ArrowLeft') navigate(1);
  });

  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });

  lightbox.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) navigate(dx > 0 ? -1 : 1);
  }, { passive: true });
}

// ─── Contact Form ───
function initContactForm() {
  const form = document.getElementById('contactForm');
  const success = document.getElementById('contactSuccess');
  if (!form || !success) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.innerHTML = 'جاري الإرسال...';

    setTimeout(() => {
      form.reset();
      btn.disabled = false;
      btn.innerHTML = 'إرسال <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>';
      success.classList.add('show');

      setTimeout(() => {
        success.classList.remove('show');
      }, 5000);
    }, 800);
  });
}

// ─── Journey Timeline ───
function initJourneyTimeline() {
  const wrapper = document.querySelector('.timeline-wrapper');
  if (!wrapper) return;

  const lineFill = wrapper.querySelector('.timeline-line-fill');
  const items = wrapper.querySelectorAll('.timeline-item');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (lineFill) lineFill.classList.add('animated');
        items.forEach((item, i) => {
          setTimeout(() => item.classList.add('animated'), i * 200);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  observer.observe(wrapper);
}

// ─── FAQ Accordion ───
function initFaqAccordion() {
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const wasActive = item.classList.contains('active');
      document.querySelectorAll('.faq-item.active').forEach(i => i.classList.remove('active'));
      if (!wasActive) item.classList.add('active');
    });
  });
}

// ─── Pricing Coverflow Carousel ───
function initPricingDots() {
  const scroll = document.getElementById('pricingCardsScroll');
  if (!scroll) return;
  const cards = Array.from(scroll.querySelectorAll('.pricing-card'));
  const dots  = Array.from(document.querySelectorAll('.pricing-dot'));
  const prev  = document.getElementById('pricingArrowPrev');
  const next  = document.getElementById('pricingArrowNext');
  if (!cards.length) return;

  // Start with the featured (middle) card centered
  let center = cards.findIndex(c => c.classList.contains('pricing-card--featured'));
  if (center < 0) center = Math.floor(cards.length / 2);

  const n = cards.length;
  function apply() {
    cards.forEach((c, i) => {
      const rel = ((i - center) % n + n) % n; // 0 center, 1 next(right), n-1 prev(left)
      let pos = 'center';
      if (rel === 1) pos = 'right';
      else if (rel === n - 1) pos = 'left';
      else if (rel !== 0) pos = 'hidden';
      c.dataset.position = pos;
    });
    dots.forEach((d, i) => d.classList.toggle('active', i === center));
  }

  function go(delta) {
    center = ((center + delta) % n + n) % n;
    apply();
  }

  cards.forEach((card, i) => {
    card.addEventListener('click', () => {
      if (i === center) return;
      center = i;
      apply();
    });
  });

  prev && prev.addEventListener('click', () => go(-1));
  next && next.addEventListener('click', () => go(1));
  dots.forEach((d, i) => d.addEventListener('click', () => { center = i; apply(); }));

  // Auto-rotate gently
  let auto = setInterval(() => go(1), 6000);
  scroll.addEventListener('mouseenter', () => clearInterval(auto));
  scroll.addEventListener('mouseleave', () => { auto = setInterval(() => go(1), 6000); });

  // Keyboard
  document.addEventListener('keydown', (e) => {
    const rect = scroll.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) return;
    if (e.key === 'ArrowLeft') go(1);   // RTL: left arrow => next
    if (e.key === 'ArrowRight') go(-1);
  });

  apply();
}


function initHeroVideo() {
  const video = document.querySelector('.hero-video');
  if (!video) return;
  
  // Hide fallback poster once video plays
  video.addEventListener('playing', () => {
    const poster = document.querySelector('.hero-poster-fallback');
    if (poster) poster.style.display = 'none';
  });

  // Try autoplay immediately
  const playPromise = video.play();
  if (playPromise !== undefined) {
    playPromise.catch(() => {
      // Autoplay blocked — wait for first touch
      const playOnInteraction = () => {
        video.play().catch(() => {});
        document.removeEventListener('touchstart', playOnInteraction);
        document.removeEventListener('click', playOnInteraction);
      };
      document.addEventListener('touchstart', playOnInteraction, { once: true });
      document.addEventListener('click', playOnInteraction, { once: true });
    });
  }
}

function initSocialLinks() {
  // Contact section social icon buttons
  document.querySelectorAll('.contact-social-icon').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      const url = this.getAttribute('href');
      if (url) window.open(url, '_blank', 'noopener,noreferrer');
    });
  });
  // Footer bottom social icon buttons
  document.querySelectorAll('.footer-social a').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      const url = this.getAttribute('href');
      if (url) window.open(url, '_blank', 'noopener,noreferrer');
    });
  });
  // Footer text links (TikTok, Facebook, etc.)
  document.querySelectorAll('.footer-grid a[href^="http"]').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      const url = this.getAttribute('href');
      if (url) window.open(url, '_blank', 'noopener,noreferrer');
    });
  });
}

// ─── Init ───
document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initSlider();
  initNavbar();
  initMobileToggle();
  initCounters();
  initResultsLightbox();
  initContactForm();
  initFaqAccordion();
  initJourneyTimeline();
  initHeroVideo();
  initSocialLinks();
  initPricingDots();
});
