/* ─── Smooth page init ─── */
document.body.style.opacity = '0';
window.addEventListener('load', () => {
  document.body.style.transition = 'opacity .5s ease';
  document.body.style.opacity = '1';
});

/* ─── Navbar scroll effect ─── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
});

/* ─── Mobile burger menu ─── */
const burger    = document.getElementById('burger');
const navLinks  = document.getElementById('navLinks');

burger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  burger.setAttribute('aria-expanded', open);
  document.body.style.overflow = open ? 'hidden' : '';
  if (open) {
    burger.children[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    burger.children[1].style.opacity   = '0';
    burger.children[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    burger.children[0].style.transform = '';
    burger.children[1].style.opacity   = '';
    burger.children[2].style.transform = '';
  }
});

navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
    burger.children[0].style.transform = '';
    burger.children[1].style.opacity   = '';
    burger.children[2].style.transform = '';
  });
});

/* ─── Typed text effect ─── */
const phrases = [
  'Frontend Developer',
  'IT Instructor',
  'TATU Student',
  'UI Crafter',
  'Code Teacher'
];
let phraseIdx = 0, charIdx = 0, deleting = false;
const typedEl = document.getElementById('typed');

function type() {
  const current = phrases[phraseIdx];
  if (!deleting) {
    typedEl.textContent = current.slice(0, ++charIdx);
    if (charIdx === current.length) {
      deleting = true;
      setTimeout(type, 2000);
      return;
    }
  } else {
    typedEl.textContent = current.slice(0, --charIdx);
    if (charIdx === 0) {
      deleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
    }
  }
  setTimeout(type, deleting ? 60 : 110);
}

// Add blinking cursor span
const cursor = document.createElement('span');
cursor.className = 'typed-cursor';
typedEl.parentElement.appendChild(cursor);
setTimeout(type, 600);

/* ─── Scroll-reveal observer ─── */
const revealItems = document.querySelectorAll('.reveal');
const revealObs   = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealItems.forEach(el => revealObs.observe(el));

/* ─── Skill bar animation ─── */
const skillBars = document.querySelectorAll('.skill-fill');
const skillObs  = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('animated');
      skillObs.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
skillBars.forEach(b => skillObs.observe(b));

/* ─── Particle canvas ─── */
const canvas = document.getElementById('particles');
const ctx    = canvas.getContext('2d');

let W, H, dots;

function resize() {
  W = canvas.width  = canvas.offsetWidth;
  H = canvas.height = canvas.offsetHeight;
}

function initDots() {
  dots = Array.from({ length: 60 }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    r: Math.random() * 1.5 + 0.5,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    alpha: Math.random() * 0.5 + 0.2
  }));
}

function drawParticles() {
  ctx.clearRect(0, 0, W, H);
  dots.forEach(d => {
    d.x += d.vx;
    d.y += d.vy;
    if (d.x < 0) d.x = W;
    if (d.x > W) d.x = 0;
    if (d.y < 0) d.y = H;
    if (d.y > H) d.y = 0;

    ctx.beginPath();
    ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(99,102,241,${d.alpha})`;
    ctx.fill();
  });

  // draw connections
  for (let i = 0; i < dots.length; i++) {
    for (let j = i + 1; j < dots.length; j++) {
      const dx = dots[i].x - dots[j].x;
      const dy = dots[i].y - dots[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 110) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(99,102,241,${0.15 * (1 - dist / 110)})`;
        ctx.lineWidth = 0.8;
        ctx.moveTo(dots[i].x, dots[i].y);
        ctx.lineTo(dots[j].x, dots[j].y);
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(drawParticles);
}

window.addEventListener('resize', () => { resize(); initDots(); });
resize(); initDots(); drawParticles();

/* ─── Contact form handler ─── */
function handleSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('sendBtn');
  btn.disabled = true;
  btn.innerHTML = '<span>Yuborilmoqda...</span>';

  setTimeout(() => {
    btn.innerHTML = '<span>Yuborish</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/></svg>';
    btn.disabled = false;
    document.getElementById('contactForm').reset();
    showToast('✅ Xabaringiz yuborildi!');
  }, 1500);
}

function showToast(msg) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  document.body.appendChild(t);
  requestAnimationFrame(() => { t.classList.add('show'); });
  setTimeout(() => {
    t.classList.remove('show');
    setTimeout(() => t.remove(), 400);
  }, 3500);
}

/* ─── Nav active link highlight on scroll ─── */
const sections = document.querySelectorAll('section[id]');
const navAs    = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY + 120 >= s.offsetTop) current = s.id;
  });
  navAs.forEach(a => {
    a.style.color = a.getAttribute('href') === `#${current}` ? '#6366f1' : '';
  });
}, { passive: true });
