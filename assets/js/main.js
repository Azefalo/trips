const initNav = () => {
  const navToggle = document.getElementById('nav-toggle');
  const siteNav = document.getElementById('site-nav');

  if (!navToggle || !siteNav) return;

  const openNav = () => {
    document.body.classList.add('nav-open');
    navToggle.setAttribute('aria-expanded', 'true');
  };

  const closeNav = () => {
    document.body.classList.remove('nav-open');
    navToggle.setAttribute('aria-expanded', 'false');
  };

  navToggle.addEventListener('click', () => {
    document.body.classList.contains('nav-open') ? closeNav() : openNav();
  });

  document.addEventListener('click', (e) => {
    if (document.body.classList.contains('nav-open') &&
        !siteNav.contains(e.target) &&
        !navToggle.contains(e.target)) {
      closeNav();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.body.classList.contains('nav-open')) {
      closeNav();
      navToggle.focus();
    }
  });
};

const initScrollHeader = () => {
  const header = document.querySelector('.site-header');
  if (!header) return;

  let ticking = false;

  const updateHeader = () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
    ticking = false;
  };

  // rAF throttle prevents layout thrashing on rapid scroll events
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateHeader);
      ticking = true;
    }
  }, { passive: true });

  updateHeader();
};

const initSmoothScroll = () => {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href').slice(1);
      if (!id) return;

      const target = document.getElementById(id);
      if (!target) return;

      e.preventDefault();

      if (document.body.classList.contains('nav-open')) {
        document.body.classList.remove('nav-open');
        const toggle = document.getElementById('nav-toggle');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
      }

      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
};

const initLazyLoad = () => {
  const images = document.querySelectorAll('img.lazy');
  if (!images.length) return;

  if (!('IntersectionObserver' in window)) {
    images.forEach((img) => img.classList.add('loaded'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('loaded');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  images.forEach((img) => observer.observe(img));
};

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initScrollHeader();
  initSmoothScroll();
  initLazyLoad();
});
