import { bookings, business, projectPhotos, reviews, services } from './content.mjs';

const pages = [
  { id: 'home', title: 'Home', path: '' },
  { id: 'services', title: 'Services', path: 'services/' },
  { id: 'contact', title: 'Contact', path: 'contact/' },
  { id: 'about', title: 'About Us', path: 'about/' },
];
const sms = `sms:${business.phoneNumber}`;
const tel = `tel:${business.phoneNumber}`;
const displayPhone = business.phone.replaceAll('-', ' ');
const textLink = `<a href="${sms}" aria-label="Text ${displayPhone}">${displayPhone}</a>`;
const callOption = `(<a href="${tel}" aria-label="Call ${displayPhone}">or call</a>)`;
const contactEstimate = '/contact/#estimate';
const email = `<a href="mailto:${business.email}">${business.email}</a>`;

function estimateEmail(service) {
  return `mailto:${business.email}?subject=${encodeURIComponent(`Free estimate - ${service}`)}`;
}

function businessLocations(withDirections = false) {
  return `<ul class="locations">${business.locations.map(({ city, street, postalCode }) => {
    const address = `${city}, BC ${postalCode}`;
    const map = `https://www.google.com/maps/search/?api=1&amp;query=${encodeURIComponent(`${street}, ${address}`)}`;
    return `<li><address><span>${street}</span><span>${address}</span></address>
      ${withDirections ? `<a class="text-link" href="${map}" aria-label="View ${city} location on map">View on map</a>` : ''}</li>`;
  }).join('')}</ul>`;
}

function image(name, alt, attrs = 'loading="lazy" decoding="async"') {
  return `<img src="/images/${name}.avif" alt="${alt}" ${attrs}>`;
}

function button(text, url, style = 'primary') {
  return `<a class="button button--${style}" href="${url}">${text}</a>`;
}

function logo() {
  return `<a class="brand" href="/" aria-label="Nikato Landscape Home">
    ${image('nikato-logo', '', 'width="105" height="72"')}
    <span data-enter>NIKATO Landscape Maintenance Inc.</span>
  </a>`;
}

function nav(active) {
  return pages.map(({ id, path, title }) =>
    `<a href="/${path}"${active === id ? ' aria-current="page"' : ''}>${title}</a>`,
  ).join('');
}

function header(active) {
  return `<a class="skip-link" href="#main">Skip to content</a>
  <header class="site-header">
    <div class="header__brand">${logo()}</div>
    <div class="header__menu">
      <button type="button" class="menu-toggle" aria-controls="site-navigation" aria-expanded="false" hidden>Menu</button>
      <nav id="site-navigation" class="nav" aria-label="Main navigation" data-enter>
        ${nav(active)}<span class="nav__phone">Text ${callOption} ${textLink}</span>
      </nav>
    </div>
  </header>`;
}

function footer() {
  return `<footer class="footer">
    <div class="wrap footer__grid">
      <div class="footer__brand"><h2><a href="/">${business.name.toUpperCase()}</a></h2>
        <a href="/" class="footer__logo">${image('nikato-footer-logo', 'Nikato Landscape Maintenance')}</a>
      </div>
      <div class="footer__contact"><p><strong>Text ${callOption}:</strong> ${textLink}</p><p><strong>Email:</strong> ${email}</p>
        <h3>Addresses</h3>${businessLocations()}
      </div>
    </div>
    <div class="wrap footer__bottom"><span>© ${new Date().getFullYear()} ${business.name}</span></div>
  </footer>`;
}

function layout({ active, title, description, content, noIndex = false }) {
  return `<!doctype html>
<html lang="en-CA">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <meta name="description" content="${description}">
  ${noIndex ? '<meta name="robots" content="noindex">' : ''}
  <meta property="og:type" content="website">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta name="theme-color" content="#f6fafb">
  <link rel="icon" type="image/avif" href="/images/nikato-logo.avif">
  <link rel="stylesheet" href="/styles/site.css">
  <script src="/site.js" defer></script>
</head>
<body>
  ${header(active)}
  <main id="main">${content}</main>
  ${footer()}
</body>
</html>`;
}

function pageIntro(label, title, copy, className = '') {
  return `<section class="page-intro ${className}"><div class="wrap">
    <p class="eyebrow">${label}</p><h1>${title}</h1><p class="intro-copy">${copy}</p>
  </div></section>`;
}

function serviceCards(items, detailed = false) {
  const originalNames = { 'tree-trimming': 'Tree Trimming', fencing: detailed ? 'Fencing' : 'Fencing &amp; Maintenance', maintenance: 'Maintenance' };
  return `<div class="service-grid${detailed ? ' service-grid--full' : ''}">${items.map(service => {
    const name = originalNames[service.id] || service.name;
    const url = detailed ? contactEstimate : `/services/#${service.id}`;
    return `
    <article class="service-card" id="${service.id}">
      <a class="service-card__link" href="${url}">${image(service.image, '')}<h3>${name}</h3></a>
      ${detailed ? `
      <div class="service-card__body">
        <p>${service.description}</p>
        <a class="text-link" href="${url}" aria-label="Get an estimate for ${service.name}">Get an estimate</a>
      </div>` : ''}
    </article>`;
  }).join('')}</div>`;
}

function projectGrid(items) {
  return `<div class="project-grid">${items.map((photo, index) => `
    <a class="project-photo" href="/images/${photo.image}.avif" data-project-photo aria-label="View project photo ${index + 1}">
      ${image(photo.image, photo.alt)}
    </a>`).join('')}</div>
    <dialog class="lightbox" aria-label="Project photo gallery">
      <div class="lightbox__toolbar"><p data-photo-status aria-live="polite"></p><form method="dialog"><button aria-label="Close photo">×</button></form></div>
      <div class="lightbox__stage">
        <button type="button" data-photo-prev aria-label="Previous photo">‹</button>
        <img alt=""><button type="button" data-photo-expand aria-label="Enlarge photo" aria-pressed="false">+</button>
        <button type="button" data-photo-next aria-label="Next photo">›</button>
      </div>
    </dialog>`;
}

function backgroundVideo(video, poster) {
  return `<video class="background-video" muted loop playsinline preload="none" poster="/images/${poster}.avif" aria-hidden="true" disablepictureinpicture>
    <source src="/images/${video}.mp4" type="video/mp4">
  </video>`;
}

function reviewCarousel() {
  return `<section class="reviews" aria-labelledby="review-title">
    <div class="wrap"><h2 id="review-title">Our Clients Say</h2></div>
    <div class="review-carousel" role="region" aria-roledescription="carousel" aria-labelledby="review-title" data-review-carousel>
      <div class="review-carousel__slides" aria-live="polite">
        ${reviews.map((review, index) => `
          <div class="review-slide" id="review-${index + 1}" ${index ? 'hidden' : ''}>
            ${image(review.image, '', 'width="394" height="552"')}
            <figure class="review-slide__copy"><blockquote>${review.quote}</blockquote><figcaption>${review.name}</figcaption></figure>
          </div>`).join('')}
      </div>
      <button type="button" class="review-arrow review-arrow--prev" data-review-prev aria-label="Previous review">←</button>
      <button type="button" class="review-arrow review-arrow--next" data-review-next aria-label="Next review">→</button>
      <div class="review-dots" aria-label="Choose a review">
        ${reviews.map((review, index) => `<button type="button" data-review-index="${index}" aria-label="Review by ${review.name}" aria-controls="review-${index + 1}" aria-pressed="${index === 0}"></button>`).join('')}
      </div>
    </div>
  </section>`;
}

function quoteBand() {
  return `<section class="quote-band"><div class="wrap quote-band__inner">
    <div><p class="eyebrow">Free estimates</p><h2>Tell us what your yard needs.</h2><p>Share a few details and we’ll follow up about your property.</p></div>
    ${button('Request an estimate', '/contact/#estimate', 'light')}
  </div></section>`;
}

const home = `
  <section class="hero" data-background-video data-scroll-media>
    ${backgroundVideo('lawn-trimming-hero', 'lawn-trimming-poster')}
    <div class="wrap hero__copy">
      <h1 data-enter>Transform Your Space</h1>
      <p data-enter>Expertise. Reliability. Value. Reasonable</p>
    </div>
  </section>
  <section class="estimate-banner" data-background-video>
    ${backgroundVideo('vancouver-forest-estimate', 'vancouver-forest-poster')}
    <div class="wrap estimate-banner__copy">
      <h2>Get the best affordable price with good landscape service in Vancouver</h2>
      <p>Text ${callOption} ${textLink} to book a free estimate.</p>
      ${button('Text us', sms)}
    </div>
  </section>
  <section class="passion"><div class="wrap story">
    <div class="story__copy"><h2 data-enter>Our Passion for Nature</h2><p>It's no secret that we love what we do. Working with nature to showcase the best of its beauty sparks a natural passion in our team. This is why our company has built a reputation as a top Landscaping Service in Vancouver. Hard work, dedication, and creativity are at the heart of all of our projects. Get in touch to learn more about how we can transform your outdoor space into something spectacular.</p><div data-enter>${button('Contact us for a free estimate', '/contact/#estimate', 'round')}</div></div>
    <div class="story__image" data-scroll-media>${image('landscaped-backyard', 'Landscaped backyard with a garden and patio')}</div>
  </div></section>
  <section class="section home-services" aria-labelledby="home-services">
    <div class="home-services__copy">
      <h2 id="home-services">Our Services</h2>
      <p>At Nikato, we offer a comprehensive range of landscaping and maintenance services to enhance your outdoor spaces. Our expertise includes lawn care, garden design, tree trimming, and seasonal clean-ups, ensuring your property looks its best all year round. We focus on quality and attention to detail, tailoring our services to meet your specific needs. Trust us to create and maintain the perfect landscape for you.</p>
      ${button('Learn more about our services', '/book-online/')}
    </div>
    <div class="service-strip">${serviceCards([services[0], services[1], services[2], services[7]])}</div>
  </section>
  <section class="section wrap home-projects">
    <h2>Past Projects</h2>
    ${projectGrid([0, 1, 2, 5, 4, 3].map(index => projectPhotos[index]))}
  </section>
  ${reviewCarousel()}`;

const servicesPage = `
  <section class="section wrap section--services">
    <h1 class="centred-heading">Our Services</h1>
    ${serviceCards(services, true)}
    <div class="services-note"><h2>And much more services...</h2><p>We can provide more custom services based on your landscaping and maintenance needs.</p></div>
  </section>
  <section class="services-estimate"><div class="wrap">
    <h2>Get a Free Estimate</h2><p>Text ${callOption} ${textLink} to book a visit.</p>
  </div></section>`;

const bookOnline = `
  <section class="section wrap bookings">
    <h1>Our Services</h1>
    <div class="bookings__grid">${bookings.map(({ id, title, image: photo, duration, price }) => {
      const url = `/services/#${id}`;
      return `<article class="booking"><a href="${url}" tabindex="-1" aria-hidden="true">${image(photo, '')}</a>
        <div class="booking__copy"><h2><a href="${url}">${title}</a></h2>
          <p>${duration}</p><p>${price}</p>${button('Book Now', estimateEmail(title))}</div></article>`;
    }).join('')}</div>
    <p class="bookings__note">Rates shown on the original site are in USD. Contact us to confirm current pricing and availability.</p>
  </section>`;

const projectsPage = `
  ${pageIntro('Projects', 'See our work up close.', 'Browse photos from the Nikato project gallery. Select a photo to see it in more detail.')}
  <section class="section wrap" aria-label="Nikato project photos">${projectGrid(projectPhotos)}</section>
  ${quoteBand()}`;

const about = `
  <div class="about-banner">${image('about-landscaped-home', 'House with a landscaped backyard', 'fetchpriority="high"')}</div>
  <section class="section about-copy">
      <h1 class="centred-heading">The Full Story</h1>
      <div class="about-copy__text">
        <p>Welcome to Nikato Landscape. Our experienced team creates outdoor spaces that are beautiful and practical. From lush gardens to modern yards, we design and build around your style and how you want to use the space.</p>
        <p>We bring the same care to a small garden project as we do to a full yard renovation. We work with you throughout the project to understand what you want and find solutions that fit your property.</p>
        <p>Let’s create your perfect outdoor escape.</p>
      </div>
  </section>
  <section class="quote-band"><div class="wrap quote-band__inner"><div><h2>Let’s Work Together</h2>
    <p>Get in touch so we can start working together.<br>Text ${callOption} ${textLink}.</p></div>
    <div class="social-icons" aria-label="Social media">
      <a href="https://www.facebook.com/hau.landscaper.canada/" aria-label="Nikato on Facebook">${image('social-facebook', '')}</a>
      ${['twitter', 'linkedin', 'instagram'].map(network => image(`social-${network}`, '')).join('')}
    </div>
  </div></section>`;

const contact = `
  <section class="contact-banner">
    ${image('calico-cat-in-grass', '', 'class="contact-banner__photo" fetchpriority="high"')}
    <div class="wrap contact-banner__inner">
      <div class="contact-banner__copy">
        <h1>Contact Us</h1>
        <p>Have a question about our landscaping services or want a free estimate? Tell us where your property is and what work you need.</p>
        <div class="contact-actions">
          <div class="contact-actions__phone" role="group" aria-label="Text or call Nikato">
            <a href="${sms}">Text ${business.phone}</a>
            <a href="${tel}" aria-label="Call ${displayPhone}">(or call)</a>
          </div>
          ${button('Email us', 'mailto:' + business.email, 'outline')}
        </div>
      </div>
    </div>
  </section>
  <section class="section wrap contact-grid" id="estimate">
    <div class="contact-details">
      <h2>Get in touch</h2>
      <dl>
        <div><dt>Text ${callOption}</dt><dd>${textLink}</dd></div>
        <div><dt>Email</dt><dd>${email}</dd></div>
        <div><dt>Service area</dt><dd>${business.region}. Ask us about availability in your neighbourhood.</dd></div>
      </dl>
    </div>
    <div class="contact-locations">
      <h2>Business locations</h2>
      ${businessLocations(true)}
    </div>
  </section>`;
function redirect(to) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex"><meta http-equiv="refresh" content="0;url=${to}"><title>Page moved | Nikato</title></head><body><p><a href="${to}">Continue to Nikato</a></p></body></html>`;
}

export function renderSite() {
  const titleSuffix = ' | Nikato Landscape';
  const simple = (active, title, description, content, noIndex) =>
    layout({ active, title: title + titleSuffix, description, content, noIndex });

  return new Map([
    ['index.html', simple('home', 'Landscaping & Lawn Care in Metro Vancouver', 'Nikato Landscape Maintenance Inc. offers lawn care, landscaping, fencing and seasonal property maintenance in Metro Vancouver. Request a free estimate.', home)],
    ['services/index.html', simple('services', 'Landscaping Services', 'Explore lawn mowing, trimming, fencing, landscaping, maintenance, power washing, power raking and snow removal.', servicesPage)],
    ['projects/index.html', simple('projects', 'Project Gallery', 'Browse photos from the Nikato landscaping project gallery.', projectsPage)],
    ['about/index.html', simple('about', 'About Us', 'Learn about Nikato Landscape Maintenance Inc., based in New Westminster and Surrey.', about)],
    ['contact/index.html', simple('contact', 'Contact & Free Estimates', 'Contact Nikato Landscape Maintenance Inc. for a free landscaping estimate in Metro Vancouver.', contact)],
    ['privacy/index.html', simple('', 'Privacy', 'How Nikato uses information provided with an estimate request.', pageIntro('Privacy', 'Your estimate details.', `We use the contact and property information you share to respond to your request and prepare an estimate. Contact ${email} with questions about your information.`))],
    ['thank-you/index.html', redirect('/contact/')],
    ['404.html', simple('', 'Page Not Found', 'This page could not be found.', pageIntro('Page not found', 'This page has moved or is unavailable.', 'Visit the home page to find landscaping services, project photos and contact details.') + `<div class="wrap simple-actions">${button('Back to home', '/')}</div>`, true)],
    ['services-5/index.html', redirect('/services/')],
    ['about-4/index.html', redirect('/about/')],
    ['contact-6/index.html', redirect('/contact/')],
    ['book-online/index.html', simple('services', 'Book Online', 'Browse tree trimming, lawn mowing and fencing installation.', bookOnline)],
  ]);
}
