<template>
  <div id="app">
    <router-view />
    <div class="signature-badge" ref="sig" @click="onSigClick">Lucy · Private Edition</div>
  </div>
</template>

<script>
import { mountWatermark } from './Watermark'
export default {
  name: 'App',
  mounted() {
    this._unmountWm = mountWatermark({
      text: 'LUCY',
      color: 'rgba(255,255,255,0.08)',
      font: '600 16px Inter, system-ui, -apple-system, Segoe UI, Roboto, PingFang SC, Noto Sans SC, Arial',
      rotate: -22,
      gap: 200
    })
  },
  beforeUnmount() {
    this._unmountWm && this._unmountWm()
  },
  methods: {
    onSigClick() {
      const el = this.$refs.sig
      if (!el) return
      el.classList.remove('sig-bounce')
      void el.offsetWidth
      el.classList.add('sig-bounce')
      const ripple = document.createElement('span')
      ripple.className = 'sig-ripple'
      el.appendChild(ripple)
      setTimeout(()=> ripple.remove(), 600)
    }
  }
}
</script>

<style>
#app {
  margin: 0;
  padding: 0;
  width: 100%;
  min-height: 100vh;
}

.signature-badge {
  position: fixed;
  right: 16px;
  bottom: 16px;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 11px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: #e7eefc;
  background: #2b3b52;
  border: 2px solid #0d1420;
  box-shadow:
    inset 0 -2px 0 #1a2535,
    0 3px 0 #0d1420,
    0 6px 12px rgba(0,0,0,0.35);
  font-family: ui-monospace, "Cascadia Mono", "SFMono-Regular", Menlo, Consolas, monospace;
  pointer-events: auto;
  z-index: 9999;
  text-shadow:
    1px 0 #000,
    -1px 0 #000,
    0 1px #000,
    0 -1px #000;
  image-rendering: pixelated;
  overflow: hidden;
  opacity: 0.85;
}

.signature-badge.sig-bounce { animation: sigBounce 420ms cubic-bezier(.18,.89,.32,1.28); }
@keyframes sigBounce {
  0% { transform: scale(1); }
  30% { transform: scale(1.12) rotate(-1deg); }
  60% { transform: scale(0.98) rotate(1deg); }
  100% { transform: scale(1); }
}

.signature-badge .sig-ripple {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 10px;
  height: 10px;
  transform: translate(-50%, -50%);
  border-radius: 0;
  background: rgba(255,255,255,0.25);
  box-shadow:
    0 0 0 2px rgba(255,255,255,0.25),
    0 0 0 4px rgba(255,255,255,0.15),
    0 0 0 6px rgba(255,255,255,0.08);
  animation: sigRipplePixel 600ms steps(6, end) forwards;
}
@keyframes sigRipplePixel {
  0% { opacity: 0.9; width: 10px; height: 10px; }
  20% { width: 30px; height: 30px; }
  40% { width: 60px; height: 60px; }
  60% { width: 90px; height: 90px; }
  80% { width: 120px; height: 120px; }
  100% { opacity: 0; width: 150px; height: 150px; }
}
</style>

