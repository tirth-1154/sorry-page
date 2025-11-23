// apology text
const apologyLines = [
  "Hey Dixa, I'm really sorry. 💬",
  "You told me not to sleep without saying — and I fell asleep.",
  "I fell asleep unintentionally and I feel bad about it.",
  "Please forgive me. I'll make sure to say goodnight next time.",
  "— With apologies, Tirth "
];

const typeEl = document.getElementById('typewriter');
const replayBtn = document.getElementById('replayBtn');
const copyBtn = document.getElementById('copyBtn');
const confettiBtn = document.getElementById('confettiBtn');
const card = document.getElementById('card');

// typewriter effect
function typeMessage(lines, speed = 24) {
  typeEl.textContent = "";
  card.classList.remove('sorry-glow');
  let idx = 0;
  let lineIdx = 0;

  function typeChar() {
    if (lineIdx >= lines.length) {
      card.classList.add('sorry-glow');
      spawnHeart();
      return;
    }
    const line = lines[lineIdx];
    if (idx <= line.length) {
      typeEl.textContent = lines.slice(0, lineIdx).join("\n") + line.slice(0, idx);
      idx++;
      setTimeout(typeChar, speed + Math.random() * 20);
    } else {
      lineIdx++;
      idx = 0;
      typeEl.textContent = lines.slice(0, lineIdx).join("\n");
      setTimeout(typeChar, 400);
    }
  }
  typeChar();
}

// initial run
typeMessage(apologyLines);

// replay button
replayBtn.addEventListener('click', () => {
  typeMessage(apologyLines);
});

// copy button
copyBtn.addEventListener('click', async () => {
  const plain = apologyLines.join("\n\n");
  try {
    await navigator.clipboard.writeText(plain);
    copyBtn.textContent = "Copied!";
    setTimeout(() => copyBtn.textContent = "Copy message", 1400);
  } catch (e) {
    alert("Could not copy automatically. Select the message and press Ctrl+C / Cmd+C.");
  }
});

// floating hearts
const heartsContainer = document.getElementById('hearts');
function spawnHeart() {
  const h = document.createElement('div');
  h.className = 'heart';
  const size = 18 + Math.random() * 18;
  h.style.width = size + 'px';
  h.style.height = size + 'px';
  h.style.left = (30 + Math.random() * 40) + '%';
  h.style.top = (70 + Math.random() * 20) + '%';
  h.style.animationDuration = (3 + Math.random() * 3) + 's';
  heartsContainer.appendChild(h);
  setTimeout(() => h.remove(), 7000);
}

// floating emoji background
const floatingEmojisContainer = document.getElementById('floating-emojis');
const emojis = ["❤️", "🤗", "😞"];

function createFloatingEmoji() {
  const emoji = document.createElement('div');
  emoji.classList.add('floating-emoji');
  emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
  emoji.style.left = Math.random() * 100 + "vw";
  emoji.style.fontSize = 18 + Math.random() * 24 + "px";
  emoji.style.animationDuration = 5 + Math.random() * 5 + "s";
  floatingEmojisContainer.appendChild(emoji);

  // remove after animation
  setTimeout(() => emoji.remove(), 11000);
}

// spawn emojis continuously
setInterval(createFloatingEmoji, 800);

// confetti effect
(function() {
  const canvas = document.getElementById('confettiCanvas');
  const ctx = canvas.getContext('2d');
  let W = canvas.width = window.innerWidth;
  let H = canvas.height = window.innerHeight;
  const particles = [];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);

  function makeConfettiBurst(x = W / 2, y = H / 2) {
    const count = 80;
    for (let i = 0; i < count; i++) {
      particles.push({
        x: x + (Math.random() - 0.5) * 120,
        y: y + (Math.random() - 0.5) * 60,
        vx: (Math.random() - 0.5) * 8,
        vy: -6 - Math.random() * 6,
        size: 6 + Math.random() * 8,
        rot: Math.random() * 360,
        vr: (Math.random() - 0.5) * 10,
        life: 60 + Math.random() * 60,
        color: `hsl(${Math.floor(Math.random() * 360)},70%,60%)`
      });
    }
  }

  function update() {
    ctx.clearRect(0, 0, W, H);
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.life--;
      if (p.life <= 0 || p.y > H + 50) {
        particles.splice(i, 1);
        continue;
      }
      p.vy += 0.2;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot * Math.PI / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      ctx.restore();
    }
    requestAnimationFrame(update);
  }
  update();

  confettiBtn.addEventListener('click', () => {
    makeConfettiBurst(window.innerWidth * 0.6, window.innerHeight * 0.4);
    for (let i = 0; i < 3; i++) {
      setTimeout(() => makeConfettiBurst(100 + Math.random() * (W - 200), 120 + Math.random() * 200), i * 160);
    }
  });

  window._makeConfettiBurst = makeConfettiBurst;
})();

// observe glow effect for confetti and hearts
const observer = new MutationObserver(mutations => {
  mutations.forEach(m => {
    if (m.attributeName === 'class') {
      if (card.classList.contains('sorry-glow')) {
        window._makeConfettiBurst(window.innerWidth / 2, window.innerHeight / 2);
        for (let i = 0; i < 4; i++) setTimeout(spawnHeart, i * 420);
      }
    }
  });
});
observer.observe(card, { attributes: true });
