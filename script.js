const burger = document.getElementById('burger');
const menu = document.getElementById('mobile-menu');
const closeBtn = document.getElementById('menu-close');
const menuLinks = menu.querySelectorAll('a');

function openMenu() {
  menu.classList.add('is-open');
  menu.setAttribute('aria-hidden', 'false');
  burger.setAttribute('aria-expanded', 'true');
  document.body.classList.add('no-scroll');
}

function closeMenu() {
  menu.classList.remove('is-open');
  menu.setAttribute('aria-hidden', 'true');
  burger.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('no-scroll');
}

burger.addEventListener('click', openMenu);
closeBtn.addEventListener('click', closeMenu);

// закрываем меню 
menuLinks.forEach((link) => link.addEventListener('click', closeMenu));

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && menu.classList.contains('is-open')) closeMenu();
});

// если растянули окно до десктопа, меню не должно зависнуть
window.addEventListener('resize', () => {
  if (window.innerWidth > 768) closeMenu();
});

// подсветка активного пункта в десктопном меню при скролле
const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.nav__link');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        link.classList.toggle(
          'nav__link--active',
          link.getAttribute('href') === '#' + entry.target.id
        );
      });
    });
  },
  { rootMargin: '-45% 0px -50% 0px' }
);

sections.forEach((section) => observer.observe(section));

/*  Космос: звезды и кометы  */

// кометы
const comets = {
  home: [
    { left: 4, top: 22, len: 110, angle: 35 },
    { left: 68, top: 76, len: 140, angle: 145 },   
    { left: 42, top: 9, len: 150, angle: 10 },     
  ],
  about: [
    { left: 6, top: 16, len: 120, angle: 40 },
    { left: 84, top: 82, len: 140, angle: 145 },
  ],
  skills: [
    { left: 8, top: 44, len: 130, angle: 40 },
    { left: 72, top: 18, len: 120, angle: 145 },
  ],
  works: [
    { left: 6, top: 20, len: 140, angle: 35 },
    { left: 76, top: 62, len: 130, angle: 145 },
  ],
  reviews: [
    { left: 24, top: 20, len: 130, angle: 40 },
    { left: 80, top: 54, len: 140, angle: 145 },
  ],
};

// генератор звезд
function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const isMobile = window.matchMedia('(max-width: 768px)').matches;
const STARS_PER_SECTION = isMobile ? 7 : 14;

sections.forEach((section, index) => {
  const layer = document.createElement('div');
  layer.className = 'space';
  layer.setAttribute('aria-hidden', 'true');

  // звезды
  const rand = seededRandom(1000 + index * 77);
  for (let i = 0; i < STARS_PER_SECTION; i++) {
    const star = document.createElement('span');
    const size = 3 + Math.round(rand() * 3);
    star.className = 'star';
    star.style.width = star.style.height = size + 'px';
    star.style.left = (rand() * 98).toFixed(1) + '%';
    star.style.top = (rand() * 98).toFixed(1) + '%';
    star.style.opacity = (0.25 + rand() * 0.3).toFixed(2);
    layer.appendChild(star);
  }

  // кометы
  (comets[section.id] || []).forEach((c) => {
    const el = document.createElement('span');
    el.className = 'comet';
    el.style.width = c.len + 'px';
    el.style.left = c.left + '%';
    el.style.top = c.top + '%';
    el.style.transform = `rotate(${c.angle}deg)`;

    const tail = document.createElement('span');
    tail.className = 'comet__tail';
    const head = document.createElement('span');
    head.className = 'comet__head';
    el.append(tail, head);

    layer.appendChild(el);
  });

  section.prepend(layer);
});