<template>
  <div class="sketch-page">
    <!-- 返回按钮 -->
    <div class="back-btn" @click="goBack">
      <span>← 返回</span>
    </div>

    <!-- 手绘风格场景 -->
    <div class="sketch-scene">
      <!-- 背景纸张纹理 -->
      <div class="paper-texture"></div>

      <!-- 雨滴 -->
      <div class="rain-container">
        <div class="sketch-rain" v-for="i in 25" :key="i" :style="getRainStyle(i)">
          <svg width="4" height="20" viewBox="0 0 4 20">
            <path d="M 2 0 Q 1 10 2 20" stroke="#6b9ac4" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.6"/>
          </svg>
        </div>
      </div>

      <!-- SVG 定义 -->
      <svg width="0" height="0" style="position: absolute;">
        <defs>
          <!-- 手绘效果滤镜 -->
          <filter id="sketch-filter">
            <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" />
            <feDisplacementMap in="SourceGraphic" scale="2" />
          </filter>
          
          <!-- 纸张纹理 -->
          <filter id="paper-filter">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" result="noise" />
            <feDiffuseLighting in="noise" lighting-color="white" surfaceScale="1">
              <feDistantLight azimuth="45" elevation="60" />
            </feDiffuseLighting>
          </filter>
        </defs>
      </svg>

      <!-- 草地 -->
      <div class="sketch-ground">
        <svg class="grass-svg" viewBox="0 0 100 30" preserveAspectRatio="none">
          <path d="M 0,25 Q 10,20 20,25 T 40,25 T 60,25 T 80,25 T 100,25 L 100,30 L 0,30 Z" 
                fill="#7cb342" stroke="#558b2f" stroke-width="0.5" opacity="0.8"/>
          <!-- 草丛 -->
          <path d="M 5,25 Q 6,18 7,25" stroke="#558b2f" stroke-width="1" fill="none" stroke-linecap="round"/>
          <path d="M 8,25 Q 9,20 10,25" stroke="#558b2f" stroke-width="1" fill="none" stroke-linecap="round"/>
          <path d="M 12,25 Q 13,19 14,25" stroke="#558b2f" stroke-width="1" fill="none" stroke-linecap="round"/>
          <path d="M 20,25 Q 21,17 22,25" stroke="#558b2f" stroke-width="1" fill="none" stroke-linecap="round"/>
          <path d="M 25,25 Q 26,21 27,25" stroke="#558b2f" stroke-width="1" fill="none" stroke-linecap="round"/>
          <path d="M 35,25 Q 36,19 37,25" stroke="#558b2f" stroke-width="1" fill="none" stroke-linecap="round"/>
          <path d="M 40,25 Q 41,18 42,25" stroke="#558b2f" stroke-width="1" fill="none" stroke-linecap="round"/>
          <path d="M 50,25 Q 51,20 52,25" stroke="#558b2f" stroke-width="1" fill="none" stroke-linecap="round"/>
          <path d="M 55,25 Q 56,19 57,25" stroke="#558b2f" stroke-width="1" fill="none" stroke-linecap="round"/>
          <path d="M 65,25 Q 66,17 67,25" stroke="#558b2f" stroke-width="1" fill="none" stroke-linecap="round"/>
          <path d="M 70,25 Q 71,21 72,25" stroke="#558b2f" stroke-width="1" fill="none" stroke-linecap="round"/>
          <path d="M 80,25 Q 81,18 82,25" stroke="#558b2f" stroke-width="1" fill="none" stroke-linecap="round"/>
          <path d="M 85,25 Q 86,20 87,25" stroke="#558b2f" stroke-width="1" fill="none" stroke-linecap="round"/>
          <path d="M 90,25 Q 91,19 92,25" stroke="#558b2f" stroke-width="1" fill="none" stroke-linecap="round"/>
        </svg>
      </div>

      <!-- 雨伞 -->
      <div class="sketch-umbrella">
        <svg viewBox="0 0 120 100" class="umbrella-svg">
          <!-- 伞面 -->
          <path d="M 10,40 Q 20,15 35,25 Q 45,10 60,25 Q 75,10 85,25 Q 100,15 110,40" 
                fill="#e74c3c" 
                stroke="#c0392b" 
                stroke-width="2.5" 
                stroke-linecap="round"
                stroke-linejoin="round"
                class="umbrella-top"/>
          <!-- 伞骨 -->
          <line x1="60" y1="25" x2="60" y2="40" stroke="#c0392b" stroke-width="2"/>
          <line x1="60" y1="25" x2="35" y2="25" stroke="#c0392b" stroke-width="1.5" opacity="0.6"/>
          <line x1="60" y1="25" x2="85" y2="25" stroke="#c0392b" stroke-width="1.5" opacity="0.6"/>
          <!-- 伞柄 -->
          <path d="M 60,40 L 60,90 Q 60,95 55,95" 
                stroke="#8b4513" 
                stroke-width="3" 
                fill="none" 
                stroke-linecap="round"
                class="umbrella-handle"/>
        </svg>
      </div>

      <!-- 小猫 -->
      <div class="sketch-cat">
        <svg viewBox="0 0 100 120" class="cat-svg">
          <!-- 尾巴 -->
          <path d="M 10,80 Q 5,70 8,60" 
                stroke="#ff9a3c" 
                stroke-width="6" 
                fill="none" 
                stroke-linecap="round"
                class="cat-tail"/>
          
          <!-- 身体 -->
          <ellipse cx="50" cy="75" rx="28" ry="22" 
                   fill="#ff9a3c" 
                   stroke="#ff8c1a" 
                   stroke-width="2.5"
                   class="cat-body-part"/>
          
          <!-- 头部 -->
          <circle cx="50" cy="45" r="22" 
                  fill="#ff9a3c" 
                  stroke="#ff8c1a" 
                  stroke-width="2.5"
                  class="cat-head-part"/>
          
          <!-- 左耳 -->
          <path d="M 35,30 L 30,15 L 40,28" 
                fill="#ff9a3c" 
                stroke="#ff8c1a" 
                stroke-width="2.5"
                stroke-linejoin="round"
                class="cat-ear"/>
          <path d="M 35,28 L 32,20 L 37,26" 
                fill="#ffb366" 
                stroke="none"/>
          
          <!-- 右耳 -->
          <path d="M 65,30 L 70,15 L 60,28" 
                fill="#ff9a3c" 
                stroke="#ff8c1a" 
                stroke-width="2.5"
                stroke-linejoin="round"
                class="cat-ear"/>
          <path d="M 65,28 L 68,20 L 63,26" 
                fill="#ffb366" 
                stroke="none"/>
          
          <!-- 左眼 -->
          <ellipse cx="42" cy="42" rx="4" ry="6" 
                   fill="#2c3e50"
                   class="cat-eye"/>
          <circle cx="43" cy="40" r="1.5" fill="white"/>
          
          <!-- 右眼 -->
          <ellipse cx="58" cy="42" rx="4" ry="6" 
                   fill="#2c3e50"
                   class="cat-eye"/>
          <circle cx="59" cy="40" r="1.5" fill="white"/>
          
          <!-- 鼻子 -->
          <path d="M 50,50 L 48,53 L 52,53 Z" fill="#34495e"/>
          
          <!-- 嘴巴 -->
          <path d="M 50,53 Q 45,55 42,54" 
                stroke="#34495e" 
                stroke-width="1.5" 
                fill="none" 
                stroke-linecap="round"/>
          <path d="M 50,53 Q 55,55 58,54" 
                stroke="#34495e" 
                stroke-width="1.5" 
                fill="none" 
                stroke-linecap="round"/>
          
          <!-- 胡须左 -->
          <line x1="32" y1="45" x2="20" y2="43" stroke="#2c3e50" stroke-width="1" opacity="0.7"/>
          <line x1="32" y1="48" x2="20" y2="50" stroke="#2c3e50" stroke-width="1" opacity="0.7"/>
          
          <!-- 胡须右 -->
          <line x1="68" y1="45" x2="80" y2="43" stroke="#2c3e50" stroke-width="1" opacity="0.7"/>
          <line x1="68" y1="48" x2="80" y2="50" stroke="#2c3e50" stroke-width="1" opacity="0.7"/>
          
          <!-- 前爪 -->
          <ellipse cx="38" cy="92" rx="8" ry="6" 
                   fill="#ffb366" 
                   stroke="#ff9a3c" 
                   stroke-width="2"/>
          <ellipse cx="62" cy="92" rx="8" ry="6" 
                   fill="#ffb366" 
                   stroke="#ff9a3c" 
                   stroke-width="2"/>
          
          <!-- 爪子细节 -->
          <line x1="35" y1="94" x2="35" y2="96" stroke="#ff8c1a" stroke-width="1"/>
          <line x1="38" y1="94" x2="38" y2="96" stroke="#ff8c1a" stroke-width="1"/>
          <line x1="41" y1="94" x2="41" y2="96" stroke="#ff8c1a" stroke-width="1"/>
          <line x1="59" y1="94" x2="59" y2="96" stroke="#ff8c1a" stroke-width="1"/>
          <line x1="62" y1="94" x2="62" y2="96" stroke="#ff8c1a" stroke-width="1"/>
          <line x1="65" y1="94" x2="65" y2="96" stroke="#ff8c1a" stroke-width="1"/>
        </svg>
      </div>

      <!-- 水坑 -->
      <div class="puddles-sketch">
        <svg viewBox="0 0 100 10" class="puddle-svg puddle-1">
          <ellipse cx="30" cy="5" rx="15" ry="3" 
                   fill="rgba(135, 206, 235, 0.3)" 
                   stroke="#87ceeb" 
                   stroke-width="1"
                   stroke-dasharray="2,2"/>
        </svg>
        <svg viewBox="0 0 100 10" class="puddle-svg puddle-2">
          <ellipse cx="70" cy="5" rx="12" ry="2.5" 
                   fill="rgba(135, 206, 235, 0.3)" 
                   stroke="#87ceeb" 
                   stroke-width="1"
                   stroke-dasharray="2,2"/>
        </svg>
      </div>
    </div>

    <!-- 标题 -->
    <div class="title-box">
      <h1>✏️ 手绘风格</h1>
      <p>温馨的手绘插画 · 雨中有伞真好</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SketchCat',
  methods: {
    goBack() {
      this.$router.push('/')
    },
    getRainStyle(index) {
      return {
        left: `${(index * 8) % 100}%`,
        animationDelay: `${(index * 0.12) % 2}s`,
        animationDuration: `${1 + (index % 3) * 0.3}s`
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
  opacity: 0.5;
}

.back-btn {
  position: fixed;
  top: 0.32rem;
  left: 0.32rem;
  background: white;
  color: #2c3e50;
  padding: 0.16rem 0.32rem;
  border-radius: 0.12rem;
  font-size: 0.28rem;
  cursor: pointer;
  z-index: 100;
  transition: all 0.3s;
  border: 0.04rem solid #2c3e50;
  box-shadow: 0.04rem 0.04rem 0 #2c3e50;
}

.back-btn:active {
  transform: translate(0.04rem, 0.04rem);
  box-shadow: none;
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
  animation: sketchRainFall 1.5s linear infinite;
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
  height: 3.5rem;
  z-index: 2;
}

.grass-svg {
  width: 100%;
  height: 100%;
  filter: url(#sketch-filter);
}

/* 雨伞 */
.sketch-umbrella {
  position: absolute;
  bottom: 3.2rem;
  left: 50%;
  transform: translateX(-50%);
  width: 3.2rem;
  height: 2.4rem;
  z-index: 5;
  animation: umbrellaFloat 4s ease-in-out infinite;
}

@keyframes umbrellaFloat {
  0%, 100% {
    transform: translateX(-50%) translateY(0) rotate(-2deg);
  }
  50% {
    transform: translateX(-50%) translateY(-0.08rem) rotate(2deg);
  }
}

.umbrella-svg {
  width: 100%;
  height: 100%;
  filter: url(#sketch-filter);
}

.umbrella-top {
  animation: umbrellaShake 5s ease-in-out infinite;
  transform-origin: 60px 40px;
}

@keyframes umbrellaShake {
  0%, 100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(-1deg);
  }
  75% {
    transform: rotate(1deg);
  }
}

/* 小猫 */
.sketch-cat {
  position: absolute;
  bottom: 1.8rem;
  left: 50%;
  transform: translateX(-50%);
  width: 2.4rem;
  height: 2.8rem;
  z-index: 10;
  animation: catBreathing 3s ease-in-out infinite;
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
  animation: tailSwing 3s ease-in-out infinite;
  transform-origin: 10px 80px;
}

@keyframes tailSwing {
  0%, 100% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(10deg);
  }
}

.cat-eye {
  animation: eyeBlink 5s infinite;
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
  animation: earTwitch 4s ease-in-out infinite;
}

.cat-ear:nth-child(3) {
  animation-delay: 0.2s;
}

@keyframes earTwitch {
  0%, 90%, 100% {
    transform: rotate(0deg);
  }
  93%, 97% {
    transform: rotate(-3deg);
  }
  95% {
    transform: rotate(3deg);
  }
}

/* 水坑 */
.puddles-sketch {
  position: absolute;
  bottom: 1.2rem;
  width: 100%;
  z-index: 3;
}

.puddle-svg {
  position: absolute;
  width: 100%;
  height: 0.2rem;
  animation: puddleWave 4s ease-in-out infinite;
}

.puddle-1 {
  left: 0;
}

.puddle-2 {
  right: 0;
  animation-delay: 2s;
}

@keyframes puddleWave {
  0%, 100% {
    transform: scaleX(1);
    opacity: 0.6;
  }
  50% {
    transform: scaleX(1.05);
    opacity: 0.8;
  }
}

/* 标题 */
.title-box {
  position: fixed;
  bottom: 0.32rem;
  left: 0;
  right: 0;
  text-align: center;
  color: #2c3e50;
  z-index: 50;
  background: rgba(255, 255, 255, 0.9);
  padding: 0.32rem;
  backdrop-filter: blur(0.1rem);
  border-top: 0.04rem solid #2c3e50;
  box-shadow: 0 -0.08rem 0.16rem rgba(0, 0, 0, 0.1);
}

.title-box h1 {
  font-size: 0.48rem;
  margin-bottom: 0.08rem;
  font-family: cursive, sans-serif;
}

.title-box p {
  font-size: 0.28rem;
  opacity: 0.8;
  font-family: cursive, sans-serif;
}
</style>


