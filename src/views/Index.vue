<template>
  <div class="index-page">
    <div class="container">
      <!-- 标题 -->
      <div class="header">
        <h1 class="title">🌧️ 雨中小猫</h1>
        <p class="subtitle">选择你喜欢的风格</p>
      </div>

      <!-- 选择卡片 -->
      <div class="cards-container">
        <!-- 像素风格卡片 -->
        <div class="style-card pixel-card" @click="goToPixel">
          <div class="card-icon">🎮</div>
          <h2>雨中小猫</h2>
          <p>像素艺术风格</p>
          <div class="preview-box pixel-preview">
            <div class="pixel-demo">
              <div class="pixel-cat">🐱</div>
              <div class="pixel-umbrella">☂️</div>
              <div class="pixel-rain">💧</div>
            </div>
          </div>
          <button class="btn btn-pixel">进入查看</button>
          <button class="btn btn-pixel" style="margin-top: 0.2rem" @click.stop="goToPixelPlay">进入互动版</button>
        </div>
      </div>

      <!-- 装饰元素 -->
      <div class="decorations">
        <div class="rain-drop" v-for="i in 20" :key="i" :style="getRainStyle(i)">💧</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Index',
  methods: {
    goToPixel() {
      this.$router.push('/pixel')
    },
    goToPixelPlay() {
      this.$router.push('/pixel-play')
    },
    goToSketch() {
      this.$router.push('/sketch')
    },
    goToPixelAuto() {
      this.$router.push('/pixel-auto')
    },
    goToSketchAuto() {
      this.$router.push('/sketch-auto')
    },
    getRainStyle(index) {
      return {
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 2}s`,
        animationDuration: `${1 + Math.random() * 1}s`
      }
    }
  }
}
</script>

<style scoped>
.index-page {
  min-height: 100vh;
  background: linear-gradient(to bottom, #4a5568 0%, #2d3748 100%);
  padding: 0.64rem 0.32rem;
  position: relative;
  overflow: hidden;
}

.container {
  max-width: 750px;
  margin: 0 auto;
  position: relative;
  z-index: 10;
}

.header {
  text-align: center;
  margin-bottom: 0.64rem;
  color: white;
}

.title {
  font-size: 0.64rem;
  margin-bottom: 0.16rem;
  text-shadow: 0 0.04rem 0.16rem rgba(0, 0, 0, 0.3);
  animation: titleFloat 3s ease-in-out infinite;
}

@keyframes titleFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-0.1rem); }
}

.subtitle {
  font-size: 0.32rem;
  opacity: 0.9;
  color: #e2e8f0;
}

.cards-container {
  display: flex;
  flex-direction: column;
  gap: 0.48rem;
}

.style-card {
  background: white;
  border-radius: 0.24rem;
  padding: 0.48rem;
  box-shadow: 0 0.08rem 0.32rem rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.style-card:active {
  transform: scale(0.98);
}

.style-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 0.08rem;
  background: linear-gradient(90deg, #667eea, #764ba2);
}

.pixel-card::before {
  background: linear-gradient(90deg, #f093fb, #f5576c);
}

.card-icon {
  font-size: 0.96rem;
  text-align: center;
  margin-bottom: 0.24rem;
}

.style-card h2 {
  font-size: 0.48rem;
  color: #2d3748;
  margin-bottom: 0.16rem;
  text-align: center;
}

.style-card p {
  font-size: 0.28rem;
  color: #718096;
  text-align: center;
  margin-bottom: 0.32rem;
}

.preview-box {
  width: 100%;
  height: 3rem;
  border-radius: 0.16rem;
  margin-bottom: 0.32rem;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.pixel-preview {
  background: linear-gradient(to bottom, #87ceeb 0%, #98d8c8 100%);
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
}

.sketch-preview {
  background: linear-gradient(to bottom, #fef3c7 0%, #fde68a 100%);
}

.pixel-auto-preview {
  background: linear-gradient(to bottom, #87ceeb 0%, #98d8c8 100%);
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
}

.sketch-auto-preview {
  background: linear-gradient(to bottom, #fef3c7 0%, #fde68a 100%);
}

.pixel-demo, .sketch-demo, .pixel-auto-demo, .sketch-auto-demo {
  position: relative;
  width: 80%;
  height: 80%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.pixel-cat, .sketch-cat, .pixel-auto-demo .pixel-cat, .sketch-auto-demo .sketch-cat {
  font-size: 1.2rem;
  position: relative;
  z-index: 3;
  animation: bobbing 2s ease-in-out infinite;
}

.pixel-umbrella, .sketch-umbrella, .pixel-auto-demo .pixel-umbrella, .sketch-auto-demo .sketch-umbrella {
  font-size: 1.6rem;
  position: absolute;
  bottom: 0.8rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  animation: umbrellaFloat 2s ease-in-out infinite;
}

.pixel-rain, .sketch-rain, .pixel-auto-demo .pixel-rain, .sketch-auto-demo .sketch-rain {
  font-size: 0.48rem;
  position: absolute;
  top: 0.16rem;
  left: 20%;
  animation: rainFall 1s linear infinite;
  opacity: 0.6;
}

.pixel-butterfly, .sketch-butterfly {
  font-size: 0.8rem;
  position: absolute;
  top: 0.4rem;
  right: 15%;
  animation: butterflyFloat 3s ease-in-out infinite;
  opacity: 0.8;
}

.pixel-flower, .sketch-flower {
  font-size: 0.6rem;
  position: absolute;
  bottom: 0.2rem;
  left: 10%;
  animation: flowerSway 2.5s ease-in-out infinite;
  opacity: 0.9;
}

@keyframes butterflyFloat {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-0.1rem) rotate(5deg);
  }
}

@keyframes flowerSway {
  0%, 100% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(2deg);
  }
}

@keyframes bobbing {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-0.08rem); }
}

@keyframes umbrellaFloat {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(-0.08rem); }
}

@keyframes rainFall {
  0% { transform: translateY(0); opacity: 0; }
  50% { opacity: 0.6; }
  100% { transform: translateY(1rem); opacity: 0; }
}

.btn {
  width: 100%;
  padding: 0.32rem;
  font-size: 0.32rem;
  border: none;
  border-radius: 0.12rem;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-pixel {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.btn-pixel:active {
  transform: scale(0.95);
  opacity: 0.9;
}

.btn-sketch {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.btn-sketch:active {
  transform: scale(0.95);
  opacity: 0.9;
}

.btn-pixel-auto {
  background: linear-gradient(135deg, #FF6B9D 0%, #FF1493 100%);
}

.btn-pixel-auto:active {
  transform: scale(0.95);
  opacity: 0.9;
}

.btn-sketch-auto {
  background: linear-gradient(135deg, #DDA0DD 0%, #DA70D6 100%);
}

.btn-sketch-auto:active {
  transform: scale(0.95);
  opacity: 0.9;
}

/* 装饰性雨滴 */
.decorations {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.rain-drop {
  position: absolute;
  top: -0.32rem;
  font-size: 0.32rem;
  opacity: 0.3;
  animation: fallDown 2s linear infinite;
}

@keyframes fallDown {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 0.3;
  }
  90% {
    opacity: 0.3;
  }
  100% {
    transform: translateY(100vh) rotate(10deg);
    opacity: 0;
  }
}
</style>

