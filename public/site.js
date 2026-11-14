const menu = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#site-navigation');
const mobile = window.matchMedia('(max-width: 800px)');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

document.querySelectorAll('[data-background-video]').forEach(section => {
  const video = section.querySelector('video');
  let inView = !('IntersectionObserver' in window);

  function syncPlayback() {
    if (inView && !reducedMotion.matches && !document.hidden) video.play().catch(() => {});
    else video.pause();
  }

  reducedMotion.addEventListener('change', syncPlayback);
  document.addEventListener('visibilitychange', syncPlayback);
  if (inView) syncPlayback();
  else new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    syncPlayback();
  }, { threshold: 0.12 }).observe(section);
});

const scrollMedia = [...document.querySelectorAll('[data-scroll-media]')];

if (scrollMedia.length) {
  let frame = 0;

  function updateScrollMedia() {
    frame = 0;
    const viewport = window.innerHeight;
    const active = !reducedMotion.matches && !mobile.matches;
    scrollMedia.forEach(section => {
      const { top, height, bottom } = section.getBoundingClientRect();
      if (active && (bottom <= 0 || top >= viewport)) return;
      const progress = (viewport - top) / (viewport + height);
      const offset = active ? (progress - .5) * height * .14 : 0;
      section.style.setProperty('--scroll-offset', `${offset.toFixed(2)}px`);
    });
  }

  function queueScrollUpdate() {
    if (!frame) frame = requestAnimationFrame(updateScrollMedia);
  }

  reducedMotion.addEventListener('change', queueScrollUpdate);
  window.addEventListener('scroll', queueScrollUpdate, { passive: true });
  window.addEventListener('resize', queueScrollUpdate);
  updateScrollMedia();
}

if (!reducedMotion.matches && 'IntersectionObserver' in window) {
  const entrance = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('enter-visible');
      entrance.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('[data-enter]').forEach(element => entrance.observe(element));
}

function setMenu(open) {
  menu.setAttribute('aria-expanded', String(open));
  navigation.toggleAttribute('data-collapsed', mobile.matches && !open);
}

function sizeMenu() {
  menu.hidden = !mobile.matches;
  setMenu(false);
}

if (menu && navigation) {
  sizeMenu();
  mobile.addEventListener('change', sizeMenu);
  menu.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') === 'false'));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      menu.focus();
    }
  });
}

const photos = [...document.querySelectorAll('[data-project-photo]')];
const lightbox = document.querySelector('.lightbox');

if (lightbox?.showModal) {
  const preview = lightbox.querySelector('img');
  const status = lightbox.querySelector('[data-photo-status]');
  const expand = lightbox.querySelector('[data-photo-expand]');
  let index = 0;
  let trigger;

  function showPhoto(nextIndex) {
    index = (nextIndex + photos.length) % photos.length;
    const link = photos[index];
    preview.src = link.href;
    preview.alt = link.querySelector('img').alt;
    status.textContent = `Photo ${index + 1} of ${photos.length}`;
    setExpanded(false);
  }

  function setExpanded(expanded) {
    lightbox.classList.toggle('lightbox--expanded', expanded);
    expand.setAttribute('aria-pressed', String(expanded));
    expand.setAttribute('aria-label', expanded ? 'Reset photo size' : 'Enlarge photo');
    expand.textContent = expanded ? '−' : '+';
  }

  photos.forEach((link, photoIndex) => {
    link.addEventListener('click', event => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      trigger = link;
      showPhoto(photoIndex);
      lightbox.showModal();
    });
  });

  lightbox.querySelector('[data-photo-prev]').addEventListener('click', () => showPhoto(index - 1));
  lightbox.querySelector('[data-photo-next]').addEventListener('click', () => showPhoto(index + 1));
  expand.addEventListener('click', () => setExpanded(expand.getAttribute('aria-pressed') === 'false'));
  lightbox.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      showPhoto(index - 1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      showPhoto(index + 1);
    }
  });
  lightbox.addEventListener('close', () => trigger?.focus());
}

const reviewCarousel = document.querySelector('[data-review-carousel]');

if (reviewCarousel) {
  const slides = [...reviewCarousel.querySelectorAll('.review-slide')];
  const dots = [...reviewCarousel.querySelectorAll('[data-review-index]')];
  let index = 0;

  function showReview(nextIndex) {
    index = (nextIndex + slides.length) % slides.length;
    slides.forEach((slide, position) => { slide.hidden = position !== index; });
    dots.forEach((dot, position) => dot.setAttribute('aria-pressed', String(position === index)));
  }

  reviewCarousel.querySelector('[data-review-prev]').addEventListener('click', () => showReview(index - 1));
  reviewCarousel.querySelector('[data-review-next]').addEventListener('click', () => showReview(index + 1));
  dots.forEach((dot, position) => dot.addEventListener('click', () => showReview(position)));
  reviewCarousel.addEventListener('keydown', event => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    showReview(index + (event.key === 'ArrowRight' ? 1 : -1));
  });
}
