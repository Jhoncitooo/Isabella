/* ============================================================
   LÓGICA INTERACTIVA: INVITACIÓN DE LEGOS PARA ISA 🧩✨
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Estado de la invitación
  const state = {
    selectedCharacter: 'Blancanieves 🍎',
    selectedSnacks: ['Gomitas & Dulces 🍬', 'Papas & Snacks 🍟'],
    selectedMusic: 'Lo-fi Chill & Relajante 🎧',
    isMuted: false,
    noClickCount: 0
  };

  // --- 1. SINTETIZADOR DE AUDIO (Web Audio API) ---
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Sonido de clic plástico tipo Lego
  function playLegoClick() {
    if (state.isMuted) return;
    initAudio();
    if (!audioCtx) return;

    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.04);
      osc.frequency.exponentialRampToValueAtTime(120, audioCtx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.08);
    } catch (e) {
      console.log('Audio error:', e);
    }
  }

  // Sonido cómico "Boing" para el botón No
  function playBoing() {
    if (state.isMuted) return;
    initAudio();
    if (!audioCtx) return;

    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(260, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(520, audioCtx.currentTime + 0.15);
      osc.frequency.exponentialRampToValueAtTime(220, audioCtx.currentTime + 0.3);

      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } catch (e) {
      console.log('Audio error:', e);
    }
  }

  // Fanfarria alegre al decir que SÍ
  function playFanfare() {
    if (state.isMuted) return;
    initAudio();
    if (!audioCtx) return;

    const notes = [
      { f: 523.25, d: 0.12 }, // C5
      { f: 659.25, d: 0.12 }, // E5
      { f: 783.99, d: 0.15 }, // G5
      { f: 1046.50, d: 0.4 }  // C6
    ];

    let time = audioCtx.currentTime;
    notes.forEach((note, index) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(note.f, time);

      gain.gain.setValueAtTime(0.18, time);
      gain.gain.exponentialRampToValueAtTime(0.01, time + note.d);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(time);
      osc.stop(time + note.d);

      time += note.d * 0.9;
    });
  }

  // Toggle Mute
  const soundToggleBtn = document.getElementById('sound-toggle');
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      state.isMuted = !state.isMuted;
      soundToggleBtn.textContent = state.isMuted ? '🔇' : '🔊';
      if (!state.isMuted) playLegoClick();
    });
  }

  // --- 2. APERTURA DE LA CAJA / INVITACIÓN ---
  const openBoxBtn = document.getElementById('open-box-btn');
  const introBox = document.getElementById('intro-box');
  const invitationContent = document.getElementById('invitation-content');

  if (openBoxBtn && introBox && invitationContent) {
    openBoxBtn.addEventListener('click', () => {
      playLegoClick();
      createBrickBurst(openBoxBtn);

      introBox.style.transition = 'all 0.5s ease';
      introBox.style.opacity = '0';
      introBox.style.transform = 'scale(0.9)';

      setTimeout(() => {
        introBox.style.display = 'none';
        invitationContent.classList.add('visible');
        invitationContent.scrollIntoView({ behavior: 'smooth' });
      }, 450);
    });
  }

  // --- 3. SELECCIÓN DE PERSONAJES ---
  const charCards = document.querySelectorAll('.character-card');
  const teamOption = document.getElementById('team-option');

  function updateCharacterSelection(name) {
    state.selectedCharacter = name;
    playLegoClick();

    charCards.forEach(card => {
      if (card.dataset.char === name) {
        card.classList.add('selected');
        const indicator = card.querySelector('.select-indicator');
        if (indicator) indicator.innerHTML = '✨ ¡Elegido por Isa!';
      } else {
        card.classList.remove('selected');
        const indicator = card.querySelector('.select-indicator');
        if (indicator) indicator.innerHTML = '🧩 Elegir este lego';
      }
    });

    if (teamOption) {
      if (name === '¡Ambos en equipo! 🤝') {
        teamOption.classList.add('selected');
        teamOption.querySelector('.team-badge').textContent = '✅ Seleccionado';
      } else {
        teamOption.classList.remove('selected');
        teamOption.querySelector('.team-badge').textContent = 'Seleccionar';
      }
    }
  }

  charCards.forEach(card => {
    card.addEventListener('click', () => {
      const charName = card.dataset.char;
      updateCharacterSelection(charName);
    });
  });

  if (teamOption) {
    teamOption.addEventListener('click', () => {
      updateCharacterSelection('¡Ambos en equipo! 🤝');
    });
  }

  // --- 4. SELECCIÓN DE SNACKS (Multi-select) ---
  const snackPills = document.querySelectorAll('.snack-pill');
  snackPills.forEach(pill => {
    pill.addEventListener('click', () => {
      playLegoClick();
      const snackName = pill.dataset.snack;
      pill.classList.toggle('active');

      if (pill.classList.contains('active')) {
        if (!state.selectedSnacks.includes(snackName)) {
          state.selectedSnacks.push(snackName);
        }
      } else {
        state.selectedSnacks = state.selectedSnacks.filter(s => s !== snackName);
      }
    });
  });

  // --- 5. SELECCIÓN DE MÚSICA (Single-select) ---
  const musicPills = document.querySelectorAll('.music-pill');
  musicPills.forEach(pill => {
    pill.addEventListener('click', () => {
      playLegoClick();
      musicPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      state.selectedMusic = pill.dataset.music;
    });
  });

  // --- 6. EL BOTÓN "NO" JUGUETÓN QUE ESCAPA O CAMBIA ---
  const noBtn = document.getElementById('no-btn');
  const yesBtn = document.getElementById('yes-btn');

  const funnyNoPhrases = [
    'Mmm... ¿segura, Isa? 🥺',
    '¡Prometo llevar gomitas! 🍬',
    '¡Chase dice que es obligatorio! 🐶🚨',
    'Blancanieves se pondrá triste 🍎',
    '¡Ese botón tiene falso contacto! ⚡😜',
    'Te prometo no desarmar lo que hagas 🧩',
    '¡Bueno, tú eliges la música! 🎵',
    '¿Y si te doy un helado? 🍦',
    '¡Solo di que sí! 🥰✨'
  ];

  function dodgeNoButton() {
    playBoing();
    state.noClickCount++;

    const phraseIndex = (state.noClickCount - 1) % funnyNoPhrases.length;
    noBtn.textContent = funnyNoPhrases[phraseIndex];

    // Mover un poco de forma traviesa sin salir de la vista
    const randomX = (Math.random() - 0.5) * 160;
    const randomY = (Math.random() - 0.5) * 80;
    noBtn.style.transform = `translate(${randomX}px, ${randomY}px)`;

    // Agrandar el botón SÍ cada vez que se intenta decir no
    const currentScale = 1 + (state.noClickCount * 0.08);
    yesBtn.style.transform = `scale(${Math.min(currentScale, 1.35)})`;

    // Si insiste varias veces, convertir el botón no en un SÍ camuflado
    if (state.noClickCount >= 5) {
      noBtn.textContent = '¡Bueno, SÍ! 💖';
      noBtn.style.background = '#00A859';
      noBtn.style.color = '#FFFFFF';
      noBtn.style.borderColor = '#007A41';
      noBtn.style.transform = 'none';
      noBtn.onclick = handleYesClick;
    }
  }

  if (noBtn) {
    noBtn.addEventListener('mouseenter', dodgeNoButton);
    noBtn.addEventListener('click', (e) => {
      e.preventDefault();
      dodgeNoButton();
    });
    noBtn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      dodgeNoButton();
    }, { passive: false });
  }

  // --- 7. ACEPTAR LA INVITACIÓN (¡SÍ!) ---
  function handleYesClick() {
    playFanfare();
    startConfetti();

    // Actualizar datos del Pase VIP
    const passChar = document.getElementById('pass-character');
    const passSnacks = document.getElementById('pass-snacks');
    const passMusic = document.getElementById('pass-music');
    const passTime = document.getElementById('pass-time');

    if (passChar) passChar.textContent = state.selectedCharacter;
    if (passSnacks) {
      passSnacks.textContent = state.selectedSnacks.length > 0 
        ? state.selectedSnacks.join(', ') 
        : '¡Lo que tú quieras pedir! 🍕';
    }
    if (passMusic) passMusic.textContent = state.selectedMusic;
    if (passTime) {
      const now = new Date();
      passTime.textContent = `Válido desde hoy: ${now.toLocaleDateString()}`;
    }

    // Configurar el botón de WhatsApp con el número +57 3225106265
    updateWhatsAppLink();

    // Ocultar sección de propuesta y mostrar Pase VIP
    const proposalBox = document.querySelector('.proposal-box');
    const ticketView = document.getElementById('ticket-view');

    if (proposalBox) {
      proposalBox.style.display = 'none';
    }

    if (ticketView) {
      ticketView.classList.add('show');
      ticketView.scrollIntoView({ behavior: 'smooth' });
    }
  }

  if (yesBtn) {
    yesBtn.addEventListener('click', handleYesClick);
  }

  // --- 8. MENSAJE PARA WHATSAPP CON NÚMERO +57 3225106265 ---
  function updateWhatsAppLink() {
    const waBtn = document.getElementById('whatsapp-btn');
    const copyBtn = document.getElementById('copy-msg-btn');
    if (!waBtn) return;

    const phoneNumber = '573225106265';

    const snacksText = state.selectedSnacks.length > 0
      ? state.selectedSnacks.join(', ')
      : 'muchos snacks ricos';

    const textMessage = 
`¡Hola! 💖✨ Ya vi la invitación y ¡SIII, acepto armar los legos contigo! 🧩🎉

Mi selección oficial:
🐶/🍎 Personaje: ${state.selectedCharacter}
🍿 Menú de snacks: ${snacksText}
🎵 Playlist: ${state.selectedMusic}

¿Cuándo empezamos a armarlos? 🥰`;

    const encoded = encodeURIComponent(textMessage);
    // Enlace universal de WhatsApp con número directo
    waBtn.href = `https://wa.me/${phoneNumber}?text=${encoded}`;

    if (copyBtn) {
      copyBtn.onclick = () => {
        playLegoClick();
        navigator.clipboard.writeText(textMessage).then(() => {
          copyBtn.textContent = '✅ ¡Mensaje copiado!';
          setTimeout(() => {
            copyBtn.textContent = '📋 Copiar mensaje';
          }, 2500);
        }).catch(() => {
          copyBtn.textContent = '✅ ¡Listo para enviar!';
        });
      };
    }
  }

  // --- 9. MOTOR DE CONFETI ESTILO LEGO (Canvas nativo) ---
  const canvas = document.getElementById('confetti-canvas');
  let ctx = null;
  let particles = [];
  let animId = null;

  if (canvas) {
    ctx = canvas.getContext('2d');
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
  }

  function startConfetti() {
    if (!canvas || !ctx) return;
    particles = [];

    const colors = ['#E52521', '#006CB7', '#FFD500', '#00A859', '#FF6584', '#9B51E0', '#FF8066'];

    for (let i = 0; i < 140; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * -canvas.height * 0.8,
        w: 12 + Math.random() * 14,
        h: 8 + Math.random() * 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedY: 2.5 + Math.random() * 4,
        speedX: (Math.random() - 0.5) * 3,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 8,
        isBrick: Math.random() > 0.4
      });
    }

    if (!animId) {
      renderConfetti();
    }
  }

  function renderConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      p.y += p.speedY;
      p.x += p.speedX;
      p.rotation += p.rotSpeed;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;

      // Dibujar bloque lego o confeti
      ctx.beginPath();
      ctx.roundRect(-p.w / 2, -p.h / 2, p.w, p.h, 2);
      ctx.fill();

      // Si es brick, dibujar los botoncitos (studs)
      if (p.isBrick && p.w > 14) {
        ctx.fillStyle = 'rgba(255,255,255,0.45)';
        ctx.beginPath();
        ctx.arc(-p.w / 4, 0, 2.5, 0, Math.PI * 2);
        ctx.arc(p.w / 4, 0, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();

      // Reaparecer arriba
      if (p.y > canvas.height + 20) {
        p.y = -20;
        p.x = Math.random() * canvas.width;
      }
    });

    animId = requestAnimationFrame(renderConfetti);
  }

  // Pequeña explosión de bloques al hacer clic en el botón de abrir
  function createBrickBurst(el) {
    const rect = el.getBoundingClientRect();
    const burstColors = ['#E52521', '#FFD500', '#006CB7', '#FF6584'];

    for (let i = 0; i < 15; i++) {
      const brick = document.createElement('div');
      brick.style.position = 'fixed';
      brick.style.left = `${rect.left + rect.width / 2}px`;
      brick.style.top = `${rect.top + rect.height / 2}px`;
      brick.style.width = '14px';
      brick.style.height = '10px';
      brick.style.borderRadius = '3px';
      brick.style.backgroundColor = burstColors[i % burstColors.length];
      brick.style.zIndex = '9999';
      brick.style.pointerEvents = 'none';
      brick.style.transition = 'all 0.6s cubic-bezier(0.25, 1, 0.5, 1)';
      document.body.appendChild(brick);

      const angle = (Math.PI * 2 * i) / 15;
      const dist = 60 + Math.random() * 80;
      const destX = Math.cos(angle) * dist;
      const destY = Math.sin(angle) * dist;

      setTimeout(() => {
        brick.style.transform = `translate(${destX}px, ${destY}px) rotate(${Math.random() * 360}deg) scale(0)`;
        brick.style.opacity = '0';
      }, 20);

      setTimeout(() => {
        brick.remove();
      }, 700);
    }
  }

  // Efecto interactivo al hacer clic en el fondo: caen piezas suaves
  document.body.addEventListener('click', (e) => {
    // Si no es un botón ni tarjeta
    if (e.target.closest('button, .character-card, .pill-choice, a, .gift-card')) return;

    playLegoClick();
    const brick = document.createElement('div');
    const colors = ['#E52521', '#FFD500', '#006CB7', '#00A859', '#FF6584'];
    const color = colors[Math.floor(Math.random() * colors.length)];

    brick.style.position = 'fixed';
    brick.style.left = `${e.clientX - 10}px`;
    brick.style.top = `${e.clientY - 8}px`;
    brick.style.width = '20px';
    brick.style.height = '14px';
    brick.style.backgroundColor = color;
    brick.style.borderRadius = '3px';
    brick.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
    brick.style.zIndex = '100';
    brick.style.pointerEvents = 'none';
    brick.style.transition = 'all 0.8s cubic-bezier(0.55, 0.055, 0.675, 0.19)';
    document.body.appendChild(brick);

    setTimeout(() => {
      brick.style.transform = `translateY(120px) rotate(${Math.random() * 180}deg)`;
      brick.style.opacity = '0';
    }, 20);

    setTimeout(() => {
      brick.remove();
    }, 850);
  });
});
