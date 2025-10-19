<template>
  <div class="sketch-page">
    <!-- 返回按钮 -->
    <div class="back-btn" @click="goBack">←</div>

    <!-- 手绘场景 -->
    <div class="sketch-scene">
      <!-- 背景纸张纹理 -->
      <div class="paper-texture"></div>

      <!-- 雨滴 -->
      <div class="rain-container">
        <div class="sketch-rain" v-for="i in 20" :key="i" :style="getRainStyle(i)">
          <svg width="3" height="18" viewBox="0 0 3 18">
            <path d="M 1.5 0 Q 0.5 8 1.5 18" stroke="#6b9ac4" stroke-width="1.2" fill="none" stroke-linecap="round" opacity="0.7"/>
          </svg>
        </div>
      </div>

      <!-- SVG 定义 -->
      <svg width="0" height="0" style="position: absolute;">
        <defs>
          <!-- 手绘效果滤镜 -->
          <filter id="sketch-filter">
            <feTurbulence type="fractalNoise" baseFrequency="0.08" numOctaves="3" />
            <feDisplacementMap in="SourceGraphic" scale="1.5" />
          </filter>
          
          <!-- 纸张纹理 -->
          <filter id="paper-filter">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" result="noise" />
            <feDiffuseLighting in="noise" lighting-color="white" surfaceScale="0.8">
              <feDistantLight azimuth="45" elevation="60" />
            </feDiffuseLighting>
          </filter>
        </defs>
      </svg>

      <!-- 草地 -->
      <div class="sketch-ground">
        <svg class="grass-svg" viewBox="0 0 100 35" preserveAspectRatio="none">
          <path d="M 0,30 Q 8,25 16,30 T 32,30 T 48,30 T 64,30 T 80,30 T 96,30 L 100,35 L 0,35 Z" 
                fill="#7cb342" stroke="#558b2f" stroke-width="0.8" opacity="0.9"/>
          <!-- 草丛 -->
          <path d="M 3,30 Q 4,22 5,30" stroke="#558b2f" stroke-width="1.2" fill="none" stroke-linecap="round"/>
          <path d="M 6,30 Q 7,25 8,30" stroke="#558b2f" stroke-width="1.2" fill="none" stroke-linecap="round"/>
          <path d="M 10,30 Q 11,23 12,30" stroke="#558b2f" stroke-width="1.2" fill="none" stroke-linecap="round"/>
          <path d="M 15,30 Q 16,20 17,30" stroke="#558b2f" stroke-width="1.2" fill="none" stroke-linecap="round"/>
          <path d="M 20,30 Q 21,24 22,30" stroke="#558b2f" stroke-width="1.2" fill="none" stroke-linecap="round"/>
          <path d="M 25,30 Q 26,22 27,30" stroke="#558b2f" stroke-width="1.2" fill="none" stroke-linecap="round"/>
          <path d="M 30,30 Q 31,21 32,30" stroke="#558b2f" stroke-width="1.2" fill="none" stroke-linecap="round"/>
          <path d="M 35,30 Q 36,23 37,30" stroke="#558b2f" stroke-width="1.2" fill="none" stroke-linecap="round"/>
          <path d="M 40,30 Q 41,25 42,30" stroke="#558b2f" stroke-width="1.2" fill="none" stroke-linecap="round"/>
          <path d="M 45,30 Q 46,20 47,30" stroke="#558b2f" stroke-width="1.2" fill="none" stroke-linecap="round"/>
          <path d="M 50,30 Q 51,24 52,30" stroke="#558b2f" stroke-width="1.2" fill="none" stroke-linecap="round"/>
          <path d="M 55,30 Q 56,22 57,30" stroke="#558b2f" stroke-width="1.2" fill="none" stroke-linecap="round"/>
          <path d="M 60,30 Q 61,23 62,30" stroke="#558b2f" stroke-width="1.2" fill="none" stroke-linecap="round"/>
          <path d="M 65,30 Q 66,21 67,30" stroke="#558b2f" stroke-width="1.2" fill="none" stroke-linecap="round"/>
          <path d="M 70,30 Q 71,25 72,30" stroke="#558b2f" stroke-width="1.2" fill="none" stroke-linecap="round"/>
          <path d="M 75,30 Q 76,22 77,30" stroke="#558b2f" stroke-width="1.2" fill="none" stroke-linecap="round"/>
          <path d="M 80,30 Q 81,24 82,30" stroke="#558b2f" stroke-width="1.2" fill="none" stroke-linecap="round"/>
          <path d="M 85,30 Q 86,23 87,30" stroke="#558b2f" stroke-width="1.2" fill="none" stroke-linecap="round"/>
          <path d="M 90,30 Q 91,22 92,30" stroke="#558b2f" stroke-width="1.2" fill="none" stroke-linecap="round"/>
          <path d="M 95,30 Q 96,25 97,30" stroke="#558b2f" stroke-width="1.2" fill="none" stroke-linecap="round"/>
        </svg>
      </div>

      <!-- 花朵 -->
      <div class="flowers">
        <svg class="flower-svg" viewBox="0 0 100 20" preserveAspectRatio="none">
          <!-- 花朵1 -->
          <circle cx="15" cy="15" r="3" fill="#FFB6C1" stroke="#FF69B4" stroke-width="0.5" opacity="0.8"/>
          <circle cx="13" cy="13" r="1.5" fill="#FF69B4"/>
          <circle cx="17" cy="13" r="1.5" fill="#FF69B4"/>
          <circle cx="13" cy="17" r="1.5" fill="#FF69B4"/>
          <circle cx="17" cy="17" r="1.5" fill="#FF69B4"/>
          <circle cx="15" cy="15" r="1" fill="#FFD700"/>
          
          <!-- 花朵2 -->
          <circle cx="35" cy="12" r="2.5" fill="#DDA0DD" stroke="#DA70D6" stroke-width="0.5" opacity="0.8"/>
          <circle cx="33" cy="10" r="1.2" fill="#DA70D6"/>
          <circle cx="37" cy="10" r="1.2" fill="#DA70D6"/>
          <circle cx="33" cy="14" r="1.2" fill="#DA70D6"/>
          <circle cx="37" cy="14" r="1.2" fill="#DA70D6"/>
          <circle cx="35" cy="12" r="0.8" fill="#FFD700"/>
          
          <!-- 花朵3 -->
          <circle cx="65" cy="16" r="3.5" fill="#FFA07A" stroke="#FF7F50" stroke-width="0.5" opacity="0.8"/>
          <circle cx="62" cy="13" r="1.8" fill="#FF7F50"/>
          <circle cx="68" cy="13" r="1.8" fill="#FF7F50"/>
          <circle cx="62" cy="19" r="1.8" fill="#FF7F50"/>
          <circle cx="68" cy="19" r="1.8" fill="#FF7F50"/>
          <circle cx="65" cy="16" r="1.2" fill="#FFD700"/>
          
          <!-- 花朵4 -->
          <circle cx="85" cy="14" r="2.8" fill="#FFB6C1" stroke="#FF69B4" stroke-width="0.5" opacity="0.8"/>
          <circle cx="82" cy="11" r="1.4" fill="#FF69B4"/>
          <circle cx="88" cy="11" r="1.4" fill="#FF69B4"/>
          <circle cx="82" cy="17" r="1.4" fill="#FF69B4"/>
          <circle cx="88" cy="17" r="1.4" fill="#FF69B4"/>
          <circle cx="85" cy="14" r="1" fill="#FFD700"/>
        </svg>
      </div>

      <!-- 蝴蝶 -->
      <div class="butterflies">
        <svg class="butterfly-svg" viewBox="0 0 100 30" preserveAspectRatio="none">
          <!-- 蝴蝶1 -->
          <ellipse cx="20" cy="15" rx="4" ry="2" fill="#FF69B4" stroke="#FF1493" stroke-width="0.5" opacity="0.8"/>
          <ellipse cx="20" cy="15" rx="2" ry="1" fill="#FFB6C1"/>
          <circle cx="20" cy="15" r="0.5" fill="#8B4513"/>
          
          <!-- 蝴蝶2 -->
          <ellipse cx="60" cy="12" rx="3.5" ry="1.8" fill="#DDA0DD" stroke="#DA70D6" stroke-width="0.5" opacity="0.8"/>
          <ellipse cx="60" cy="12" rx="1.8" ry="0.9" fill="#E6E6FA"/>
          <circle cx="60" cy="12" r="0.4" fill="#8B4513"/>
          
          <!-- 蝴蝶3 -->
          <ellipse cx="80" cy="18" rx="3" ry="1.5" fill="#FFA07A" stroke="#FF7F50" stroke-width="0.5" opacity="0.8"/>
          <ellipse cx="80" cy="18" rx="1.5" ry="0.8" fill="#FFE4B5"/>
          <circle cx="80" cy="18" r="0.4" fill="#8B4513"/>
        </svg>
      </div>

      <!-- 雨伞 -->
      <div class="sketch-umbrella">
        <svg viewBox="0 0 140 120" class="umbrella-svg">
          <!-- 伞面 -->
          <path d="M 15,50 Q 25,20 40,30 Q 50,15 65,30 Q 80,15 95,30 Q 110,20 125,50" 
                fill="#FF6B9D" 
                stroke="#FF1493" 
                stroke-width="3" 
                stroke-linecap="round"
                stroke-linejoin="round"
                class="umbrella-top"/>
          <!-- 伞骨 -->
          <line x1="70" y1="30" x2="70" y2="50" stroke="#FF1493" stroke-width="2.5"/>
          <line x1="70" y1="30" x2="40" y2="30" stroke="#FF1493" stroke-width="2" opacity="0.7"/>
          <line x1="70" y1="30" x2="95" y2="30" stroke="#FF1493" stroke-width="2" opacity="0.7"/>
          <!-- 伞柄 -->
          <path d="M 70,50 L 70,110 Q 70,115 65,115" 
                stroke="#8B4513" 
                stroke-width="4" 
                fill="none" 
                stroke-linecap="round"
                class="umbrella-handle"/>
        </svg>
      </div>

      <!-- 小猫 -->
      <div class="sketch-cat">
        <svg viewBox="0 0 120 140" class="cat-svg">
          <!-- 尾巴 -->
          <path d="M 15,90 Q 8,75 12,60" 
                stroke="#8B7355" 
                stroke-width="8" 
                fill="none" 
                stroke-linecap="round"
                class="cat-tail"/>
          
          <!-- 身体 -->
          <ellipse cx="60" cy="85" rx="35" ry="28" 
                   fill="#F5F5F5" 
                   stroke="#8B7355" 
                   stroke-width="3"
                   class="cat-body-part"/>
          
          <!-- 头部 -->
          <circle cx="60" cy="50" r="28" 
                  fill="#F5F5F5" 
                  stroke="#8B7355" 
                  stroke-width="3"
                  class="cat-head-part"/>
          
          <!-- 左耳 -->
          <path d="M 40,30 L 35,15 L 45,28" 
                fill="#F5F5F5" 
                stroke="#8B7355" 
                stroke-width="3"
                stroke-linejoin="round"
                class="cat-ear"/>
          <path d="M 40,28 L 37,20 L 42,26" 
                fill="#FFB6C1" 
                stroke="none"/>
          
          <!-- 右耳 -->
          <path d="M 80,30 L 85,15 L 75,28" 
                fill="#F5F5F5" 
                stroke="#8B7355" 
                stroke-width="3"
                stroke-linejoin="round"
                class="cat-ear"/>
          <path d="M 80,28 L 83,20 L 78,26" 
                fill="#8B7355" 
                stroke="none"/>
          
          <!-- 左眼 -->
          <ellipse cx="48" cy="48" rx="5" ry="7" 
                   fill="#4169E1"
                   class="cat-eye"/>
          <circle cx="49" cy="46" r="2" fill="white"/>
          
          <!-- 右眼 -->
          <ellipse cx="72" cy="48" rx="5" ry="7" 
                   fill="#4169E1"
                   class="cat-eye"/>
          <circle cx="73" cy="46" r="2" fill="white"/>
          
          <!-- 鼻子 -->
          <path d="M 60,58 L 58,61 L 62,61 Z" fill="#FFB6C1"/>
          
          <!-- 嘴巴 -->
          <path d="M 60,61 Q 55,63 52,62" 
                stroke="#8B7355" 
                stroke-width="2" 
                fill="none" 
                stroke-linecap="round"/>
          <path d="M 60,61 Q 65,63 68,62" 
                stroke="#8B7355" 
                stroke-width="2" 
                fill="none" 
                stroke-linecap="round"/>
          
          <!-- 胡须左 -->
          <line x1="38" y1="52" x2="25" y2="50" stroke="#8B7355" stroke-width="1.5" opacity="0.8"/>
          <line x1="38" y1="55" x2="25" y2="57" stroke="#8B7355" stroke-width="1.5" opacity="0.8"/>
          
          <!-- 胡须右 -->
          <line x1="82" y1="52" x2="95" y2="50" stroke="#8B7355" stroke-width="1.5" opacity="0.8"/>
          <line x1="82" y1="55" x2="95" y2="57" stroke="#8B7355" stroke-width="1.5" opacity="0.8"/>
          
          <!-- 腮红 -->
          <circle cx="35" cy="55" r="4" fill="#87CEEB" opacity="0.6"/>
          <circle cx="85" cy="55" r="4" fill="#87CEEB" opacity="0.6"/>
          
          <!-- 前爪 -->
          <ellipse cx="45" cy="105" rx="10" ry="8" 
                   fill="#F5F5F5" 
                   stroke="#8B7355" 
                   stroke-width="2"/>
          <ellipse cx="75" cy="105" rx="10" ry="8" 
                   fill="#F5F5F5" 
                   stroke="#8B7355" 
                   stroke-width="2"/>
          
          <!-- 爪子细节 -->
          <line x1="42" y1="107" x2="42" y2="109" stroke="#8B7355" stroke-width="1.5"/>
          <line x1="45" y1="107" x2="45" y2="109" stroke="#8B7355" stroke-width="1.5"/>
          <line x1="48" y1="107" x2="48" y2="109" stroke="#8B7355" stroke-width="1.5"/>
          <line x1="72" y1="107" x2="72" y2="109" stroke="#8B7355" stroke-width="1.5"/>
          <line x1="75" y1="107" x2="75" y2="109" stroke="#8B7355" stroke-width="1.5"/>
          <line x1="78" y1="107" x2="78" y2="109" stroke="#8B7355" stroke-width="1.5"/>
        </svg>
      </div>

      <!-- 水坑 -->
      <div class="puddles-sketch">
        <svg viewBox="0 0 100 15" class="puddle-svg puddle-1">
          <ellipse cx="35" cy="7" rx="18" ry="4" 
                   fill="rgba(135, 206, 235, 0.4)" 
                   stroke="#87ceeb" 
                   stroke-width="1.5"
                   stroke-dasharray="3,3"/>
        </svg>
        <svg viewBox="0 0 100 15" class="puddle-svg puddle-2">
          <ellipse cx="70" cy="8" rx="15" ry="3.5" 
                   fill="rgba(135, 206, 235, 0.4)" 
                   stroke="#87ceeb" 
                   stroke-width="1.5"
                   stroke-dasharray="3,3"/>
        </svg>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'

export default {
  name: 'SketchCatAuto',
  setup() {
    const showToast = ref(false)
    const toastMessage = ref('')

    const showToastMessage = (message) => {
      toastMessage.value = message
      showToast.value = true
      setTimeout(() => {
        showToast.value = false
      }, 2000)
    }

    return {
      showToast,
      toastMessage,
      showToastMessage
    }
  },
  methods: {
    goBack() {
      this.$router.push('/')
    },
    getRainStyle(index) {
      return {
        left: `${(index * 10) % 100}%`,
        animationDelay: `${(index * 0.15) % 2}s`,
        animationDuration: `${1.2 + (index % 3) * 0.4}s`
      }
    }
  }
}
</script>

<style scoped>
.sketch-page {
  min-height: 100vh;
  background: linear-gradient(to bottom, #e8f4f8 0%, #b8d4e0 100%);
  position: relative;
  overflow: hidden;
}

.paper-texture {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,.02) 2px, rgba(0,0,0,.02) 4px),
    repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,.02) 2px, rgba(0,0,0,.02) 4px);
  pointer-events: none;
  opacity: 0.6;
}

.back-btn {
  position: fixed;
  top: 20px;
  left: 20px;
  width: 48px;
  height: 48px;
  background: rgba(255, 107, 157, 0.8);
  color: white;
  border: none;
  font-size: 28px;
  cursor: pointer;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: Arial, sans-serif;
  font-weight: bold;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(255, 107, 157, 0.4);
  transition: all 0.2s;
  backdrop-filter: blur(4px);
}

.back-btn:hover {
  background: rgba(255, 107, 157, 1);
  transform: scale(1.1);
}

.back-btn:active {
  transform: scale(0.95);
}

.sketch-scene {
  width: 100%;
  height: 100vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 雨 */
.rain-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.sketch-rain {
  position: absolute;
  animation: sketchRainFall 1.8s linear infinite;
}

@keyframes sketchRainFall {
  0% {
    transform: translateY(-0.5rem);
    opacity: 0;
  }
  10% {
    opacity: 0.8;
  }
  90% {
    opacity: 0.8;
  }
  100% {
    transform: translateY(100vh);
    opacity: 0;
  }
}

/* 草地 */
.sketch-ground {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 4rem;
  z-index: 2;
}

.grass-svg {
  width: 100%;
  height: 100%;
  filter: url(#sketch-filter);
}

/* 花朵 */
.flowers {
  position: absolute;
  bottom: 1rem;
  left: 0;
  width: 100%;
  height: 1.5rem;
  z-index: 3;
}

.flower-svg {
  width: 100%;
  height: 100%;
  filter: url(#sketch-filter);
  animation: flowerSway 4s ease-in-out infinite;
}

@keyframes flowerSway {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-0.1rem);
  }
}

/* 蝴蝶 */
.butterflies {
  position: absolute;
  top: 20%;
  left: 0;
  width: 100%;
  height: 30%;
  z-index: 4;
}

.butterfly-svg {
  width: 100%;
  height: 100%;
  filter: url(#sketch-filter);
  animation: butterflyFloat 6s ease-in-out infinite;
}

@keyframes butterflyFloat {
  0%, 100% {
    transform: translateX(0) translateY(0);
  }
  25% {
    transform: translateX(0.5rem) translateY(-0.2rem);
  }
  50% {
    transform: translateX(0) translateY(-0.1rem);
  }
  75% {
    transform: translateX(-0.3rem) translateY(0.1rem);
  }
}

/* 雨伞 */
.sketch-umbrella {
  position: absolute;
  bottom: 3.5rem;
  left: 50%;
  transform: translateX(-50%);
  width: 3.5rem;
  height: 2.8rem;
  z-index: 5;
  animation: umbrellaFloat 5s ease-in-out infinite;
}

@keyframes umbrellaFloat {
  0%, 100% {
    transform: translateX(-50%) translateY(0) rotate(-1deg);
  }
  50% {
    transform: translateX(-50%) translateY(-0.1rem) rotate(1deg);
  }
}

.umbrella-svg {
  width: 100%;
  height: 100%;
  filter: url(#sketch-filter);
}

.umbrella-top {
  animation: umbrellaShake 6s ease-in-out infinite;
  transform-origin: 70px 50px;
}

@keyframes umbrellaShake {
  0%, 100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(-0.5deg);
  }
  75% {
    transform: rotate(0.5deg);
  }
}

/* 小猫 */
.sketch-cat {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  width: 2.8rem;
  height: 3.2rem;
  z-index: 10;
  animation: catBreathing 4s ease-in-out infinite;
}

@keyframes catBreathing {
  0%, 100% {
    transform: translateX(-50%) scale(1);
  }
  50% {
    transform: translateX(-50%) scale(1.02);
  }
}

.cat-svg {
  width: 100%;
  height: 100%;
  filter: url(#sketch-filter);
}

.cat-tail {
  animation: tailSwing 4s ease-in-out infinite;
  transform-origin: 15px 90px;
}

@keyframes tailSwing {
  0%, 100% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(8deg);
  }
}

.cat-eye {
  animation: eyeBlink 6s infinite;
}

@keyframes eyeBlink {
  0%, 92%, 100% {
    transform: scaleY(1);
  }
  95% {
    transform: scaleY(0.1);
  }
}

.cat-ear {
  animation: earTwitch 5s ease-in-out infinite;
}

.cat-ear:nth-child(3) {
  animation-delay: 0.3s;
}

@keyframes earTwitch {
  0%, 88%, 100% {
    transform: rotate(0deg);
  }
  92%, 96% {
    transform: rotate(-2deg);
  }
  94% {
    transform: rotate(2deg);
  }
}

/* 水坑 */
.puddles-sketch {
  position: absolute;
  bottom: 1.5rem;
  width: 100%;
  z-index: 3;
}

.puddle-svg {
  position: absolute;
  width: 100%;
  height: 0.3rem;
  animation: puddleWave 5s ease-in-out infinite;
}

.puddle-1 {
  left: 0;
}

.puddle-2 {
  right: 0;
  animation-delay: 2.5s;
}

@keyframes puddleWave {
  0%, 100% {
    transform: scaleX(1);
    opacity: 0.6;
  }
  50% {
    transform: scaleX(1.08);
    opacity: 0.8;
  }
}
</style>


