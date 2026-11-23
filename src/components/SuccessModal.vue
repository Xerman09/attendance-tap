<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="show"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 pt-14"
        role="dialog"
        aria-modal="true"
        aria-labelledby="success-modal-title"
      >
        <!-- Emerald-tinted Backdrop -->
        <div
          class="fixed inset-0 bg-emerald-950/45 backdrop-blur-md"
          @click="emitClose"
        />

        <!-- Full-screen Confetti Canvas -->
        <canvas
          ref="confettiCanvas"
          class="pointer-events-none fixed inset-0 z-[101] h-full w-full"
        />

        <!-- Organic Floating-Medallion Centered Modal -->
        <div class="modal-card relative z-[102] w-full max-w-md">
          <!-- Floating Top Success Medallion (breaks out of card silhouette) -->
          <div class="pointer-events-none absolute -top-12 left-1/2 z-20 -translate-x-1/2">
            <div class="relative flex h-24 w-24 items-center justify-center">
              <!-- Outer pulsing green aura -->
              <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/40" />
              <span class="absolute -inset-2 rounded-full bg-emerald-300/30 blur-md" />
              <!-- Medallion ring -->
              <div class="relative flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-lime-400 via-emerald-500 to-green-600 text-white shadow-xl shadow-emerald-600/40">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  class="check-pop h-12 w-12 drop-shadow"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="3.2"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <!-- Floating sparkles -->
              <span class="sparkle absolute -left-3 top-2 h-3 w-3 rounded-full bg-lime-300 shadow shadow-lime-300/80" />
              <span class="sparkle-delay absolute -right-2 top-4 h-2.5 w-2.5 rounded-full bg-emerald-200 shadow shadow-emerald-200/80" />
              <span class="sparkle absolute -right-4 bottom-2 h-2 w-2 rounded-full bg-amber-300" />
            </div>
          </div>

          <!-- Main Sculpted Card -->
          <div
            class="relative overflow-hidden rounded-[2.25rem] border-2 border-emerald-300/70 bg-gradient-to-b from-emerald-50 via-white to-emerald-50/90 shadow-[0_28px_70px_-15px_rgba(5,150,105,0.5)]"
          >
            <!-- Lush Green Hero Banner with Curved Bottom Wave -->
            <div class="relative bg-gradient-to-br from-emerald-600 via-green-500 to-teal-500 px-6 pb-12 pt-16 text-center text-white">
              <!-- Decorative soft radial orbs -->
              <div class="pointer-events-none absolute -left-10 -top-10 h-36 w-36 rounded-full bg-lime-300/25 blur-2xl" />
              <div class="pointer-events-none absolute -right-8 top-4 h-32 w-32 rounded-full bg-teal-200/25 blur-2xl" />

              <!-- Close button -->
              <button
                type="button"
                class="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white/90 backdrop-blur-sm transition hover:bg-white/25 hover:text-white"
                aria-label="Close"
                @click="emitClose"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2.2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <h2
                id="success-modal-title"
                class="relative text-3xl font-extrabold tracking-tight drop-shadow-sm"
              >
                Tap Successful!
              </h2>
              <p class="relative mt-1.5 text-sm font-medium text-emerald-50/95">
                Your attendance has been recorded
              </p>

              <!-- Curved SVG Wave Divider -->
              <svg
                class="pointer-events-none absolute -bottom-px left-0 h-8 w-full text-emerald-50"
                viewBox="0 0 400 40"
                preserveAspectRatio="none"
              >
                <path
                  d="M0,18 C110,46 290,-8 400,22 L400,40 L0,40 Z"
                  fill="currentColor"
                />
              </svg>
            </div>

            <!-- Card Body -->
            <div class="px-6 pb-6 pt-3 text-center">
              <!-- Employee Pill Card -->
              <div
                v-if="employeeName"
                class="flex items-center gap-3.5 rounded-full border border-emerald-200/90 bg-white/90 p-2 pr-4 text-left shadow-sm shadow-emerald-900/5"
              >
                <div class="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-emerald-400 bg-gradient-to-br from-emerald-100 to-green-200 text-sm font-bold text-emerald-800">
                  <img
                    v-if="photoUrl"
                    :src="photoUrl"
                    alt="Employee photo"
                    class="h-full w-full object-cover"
                  />
                  <span v-else>{{ employeeInitials }}</span>
                </div>
                <div class="min-w-0 flex-1">
                  <div class="truncate text-base font-bold text-emerald-950">
                    {{ employeeName }}
                  </div>
                  <div class="truncate text-xs font-medium text-emerald-700/80">
                    {{ department || '—' }}
                  </div>
                </div>
                <span
                  v-if="tapMethod"
                  class="shrink-0 rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-700"
                >
                  {{ tapMethod }}
                </span>
              </div>

              <!-- Tap Type & Time Pods -->
              <div class="mt-4 grid grid-cols-2 gap-3 text-left">
                <!-- Type of Tap Pod -->
                <div class="rounded-3xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50/90 to-white p-4 shadow-sm">
                  <div class="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-600/90">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="2.2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M7 7h10M7 12h6m-6 5h8" />
                    </svg>
                    <span>Type of Tap</span>
                  </div>
                  <div class="mt-2.5">
                    <span
                      class="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-bold shadow-sm"
                      :class="tapTypeMeta.badgeClass"
                    >
                      <span class="h-2 w-2 rounded-full" :class="tapTypeMeta.dotClass" />
                      {{ tapTypeMeta.label }}
                    </span>
                  </div>
                </div>

                <!-- Time of Tap Pod -->
                <div class="rounded-3xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50/90 to-white p-4 shadow-sm">
                  <div class="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-600/90">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="2.2">
                      <circle cx="12" cy="12" r="9" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 7v5l3 2" />
                    </svg>
                    <span>Time of Tap</span>
                  </div>
                  <div class="mt-2 tabular-nums text-lg font-extrabold text-emerald-950">
                    {{ tapTime || '—' }}
                  </div>
                  <div v-if="tapDate" class="mt-0.5 truncate text-[11px] font-medium text-emerald-700/75">
                    {{ tapDate }}
                  </div>
                </div>
              </div>

              <!-- Pill Action Button -->
              <button
                type="button"
                class="mt-5 w-full rounded-full bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 px-6 py-3 text-sm font-bold tracking-wide text-white shadow-lg shadow-emerald-500/35 transition hover:-translate-y-0.5 hover:from-emerald-600 hover:via-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 active:translate-y-0"
                @click="emitClose"
              >
                Awesome, Done!
              </button>

              <!-- Rounded Auto-close Progress Pill -->
              <div class="mx-auto mt-4 h-1.5 w-4/5 overflow-hidden rounded-full bg-emerald-100">
                <div
                  :key="triggerKey"
                  class="progress-bar h-full rounded-full bg-gradient-to-r from-lime-400 via-emerald-500 to-green-600"
                  :style="{ animationDuration: `${duration}ms` }"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, nextTick, onBeforeUnmount, onMounted } from 'vue';

const props = defineProps({
  show: { type: Boolean, default: false },
  triggerKey: { type: Number, default: 0 },
  tapType: { type: String, default: 'TIME_IN' },
  tapMethod: { type: String, default: '' },
  tapTime: { type: String, default: '' },
  tapDate: { type: String, default: '' },
  employeeName: { type: String, default: '' },
  department: { type: String, default: '' },
  photoUrl: { type: String, default: '' },
  duration: { type: Number, default: 4000 },
});

const emit = defineEmits(['close']);

const confettiCanvas = ref(null);
let animFrameId = null;
let autoCloseTimer = null;
let audioCtx = null;

function emitClose() {
  clearAutoClose();
  stopConfetti();
  emit('close');
}

function clearAutoClose() {
  if (autoCloseTimer) {
    clearTimeout(autoCloseTimer);
    autoCloseTimer = null;
  }
}

function scheduleAutoClose() {
  clearAutoClose();
  if (props.duration > 0) {
    autoCloseTimer = setTimeout(() => {
      emitClose();
    }, props.duration);
  }
}

/** ---------------- Tap type badge metadata ---------------- */
const tapTypeMeta = computed(() => {
  const key = String(props.tapType || 'TIME_IN').trim().toUpperCase();
  const map = {
    TIME_IN: {
      label: 'Time In',
      badgeClass: 'bg-emerald-600 text-white',
      dotClass: 'bg-lime-300',
    },
    LUNCH_START: {
      label: 'Lunch Start',
      badgeClass: 'bg-amber-100 text-amber-900 border border-amber-300/70',
      dotClass: 'bg-amber-500',
    },
    LUNCH_END: {
      label: 'Lunch End',
      badgeClass: 'bg-lime-100 text-lime-900 border border-lime-300/80',
      dotClass: 'bg-lime-600',
    },
    BREAK_START: {
      label: 'Break Start',
      badgeClass: 'bg-teal-100 text-teal-900 border border-teal-300/70',
      dotClass: 'bg-teal-500',
    },
    BREAK_END: {
      label: 'Break End',
      badgeClass: 'bg-emerald-100 text-emerald-900 border border-emerald-300/80',
      dotClass: 'bg-emerald-600',
    },
    TIME_OUT: {
      label: 'Time Out',
      badgeClass: 'bg-green-700 text-white',
      dotClass: 'bg-emerald-300',
    },
  };
  if (map[key]) return map[key];
  const formatted = key
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    label: formatted || 'Time In',
    badgeClass: 'bg-emerald-600 text-white',
    dotClass: 'bg-lime-300',
  };
});

const employeeInitials = computed(() => {
  const parts = String(props.employeeName || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  const s = (parts[0]?.[0] || '') + (parts[1]?.[0] || '');
  return s ? s.toUpperCase() : 'EMP';
});

/** ---------------- Celebratory Music (Web Audio API) ---------------- */
function getAudioContext() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return null;
  if (!audioCtx || audioCtx.state === 'closed') {
    audioCtx = new AudioCtx();
  }
  return audioCtx;
}

function playCelebrationMusic() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;

    // Warm 8-bit NES-style low-pass filter
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(3600, now);

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.24, now);

    filter.connect(masterGain);
    masterGain.connect(ctx.destination);

    // Classic 8-bit Super Mario 1-UP success jingle: E5 -> G5 -> E6 -> C6 -> D6 -> G6
    const lead = [
      { freq: 659.25, start: 0.0, dur: 0.11 },  // E5
      { freq: 783.99, start: 0.11, dur: 0.11 }, // G5
      { freq: 1318.51, start: 0.22, dur: 0.11 }, // E6
      { freq: 1046.5, start: 0.33, dur: 0.11 }, // C6
      { freq: 1174.66, start: 0.44, dur: 0.11 }, // D6
      { freq: 1567.98, start: 0.55, dur: 0.28 }, // G6
    ];

    const harmony = [
      { freq: 329.63, start: 0.0, dur: 0.11 },  // E4
      { freq: 392.0, start: 0.11, dur: 0.11 },  // G4
      { freq: 659.25, start: 0.22, dur: 0.11 }, // E5
      { freq: 523.25, start: 0.33, dur: 0.11 }, // C5
      { freq: 587.33, start: 0.44, dur: 0.11 }, // D5
      { freq: 783.99, start: 0.55, dur: 0.28 }, // G5
    ];

    const scheduleVoice = (notes, type, vol) => {
      for (const n of notes) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(n.freq, now + n.start);

        gain.gain.setValueAtTime(0.0001, now + n.start);
        gain.gain.linearRampToValueAtTime(vol, now + n.start + 0.008);
        gain.gain.setValueAtTime(vol, now + n.start + Math.max(0.02, n.dur - 0.02));
        gain.gain.exponentialRampToValueAtTime(0.0001, now + n.start + n.dur);

        osc.connect(gain);
        gain.connect(filter);

        osc.start(now + n.start);
        osc.stop(now + n.start + n.dur + 0.02);
      }
    };

    scheduleVoice(lead, 'square', 0.65);
    scheduleVoice(harmony, 'triangle', 0.6);
  } catch (_) {
    // Ignore audio errors if blocked by browser policy
  }
}

/** ---------------- Confetti Canvas Engine ---------------- */
const CONFETTI_COLORS = [
  '#10b981', // emerald
  '#22c55e', // green
  '#84cc16', // lime
  '#14b8a6', // teal
  '#34d399', // mint
  '#facc15', // gold accent
  '#ffffff', // crisp white sparkle
  '#a3e635', // bright lime
];

let particles = [];

function stopConfetti() {
  if (animFrameId) {
    cancelAnimationFrame(animFrameId);
    animFrameId = null;
  }
  particles = [];
}

function createBurst(originX, originY, count, angleMin, angleMax, speedMin, speedMax) {
  for (let i = 0; i < count; i++) {
    const angle = angleMin + Math.random() * (angleMax - angleMin);
    const speed = speedMin + Math.random() * (speedMax - speedMin);
    particles.push({
      x: originX,
      y: originY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: 6 + Math.random() * 6,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.25,
      tilt: Math.random() * Math.PI * 2,
      tiltSpeed: 0.08 + Math.random() * 0.12,
      shape: Math.random() > 0.35 ? 'rect' : 'circle',
      alpha: 1,
      decay: 0.006 + Math.random() * 0.006,
      gravity: 0.28 + Math.random() * 0.12,
      drag: 0.982,
    });
  }
}

function startConfetti() {
  stopConfetti();
  const canvas = confettiCanvas.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = window.innerWidth;
  const h = window.innerHeight;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  // Center burst + left & right celebratory cannons
  createBurst(w * 0.5, h * 0.45, 75, -Math.PI, 0, 5, 15);
  createBurst(w * 0.12, h * 0.65, 45, -Math.PI * 0.45, -Math.PI * 0.15, 10, 19);
  createBurst(w * 0.88, h * 0.65, 45, -Math.PI * 0.85, -Math.PI * 0.55, 10, 19);

  function frame() {
    ctx.clearRect(0, 0, w, h);
    let alive = 0;

    for (const p of particles) {
      if (p.alpha <= 0) continue;
      alive++;

      p.vx *= p.drag;
      p.vy *= p.drag;
      p.vy += p.gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotationSpeed;
      p.tilt += p.tiltSpeed;

      if (p.y > h * 0.72) {
        p.alpha -= p.decay * 1.8;
      } else {
        p.alpha -= p.decay * 0.4;
      }

      if (p.alpha <= 0) continue;

      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;

      if (p.shape === 'rect') {
        const scaleY = Math.cos(p.tilt);
        ctx.fillRect(-p.size / 2, (-p.size * 0.55 * scaleY) / 2, p.size, p.size * 0.55 * scaleY);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.size * 0.35, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    if (alive > 0) {
      animFrameId = requestAnimationFrame(frame);
    } else {
      animFrameId = null;
    }
  }

  animFrameId = requestAnimationFrame(frame);
}

/** ---------------- Lifecycle & Watchers ---------------- */
function unlockAudio() {
  if (audioCtx && audioCtx.state === 'running') return;
  try {
    const ctx = getAudioContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
  } catch (_) {}
}

function onKeydown(e) {
  unlockAudio();
  if (e.key === 'Escape' && props.show) {
    emitClose();
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown);
  window.addEventListener('pointerdown', unlockAudio);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown);
  window.removeEventListener('pointerdown', unlockAudio);
  clearAutoClose();
  stopConfetti();
});

watch(
  () => [props.show, props.triggerKey],
  async ([isShown]) => {
    if (isShown) {
      playCelebrationMusic();
      scheduleAutoClose();
      await nextTick();
      startConfetti();
    } else {
      clearAutoClose();
      stopConfetti();
    }
  }
);
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.24s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .modal-card {
  animation: modal-pop 0.38s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

@keyframes modal-pop {
  0% {
    opacity: 0;
    transform: scale(0.84) translateY(18px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.check-pop {
  animation: check-bounce 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s both;
}

@keyframes check-bounce {
  0% {
    opacity: 0;
    transform: scale(0.35) rotate(-12deg);
  }
  100% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
}

.sparkle {
  animation: float-sparkle 2s ease-in-out infinite;
}
.sparkle-delay {
  animation: float-sparkle 2s ease-in-out 0.6s infinite;
}

@keyframes float-sparkle {
  0%, 100% {
    transform: translateY(0) scale(1);
    opacity: 0.9;
  }
  50% {
    transform: translateY(-5px) scale(1.25);
    opacity: 1;
  }
}

.progress-bar {
  width: 100%;
  transform-origin: left center;
  animation-name: shrink-progress;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
}

@keyframes shrink-progress {
  from {
    transform: scaleX(1);
  }
  to {
    transform: scaleX(0);
  }
}
</style>
