<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="show"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 pt-14"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="error-modal-title"
      >
        <!-- Rose-tinted Backdrop -->
        <div
          class="fixed inset-0 bg-rose-950/45 backdrop-blur-md"
          @click="emitClose"
        />

        <!-- Organic Floating-Medallion Centered Modal -->
        <div class="modal-card relative z-[102] w-full max-w-md">
          <!-- Floating Top Error Medallion (breaks out of card silhouette) -->
          <div class="pointer-events-none absolute -top-12 left-1/2 z-20 -translate-x-1/2">
            <div class="relative flex h-24 w-24 items-center justify-center">
              <!-- Outer pulsing red aura -->
              <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400/40" />
              <span class="absolute -inset-2 rounded-full bg-red-400/30 blur-md" />
              <!-- Medallion ring -->
              <div class="relative flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-orange-400 via-rose-500 to-red-600 text-white shadow-xl shadow-rose-600/40">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  class="icon-shake h-12 w-12 drop-shadow"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="3.2"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <!-- Floating accent dots -->
              <span class="pulse-dot absolute -left-3 top-2 h-3 w-3 rounded-full bg-orange-300 shadow shadow-orange-300/80" />
              <span class="pulse-dot-delay absolute -right-2 top-4 h-2.5 w-2.5 rounded-full bg-rose-200 shadow shadow-rose-200/80" />
              <span class="pulse-dot absolute -right-4 bottom-2 h-2 w-2 rounded-full bg-red-300" />
            </div>
          </div>

          <!-- Main Sculpted Card -->
          <div
            class="relative overflow-hidden rounded-[2.25rem] border-2 border-rose-300/75 bg-gradient-to-b from-rose-50 via-white to-rose-50/90 shadow-[0_28px_70px_-15px_rgba(225,29,72,0.45)]"
          >
            <!-- Rich Red/Rose Hero Banner with Curved Bottom Wave -->
            <div class="relative bg-gradient-to-br from-rose-600 via-red-500 to-orange-500 px-6 pb-12 pt-16 text-center text-white">
              <!-- Decorative soft radial orbs -->
              <div class="pointer-events-none absolute -left-10 -top-10 h-36 w-36 rounded-full bg-orange-300/25 blur-2xl" />
              <div class="pointer-events-none absolute -right-8 top-4 h-32 w-32 rounded-full bg-pink-200/25 blur-2xl" />

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
                id="error-modal-title"
                class="relative text-3xl font-extrabold tracking-tight drop-shadow-sm"
              >
                Tap Unsuccessful
              </h2>
              <p class="relative mt-1.5 text-sm font-medium text-rose-50/95">
                Attendance could not be recorded
              </p>

              <!-- Curved SVG Wave Divider -->
              <svg
                class="pointer-events-none absolute -bottom-px left-0 h-8 w-full text-rose-50"
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
              <!-- Reason / Error Message Pod -->
              <div class="rounded-3xl border border-rose-200/90 bg-white/95 p-4 text-left shadow-sm shadow-rose-900/5">
                <div class="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-rose-600">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-4 w-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2.2">
                    <circle cx="12" cy="12" r="9" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01" />
                  </svg>
                  <span>Reason</span>
                </div>
                <p class="mt-1.5 text-sm font-semibold leading-relaxed text-rose-950">
                  {{ message || 'Unable to process tap. Please try again.' }}
                </p>
              </div>

              <!-- Attempt Details Strip -->
              <div class="mt-3.5 grid grid-cols-2 gap-3 text-left">
                <!-- Status Pill Pod -->
                <div class="rounded-3xl border border-rose-200/80 bg-gradient-to-br from-rose-50/90 to-white p-3.5 shadow-sm">
                  <div class="text-[11px] font-bold uppercase tracking-wider text-rose-500">
                    Status
                  </div>
                  <div class="mt-2">
                    <span class="inline-flex items-center gap-1.5 rounded-full bg-rose-600 px-3 py-1 text-xs font-bold text-white shadow-sm">
                      <span class="h-2 w-2 rounded-full bg-orange-200" />
                      Failed Tap
                    </span>
                  </div>
                </div>

                <!-- Time of Attempt Pod -->
                <div class="rounded-3xl border border-rose-200/80 bg-gradient-to-br from-rose-50/90 to-white p-3.5 shadow-sm">
                  <div class="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-rose-500">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="2.2">
                      <circle cx="12" cy="12" r="9" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 7v5l3 2" />
                    </svg>
                    <span>Time</span>
                  </div>
                  <div class="mt-1.5 tabular-nums text-base font-extrabold text-rose-950">
                    {{ tapTime || '—' }}
                  </div>
                  <div v-if="tapDate" class="mt-0.5 truncate text-[11px] font-medium text-rose-700/75">
                    {{ tapDate }}
                  </div>
                </div>
              </div>

              <!-- Pill Action Button -->
              <button
                type="button"
                class="mt-5 w-full rounded-full bg-gradient-to-r from-rose-500 via-red-500 to-rose-600 px-6 py-3 text-sm font-bold tracking-wide text-white shadow-lg shadow-rose-500/35 transition hover:-translate-y-0.5 hover:from-rose-600 hover:via-red-600 hover:to-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-2 active:translate-y-0"
                @click="emitClose"
              >
                Try Again
              </button>

              <!-- Rounded Auto-close Progress Pill -->
              <div class="mx-auto mt-4 h-1.5 w-4/5 overflow-hidden rounded-full bg-rose-100">
                <div
                  :key="triggerKey"
                  class="progress-bar h-full rounded-full bg-gradient-to-r from-orange-400 via-rose-500 to-red-600"
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
import { watch, onBeforeUnmount, onMounted } from 'vue';

const props = defineProps({
  show: { type: Boolean, default: false },
  triggerKey: { type: Number, default: 0 },
  message: { type: String, default: '' },
  tapTime: { type: String, default: '' },
  tapDate: { type: String, default: '' },
  duration: { type: Number, default: 2000 },
});

const emit = defineEmits(['close']);

let autoCloseTimer = null;
let audioCtx = null;

function emitClose() {
  clearAutoClose();
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

/** ---------------- Error Alert Sound (Web Audio API) ---------------- */
function getAudioContext() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return null;
  if (!audioCtx || audioCtx.state === 'closed') {
    audioCtx = new AudioCtx();
  }
  return audioCtx;
}

function unlockAudio() {
  if (audioCtx && audioCtx.state === 'running') return;
  try {
    const ctx = getAudioContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
  } catch (_) {}
}

function playErrorSound() {
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
    filter.frequency.setValueAtTime(3200, now);

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.24, now);

    filter.connect(masterGain);
    masterGain.connect(ctx.destination);

    // Classic 8-bit "Player Down / Defeated" chiptune melody (square lead + triangle bass)
    const lead = [
      { freq: 493.88, start: 0.0, dur: 0.11 },  // B4
      { freq: 698.46, start: 0.12, dur: 0.11 }, // F5
      { freq: 698.46, start: 0.34, dur: 0.13 }, // F5
      { freq: 698.46, start: 0.49, dur: 0.14 }, // F5
      { freq: 659.25, start: 0.65, dur: 0.14 }, // E5
      { freq: 587.33, start: 0.81, dur: 0.14 }, // D5
      { freq: 523.25, start: 0.97, dur: 0.12 }, // C5
      { freq: 329.63, start: 1.11, dur: 0.11 }, // E4
      { freq: 329.63, start: 1.24, dur: 0.1 },  // E4
      { freq: 261.63, start: 1.36, dur: 0.28 }, // C4
    ];

    const bass = [
      { freq: 196.0, start: 0.0, dur: 0.11 },   // G3
      { freq: 293.66, start: 0.12, dur: 0.11 }, // D4
      { freq: 293.66, start: 0.34, dur: 0.13 }, // D4
      { freq: 293.66, start: 0.49, dur: 0.14 }, // D4
      { freq: 261.63, start: 0.65, dur: 0.14 }, // C4
      { freq: 246.94, start: 0.81, dur: 0.14 }, // B3
      { freq: 196.0, start: 0.97, dur: 0.12 },  // G3
      { freq: 130.81, start: 1.36, dur: 0.28 }, // C3
    ];

    const scheduleVoice = (notes, type, vol) => {
      for (const n of notes) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(n.freq, now + n.start);

        gain.gain.setValueAtTime(0.0001, now + n.start);
        gain.gain.linearRampToValueAtTime(vol, now + n.start + 0.008);
        gain.gain.setValueAtTime(vol, now + n.start + Math.max(0.02, n.dur - 0.025));
        gain.gain.exponentialRampToValueAtTime(0.0001, now + n.start + n.dur);

        osc.connect(gain);
        gain.connect(filter);

        osc.start(now + n.start);
        osc.stop(now + n.start + n.dur + 0.02);
      }
    };

    scheduleVoice(lead, 'square', 0.65);
    scheduleVoice(bass, 'triangle', 0.85);
  } catch (_) {
    // Ignore audio errors if blocked by browser policy
  }
}

/** ---------------- Lifecycle & Watchers ---------------- */
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
});

watch(
  () => [props.show, props.triggerKey],
  ([isShown]) => {
    if (isShown) {
      playErrorSound();
      scheduleAutoClose();
    } else {
      clearAutoClose();
    }
  }
);
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.22s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .modal-card {
  animation: modal-shake-in 0.42s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

@keyframes modal-shake-in {
  0% {
    opacity: 0;
    transform: scale(0.86) translateY(14px);
  }
  45% {
    opacity: 1;
    transform: scale(1.01) translateX(-5px);
  }
  65% {
    transform: scale(1) translateX(5px);
  }
  82% {
    transform: translateX(-3px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateX(0);
  }
}

.icon-shake {
  animation: x-pop 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) 0.08s both;
}

@keyframes x-pop {
  0% {
    opacity: 0;
    transform: scale(0.4) rotate(18deg);
  }
  100% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
}

.pulse-dot {
  animation: float-dot 2s ease-in-out infinite;
}
.pulse-dot-delay {
  animation: float-dot 2s ease-in-out 0.6s infinite;
}

@keyframes float-dot {
  0%, 100% {
    transform: translateY(0) scale(1);
    opacity: 0.85;
  }
  50% {
    transform: translateY(-4px) scale(1.2);
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

