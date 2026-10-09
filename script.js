/* ===== Nihawww Birthday — script.js ===== */
(() => {
  'use strict';

  const $ = (s) => document.querySelector(s);
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const intro = $('#intro');
  const site = $('#site');
  const openBtn = $('#openBtn');
  const toast = $('#toast');
  const canvas = $('#fx');
  const ctx = canvas.getContext('2d');

  /* ---------- falling hearts & petals ---------- */
  let W = 0, H = 0, dpr = 1;
  const parts = [];
  let running = true;
  const COLORS = ['#d9575d', '#f0a3a8', '#b3262e', '#f6d3d5', '#e8777d'];

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function makePart(burst, x, y) {
    const heart = Math.random() < 0.6;
    return {
      x: burst ? x : Math.random() * W,
      y: burst ? y : -20 - Math.random() * H * 0.3,
      s: 6 + Math.random() * 9,
      vy: burst ? -2 - Math.random() * 5 : 0.35 + Math.random() * 0.8,
      vx: burst ? (Math.random() - 0.5) * 6 : (Math.random() - 0.5) * 0.4,
      g: burst ? 0.09 : 0,
      r: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.04,
      sw: Math.random() * Math.PI * 2,
      c: COLORS[(Math.random() * COLORS.length) | 0],
      heart,
      life: burst ? 150 : Infinity,
    };
  }

  function drawHeart(s) {
    ctx.beginPath();
    ctx.moveTo(0, s * 0.35);
    ctx.bezierCurveTo(-s, -s * 0.25, -s * 0.5, -s * 0.95, 0, -s * 0.4);
    ctx.bezierCurveTo(s * 0.5, -s * 0.95, s, -s * 0.25, 0, s * 0.35);
    ctx.fill();
  }

  function drawPetal(s) {
    ctx.beginPath();
    ctx.ellipse(0, 0, s * 0.45, s * 0.8, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  function seed() {
    const n = reduce ? 0 : (W < 600 ? 14 : 24);

    for (let i = 0; i < n; i++) {
      const p = makePart(false);
      p.y = Math.random() * H;
      parts.push(p);
    }
  }

  function tick() {
    if (!running) return;

    ctx.clearRect(0, 0, W, H);

    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i];

      p.sw += 0.02;
      p.x += p.vx + Math.sin(p.sw) * 0.35;
      p.vy += p.g;
      p.y += p.vy;
      p.r += p.vr;
      p.life--;

      const fade = p.life < 40 ? Math.max(p.life / 40, 0) : 1;

      ctx.save();
      ctx.globalAlpha = 0.75 * fade;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.r);
      ctx.fillStyle = p.c;
      p.heart ? drawHeart(p.s) : drawPetal(p.s);
      ctx.restore();

      if (p.life <= 0) {
        parts.splice(i, 1);
        continue;
      }

      if (p.life === Infinity && p.y > H + 30) {
        parts[i] = makePart(false);
      }
    }

    requestAnimationFrame(tick);
  }

  function burst(x, y, n = 36) {
    if (reduce) return;

    for (let i = 0; i < n; i++) {
      parts.push(makePart(true, x, y));
    }
  }

  document.addEventListener('visibilitychange', () => {
    running = !document.hidden;
    if (running) requestAnimationFrame(tick);
  });

  window.addEventListener('resize', resize, { passive: true });

  resize();
  seed();
  requestAnimationFrame(tick);

  /* ---------- toast ---------- */
  let tt;

  function say(msg) {
    if (!toast) return;

    toast.textContent = msg;
    toast.classList.add('show');

    clearTimeout(tt);
    tt = setTimeout(() => toast.classList.remove('show'), 3200);
  }

  /* ---------- music ---------- */
  const tape = $('#tape');
  const song = $('#song');

  function playSong() {
    if (!song || !song.getAttribute('src')) {
      say('Add your song in index.html (audio src) ♪');
      return;
    }

    const playback = song.play();

    if (playback) {
      playback
        .then(() => {
          tape?.classList.add('playing');
        })
        .catch((error) => {
          console.warn('Audio playback failed:', error);
          say('Audio could not play. Check the song file path.');
        });
    }
  }

  /* ---------- open the surprise + start music ---------- */
  function openSite() {
    const r = openBtn.getBoundingClientRect();

    burst(r.left + r.width / 2, r.top + r.height / 2, 46);

    intro.classList.add('gone');
    site.hidden = false;
    document.body.classList.remove('locked');
    window.scrollTo(0, 0);

    // Play the song directly from the "click me!" button interaction.
    // Calling play() here allows the browser to recognize the user gesture.
    playSong();

    requestAnimationFrame(() => requestAnimationFrame(startReveal));
  }

  if (openBtn) {
    openBtn.addEventListener('click', openSite, { once: true });
  }

  /* ---------- scroll reveal ---------- */
  function startReveal() {
    const items = document.querySelectorAll('.reveal');

    if (!('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.add('in'));
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    }, {
      threshold: 0.18,
      rootMargin: '0px 0px -6% 0px'
    });

    items.forEach((el) => io.observe(el));
  }

  /* ---------- cassette button: play/pause ---------- */
  if (tape && song) {
    tape.addEventListener('click', () => {
      if (!song.getAttribute('src')) {
        say('Add your song in index.html (audio src) ♪');
        return;
      }

      if (song.paused) {
        playSong();
      } else {
        song.pause();
        tape.classList.remove('playing');
      }
    });
  }

  /* ---------- final surprise ---------- */
  const MESSAGES = [
    'You are my favorite person, Nihawww ♡',
    'Every day with you feels like a birthday.',
    'I love you more than yesterday, less than tomorrow.',
    "Forever isn't long enough with you ♡",
  ];

  let mi = 0;

  const surprise = $('#surprise');

  if (surprise) {
    surprise.addEventListener('click', (e) => {
      const r = e.currentTarget.getBoundingClientRect();

      burst(r.left + r.width / 2, r.top, 60);
      say(MESSAGES[mi++ % MESSAGES.length]);
    });
  }
})();