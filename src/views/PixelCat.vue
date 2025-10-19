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
  name: 'PixelCat',
  data() {
    return {
      ctx: null,
      pixelSize: 0,
      animationFrame: null,
      raindrops: [],
      time: 0,
      lightning: false,
      lightningTimer: 0
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
      
      // 根据屏幕大小计算像素块大小
      this.pixelSize = Math.max(6, Math.floor(Math.min(canvas.width, canvas.height) / 60))
      
      // 初始化雨滴
      this.raindrops = []
      for (let i = 0; i < 40; i++) {
        this.raindrops.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          speed: 0.4 + Math.random() * 0.3
        })
      }
    },
    drawPixel(x, y, color) {
      this.ctx.fillStyle = color
      this.ctx.fillRect(x * this.pixelSize, y * this.pixelSize, this.pixelSize, this.pixelSize)
    },
    drawRagdollCat(startX, startY, frame) {
      const p = this.pixelSize
      const blink = Math.floor(frame / 120) % 80 < 3
      
      // 布偶猫像素图案 - 按照你提供的图片设计
      const catPixels = [
        // 第1行 - 耳朵尖
        [2,0,'#000'], [3,0,'#000'], [4,0,'#000'], [8,0,'#000'], [9,0,'#000'], [10,0,'#000'],
        
        // 第2行 - 耳朵
        [1,1,'#000'], [2,1,'#FFB6C1'], [3,1,'#FFB6C1'], [4,1,'#000'], [7,1,'#000'], [8,1,'#8B7355'], [9,1,'#8B7355'], [10,1,'#000'], [11,1,'#000'],
        
        // 第3行 - 耳朵和头顶
        [1,2,'#000'], [2,2,'#FFB6C1'], [3,2,'#FFB6C1'], [4,2,'#000'], [5,2,'#000'], [6,2,'#000'], [7,2,'#000'], [8,2,'#8B7355'], [9,2,'#8B7355'], [10,2,'#8B7355'], [11,2,'#000'], [12,2,'#000'],
        
        // 第4行 - 头部
        [0,3,'#000'], [1,3,'#F5F5F5'], [2,3,'#F5F5F5'], [3,3,'#F5F5F5'], [4,3,'#F5F5F5'], [5,3,'#F5F5F5'], [6,3,'#8B7355'], [7,3,'#8B7355'], [8,3,'#8B7355'], [9,3,'#8B7355'], [10,3,'#8B7355'], [11,3,'#8B7355'], [12,3,'#000'],
        
        // 第5行 - 眼睛和腮红
        [0,4,'#000'], [1,4,'#F5F5F5'], [2,4,'#87CEEB'], [3,4,'#F5F5F5'], [4,4,'#F5F5F5'], [5,4,'#F5F5F5'], [6,4,'#8B7355'], [7,4,'#8B7355'], [8,4,'#8B7355'], [9,4,'#8B7355'], [10,4,'#8B7355'], [11,4,'#8B7355'], [12,4,'#000'],
        
        // 第6行 - 眼睛
        [0,5,'#000'], [1,5,'#F5F5F5'], [2,5, blink ? '#000' : '#4169E1'], [3,5,'#F5F5F5'], [4,5,'#F5F5F5'], [5,5,'#F5F5F5'], [6,5,'#F5F5F5'], [7,5,'#8B7355'], [8,5,'#8B7355'], [9,5,'#F5F5F5'], [10,5, blink ? '#000' : '#4169E1'], [11,5,'#F5F5F5'], [12,5,'#000'],
        
        // 第7行 - 脸部
        [0,6,'#000'], [1,6,'#F5F5F5'], [2,6,'#87CEEB'], [3,6,'#F5F5F5'], [4,6,'#F5F5F5'], [5,6,'#F5F5F5'], [6,6,'#F5F5F5'], [7,6,'#F5F5F5'], [8,6,'#F5F5F5'], [9,6,'#F5F5F5'], [10,6,'#87CEEB'], [11,6,'#F5F5F5'], [12,6,'#000'],
        
        // 第8行 - 嘴巴区域
        [0,7,'#000'], [1,7,'#F5F5F5'], [2,7,'#F5F5F5'], [3,7,'#F5F5F5'], [4,7,'#F5F5F5'], [5,7,'#FFB6C1'], [6,7,'#FFB6C1'], [7,7,'#F5F5F5'], [8,7,'#F5F5F5'], [9,7,'#F5F5F5'], [10,7,'#F5F5F5'], [11,7,'#F5F5F5'], [12,7,'#000'],
        
        // 第9行 - 下巴
        [1,8,'#000'], [2,8,'#F5F5F5'], [3,8,'#F5F5F5'], [4,8,'#F5F5F5'], [5,8,'#F5F5F5'], [6,8,'#F5F5F5'], [7,8,'#F5F5F5'], [8,8,'#F5F5F5'], [9,8,'#F5F5F5'], [10,8,'#F5F5F5'], [11,8,'#F5F5F5'], [12,8,'#000'],
        
        // 第10行 - 身体上部
        [0,9,'#000'], [1,9,'#F5F5F5'], [2,9,'#F5F5F5'], [3,9,'#F5F5F5'], [4,9,'#F5F5F5'], [5,9,'#F5F5F5'], [6,9,'#F5F5F5'], [7,9,'#F5F5F5'], [8,9,'#F5F5F5'], [9,9,'#F5F5F5'], [10,9,'#F5F5F5'], [11,9,'#F5F5F5'], [12,9,'#000'],
        
        // 第11行 - 身体
        [0,10,'#000'], [1,10,'#F5F5F5'], [2,10,'#F5F5F5'], [3,10,'#F5F5F5'], [4,10,'#F5F5F5'], [5,10,'#F5F5F5'], [6,10,'#F5F5F5'], [7,10,'#F5F5F5'], [8,10,'#F5F5F5'], [9,10,'#F5F5F5'], [10,10,'#F5F5F5'], [11,10,'#F5F5F5'], [12,10,'#000'],
        
        // 第12行 - 尾巴和身体下部
        [0,11,'#000'], [1,11,'#000'], [2,11,'#F5F5F5'], [3,11,'#F5F5F5'], [4,11,'#F5F5F5'], [5,11,'#F5F5F5'], [6,11,'#F5F5F5'], [7,11,'#F5F5F5'], [8,11,'#F5F5F5'], [9,11,'#F5F5F5'], [10,11,'#F5F5F5'], [11,11,'#000'], [12,11,'#000'], [13,11,'#000'], [14,11,'#000'],
        
        // 第13行 - 前腿和尾巴
        [-2,12,'#000'], [-1,12,'#8B7355'], [0,12,'#8B7355'], [1,12,'#000'], [2,12,'#000'], [3,12,'#F5F5F5'], [4,12,'#F5F5F5'], [5,12,'#000'], [6,12,'#000'], [7,12,'#000'], [8,12,'#F5F5F5'], [9,12,'#F5F5F5'], [10,12,'#000'], [11,12,'#8B7355'], [12,12,'#8B7355'], [13,12,'#8B7355'], [14,12,'#000'],
        
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
      
      // 雨伞像素图案 - 更大更美观
      const umbrellaPixels = [
        // 伞顶弧形
        [5,0,'#E74C3C'], [6,0,'#E74C3C'], [7,0,'#E74C3C'], [8,0,'#E74C3C'], [9,0,'#E74C3C'],
        [4,1,'#E74C3C'], [5,1,'#E74C3C'], [6,1,'#E74C3C'], [7,1,'#E74C3C'], [8,1,'#E74C3C'], [9,1,'#E74C3C'], [10,1,'#E74C3C'],
        [3,2,'#E74C3C'], [4,2,'#C0392B'], [5,2,'#E74C3C'], [6,2,'#C0392B'], [7,2,'#E74C3C'], [8,2,'#C0392B'], [9,2,'#E74C3C'], [10,2,'#C0392B'], [11,2,'#E74C3C'],
        [2,3,'#E74C3C'], [3,3,'#C0392B'], [4,3,'#E74C3C'], [5,3,'#C0392B'], [6,3,'#E74C3C'], [7,3,'#C0392B'], [8,3,'#E74C3C'], [9,3,'#C0392B'], [10,3,'#E74C3C'], [11,3,'#C0392B'], [12,3,'#E74C3C'],
        [1,4,'#E74C3C'], [2,4,'#C0392B'], [3,4,'#E74C3C'], [4,4,'#C0392B'], [5,4,'#E74C3C'], [6,4,'#C0392B'], [7,4,'#E74C3C'], [8,4,'#C0392B'], [9,4,'#E74C3C'], [10,4,'#C0392B'], [11,4,'#E74C3C'], [12,4,'#C0392B'], [13,4,'#E74C3C'],
        [1,5,'#C0392B'], [2,5,'#E74C3C'], [3,5,'#C0392B'], [4,5,'#E74C3C'], [5,5,'#C0392B'], [6,5,'#E74C3C'], [7,5,'#C0392B'], [8,5,'#E74C3C'], [9,5,'#C0392B'], [10,5,'#E74C3C'], [11,5,'#C0392B'], [12,5,'#E74C3C'], [13,5,'#C0392B'],
        [0,6,'#C0392B'], [1,6,''], [2,6,'#C0392B'], [3,6,''], [4,6,'#C0392B'], [5,6,''], [6,6,'#C0392B'], [7,6,''], [8,6,'#C0392B'], [9,6,''], [10,6,'#C0392B'], [11,6,''], [12,6,'#C0392B'], [13,6,''], [14,6,'#C0392B'],
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
    drawGrass(canvasWidth, canvasHeight) {
      const p = this.pixelSize
      const grassHeight = 18
      const startY = Math.floor(canvasHeight / p) - grassHeight
      const width = Math.floor(canvasWidth / p)
      
      // 草地底部
      for (let y = 0; y < grassHeight; y++) {
        for (let x = 0; x < width; x++) {
          const baseColor = y < 5 ? '#5a8c3a' : '#3d6b2a'
          this.ctx.fillStyle = baseColor
          this.ctx.fillRect(x * p, (startY + y) * p, p, p)
        }
      }
      
      // 草丛细节
      const grassTime = Math.floor(this.time / 20) % 2
      for (let i = 0; i < width; i += 4) {
        const offset = (i % 8 === 0 && grassTime) ? 1 : 0
        this.ctx.fillStyle = '#6fa84d'
        this.ctx.fillRect((i + offset) * p, (startY - 1) * p, p, p)
        this.ctx.fillRect((i + offset) * p, (startY - 2) * p, p, p)
        this.ctx.fillRect((i + offset) * p, (startY - 3) * p, p, p)
      }
    },
    drawClouds(time) {
      const p = this.pixelSize
      const offset = Math.floor(time / 40) % 300
      
      // 云朵1
      const cloud1X = 15 - offset / 10
      const cloud1Y = 5
      const cloud1 = [
        [1,0,'rgba(255,255,255,0.5)'], [2,0,'rgba(255,255,255,0.5)'], [3,0,'rgba(255,255,255,0.5)'],
        [0,1,'rgba(255,255,255,0.5)'], [1,1,'rgba(255,255,255,0.6)'], [2,1,'rgba(255,255,255,0.6)'], [3,1,'rgba(255,255,255,0.6)'], [4,1,'rgba(255,255,255,0.5)'],
        [0,2,'rgba(255,255,255,0.5)'], [1,2,'rgba(255,255,255,0.5)'], [2,2,'rgba(255,255,255,0.5)'], [3,2,'rgba(255,255,255,0.5)'], [4,2,'rgba(255,255,255,0.5)']
      ]
      
      cloud1.forEach(([x, y, color]) => {
        this.ctx.fillStyle = color
        this.ctx.fillRect((cloud1X + x) * p, (cloud1Y + y) * p, p, p)
      })
      
      // 云朵2
      const cloud2X = 60 - offset / 15
      const cloud2Y = 12
      cloud1.forEach(([x, y, color]) => {
        this.ctx.fillStyle = color
        this.ctx.fillRect((cloud2X + x) * p, (cloud2Y + y) * p, p, p)
      })
    },
    drawRain() {
      const p = this.pixelSize
      
      this.raindrops.forEach(drop => {
        this.ctx.fillStyle = 'rgba(200, 220, 240, 0.5)'
        this.ctx.fillRect(drop.x, drop.y, p * 0.8, p * 3)
        
        drop.y += drop.speed * p
        
        if (drop.y > this.$refs.pixelCanvas.height) {
          drop.y = -p * 3
          drop.x = Math.random() * this.$refs.pixelCanvas.width
        }
      })
    },
    drawPuddle(x, y) {
      const p = this.pixelSize
      const alpha = 0.35 + Math.sin(this.time / 30) * 0.1
      
      const puddle = [
        [1,0,alpha], [2,0,alpha], [3,0,alpha], [4,0,alpha],
        [0,1,alpha], [1,1,alpha+0.1], [2,1,alpha+0.1], [3,1,alpha+0.1], [4,1,alpha+0.1], [5,1,alpha],
        [0,2,alpha], [1,2,alpha], [2,2,alpha], [3,2,alpha], [4,2,alpha], [5,2,alpha]
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
      
      // 闪电效果（随机触发）
      if (this.lightningTimer > 0) {
        this.lightningTimer--
        this.lightning = true
      } else {
        this.lightning = false
        // 每300帧有机会触发闪电
        if (this.time % 300 === 0 && Math.random() < 0.3) {
          this.lightningTimer = 3 + Math.floor(Math.random() * 3)
        }
      }
      
      // 清空画布 - 天空渐变背景（降低亮度）
      const gradient = this.ctx.createLinearGradient(0, 0, 0, canvas.height)
      if (this.lightning) {
        // 闪电时天空变亮
        gradient.addColorStop(0, '#B0C4DE')
        gradient.addColorStop(0.6, '#87CEEB')
        gradient.addColorStop(1, '#6B9BD1')
      } else {
        // 正常暗色天空
        gradient.addColorStop(0, '#4a5d6f')
        gradient.addColorStop(0.6, '#3a4d5f')
        gradient.addColorStop(1, '#2a3d4f')
      }
      this.ctx.fillStyle = gradient
      this.ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // 绘制云朵
      this.drawClouds(this.time)
      
      // 绘制雨滴
      this.drawRain()
      
      // 绘制草地
      this.drawGrass(canvas.width, canvas.height)
      
      // 计算草地顶部位置，让猫站在草地上
      const grassHeight = 18
      const grassTopY = Math.floor(canvas.height / this.pixelSize) - grassHeight - 14
      
      // 计算中心位置
      const centerX = Math.floor(canvas.width / this.pixelSize / 2) - 6
      
      // 绘制水坑（在草地上）
      const puddleY = Math.floor(canvas.height / this.pixelSize) - grassHeight + 2
      this.drawPuddle(centerX - 18, puddleY)
      this.drawPuddle(centerX + 20, puddleY + 1)
      
      // 绘制雨伞（在猫的上方）
      const breathe = Math.sin(this.time / 60) * 0.4
      this.drawUmbrella(centerX - 2, grassTopY - 9 + breathe)
      
      // 绘制布偶猫（站在草地上）
      this.drawRagdollCat(centerX, grassTopY + breathe, this.time)
      
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
  background: rgba(0, 0, 0, 0.6);
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
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transition: all 0.2s;
  backdrop-filter: blur(4px);
}

.back-btn:hover {
  background: rgba(0, 0, 0, 0.8);
  transform: scale(1.1);
}

.back-btn:active {
  transform: scale(0.95);
}
</style>
