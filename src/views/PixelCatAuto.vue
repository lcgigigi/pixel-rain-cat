<template>
  <div class="pixel-page">
    <!-- 返回按钮 -->
    <div class="back-btn" @click="goBack">←</div>

    <!-- 像素画布 -->
    <canvas ref="pixelCanvas" class="pixel-canvas"></canvas>
  </div>
</template>

<script>
export default {
  name: 'PixelCatAuto',
  data() {
    return {
      ctx: null,
      pixelSize: 0,
      animationFrame: null,
      raindrops: [],
      time: 0,
      butterflies: [],
      flowers: []
    }
  },
  mounted() {
    this.initCanvas()
    this.animate()
    window.addEventListener('resize', this.initCanvas)
  },
  beforeUnmount() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame)
    }
    window.removeEventListener('resize', this.initCanvas)
  },
  methods: {
    goBack() {
      this.$router.push('/')
    },
    initCanvas() {
      const canvas = this.$refs.pixelCanvas
      const dpr = window.devicePixelRatio || 1
      
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = window.innerWidth + 'px'
      canvas.style.height = window.innerHeight + 'px'
      
      this.ctx = canvas.getContext('2d')
      this.ctx.imageSmoothingEnabled = false
      
      this.pixelSize = Math.max(6, Math.floor(Math.min(canvas.width, canvas.height) / 60))
      
      // 初始化雨滴
      this.raindrops = []
      for (let i = 0; i < 25; i++) {
        this.raindrops.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          speed: 2 + Math.random() * 2
        })
      }
      
      // 初始化蝴蝶
      this.butterflies = []
      for (let i = 0; i < 3; i++) {
        this.butterflies.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height * 0.6,
          speed: 0.5 + Math.random() * 0.5,
          direction: Math.random() * Math.PI * 2,
          wingPhase: Math.random() * Math.PI * 2
        })
      }
      
      // 初始化花朵
      this.flowers = []
      for (let i = 0; i < 8; i++) {
        this.flowers.push({
          x: Math.random() * canvas.width,
          y: canvas.height - 100 + Math.random() * 50,
          color: ['#FF69B4', '#FFB6C1', '#FFA07A', '#DDA0DD'][Math.floor(Math.random() * 4)],
          sway: Math.random() * Math.PI * 2
        })
      }
    },
    drawPixel(x, y, color) {
      this.ctx.fillStyle = color
      this.ctx.fillRect(x * this.pixelSize, y * this.pixelSize, this.pixelSize, this.pixelSize)
    },
    drawCuteCat(startX, startY, frame) {
      const p = this.pixelSize
      const blink = Math.floor(frame / 100) % 60 < 3
      const tailWag = Math.sin(frame / 30) * 0.5
      
      // 超可爱小猫像素图案
      const catPixels = [
        // 第1行 - 耳朵
        [2,0,'#000'], [3,0,'#FFB6C1'], [4,0,'#000'], [8,0,'#000'], [9,0,'#8B7355'], [10,0,'#000'],
        
        // 第2行 - 耳朵内部
        [1,1,'#000'], [2,1,'#FFB6C1'], [3,1,'#FFB6C1'], [4,1,'#000'], [7,1,'#000'], [8,1,'#8B7355'], [9,1,'#8B7355'], [10,1,'#000'], [11,1,'#000'],
        
        // 第3行 - 头顶
        [1,2,'#000'], [2,2,'#FFB6C1'], [3,2,'#FFB6C1'], [4,2,'#000'], [5,2,'#000'], [6,2,'#000'], [7,2,'#000'], [8,2,'#8B7355'], [9,2,'#8B7355'], [10,2,'#8B7355'], [11,2,'#000'], [12,2,'#000'],
        
        // 第4行 - 头部
        [0,3,'#000'], [1,3,'#FFF'], [2,3,'#FFF'], [3,3,'#FFF'], [4,3,'#FFF'], [5,3,'#FFF'], [6,3,'#8B7355'], [7,3,'#8B7355'], [8,3,'#8B7355'], [9,3,'#8B7355'], [10,3,'#8B7355'], [11,3,'#8B7355'], [12,3,'#000'],
        
        // 第5行 - 眼睛和腮红
        [0,4,'#000'], [1,4,'#FFF'], [2,4,'#87CEEB'], [3,4,'#FFF'], [4,4,'#FFF'], [5,4,'#FFF'], [6,4,'#8B7355'], [7,4,'#8B7355'], [8,4,'#8B7355'], [9,4,'#8B7355'], [10,4,'#8B7355'], [11,4,'#8B7355'], [12,4,'#000'],
        
        // 第6行 - 眼睛
        [0,5,'#000'], [1,5,'#FFF'], [2,5, blink ? '#000' : '#4169E1'], [3,5,'#FFF'], [4,5,'#FFF'], [5,5,'#FFF'], [6,5,'#FFF'], [7,5,'#8B7355'], [8,5,'#8B7355'], [9,5,'#FFF'], [10,5, blink ? '#000' : '#4169E1'], [11,5,'#FFF'], [12,5,'#000'],
        
        // 第7行 - 脸部
        [0,6,'#000'], [1,6,'#FFF'], [2,6,'#87CEEB'], [3,6,'#FFF'], [4,6,'#FFF'], [5,6,'#FFF'], [6,6,'#FFF'], [7,6,'#FFF'], [8,6,'#FFF'], [9,6,'#FFF'], [10,6,'#87CEEB'], [11,6,'#FFF'], [12,6,'#000'],
        
        // 第8行 - 嘴巴
        [0,7,'#000'], [1,7,'#FFF'], [2,7,'#FFF'], [3,7,'#FFF'], [4,7,'#FFF'], [5,7,'#FFB6C1'], [6,7,'#FFB6C1'], [7,7,'#FFF'], [8,7,'#FFF'], [9,7,'#FFF'], [10,7,'#FFF'], [11,7,'#FFF'], [12,7,'#000'],
        
        // 第9行 - 下巴
        [1,8,'#000'], [2,8,'#FFF'], [3,8,'#FFF'], [4,8,'#FFF'], [5,8,'#FFF'], [6,8,'#FFF'], [7,8,'#FFF'], [8,8,'#FFF'], [9,8,'#FFF'], [10,8,'#FFF'], [11,8,'#FFF'], [12,8,'#000'],
        
        // 第10行 - 身体上部
        [0,9,'#000'], [1,9,'#FFF'], [2,9,'#FFF'], [3,9,'#FFF'], [4,9,'#FFF'], [5,9,'#FFF'], [6,9,'#FFF'], [7,9,'#FFF'], [8,9,'#FFF'], [9,9,'#FFF'], [10,9,'#FFF'], [11,9,'#FFF'], [12,9,'#000'],
        
        // 第11行 - 身体
        [0,10,'#000'], [1,10,'#FFF'], [2,10,'#FFF'], [3,10,'#FFF'], [4,10,'#FFF'], [5,10,'#FFF'], [6,10,'#FFF'], [7,10,'#FFF'], [8,10,'#FFF'], [9,10,'#FFF'], [10,10,'#FFF'], [11,10,'#FFF'], [12,10,'#000'],
        
        // 第12行 - 尾巴和身体下部
        [0,11,'#000'], [1,11,'#000'], [2,11,'#FFF'], [3,11,'#FFF'], [4,11,'#FFF'], [5,11,'#FFF'], [6,11,'#FFF'], [7,11,'#FFF'], [8,11,'#FFF'], [9,11,'#FFF'], [10,11,'#FFF'], [11,11,'#000'], [12,11,'#000'], [13,11,'#000'], [14,11,'#000'],
        
        // 第13行 - 前腿和尾巴
        [-2,12,'#000'], [-1,12,'#8B7355'], [0,12,'#8B7355'], [1,12,'#000'], [2,12,'#000'], [3,12,'#FFF'], [4,12,'#FFF'], [5,12,'#000'], [6,12,'#000'], [7,12,'#000'], [8,12,'#FFF'], [9,12,'#FFF'], [10,12,'#000'], [11,12,'#8B7355'], [12,12,'#8B7355'], [13,12,'#8B7355'], [14,12,'#000'],
        
        // 第14行 - 脚
        [-2,13,'#000'], [-1,13,'#8B7355'], [0,13,'#000'], [3,13,'#000'], [4,13,'#000'], [8,13,'#000'], [9,13,'#000'], [11,13,'#000'], [12,13,'#8B7355'], [13,13,'#8B7355'], [14,13,'#000'],
      ]
      
      catPixels.forEach(([x, y, color]) => {
        if (color) {
          this.ctx.fillStyle = color
          this.ctx.fillRect((startX + x) * p, (startY + y) * p, p, p)
        }
      })
    },
    drawUmbrella(startX, startY) {
      const p = this.pixelSize
      
      // 可爱雨伞
      const umbrellaPixels = [
        // 伞顶
        [5,0,'#FF6B9D'], [6,0,'#FF6B9D'], [7,0,'#FF6B9D'], [8,0,'#FF6B9D'], [9,0,'#FF6B9D'],
        [4,1,'#FF6B9D'], [5,1,'#FF1493'], [6,1,'#FF6B9D'], [7,1,'#FF1493'], [8,1,'#FF6B9D'], [9,1,'#FF1493'], [10,1,'#FF6B9D'],
        [3,2,'#FF6B9D'], [4,2,'#FF1493'], [5,2,'#FF6B9D'], [6,2,'#FF1493'], [7,2,'#FF6B9D'], [8,2,'#FF1493'], [9,2,'#FF6B9D'], [10,2,'#FF1493'], [11,2,'#FF6B9D'],
        [2,3,'#FF6B9D'], [3,3,'#FF1493'], [4,3,'#FF6B9D'], [5,3,'#FF1493'], [6,3,'#FF6B9D'], [7,3,'#FF1493'], [8,3,'#FF6B9D'], [9,3,'#FF1493'], [10,3,'#FF6B9D'], [11,3,'#FF1493'], [12,3,'#FF6B9D'],
        [1,4,'#FF6B9D'], [2,4,'#FF1493'], [3,4,'#FF6B9D'], [4,4,'#FF1493'], [5,4,'#FF6B9D'], [6,4,'#FF1493'], [7,4,'#FF6B9D'], [8,4,'#FF1493'], [9,4,'#FF6B9D'], [10,4,'#FF1493'], [11,4,'#FF6B9D'], [12,4,'#FF1493'], [13,4,'#FF6B9D'],
        [1,5,'#FF1493'], [2,5,'#FF6B9D'], [3,5,'#FF1493'], [4,5,'#FF6B9D'], [5,5,'#FF1493'], [6,5,'#FF6B9D'], [7,5,'#FF1493'], [8,5,'#FF6B9D'], [9,5,'#FF1493'], [10,5,'#FF6B9D'], [11,5,'#FF1493'], [12,5,'#FF6B9D'], [13,5,'#FF1493'],
        [0,6,'#FF1493'], [1,6,''], [2,6,'#FF1493'], [3,6,''], [4,6,'#FF1493'], [5,6,''], [6,6,'#FF1493'], [7,6,''], [8,6,'#FF1493'], [9,6,''], [10,6,'#FF1493'], [11,6,''], [12,6,'#FF1493'], [13,6,''], [14,6,'#FF1493'],
        // 伞柄
        [7,7,'#8B4513'], [7,8,'#8B4513'], [7,9,'#8B4513'], [7,10,'#8B4513'], [7,11,'#8B4513'], [7,12,'#8B4513'],
        [6,13,'#8B4513'], [7,13,'#8B4513'], [8,13,'#8B4513']
      ]
      
      umbrellaPixels.forEach(([x, y, color]) => {
        if (color) {
          this.ctx.fillStyle = color
          this.ctx.fillRect((startX + x) * p, (startY + y) * p, p, p)
        }
      })
    },
    drawButterfly(butterfly) {
      const p = this.pixelSize
      const wingOffset = Math.sin(butterfly.wingPhase) * 0.3
      
      // 蝴蝶身体
      this.ctx.fillStyle = '#8B4513'
      this.ctx.fillRect(butterfly.x, butterfly.y, p, p * 2)
      
      // 蝴蝶翅膀
      this.ctx.fillStyle = '#FF69B4'
      this.ctx.fillRect(butterfly.x - p, butterfly.y - wingOffset, p, p)
      this.ctx.fillRect(butterfly.x + p, butterfly.y - wingOffset, p, p)
      this.ctx.fillRect(butterfly.x - p, butterfly.y + p - wingOffset, p, p)
      this.ctx.fillRect(butterfly.x + p, butterfly.y + p - wingOffset, p, p)
    },
    drawFlower(flower) {
      const p = this.pixelSize
      const sway = Math.sin(flower.sway + this.time / 50) * 0.5
      
      // 花茎
      this.ctx.fillStyle = '#228B22'
      this.ctx.fillRect(flower.x, flower.y, p, p * 3)
      
      // 花朵
      this.ctx.fillStyle = flower.color
      this.ctx.fillRect(flower.x - p, flower.y - p + sway, p, p)
      this.ctx.fillRect(flower.x + p, flower.y - p + sway, p, p)
      this.ctx.fillRect(flower.x, flower.y - p * 2 + sway, p, p)
      this.ctx.fillRect(flower.x - p, flower.y + sway, p, p)
      this.ctx.fillRect(flower.x + p, flower.y + sway, p, p)
      
      // 花心
      this.ctx.fillStyle = '#FFD700'
      this.ctx.fillRect(flower.x, flower.y - p + sway, p, p)
    },
    drawGrass(canvasWidth, canvasHeight) {
      const p = this.pixelSize
      const grassHeight = 12
      const startY = Math.floor(canvasHeight / p) - grassHeight
      const width = Math.floor(canvasWidth / p)
      
      // 草地
      for (let y = 0; y < grassHeight; y++) {
        for (let x = 0; x < width; x++) {
          const baseColor = y < 4 ? '#7CB342' : '#558B2F'
          this.ctx.fillStyle = baseColor
          this.ctx.fillRect(x * p, (startY + y) * p, p, p)
        }
      }
      
      // 草丛摇摆
      const grassTime = Math.floor(this.time / 15) % 2
      for (let i = 0; i < width; i += 3) {
        const offset = (i % 6 === 0 && grassTime) ? 1 : 0
        this.ctx.fillStyle = '#9CCC65'
        this.ctx.fillRect((i + offset) * p, (startY - 1) * p, p, p)
        this.ctx.fillRect((i + offset) * p, (startY - 2) * p, p, p)
        this.ctx.fillRect((i + offset) * p, (startY - 3) * p, p, p)
      }
    },
    drawClouds(time) {
      const p = this.pixelSize
      const offset = Math.floor(time / 50) % 400
      
      // 云朵
      const cloud1X = 20 - offset / 12
      const cloud1Y = 8
      const cloud1 = [
        [1,0,'rgba(255,255,255,0.6)'], [2,0,'rgba(255,255,255,0.6)'], [3,0,'rgba(255,255,255,0.6)'], [4,0,'rgba(255,255,255,0.6)'],
        [0,1,'rgba(255,255,255,0.6)'], [1,1,'rgba(255,255,255,0.7)'], [2,1,'rgba(255,255,255,0.7)'], [3,1,'rgba(255,255,255,0.7)'], [4,1,'rgba(255,255,255,0.7)'], [5,1,'rgba(255,255,255,0.6)'],
        [0,2,'rgba(255,255,255,0.6)'], [1,2,'rgba(255,255,255,0.6)'], [2,2,'rgba(255,255,255,0.6)'], [3,2,'rgba(255,255,255,0.6)'], [4,2,'rgba(255,255,255,0.6)'], [5,2,'rgba(255,255,255,0.6)']
      ]
      
      cloud1.forEach(([x, y, color]) => {
        this.ctx.fillStyle = color
        this.ctx.fillRect((cloud1X + x) * p, (cloud1Y + y) * p, p, p)
      })
    },
    drawRain() {
      const p = this.pixelSize
      
      this.raindrops.forEach(drop => {
        this.ctx.fillStyle = 'rgba(173, 216, 230, 0.8)'
        this.ctx.fillRect(drop.x, drop.y, p * 0.5, p * 2)
        
        drop.y += drop.speed * p
        
        if (drop.y > this.$refs.pixelCanvas.height) {
          drop.y = -p * 3
          drop.x = Math.random() * this.$refs.pixelCanvas.width
        }
      })
    },
    drawPuddle(x, y) {
      const p = this.pixelSize
      const alpha = 0.4 + Math.sin(this.time / 25) * 0.1
      
      const puddle = [
        [1,0,alpha], [2,0,alpha], [3,0,alpha], [4,0,alpha], [5,0,alpha],
        [0,1,alpha], [1,1,alpha+0.1], [2,1,alpha+0.1], [3,1,alpha+0.1], [4,1,alpha+0.1], [5,1,alpha+0.1], [6,1,alpha],
        [0,2,alpha], [1,2,alpha], [2,2,alpha], [3,2,alpha], [4,2,alpha], [5,2,alpha], [6,2,alpha]
      ]
      
      puddle.forEach(([px, py, a]) => {
        this.ctx.fillStyle = `rgba(135, 206, 235, ${a})`
        this.ctx.fillRect((x + px) * p, (y + py) * p, p, p)
      })
    },
    animate() {
      const canvas = this.$refs.pixelCanvas
      if (!canvas) return
      
      this.time++
      
      // 天空渐变
      const gradient = this.ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, '#87CEEB')
      gradient.addColorStop(0.7, '#6B9BD1')
      gradient.addColorStop(1, '#5A8AB8')
      this.ctx.fillStyle = gradient
      this.ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // 绘制云朵
      this.drawClouds(this.time)
      
      // 绘制雨滴
      this.drawRain()
      
      // 绘制草地
      this.drawGrass(canvas.width, canvas.height)
      
      // 绘制花朵
      this.flowers.forEach(flower => {
        this.drawFlower(flower)
      })
      
      // 绘制蝴蝶
      this.butterflies.forEach(butterfly => {
        this.drawButterfly(butterfly)
        butterfly.x += Math.cos(butterfly.direction) * butterfly.speed
        butterfly.y += Math.sin(butterfly.direction) * butterfly.speed * 0.3
        butterfly.wingPhase += 0.3
        
        if (butterfly.x < 0 || butterfly.x > canvas.width) {
          butterfly.direction = Math.PI - butterfly.direction
        }
        if (butterfly.y < 0 || butterfly.y > canvas.height * 0.6) {
          butterfly.direction = -butterfly.direction
        }
      })
      
      // 计算中心位置
      const centerX = Math.floor(canvas.width / this.pixelSize / 2) - 6
      const centerY = Math.floor(canvas.height / this.pixelSize / 2) - 5
      
      // 绘制水坑
      this.drawPuddle(centerX - 18, centerY + 22)
      this.drawPuddle(centerX + 20, centerY + 24)
      
      // 绘制雨伞
      const breathe = Math.sin(this.time / 70) * 0.3
      this.drawUmbrella(centerX - 2, centerY - 9 + breathe)
      
      // 绘制小猫
      this.drawCuteCat(centerX, centerY + breathe, this.time)
      
      this.animationFrame = requestAnimationFrame(() => this.animate())
    }
  }
}
</script>

<style scoped>
.pixel-page {
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  overflow: hidden;
  position: relative;
  background: #87CEEB;
}

.pixel-canvas {
  display: block;
  image-rendering: -moz-crisp-edges;
  image-rendering: -webkit-crisp-edges;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
  width: 100%;
  height: 100%;
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
</style>


