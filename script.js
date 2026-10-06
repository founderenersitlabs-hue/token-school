/* ============================================
   TOKEN SCHOOL — JavaScript
   ============================================ */

'use strict';

// ── Particles Canvas ──────────────────────────
(function initParticles() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  const COLORS = ['rgba(108,99,255,', 'rgba(0,212,170,', 'rgba(255,107,157,', 'rgba(247,183,49,'];

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function Particle() {
    this.reset();
  }
  Particle.prototype.reset = function() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.r = Math.random() * 2 + 0.5;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = (Math.random() - 0.5) * 0.3;
    this.alpha = Math.random() * 0.6 + 0.1;
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
  };
  Particle.prototype.update = function() {
    this.x += this.vx; this.y += this.vy;
    if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
  };
  Particle.prototype.draw = function() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = this.color + this.alpha + ')';
    ctx.fill();
  };

  function init() {
    resize();
    particles = Array.from({ length: 80 }, () => new Particle());
    animate();
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(108,99,255,${0.08 * (1 - dist / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', resize);
  init();
})();

// ── Nav scroll effect ─────────────────────────
(function initNav() {
  const nav = document.getElementById('nav');
  const burger = document.getElementById('nav-burger');
  const links = document.getElementById('nav-links');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  });

  if (burger) {
    burger.addEventListener('click', () => {
      const isOpen = links.style.display === 'flex';
      links.style.cssText = isOpen ? '' : `
        display: flex; flex-direction: column; position: absolute;
        top: 72px; left: 0; right: 0;
        background: rgba(10,10,20,0.98); backdrop-filter: blur(20px);
        padding: 1rem; border-bottom: 1px solid rgba(108,99,255,0.2);
        gap: 0.25rem;
      `;
    });
  }

  // Smooth scroll for nav links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Close mobile nav if open
        if (links && links.style.display === 'flex') links.style.display = '';
      }
    });
  });
})();

// ── Typewriter Effect ─────────────────────────
(function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;
  const phrases = ['Full Potential.', 'Board Exam Goals.', 'Dream Career.', 'Best Score Yet.'];
  let phraseIdx = 0, charIdx = 0, deleting = false;

  function type() {
    const current = phrases[phraseIdx];
    if (deleting) {
      el.textContent = current.slice(0, charIdx--);
      if (charIdx < 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        charIdx = 0;
        setTimeout(type, 400);
        return;
      }
    } else {
      el.textContent = current.slice(0, charIdx++);
      if (charIdx > current.length) {
        deleting = true;
        setTimeout(type, 1800);
        return;
      }
    }
    setTimeout(type, deleting ? 50 : 80);
  }
  type();
})();

// ── Counter Animation ─────────────────────────
(function initCounters() {
  const counters = document.querySelectorAll('.stat__num[data-target]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const suffix = el.dataset.suffix || '';
      let start = 0;
      const duration = 1800;
      const startTime = performance.now();

      function update(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(ease * target);
        el.textContent = current.toLocaleString('en-IN') + suffix;
        if (progress < 1) requestAnimationFrame(update);
        else el.textContent = target.toLocaleString('en-IN') + suffix;
      }
      requestAnimationFrame(update);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
})();

// ── Scroll Reveal ─────────────────────────────
(function initScrollReveal() {
  const revealEls = [
    '.class-card', '.subject-tile', '.feature-card',
    '.step', '.testi-card', '.price-card', '.section__header'
  ];
  revealEls.forEach(sel => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.classList.add('animate-in');
      el.style.transitionDelay = `${i * 0.07}s`;
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.animate-in').forEach(el => observer.observe(el));
})();

// ── Testimonials Slider ───────────────────────
(function initTestimonials() {
  const track = document.getElementById('testi-track');
  const prevBtn = document.getElementById('testi-prev');
  const nextBtn = document.getElementById('testi-next');
  const dotsContainer = document.getElementById('testi-dots');
  if (!track) return;

  const cards = track.querySelectorAll('.testi-card');
  let current = 0;
  const perView = window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;
  const total = Math.ceil(cards.length / perView);

  // Create dots
  for (let i = 0; i < total; i++) {
    const dot = document.createElement('button');
    dot.className = 'testi-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Slide ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  }

  function goTo(idx) {
    current = (idx + total) % total;
    const cardW = cards[0].offsetWidth + 24; // gap
    track.scrollTo({ left: current * cardW * perView, behavior: 'smooth' });
    document.querySelectorAll('.testi-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));

  // Auto-play
  let timer = setInterval(() => goTo(current + 1), 4000);
  track.addEventListener('mouseenter', () => clearInterval(timer));
  track.addEventListener('mouseleave', () => {
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), 4000);
  });
})();

// ── Pricing Toggle ────────────────────────────
(function initPricing() {
  const toggle = document.getElementById('billing-toggle');
  if (!toggle) return;

  toggle.addEventListener('change', () => {
    const isAnnual = toggle.checked;
    document.querySelectorAll('.monthly-price').forEach(el => {
      el.style.display = isAnnual ? 'none' : 'inline';
    });
    document.querySelectorAll('.annual-price').forEach(el => {
      el.style.display = isAnnual ? 'inline' : 'none';
    });
    document.querySelectorAll('.annual-note').forEach(el => {
      el.style.display = isAnnual ? 'block' : 'none';
    });
  });
})();

// ── Active Nav on Scroll ──────────────────────
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - 120) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  });
})();

// ── Parallax subtle on hero ───────────────────
(function initParallax() {
  const orbs = document.querySelectorAll('.hero__orb');
  window.addEventListener('mousemove', (e) => {
    const xRatio = (e.clientX / window.innerWidth - 0.5) * 20;
    const yRatio = (e.clientY / window.innerHeight - 0.5) * 20;
    orbs.forEach((orb, i) => {
      const factor = (i + 1) * 0.5;
      orb.style.transform = `translate(${xRatio * factor}px, ${yRatio * factor}px)`;
    });
  });
})();

// ── Add active style for nav ──────────────────
const style = document.createElement('style');
style.textContent = `.nav__link.active { color: var(--text-primary) !important; background: rgba(108,99,255,0.1); }`;
document.head.appendChild(style);

console.log('🎓 Token School — Where Every Student Unlocks Their Full Potential.');
