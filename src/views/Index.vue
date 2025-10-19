<template>
  <div class="index-page">
    <div class="main">
      <h1 class="title">快进入咪的世界吧</h1>
      <div class="btns">
        <button class="enter-btn" @click="goToPixelPlay">🌧️ 雨中小猫</button>
        <!-- <button class="enter-btn aqua" @click="goToAquarium">🐠 咪的水族馆</button> -->
      </div>
    </div>
    <div class="bg-rain">
      <div class="rain-line" v-for="i in 18" :key="i" :style="getRainStyle(i)"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Index',
  methods: {
    goToPixelPlay() {
      this.$router.push('/pixel-play')
    },
    goToAquarium() {
      this.$router.push('/aquarium')
    },
    getRainStyle(index) {
      return {
        left: `${5 + Math.random() * 90}%`,
        animationDelay: `${Math.random() * 3}s`,
        animationDuration: `${2 + Math.random() * 1.5}s`
      }
    }
  }
}
</script>

<style scoped>
.index-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #5d7a9e 0%, #3a4d66 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: 0.48rem;
}

.main {
  text-align: center;
  color: #fff;
  z-index: 10;
  max-width: 6.5rem;
}

.cat-emoji {
  font-size: 1.6rem;
  margin-bottom: 0.32rem;
  filter: drop-shadow(0 0.04rem 0.12rem rgba(0,0,0,0.2));
}

.title {
  font-size: 0.56rem;
  font-weight: 600;
  margin-bottom: 0.24rem;
  text-shadow: 0 0.04rem 0.16rem rgba(0,0,0,0.25);
  letter-spacing: 0.01rem;
}

.desc {
  font-size: 0.28rem;
  opacity: 0.88;
  margin-bottom: 0.48rem;
  line-height: 1.5;
}

.btns {
  display: flex;
  flex-direction: column;
  gap: 0.24rem;
  align-items: center;
}

.enter-btn {
  display: inline-block;
  padding: 0.3rem 0.6rem;
  font-size: 0.32rem;
  font-weight: 500;
  border: none;
  border-radius: 0.16rem;
  color: #fff;
  background: linear-gradient(135deg, #a3b8d8 0%, #7a94bb 100%);
  box-shadow: 0 0.08rem 0.24rem rgba(0,0,0,0.25);
  cursor: pointer;
  transition: all 0.2s;
  min-width: 4rem;
}
.enter-btn.aqua {
  background: linear-gradient(135deg, #4dd0e1 0%, #0097a7 100%);
}
.enter-btn:active {
  transform: scale(0.96);
  box-shadow: 0 0.04rem 0.12rem rgba(0,0,0,0.2);
}

.bg-rain {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
}

.rain-line {
  position: absolute;
  top: -2%;
  width: 1px;
  height: 12%;
  background: linear-gradient(to bottom, transparent, rgba(200,220,240,0.4), transparent);
  animation: rain 3s linear infinite;
}

@keyframes rain {
  0% { transform: translateY(0); opacity: 0; }
  20% { opacity: 1; }
  80% { opacity: 1; }
  100% { transform: translateY(100vh); opacity: 0; }
}
</style>

