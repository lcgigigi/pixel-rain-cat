<template>
  <div class="aquarium-page">
    <div class="back-btn" @click="goBack">←</div>
    <div class="score-panel">
      得分: {{ score }} | 宝物: {{ treasures }}
      <span v-if="poseMode" class="pose-hint">📸 摆拍中...</span>
    </div>
    
    <canvas ref="canvas" class="aqua-canvas"
            @click="handleClick"
            @mousemove="handleMouseMove"></canvas>
  </div>
</template>

<script>
export default {
  name: 'Aquarium',
  data() {
    return {
      ctx: null,
      pixelSize: 8,
      animationFrame: null,
      time: 0,
      // 小猫
      catX: 0,
      catY: 0,
      catVX: 0,
      catVY: 0,
      catTargetX: 0,
      catTargetY: 0,
      // 鼠标
      mouseX: 0,
      mouseY: 0,
      // 气泡
      bubbles: [],
      // 鱼群
      fishes: [],
      // 鱼食
      foods: [],
      // 海草
      seaweeds: [],
      // 水母
      jellyfish: [],
      // 宝箱
      chest: null,
      // 珊瑚
      corals: [],
      // 计分
      score: 0,
      treasures: 0,
      // 拍照
      poseMode: false,
      poseTimer: 0
    }
  },
  mounted() {
    this.init()
    this.animate()
    window.addEventListener('resize', this.init)
    window.addEventListener('keydown', this.onKey)
  },
  beforeUnmount() {
    if (this.animationFrame) cancelAnimationFrame(this.animationFrame)
    window.removeEventListener('resize', this.init)
    window.removeEventListener('keydown', this.onKey)
  },
  methods: {
    goBack() {
      this.$router.push('/')
    },
    init() {
      const c = this.$refs.canvas
      const dpr = window.devicePixelRatio || 1
      c.width = window.innerWidth * dpr
      c.height = window.innerHeight * dpr
      c.style.width = window.innerWidth + 'px'
      c.style.height = window.innerHeight + 'px'
      this.ctx = c.getContext('2d')
      this.ctx.imageSmoothingEnabled = false
      this.pixelSize = Math.max(6, Math.floor(Math.min(c.width, c.height) / 80))
      
      // 初始化小猫位置
      this.catX = c.width / 2
      this.catY = c.height / 2
      this.catTargetX = this.catX
      this.catTargetY = this.catY
      
      // 生成气泡
      this.bubbles = []
      for (let i = 0; i < 25; i++) {
        this.bubbles.push({
          x: Math.random() * c.width,
          y: c.height + Math.random() * c.height,
          r: 3 + Math.random() * 8,
          vy: -(0.3 + Math.random() * 0.6),
          wobble: Math.random() * Math.PI * 2
        })
      }
      
      // 生成鱼群
      this.fishes = []
      for (let i = 0; i < 12; i++) {
        this.fishes.push({
          x: Math.random() * c.width,
          y: Math.random() * c.height * 0.8,
          vx: (Math.random() - 0.5) * 1.2,
          vy: (Math.random() - 0.5) * 0.4,
          color: ['#ff9a56', '#56d4ff', '#ffeb3b', '#9c27b0'][Math.floor(Math.random() * 4)],
          size: 8 + Math.random() * 6
        })
      }
      
      // 生成海草
      this.seaweeds = []
      const p = this.pixelSize
      const count = Math.floor(c.width / (p * 20))
      for (let i = 0; i < count; i++) {
        this.seaweeds.push({
          x: (i + 0.5) * (c.width / count),
          baseX: (i + 0.5) * (c.width / count),
          height: 40 + Math.random() * 60,
          segments: 8,
          bendFactor: 0
        })
      }
      
      // 生成水母
      this.jellyfish = []
      for (let i = 0; i < 4; i++) {
        this.jellyfish.push({
          x: Math.random() * c.width,
          y: 100 + Math.random() * (c.height * 0.4),
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.3,
          color: '#d4a5ff',
          glow: 0,
          phase: Math.random() * Math.PI * 2
        })
      }
      
      // 生成珊瑚
      this.corals = []
      for (let i = 0; i < 8; i++) {
        this.corals.push({
          x: (i + 1) * (c.width / 9),
          y: c.height - 20 - Math.random() * 30,
          type: Math.floor(Math.random() * 3),
          color: ['#ff6b9d', '#ff9a56', '#a78bfa'][Math.floor(Math.random() * 3)]
        })
      }
    },
    pxRect(x, y, w, h, color) {
      this.ctx.fillStyle = color
      this.ctx.fillRect(x, y, w, h)
    },
    //---------- 绘制小猫潜水员
    drawDiverCat() {
      const p = this.pixelSize
      const x = this.catX
      const y = this.catY
      const ctx = this.ctx
      
      // 简化像素猫头（戴潜水头盔）
      // 头盔玻璃罩
      ctx.fillStyle = 'rgba(200,230,255,0.3)'
      ctx.beginPath()
      ctx.arc(x, y, p * 2.5, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = '#8ab4d5'
      ctx.lineWidth = 2
      ctx.stroke()
      
      // 猫脸
      ctx.fillStyle = '#fff'
      ctx.beginPath()
      ctx.arc(x, y, p * 1.8, 0, Math.PI * 2)
      ctx.fill()
      
      // 眼睛
      ctx.fillStyle = '#333'
      ctx.fillRect(x - p * 0.6, y - p * 0.3, p * 0.4, p * 0.4)
      ctx.fillRect(x + p * 0.2, y - p * 0.3, p * 0.4, p * 0.4)
      
      // 鼻子
      ctx.fillStyle = '#ffb6c1'
      ctx.beginPath()
      ctx.arc(x, y + p * 0.3, p * 0.3, 0, Math.PI * 2)
      ctx.fill()
      
      // 耳朵（在头盔外）
      ctx.fillStyle = '#ddd'
      ctx.beginPath()
      ctx.moveTo(x - p * 1.5, y - p * 2)
      ctx.lineTo(x - p * 2, y - p * 3)
      ctx.lineTo(x - p * 1, y - p * 2.5)
      ctx.fill()
      ctx.beginPath()
      ctx.moveTo(x + p * 1.5, y - p * 2)
      ctx.lineTo(x + p * 2, y - p * 3)
      ctx.lineTo(x + p * 1, y - p * 2.5)
      ctx.fill()
      
      // 氧气管
      ctx.strokeStyle = '#555'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(x + p * 2, y + p)
      ctx.lineTo(x + p * 3, y + p * 2)
      ctx.stroke()
    },
    //---------- 绘制气泡
    drawBubbles() {
      this.bubbles.forEach(b => {
        b.y += b.vy
        b.wobble += 0.05
        b.x += Math.sin(b.wobble) * 0.3
        
        if (b.y < -b.r * 2) {
          b.y = this.$refs.canvas.height + b.r
          b.x = Math.random() * this.$refs.canvas.width
        }
        
        const ctx = this.ctx
        ctx.fillStyle = 'rgba(200,230,255,0.25)'
        ctx.beginPath()
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2)
        ctx.fill()
        ctx.strokeStyle = 'rgba(255,255,255,0.5)'
        ctx.lineWidth = 1
        ctx.stroke()
      })
    },
    //---------- 绘制鱼群
    drawFishes() {
      const p = this.pixelSize
      this.fishes.forEach(f => {
        // 简单鱼形（椭圆+尾巴）
        const ctx = this.ctx
        ctx.fillStyle = f.color
        ctx.beginPath()
        ctx.ellipse(f.x, f.y, f.size, f.size * 0.6, 0, 0, Math.PI * 2)
        ctx.fill()
        // 尾巴
        const dir = f.vx > 0 ? -1 : 1
        ctx.beginPath()
        ctx.moveTo(f.x + dir * f.size, f.y)
        ctx.lineTo(f.x + dir * f.size * 1.6, f.y - f.size * 0.5)
        ctx.lineTo(f.x + dir * f.size * 1.6, f.y + f.size * 0.5)
        ctx.closePath()
        ctx.fill()
        
        // 朝向鱼食移动
        let attracted = false
        this.foods.forEach(food => {
          const dx = food.x - f.x
          const dy = food.y - f.y
          const dist = Math.hypot(dx, dy)
          if (dist < 150) {
            f.vx += dx / dist * 0.02
            f.vy += dy / dist * 0.02
            attracted = true
          }
        })
        
        if (!attracted) {
          f.vx += (Math.random() - 0.5) * 0.05
          f.vy += (Math.random() - 0.5) * 0.05
        }
        
        f.vx *= 0.98
        f.vy *= 0.98
        f.x += f.vx
        f.y += f.vy
        
        const c = this.$refs.canvas
        if (f.x < -20) f.x = c.width + 20
        if (f.x > c.width + 20) f.x = -20
        if (f.y < -20) f.y = c.height + 20
        if (f.y > c.height + 20) f.y = -20
      })
    },
    //---------- 绘制鱼食
    drawFoods() {
      const p = this.pixelSize
      this.foods = this.foods.filter(food => {
        food.y += 0.8
        if (food.y > this.$refs.canvas.height) return false
        
        // 被鱼吃掉
        for (let f of this.fishes) {
          if (Math.hypot(f.x - food.x, f.y - food.y) < f.size + 5) {
            return false
          }
        }
        
        this.ctx.fillStyle = '#8b4513'
        this.ctx.beginPath()
        this.ctx.arc(food.x, food.y, 3, 0, Math.PI * 2)
        this.ctx.fill()
        return true
      })
    },
    //---------- 绘制海草
    drawSeaweeds() {
      const c = this.$refs.canvas
      this.seaweeds.forEach(sw => {
        const dx = this.mouseX - sw.x
        const dy = this.mouseY - (c.height - sw.height)
        const dist = Math.hypot(dx, dy)
        if (dist < 100) {
          sw.bendFactor = Math.min(1, (100 - dist) / 100) * (dx / 100)
        } else {
          sw.bendFactor *= 0.95
        }
        
        const ctx = this.ctx
        ctx.strokeStyle = '#2d8659'
        ctx.lineWidth = 4
        ctx.lineCap = 'round'
        ctx.beginPath()
        let baseY = c.height
        ctx.moveTo(sw.x, baseY)
        for (let i = 1; i <= sw.segments; i++) {
          const ratio = i / sw.segments
          const offsetX = sw.bendFactor * ratio * 30
          const segY = baseY - (sw.height / sw.segments) * i
          ctx.lineTo(sw.x + offsetX, segY)
        }
        ctx.stroke()
      })
    },
    //---------- 绘制水母
    drawJellyfish() {
      this.jellyfish.forEach(j => {
        j.x += j.vx
        j.y += j.vy + Math.sin(j.phase) * 0.2
        j.phase += 0.03
        j.glow = (j.glow + 0.05) % (Math.PI * 2)
        
        const c = this.$refs.canvas
        if (j.x < -30) j.x = c.width + 30
        if (j.x > c.width + 30) j.x = -30
        if (j.y < 50) j.y = 50
        if (j.y > c.height * 0.6) j.y = c.height * 0.6
        
        const ctx = this.ctx
        const bright = 0.6 + Math.sin(j.glow) * 0.4
        // 伞状体
        ctx.fillStyle = j.color
        ctx.globalAlpha = bright
        ctx.beginPath()
        ctx.ellipse(j.x, j.y, 15, 12, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.globalAlpha = 1
        
        // 触手
        ctx.strokeStyle = j.color
        ctx.lineWidth = 2
        for (let i = 0; i < 6; i++) {
          ctx.beginPath()
          ctx.moveTo(j.x - 10 + i * 4, j.y + 10)
          ctx.lineTo(j.x - 10 + i * 4 + Math.sin(this.time / 10 + i) * 3, j.y + 25)
          ctx.stroke()
        }
      })
    },
    //---------- 绘制珊瑚
    drawCorals() {
      this.corals.forEach(c => {
        const ctx = this.ctx
        const p = this.pixelSize
        ctx.fillStyle = c.color
        if (c.type === 0) {
          // 分支型
          for (let i = 0; i < 5; i++) {
            ctx.fillRect(c.x - 2 + i * 1, c.y - i * 4, 3, i * 4 + 10)
          }
        } else if (c.type === 1) {
          // 圆球型
          ctx.beginPath()
          ctx.arc(c.x, c.y, 12, 0, Math.PI * 2)
          ctx.fill()
        } else {
          // 尖刺型
          ctx.beginPath()
          ctx.moveTo(c.x, c.y - 20)
          ctx.lineTo(c.x - 8, c.y)
          ctx.lineTo(c.x + 8, c.y)
          ctx.closePath()
          ctx.fill()
        }
      })
    },
    //---------- 绘制宝箱
    drawChest() {
      if (!this.chest) return
      const c = this.chest
      const ctx = this.ctx
      const p = this.pixelSize
      
      if (c.opened) {
        // 开启状态
        ctx.fillStyle = '#8b6914'
        ctx.fillRect(c.x - 15, c.y - 8, 30, 16)
        ctx.fillStyle = '#ffd700'
        ctx.fillRect(c.x - 10, c.y - 15, 20, 10)
        ctx.fillStyle = '#fff'
        ctx.font = '14px sans-serif'
        ctx.fillText(c.treasure, c.x - 15, c.y - 20)
      } else {
        // 关闭状态（闪光提示）
        const glow = 0.5 + Math.sin(this.time / 10) * 0.5
        ctx.fillStyle = `rgba(255,215,0,${glow * 0.3})`
        ctx.fillRect(c.x - 20, c.y - 20, 40, 40)
        ctx.fillStyle = '#8b6914'
        ctx.fillRect(c.x - 15, c.y - 5, 30, 10)
        ctx.fillRect(c.x - 15, c.y - 10, 30, 5)
      }
    },
    //---------- 动画主循环
    animate() {
      const c = this.$refs.canvas
      if (!c) return
      this.time++
      
      // 背景渐变（海底）
      const g = this.ctx.createLinearGradient(0, 0, 0, c.height)
      g.addColorStop(0, '#1a4d6f')
      g.addColorStop(0.5, '#0d3a5a')
      g.addColorStop(1, '#0a2540')
      this.ctx.fillStyle = g
      this.ctx.fillRect(0, 0, c.width, c.height)
      
      // 沙地
      this.ctx.fillStyle = '#d4c5a0'
      this.ctx.fillRect(0, c.height - 30, c.width, 30)
      
      // 绘制元素（从后到前）
      this.drawCorals()
      this.drawSeaweeds()
      this.drawBubbles()
      this.drawFishes()
      this.drawFoods()
      this.drawJellyfish()
      this.drawChest()
      
      // 小猫跟随鼠标（惯性）
      if (!this.poseMode) {
        const dx = this.catTargetX - this.catX
        const dy = this.catTargetY - this.catY
        this.catVX += dx * 0.002
        this.catVY += dy * 0.002
        this.catVX *= 0.92
        this.catVY *= 0.92
        this.catX += this.catVX
        this.catY += this.catVY
      }
      
      this.drawDiverCat()
      
      // 拍照模式倒计时
      if (this.poseMode) {
        this.poseTimer--
        if (this.poseTimer <= 0) this.poseMode = false
      }
      
      // 随机生成宝箱
      if (!this.chest && Math.random() < 0.001) {
        const treasureList = ['珍珠', '海星', '贝壳', '珊瑚', '海螺']
        this.chest = {
          x: 100 + Math.random() * (c.width - 200),
          y: c.height - 60 - Math.random() * 100,
          opened: false,
          treasure: treasureList[Math.floor(Math.random() * treasureList.length)]
        }
      }
      
      this.animationFrame = requestAnimationFrame(this.animate)
    },
    //---------- 交互
    handleMouseMove(e) {
      const rect = this.$refs.canvas.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      this.mouseX = (e.clientX - rect.left) * dpr
      this.mouseY = (e.clientY - rect.top) * dpr
      this.catTargetX = this.mouseX
      this.catTargetY = this.mouseY
    },
    handleClick(e) {
      const rect = this.$refs.canvas.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      const mx = (e.clientX - rect.left) * dpr
      const my = (e.clientY - rect.top) * dpr
      
      // 点击气泡
      for (let i = this.bubbles.length - 1; i >= 0; i--) {
        const b = this.bubbles[i]
        if (Math.hypot(mx - b.x, my - b.y) < b.r) {
          this.bubbles.splice(i, 1)
          this.score += 1
          // 生成新气泡
          this.bubbles.push({
            x: Math.random() * this.$refs.canvas.width,
            y: this.$refs.canvas.height + 20,
            r: 3 + Math.random() * 8,
            vy: -(0.3 + Math.random() * 0.6),
            wobble: Math.random() * Math.PI * 2
          })
          return
        }
      }
      
      // 点击水母
      this.jellyfish.forEach(j => {
        if (Math.hypot(mx - j.x, my - j.y) < 20) {
          const colors = ['#d4a5ff', '#ff6bcf', '#6bffd4', '#ffd46b']
          j.color = colors[Math.floor(Math.random() * colors.length)]
          j.glow = 0
        }
      })
      
      // 点击宝箱
      if (this.chest && !this.chest.opened) {
        if (Math.hypot(mx - this.chest.x, my - this.chest.y) < 25) {
          this.chest.opened = true
          this.treasures++
          setTimeout(() => { this.chest = null }, 2000)
        }
      }
      
      // 投放鱼食
      this.foods.push({ x: mx, y: my })
    },
    onKey(e) {
      if (e.key === 'p' || e.key === 'P') {
        this.poseMode = true
        this.poseTimer = 180
        this.catVX = 0
        this.catVY = 0
      }
    }
  }
}
</script>

<style scoped>
.aquarium-page {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
}
.aqua-canvas {
  display: block;
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
  color: #fff;
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
.back-btn:hover { background: rgba(0,0,0,0.8); transform: scale(1.1); }
.back-btn:active { transform: scale(0.95); }

.score-panel {
  position: fixed;
  top: 20px;
  right: 20px;
  background: rgba(255,255,255,0.85);
  padding: 12px 20px;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  z-index: 100;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  backdrop-filter: blur(4px);
}

.pose-hint {
  margin-left: 12px;
  color: #ff6b9d;
  animation: blink 0.5s infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}
</style>

