/* ============================================
   LUMIERE — World Cinematography Tribute
   JavaScript — Animations & Interactivity
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // --- Preloader with Curtain Reveal ---
  const preloader = document.getElementById('preloader');
  let preloaderDismissed = false;

  function dismissPreloader() {
    if (preloaderDismissed) return;
    preloaderDismissed = true;
    preloader.classList.add('hidden');
    setTimeout(() => {
      document.body.style.overflow = 'auto';
      triggerHeroAnimations();
      setTimeout(() => document.body.classList.add('cinematic-mode'), 800);
    }, 600);
    setTimeout(() => {
      preloader.style.display = 'none';
    }, 2500);
  }

  window.addEventListener('load', () => {
    setTimeout(dismissPreloader, 2400);
  });

  // Fallback
  setTimeout(dismissPreloader, 4500);

  // --- Custom Cursor ---
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorRing = document.querySelector('.cursor-ring');

  if (cursorDot && cursorRing && window.innerWidth > 768) {
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = mouseX + 'px';
      cursorDot.style.top = mouseY + 'px';
    });

    function animateCursor() {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top = ringY + 'px';
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover effect on interactive elements
    const hoverTargets = document.querySelectorAll('a, button, .cinema-card, .master-card, .philosophy-card, .film-frame-card');
    hoverTargets.forEach(el => {
      el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
      el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
    });
  }

  // --- Navbar Scroll Effect ---
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // --- Mobile Menu ---
  const menuBtn = document.querySelector('.nav-menu-btn');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (menuBtn) {
    menuBtn.addEventListener('click', () => {
      menuBtn.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : 'auto';
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuBtn.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = 'auto';
      });
    });
  }

  // --- Hero Slideshow ---
  const heroSlides = document.querySelectorAll('.hero-slide');
  let currentSlide = 0;

  function nextHeroSlide() {
    heroSlides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % heroSlides.length;
    heroSlides[currentSlide].classList.add('active');
  }

  setInterval(nextHeroSlide, 6000);

  // --- Hero Animations Trigger ---
  function triggerHeroAnimations() {
    const heroReveals = document.querySelectorAll('#hero .reveal-up');
    heroReveals.forEach(el => {
      setTimeout(() => {
        el.classList.add('visible');
      }, parseFloat(getComputedStyle(el).getPropertyValue('--delay') || 0) * 1000);
    });
    animateCounters();
  }

  // --- Counter Animation ---
  function animateCounters() {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    counters.forEach(counter => {
      const target = parseInt(counter.dataset.target);
      const duration = 2000;
      const startTime = performance.now();

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * target);

        if (target >= 1000) {
          counter.textContent = current.toLocaleString() + '+';
        } else {
          counter.textContent = current + '+';
        }

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        }
      }
      requestAnimationFrame(updateCounter);
    });
  }

  // --- Scroll Reveal (Intersection Observer) ---
  const revealElements = document.querySelectorAll('.reveal-up:not(#hero .reveal-up), .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // --- Smooth Scroll for Anchor Links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        const offset = 80;
        const position = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: position, behavior: 'smooth' });
      }
    });
  });

  // --- Quotes Carousel ---
  const quoteSlides = document.querySelectorAll('.quote-slide');
  const quotePrev = document.querySelector('.quote-prev');
  const quoteNext = document.querySelector('.quote-next');
  const quoteDots = document.querySelector('.quote-dots');
  let currentQuote = 0;
  let quoteInterval;

  if (quoteDots) {
    quoteSlides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.classList.add('quote-dot');
      dot.setAttribute('aria-label', `Quote ${i + 1}`);
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToQuote(i));
      quoteDots.appendChild(dot);
    });
  }

  function goToQuote(index) {
    quoteSlides[currentQuote].classList.remove('active');
    const dots = document.querySelectorAll('.quote-dot');
    if (dots[currentQuote]) dots[currentQuote].classList.remove('active');

    currentQuote = index;
    if (currentQuote >= quoteSlides.length) currentQuote = 0;
    if (currentQuote < 0) currentQuote = quoteSlides.length - 1;

    quoteSlides[currentQuote].classList.add('active');
    if (dots[currentQuote]) dots[currentQuote].classList.add('active');

    resetQuoteAutoplay();
  }

  function resetQuoteAutoplay() {
    clearInterval(quoteInterval);
    quoteInterval = setInterval(() => goToQuote(currentQuote + 1), 7000);
  }

  if (quotePrev) quotePrev.addEventListener('click', () => goToQuote(currentQuote - 1));
  if (quoteNext) quoteNext.addEventListener('click', () => goToQuote(currentQuote + 1));

  quoteInterval = setInterval(() => goToQuote(currentQuote + 1), 7000);

  // --- Parallax Effect on Scroll ---
  const parallaxBgs = document.querySelectorAll('.parallax-bg');

  function updateParallax() {
    parallaxBgs.forEach(bg => {
      const section = bg.parentElement;
      const rect = section.getBoundingClientRect();
      const speed = 0.3;

      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const yPos = -(rect.top * speed);
        bg.style.transform = `translateY(${yPos}px)`;
      }
    });
  }

  window.addEventListener('scroll', () => {
    requestAnimationFrame(updateParallax);
  });

  // --- Toggle letterbox bars on parallax quote sections ---
  const parallaxSections = document.querySelectorAll('.parallax-quote');
  const letterboxObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        document.body.classList.remove('cinematic-mode');
      } else {
        document.body.classList.add('cinematic-mode');
      }
    });
  }, { threshold: 0.3 });

  parallaxSections.forEach(s => letterboxObserver.observe(s));

  // --- Tilt Effect on Cinema Cards ---
  if (window.innerWidth > 768) {
    const cards = document.querySelectorAll('.cinema-card, .master-card');

    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / centerY * -3;
        const rotateY = (x - centerX) / centerX * 3;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
      });
    });
  }

  // --- Lazy Loading Enhancement ---
  const images = document.querySelectorAll('img[loading="lazy"]');
  images.forEach(img => {
    img.addEventListener('load', () => {
      img.style.opacity = '1';
    });
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.5s ease';
    if (img.complete) {
      img.style.opacity = '1';
    }
  });

  // --- Page Visibility: Pause animations when tab is hidden ---
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      clearInterval(quoteInterval);
    } else {
      quoteInterval = setInterval(() => goToQuote(currentQuote + 1), 7000);
    }
  });


  // =============================================
  // NEW FEATURES
  // =============================================


  // --- Scroll Progress Bar ---
  const scrollProgressFill = document.querySelector('.scroll-progress-fill');

  function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (scrollProgressFill) {
      scrollProgressFill.style.width = progress + '%';
    }
  }

  window.addEventListener('scroll', () => {
    requestAnimationFrame(updateScrollProgress);
  });


  // --- Back to Top Button ---
  const backToTop = document.getElementById('back-to-top');

  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 600) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  // --- Ambient Projector Sound (Web Audio API) ---
  const ambientToggle = document.getElementById('ambient-toggle');
  let audioCtx = null;
  let ambientPlaying = false;
  let ambientNodes = [];

  function createAmbientSound() {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    // Brown noise for projector hum
    const bufferSize = 2 * audioCtx.sampleRate;
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    let lastOut = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5;
    }

    const noiseSource = audioCtx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    // Low-pass filter for muffled projector feel
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 200;
    filter.Q.value = 1;

    // Gain control
    const gainNode = audioCtx.createGain();
    gainNode.gain.value = 0;

    noiseSource.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    noiseSource.start();

    // Subtle click/flicker - periodic tick
    const clickOsc = audioCtx.createOscillator();
    clickOsc.type = 'square';
    clickOsc.frequency.value = 12; // ~12fps projector speed

    const clickGain = audioCtx.createGain();
    clickGain.gain.value = 0;

    const clickFilter = audioCtx.createBiquadFilter();
    clickFilter.type = 'highpass';
    clickFilter.frequency.value = 800;

    clickOsc.connect(clickFilter);
    clickFilter.connect(clickGain);
    clickGain.connect(audioCtx.destination);
    clickOsc.start();

    ambientNodes = { noiseSource, gainNode, clickOsc, clickGain };

    // Fade in
    gainNode.gain.linearRampToValueAtTime(0.08, audioCtx.currentTime + 1);
    clickGain.gain.linearRampToValueAtTime(0.015, audioCtx.currentTime + 1);
  }

  function stopAmbientSound() {
    if (ambientNodes.gainNode) {
      ambientNodes.gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.5);
      ambientNodes.clickGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.5);
    }
    setTimeout(() => {
      if (audioCtx) {
        audioCtx.close();
        audioCtx = null;
        ambientNodes = [];
      }
    }, 600);
  }

  if (ambientToggle) {
    ambientToggle.addEventListener('click', () => {
      if (!ambientPlaying) {
        createAmbientSound();
        ambientToggle.classList.add('active');
        ambientToggle.querySelector('.sound-off').style.display = 'none';
        ambientToggle.querySelector('.sound-on').style.display = 'block';
      } else {
        stopAmbientSound();
        ambientToggle.classList.remove('active');
        ambientToggle.querySelector('.sound-off').style.display = 'block';
        ambientToggle.querySelector('.sound-on').style.display = 'none';
      }
      ambientPlaying = !ambientPlaying;
    });
  }


  // --- Exposure Shift on Masters Section ---
  const mastersSection = document.getElementById('masters');

  if (mastersSection) {
    const exposureObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const ratio = entry.intersectionRatio;
        // As the section comes into view, brightness increases (like a lens opening)
        const brightness = 0.7 + (ratio * 0.3);
        const contrast = 0.9 + (ratio * 0.1);
        mastersSection.style.filter = `brightness(${brightness}) contrast(${contrast})`;
      });
    }, {
      threshold: Array.from({ length: 20 }, (_, i) => i / 20)
    });

    exposureObserver.observe(mastersSection);
  }


  // --- Spotlight Search (Ctrl+K / Cmd+K) ---
  const spotlightOverlay = document.getElementById('spotlight');
  const spotlightInput = document.getElementById('spotlight-input');
  const spotlightResults = document.getElementById('spotlight-results');
  const spotlightTrigger = document.querySelector('.spotlight-trigger');

  // Search index
  const searchData = [
    // Films from World Cinema
    { title: 'The Godfather', meta: 'Hollywood — USA', section: '#world-cinema', icon: '🎬' },
    { title: 'Citizen Kane', meta: 'Hollywood — USA', section: '#world-cinema', icon: '🎬' },
    { title: '2001: A Space Odyssey', meta: 'Hollywood — USA', section: '#world-cinema', icon: '🎬' },
    { title: 'Breathless', meta: 'French New Wave — France', section: '#world-cinema', icon: '🎬' },
    { title: 'The 400 Blows', meta: 'French New Wave — France', section: '#world-cinema', icon: '🎬' },
    { title: 'Amelie', meta: 'French New Wave — France', section: '#world-cinema', icon: '🎬' },
    { title: 'Seven Samurai', meta: 'Japanese Cinema — Japan', section: '#world-cinema', icon: '🎬' },
    { title: 'Spirited Away', meta: 'Japanese Cinema — Japan', section: '#world-cinema', icon: '🎬' },
    { title: 'Tokyo Story', meta: 'Japanese Cinema — Japan', section: '#world-cinema', icon: '🎬' },
    { title: 'Cinema Paradiso', meta: 'Italian Neorealism — Italy', section: '#world-cinema', icon: '🎬' },
    { title: 'Bicycle Thieves', meta: 'Italian Neorealism — Italy', section: '#world-cinema', icon: '🎬' },
    { title: 'La Dolce Vita', meta: 'Italian Neorealism — Italy', section: '#world-cinema', icon: '🎬' },
    { title: 'Parasite', meta: 'Korean Wave — South Korea', section: '#world-cinema', icon: '🎬' },
    { title: 'Oldboy', meta: 'Korean Wave — South Korea', section: '#world-cinema', icon: '🎬' },
    { title: 'Memories of Murder', meta: 'Korean Wave — South Korea', section: '#world-cinema', icon: '🎬' },
    { title: 'Pather Panchali', meta: 'Indian Cinema — India', section: '#world-cinema', icon: '🎬' },
    { title: 'RRR', meta: 'Indian Cinema — India', section: '#world-cinema', icon: '🎬' },
    { title: 'A Separation', meta: 'Iranian New Wave — Iran', section: '#world-cinema', icon: '🎬' },
    { title: 'Metropolis', meta: 'German Expressionism — Germany', section: '#world-cinema', icon: '🎬' },
    { title: 'Nosferatu', meta: 'German Expressionism — Germany', section: '#world-cinema', icon: '🎬' },
    { title: 'In the Mood for Love', meta: 'Hong Kong Cinema', section: '#world-cinema', icon: '🎬' },
    { title: 'The Seventh Seal', meta: 'Scandinavian Cinema — Sweden', section: '#world-cinema', icon: '🎬' },
    { title: 'Roma', meta: 'Mexican Cinema — Mexico', section: '#world-cinema', icon: '🎬' },
    { title: "Pan's Labyrinth", meta: 'Mexican Cinema — Mexico', section: '#world-cinema', icon: '🎬' },
    { title: 'Stalker', meta: 'Russian Cinema — Russia', section: '#world-cinema', icon: '🎬' },
    { title: 'Mad Max: Fury Road', meta: 'Australian Cinema', section: '#world-cinema', icon: '🎬' },

    // My Picks
    { title: 'Goodfellas', meta: 'My Picks — 1990', section: '#my-collection', icon: '🎞️' },
    { title: 'The Godfather', meta: 'My Picks — 1972', section: '#my-collection', icon: '🎞️' },
    { title: 'La Haine', meta: 'My Picks — 1995', section: '#my-collection', icon: '🎞️' },
    { title: 'American History X', meta: 'My Picks — 1998', section: '#my-collection', icon: '🎞️' },
    { title: 'Pulp Fiction', meta: 'My Picks — 1994', section: '#my-collection', icon: '🎞️' },
    { title: 'Fight Club', meta: 'My Picks — 1999', section: '#my-collection', icon: '🎞️' },

    // Cinematographers
    { title: 'Roger Deakins', meta: 'Cinematographer — United Kingdom', section: '#masters', icon: '📷' },
    { title: 'Emmanuel Lubezki', meta: 'Cinematographer — Mexico', section: '#masters', icon: '📷' },
    { title: 'Vittorio Storaro', meta: 'Cinematographer — Italy', section: '#masters', icon: '📷' },
    { title: 'Hoyte van Hoytema', meta: 'Cinematographer — Netherlands', section: '#masters', icon: '📷' },
    { title: 'Rachel Morrison', meta: 'Cinematographer — United States', section: '#masters', icon: '📷' },
    { title: 'Kazuo Miyagawa', meta: 'Cinematographer — Japan', section: '#masters', icon: '📷' },

    // Directors (mentioned throughout)
    { title: 'Martin Scorsese', meta: 'Director — USA', section: '#my-collection', icon: '🎥' },
    { title: 'Francis Ford Coppola', meta: 'Director — USA', section: '#my-collection', icon: '🎥' },
    { title: 'Quentin Tarantino', meta: 'Director — USA', section: '#my-collection', icon: '🎥' },
    { title: 'David Fincher', meta: 'Director — USA', section: '#my-collection', icon: '🎥' },
    { title: 'Akira Kurosawa', meta: 'Director — Japan', section: '#world-cinema', icon: '🎥' },
    { title: 'Bong Joon-ho', meta: 'Director — South Korea', section: '#world-cinema', icon: '🎥' },
    { title: 'Wong Kar-wai', meta: 'Director — Hong Kong', section: '#world-cinema', icon: '🎥' },
    { title: 'Ingmar Bergman', meta: 'Director — Sweden', section: '#world-cinema', icon: '🎥' },
    { title: 'Federico Fellini', meta: 'Director — Italy', section: '#world-cinema', icon: '🎥' },

    // Sections
    { title: 'World Cinema', meta: 'Section — 14 cinematic traditions', section: '#world-cinema', icon: '🌍' },
    { title: 'Masters of Light', meta: 'Section — Legendary cinematographers', section: '#masters', icon: '💡' },
    { title: 'Timeline', meta: 'Section — Evolution of cinema', section: '#timeline', icon: '📅' },
    { title: 'Philosophy', meta: 'Section — Why cinema matters', section: '#philosophy', icon: '🎭' },
    { title: 'My Collection', meta: 'Section — Personal picks', section: '#my-collection', icon: '❤️' },

    // Decades
    { title: '1895 — The Birth of Cinema', meta: 'Timeline', section: '#timeline', icon: '📅' },
    { title: '1920s — Silent Mastery', meta: 'Timeline', section: '#timeline', icon: '📅' },
    { title: '1930s — The Golden Age', meta: 'Timeline', section: '#timeline', icon: '📅' },
    { title: '1940s-50s — Neorealism & Noir', meta: 'Timeline', section: '#timeline', icon: '📅' },
    { title: '1960s — New Waves', meta: 'Timeline', section: '#timeline', icon: '📅' },
    { title: '1970s — New Hollywood', meta: 'Timeline', section: '#timeline', icon: '📅' },
    { title: '1980s-90s — Global Expansion', meta: 'Timeline', section: '#timeline', icon: '📅' },
    { title: '2000s — Digital Dawn', meta: 'Timeline', section: '#timeline', icon: '📅' },
    { title: '2010s-Now — Borderless Art', meta: 'Timeline', section: '#timeline', icon: '📅' },
  ];

  function openSpotlight() {
    spotlightOverlay.classList.add('active');
    spotlightInput.value = '';
    spotlightInput.focus();
    renderResults('');
  }

  function closeSpotlight() {
    spotlightOverlay.classList.remove('active');
    spotlightInput.value = '';
    spotlightResults.innerHTML = '';
  }

  function renderResults(query) {
    const q = query.toLowerCase().trim();

    let filtered;
    if (!q) {
      // Show sections as default
      filtered = searchData.filter(d => d.meta.startsWith('Section'));
    } else {
      filtered = searchData.filter(d =>
        d.title.toLowerCase().includes(q) ||
        d.meta.toLowerCase().includes(q)
      );
    }

    if (filtered.length === 0) {
      spotlightResults.innerHTML = '<div class="spotlight-empty">No results found</div>';
      return;
    }

    // Limit to 10 results
    filtered = filtered.slice(0, 10);

    spotlightResults.innerHTML = filtered.map((item, i) => `
      <div class="spotlight-result${i === 0 ? ' selected' : ''}" data-section="${item.section}">
        <span class="spotlight-result-icon">${item.icon}</span>
        <div class="spotlight-result-text">
          <div class="spotlight-result-title">${highlightMatch(item.title, q)}</div>
          <div class="spotlight-result-meta">${item.meta}</div>
        </div>
      </div>
    `).join('');

    // Click to navigate
    spotlightResults.querySelectorAll('.spotlight-result').forEach(el => {
      el.addEventListener('click', () => {
        const section = el.dataset.section;
        const target = document.querySelector(section);
        if (target) {
          closeSpotlight();
          const offset = 80;
          const position = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top: position, behavior: 'smooth' });
        }
      });
    });
  }

  function highlightMatch(text, query) {
    if (!query) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<strong style="color:var(--gold)">$1</strong>');
  }

  // Keyboard shortcut: Ctrl+K / Cmd+K
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      if (spotlightOverlay.classList.contains('active')) {
        closeSpotlight();
      } else {
        openSpotlight();
      }
    }

    if (e.key === 'Escape' && spotlightOverlay.classList.contains('active')) {
      closeSpotlight();
    }

    // Arrow navigation in spotlight
    if (spotlightOverlay.classList.contains('active')) {
      const results = spotlightResults.querySelectorAll('.spotlight-result');
      const selected = spotlightResults.querySelector('.spotlight-result.selected');
      let idx = Array.from(results).indexOf(selected);

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (selected) selected.classList.remove('selected');
        idx = (idx + 1) % results.length;
        results[idx].classList.add('selected');
        results[idx].scrollIntoView({ block: 'nearest' });
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (selected) selected.classList.remove('selected');
        idx = idx <= 0 ? results.length - 1 : idx - 1;
        results[idx].classList.add('selected');
        results[idx].scrollIntoView({ block: 'nearest' });
      }

      if (e.key === 'Enter' && selected) {
        selected.click();
      }
    }

    // Quote navigation (only when spotlight is not open)
    if (!spotlightOverlay.classList.contains('active')) {
      if (e.key === 'ArrowLeft') goToQuote(currentQuote - 1);
      if (e.key === 'ArrowRight') goToQuote(currentQuote + 1);
    }
  });

  // Search input
  if (spotlightInput) {
    spotlightInput.addEventListener('input', (e) => {
      renderResults(e.target.value);
    });
  }

  // Click outside to close
  if (spotlightOverlay) {
    spotlightOverlay.addEventListener('click', (e) => {
      if (e.target === spotlightOverlay) {
        closeSpotlight();
      }
    });
  }

  // Trigger button
  if (spotlightTrigger) {
    spotlightTrigger.addEventListener('click', openSpotlight);
  }

});
