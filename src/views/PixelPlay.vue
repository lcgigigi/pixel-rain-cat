<template>
  <div class="pixel-play">
    <div class="back-btn" @click="goBack">←</div>

    <canvas ref="canvas" class="pixel-canvas"
            @click="handleCanvasClick"
            @mousemove="handleMouseMove"></canvas>

    <audio ref="bgm" :src="bgmSrc" loop preload="auto" autoplay></audio>

    <div class="ui-panel">
      <div class="hint">提示：点击小猫可以切换它说的话～</div>
      <div class="audio-controls">
        <button class="btn-audio" ref="playBtn" @click="tryPlayBgm">播放音乐</button>
        
      </div>
      
      <div class="chat">
        <div class="messages" ref="msgWrap">
          <div v-for="(m, i) in messages" :key="i" class="msg" :class="m.role">
            <span class="bubble">{{ m.text }}</span>
          </div>
        </div>
        <div class="input">
          <input v-model="inputText" @keyup.enter="sendMessage" placeholder="和小猫说点什么吧..." />
          <button class="btn-send" @click="sendMessage">发送</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PixelPlay',
  data() {
    return {
      ctx: null,
      pixelSize: 8,
      animationFrame: null,
      time: 0,
      raindrops: [],
      lightning: false,
      lightningTimer: 0,
      lightningBolts: [],
      lightningProgress: 0,
      // 交互
      mouseX: 0,
      mouseY: 0,
      groundTop: 0,
      // 小猫
      catX: 40,
      catY: 0,
      catXOffset: 6,
      // 说话
      catSayings: [
        'Lucy，咪旁边的这棵树有点像小鸡腿。',
        'Lucy，今天天气很适合打盹～',
        'Lucy，有小鱼干吗？',
        'Lucy，一起听雨吧。',
        'Lucy，喵！'
      ],
      catSayIndex: 0,
      catBounds: { x: 0, y: 0, w: 0, h: 0 },
      // 头顶气泡
      headBubbleText: 'Lucy，咪的世界下雨了，咪处理不好。',
      headBubbleSayings: [
        'Lucy，咪喜欢你的摸摸。',
        'Lucy，能再陪咪一会吗？',
        'Lucy，伞借咪一下好不好？',
        'Lucy，别走太快，咪跟不上。',
        'Lucy，和咪一起听雨吧。'
      ],
      headBubbleIndex: 0,
      // 聊天
      inputText: '',
      messages: [
        { role: 'cat', text: 'Lucy，咪旁边的这棵树有点像小鸡腿。' },
      ],
      // 音乐（默认 public/bgm.mp3）
      bgmSrc: '/bgm.mp3',
      bgmPlaying: false
    }
  },
  mounted() {
    this.init()
    this.animate()
    // 尝试自动播放并模拟点击按钮一次（部分浏览器需用户交互）
    this.$nextTick(()=>{ 
      const btn = this.$refs.playBtn
      if (btn && typeof btn.click === 'function') btn.click()
      this.tryPlayBgm()
    })
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

      // 基础像素大小
      this.pixelSize = Math.max(6, Math.floor(Math.min(c.width, c.height) / 80))

      // 雨滴（斜线雨）
      this.raindrops = []
      for (let i = 0; i < 110; i++) {
        this.raindrops.push({
          x: Math.random() * c.width,
          y: Math.random() * c.height,
          vy: (0.8 + Math.random() * 0.9) * this.pixelSize,
          vx: (0.25 + Math.random() * 0.25) * this.pixelSize
        })
      }

      // 地面顶端（草地上沿）
      const p = this.pixelSize
      const grassHeight = 18
      this.groundTop = Math.floor(c.height / p) - grassHeight - 14

      // 初始化猫位置到屏幕中部并左移一定偏移量（固定，不移动）
      this.catX = Math.floor(c.width / p / 2) - (this.catXOffset || 0)
      this.catY = this.groundTop
    },
    //---------------- 绘制基础像素块
    pxRect(x, y, color) {
      const p = this.pixelSize
      this.ctx.fillStyle = color
      this.ctx.fillRect(x * p, y * p, p, p)
    },
    //---------------- 元素：树（全新圆润树冠 + 树干细节）
    drawTree(startX, startY) {
      // 树冠：三层圆润形状，顶部亮、底部暗，加入点状高光
      const crown = []
      for (let y = 0; y < 16; y++) {
        const half = 8 - Math.floor(Math.abs(y - 7) * 0.9)
        for (let x = -half - 3; x <= half + 3; x++) {
          const top = y < 5
          const mid = y >= 5 && y < 11
          const color = top ? '#8edc81' : (mid ? '#63b86a' : '#3d8a4f')
          this.pxRect(startX + x, startY + y, color)
          // 点状高光
          if (top && (x + y) % 7 === 0) this.pxRect(startX + x, startY + y, '#bff3b8')
        }
      }
      // 树干：加明暗条纹
      for (let y = 16; y < 28; y++) {
        this.pxRect(startX - 1, startY + y, '#7b4e33')
        this.pxRect(startX, startY + y, (y % 3 === 0) ? '#915e3c' : '#875637')
        this.pxRect(startX + 1, startY + y, '#6b432b')
      }
      // 根部加粗
      for (let x = -2; x <= 2; x++) this.pxRect(startX + x, startY + 28, '#6b432b')
    },
    //---------------- 元素：草地（三层渐变 + 小花）
    drawGrass(w, h) {
      const p = this.pixelSize
      const grassHeight = 20
      const startY = Math.floor(h / p) - grassHeight
      const width = Math.floor(w / p)
      for (let y = 0; y < grassHeight; y++) {
        for (let x = 0; x < width; x++) {
          const color = y < 6 ? '#9adf88' : (y < 13 ? '#64b66a' : '#3c8a4e')
          this.pxRect(x, startY + y, color)
        }
      }
      // 草尖（轻微左右摆）
      const sway = Math.floor(this.time / 24) % 2
      for (let i = 0; i < width; i += 3) {
        const off = (i % 6 === 0 && sway) ? 1 : 0
        this.pxRect(i + off, startY - 1, '#c5f3bd')
      }
      // 小花点缀：粉、黄、白（稳定规则避免闪烁）
      for (let i = 0; i < width; i++) {
        if (i % 23 === 5) this.pxRect(i, startY - 1, '#ffd1dc')
        if (i % 29 === 11) this.pxRect(i, startY - 1, '#ffe680')
        if (i % 31 === 7) this.pxRect(i, startY - 1, '#ffffff')
      }
    },
    //---------------- 元素：云
    drawClouds() {
      const p = this.pixelSize
      const off = Math.floor(this.time / 40)
      const clouds = [
        { x: 15 - off / 10, y: 5 },
        { x: 60 - off / 15, y: 12 }
      ]
      clouds.forEach(c => {
        const shape = [
          [1,0,0.5],[2,0,0.5],[3,0,0.5],
          [0,1,0.5],[1,1,0.6],[2,1,0.6],[3,1,0.6],[4,1,0.5],
          [0,2,0.5],[1,2,0.5],[2,2,0.5],[3,2,0.5],[4,2,0.5]
        ]
        shape.forEach(([x,y,a])=>{
          this.ctx.fillStyle = `rgba(255,255,255,${a})`
          this.ctx.fillRect((c.x + x) * p, (c.y + y) * p, p, p)
        })
      })
    },
    //---------------- 元素：雨（斜线 + 水花）
    drawRain() {
      const p = this.pixelSize
      const c = this.$refs.canvas
      const groundPx = (this.groundTop + 14) * p
      this.raindrops.forEach(d => {
        // 斜线雨滴：两格像素形成倾斜视觉
        this.ctx.fillStyle = 'rgba(210,230,255,0.8)'
        this.ctx.fillRect(d.x, d.y, p * 0.6, p * 2.2)
        this.ctx.fillStyle = 'rgba(190,210,245,0.6)'
        this.ctx.fillRect(d.x - p * 0.4, d.y - p * 0.4, p * 0.6, p * 1.4)

        d.x += d.vx; d.y += d.vy

        // 触地水花
        if (d.y > groundPx - p * 0.5) {
          const splashY = groundPx - p
          this.ctx.fillStyle = 'rgba(170,210,250,0.7)'
          this.ctx.fillRect(d.x - p, splashY, p, p * 0.4)
          this.ctx.fillRect(d.x + p * 0.3, splashY - p * 0.2, p, p * 0.4)
          // 重置
          d.y = -p * 2
          d.x = Math.random() * c.width
        }
        if (d.x > c.width + p * 2) d.x = -p * 2
      })
    },
    //---------------- 元素：水坑
    drawPuddle(x, y) {
      const p = this.pixelSize
      const a = 0.35 + Math.sin(this.time / 30) * 0.1
      const tiles = [
        [1,0],[2,0],[3,0],[4,0],
        [0,1],[1,1],[2,1],[3,1],[4,1],[5,1],
        [0,2],[1,2],[2,2],[3,2],[4,2],[5,2]
      ]
      tiles.forEach(([px,py])=>this.pxRect(x+px, y+py, `rgba(135,206,235,${a})`))
    },
    //---------------- 小猫像素（按图片重绘）
    drawCat(startX, startY, frame) {
      const p = this.pixelSize
      const px = (x, y, c) => this.pxRect(startX + x, startY + y, c)
      const O = '#000'
      const WHITE = '#ffffff'
      const GRAY = '#bfb8ae'
      const TAIL = '#9b7a5f'
      const TAIL_DARK = '#7d5f49'
      const EAR_PINK = '#f4a8b6'
      const CHEEK = '#f4a8b6'
      const EYE = '#3aa7ff'
      const NOSE = '#2b2b2b'
      const blink = Math.floor(frame / 120) % 80 < 3

      // 定义点击边界（以像素格为单位转换到画布像素）
      const w = 16, h = 14
      this.catBounds = { x: (startX) * p, y: (startY) * p, w: w * p, h: h * p }

      // 轮廓（简化的粗黑边）
      ;[[1,1],[2,0],[3,0],[12,0],[13,1],[0,2],[14,2],[0,3],[14,3],[0,4],[14,4],[0,5],[14,5],[0,6],[14,6],[1,7],[13,7],[2,8],[4,8],[10,8],[12,8],[3,9],[11,9],[2,10],[4,10],[10,10],[12,10],[1,11],[13,11],[1,12],[4,12],[11,12],[13,12]].forEach(([x,y])=>px(x,y,O))

      // 耳朵粉
      ;[[3,1],[12,1]].forEach(([x,y])=>px(x,y,EAR_PINK))

      // 顶部灰毛
      for (let x = 2; x <= 13; x++) px(x,2,GRAY)
      for (let x = 1; x <= 13; x++) px(x,3,GRAY)
      for (let x = 1; x <= 13; x++) px(x,4,GRAY)

      // 脸部与身体白
      for (let y = 5; y <= 8; y++) for (let x = 1; x <= 13; x++) px(x,y,WHITE)
      for (let y = 9; y <= 11; y++) for (let x = 2; x <= 12; x++) px(x,y,WHITE)

      // 眼睛/眨眼
      if (!blink) { px(5,6,EYE); px(10,6,EYE) } else { px(5,6,NOSE); px(10,6,NOSE) }
      // 鼻子
      px(8,7,NOSE)
      // 腮红
      px(4,7,CHEEK); px(11,7,CHEEK)
      // 爪子白
      px(2,12,WHITE); px(4,12,WHITE); px(11,12,WHITE); px(13,12,WHITE)
      // 尾巴（棕）
      ;[[14,6],[15,7],[15,8],[15,9]].forEach(([x,y])=>px(x-1,y,TAIL))
      ;[[14,7],[14,8],[14,9]].forEach(([x,y])=>px(x-1,y,TAIL_DARK))
    },
    //---------------- 闪电
    generateLightningBolt(startX, startY, endY) {
      const bolt = []
      let x = startX
      let y = startY
      while (y < endY) {
        bolt.push({ x, y })
        y += 20 + Math.random() * 30
        x += (Math.random() - 0.5) * 40
        if (Math.random() < 0.25) {
          const n = 3 + Math.floor(Math.random() * 3)
          let bx = x, by = y
          for (let i = 0; i < n; i++) {
            bx += (Math.random() - 0.5) * 30
            by += 15 + Math.random() * 20
            bolt.push({ x: bx, y: by, branch: true })
          }
        }
      }
      return bolt
    },
    drawLightning() {
      if (!this.lightning || this.lightningBolts.length === 0) return
      const p = this.pixelSize
      this.lightningBolts.forEach(bolt => {
        const segs = Math.floor(bolt.length * this.lightningProgress)
        for (let i = 0; i < segs - 1; i++) {
          const a = bolt[i], b = bolt[i+1]
          // 使用像素块连接两点（锯齿阶梯）
          const steps = Math.max(1, Math.floor(Math.hypot(b.x-a.x, b.y-a.y) / (p*1.2)))
          for (let s = 0; s <= steps; s++) {
            const t = s / steps
            const x = Math.floor((a.x + (b.x-a.x)*t) / p)
            const y = Math.floor((a.y + (b.y-a.y)*t) / p)
            // 外圈微光
            this.pxRect(x-1, y, 'rgba(240,248,255,0.25)')
            this.pxRect(x+1, y, 'rgba(240,248,255,0.25)')
            this.pxRect(x, y-1, 'rgba(240,248,255,0.25)')
            this.pxRect(x, y+1, 'rgba(240,248,255,0.25)')
            // 主体
            this.pxRect(x, y, '#ffffff')
          }
        }
      })
    },
    //---------------- 动画主循环
    animate() {
      const c = this.$refs.canvas
      if (!c) return
      this.time++

      // 闪电随机触发
      if (this.lightningTimer > 0) {
        this.lightningTimer--
        this.lightning = true
        const total = 15, extend = 5
        const cur = total - this.lightningTimer
        this.lightningProgress = cur <= extend ? cur / extend : 1
      } else {
        this.lightning = false
        this.lightningBolts = []
        this.lightningProgress = 0
        if (this.time % 200 === 0 && Math.random() < 0.4) {
          this.lightningTimer = 15
          const count = Math.random() < 0.7 ? 1 : 2
          this.lightningBolts = []
          for (let i = 0; i < count; i++) {
            const sx = c.width * (0.2 + Math.random() * 0.6)
            this.lightningBolts.push(this.generateLightningBolt(sx, 0, c.height * 0.6))
          }
        }
      }

      // 背景天空
      const g = this.ctx.createLinearGradient(0, 0, 0, c.height)
      if (this.lightning) {
        g.addColorStop(0, '#B0C4DE')
        g.addColorStop(0.6, '#87CEEB')
        g.addColorStop(1, '#6B9BD1')
      } else {
        g.addColorStop(0, '#4a5d6f')
        g.addColorStop(0.6, '#3a4d5f')
        g.addColorStop(1, '#2a3d4f')
      }
      this.ctx.fillStyle = g
      this.ctx.fillRect(0, 0, c.width, c.height)

      this.drawClouds()
      this.drawRain()

      // 草地与地面
      this.drawGrass(c.width, c.height)

      // 水坑
      const p = this.pixelSize
      const grassHeight = 18
      const puddleY = Math.floor(c.height / p) - grassHeight + 2
      const centerX = Math.floor(c.width / p / 2)
      this.drawPuddle(centerX + 18, puddleY)
      this.drawPuddle(centerX + 26, puddleY + 1)

      // 树
      const treeX = centerX - 20
      const treeY = this.groundTop - 20
      this.drawTree(treeX, treeY)

      // 固定位置绘制小猫
      this.drawCat(this.catX, this.groundTop, this.time)
      // 小猫头顶气泡（上移避免遮挡）
      this.drawSpeechBubble(this.catX + 1, this.groundTop - 14, this.headBubbleText)

      // 闪电置顶
      this.drawLightning()

      this.animationFrame = requestAnimationFrame(this.animate)
    },
    //---------------- 交互
    handleMouseMove(e) {
      const rect = this.$refs.canvas.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      this.mouseX = (e.clientX - rect.left) * dpr
      this.mouseY = (e.clientY - rect.top) * dpr
    },
    handleCanvasClick(e) {
      const rect = this.$refs.canvas.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      const mx = (e.clientX - rect.left) * dpr
      const my = (e.clientY - rect.top) * dpr
      if (!this.bgmPlaying) this.tryPlayBgm()
      const b = this.catBounds
      if (mx >= b.x && mx <= b.x + b.w && my >= b.y && my <= b.y + b.h) {
        this.headBubbleIndex = (this.headBubbleIndex + 1) % this.headBubbleSayings.length
        this.headBubbleText = this.headBubbleSayings[this.headBubbleIndex]
      }
    },
    onKey(e) {
      if (!this.bgmPlaying) this.tryPlayBgm()
    },
    //---------------- 音乐
    tryPlayBgm() {
      const el = this.$refs.bgm
      if (!el) return
      try {
        el.volume = 0.45
        const p = el.play()
        if (p && typeof p.then === 'function') {
          p.then(()=>{ this.bgmPlaying = true }).catch(()=>{})
        } else {
          this.bgmPlaying = true
        }
      } catch (_) {}
    },
    // 切换按钮已移除，始终尝试保持播放
    // 选择音乐相关已移除，默认使用 public/bgm.mp3
    //---------------- 聊天
    sendMessage() {
      const t = (this.inputText || '').trim()
      if (!t) return
      this.messages.push({ role: 'user', text: t })
      this.inputText = ''
      this.$nextTick(()=>{
        this.scrollMsgToBottom()
        const reply = this.generateCatReply(t)
        this.messages.push({ role: 'cat', text: reply })
        this.$nextTick(this.scrollMsgToBottom)
      })
    },
    generateCatReply(text) {
      const t = (text || '').toLowerCase().trim()
      // 问候与身份
      if (/你好|hello|hi/.test(t)) return 'Lucy，你好。'
      if (/你是(谁|谁呀)|你叫(什么|啥)/.test(t)) return '我是咪，一只怕淋雨的小猫。'
      if (/名字/.test(t)) return '咪的名字就叫“咪”。'
      // 情绪安慰与共情
      if (/你怎么知道/.test(t)) return '这是咪的秘密。'
      if (/(谢谢|多谢|感谢|谢了)/.test(t)) return '不用客气，Lucy。'
      if (/(难过|伤心|哭|不开心)/.test(t)) return 'Lucy，咪在这儿，给你抱抱。'
      if (/(抱抱|抱我|抱一下)/.test(t)) return '给你一个大抱抱。'
      if (/(累|辛苦)/.test(t)) return '辛苦了，喝口热茶休息一下。'
      if (/(冷|有点冷)/.test(t)) return '外面凉，咪给你披小毯子。'
      // 日常闲聊
      if (/(在干嘛|干什么|做什么|在做什么)/.test(t)) return '咪在听雨，顺便想你。'
      if (/(无聊)/.test(t)) return '要不要听咪讲一个小故事？'
      // 天气与场景
      if (/天气|下雨|雨/.test(t)) return '是呀，下雨了，咪有点慌。'
      // 喜好与食物
      if (/小鱼干|鱼|零食/.test(t)) return '小鱼干？可以多来两份吗？'
      if (/喜欢|爱/.test(t)) return '咪喜欢安静听雨，也喜欢你。'
      // 状态在不
      if (/在吗|在不在|在不/.test(t)) return '咪在，咪一直都在。'
      // 早晚问候
      if (/(早安|早上好)/.test(t)) return '早安，Lucy。今天也要好好加油。'
      if (/(晚安|晚上好|睡觉)/.test(t)) return '晚安，Lucy。做个甜甜的梦。'
      // 告别
      if (/再见|拜拜|byebye|goodbye/.test(t)) return 'Lucy，再见。记得带伞。'
      // 默认
      return '喵喵喵。'
    },
    scrollMsgToBottom() {
      const w = this.$refs.msgWrap
      if (w) w.scrollTop = w.scrollHeight
    },
    
    
    //---------------- 头顶气泡绘制
    drawSpeechBubble(startX, startY, text) {
      if (!text) return
      const p = this.pixelSize
      const ctx = this.ctx
      // 文本分行（每行最多 14 个中文左右）
      const maxChars = 14
      const lines = []
      let s = text
      while (s.length > 0) { lines.push(s.slice(0, maxChars)); s = s.slice(maxChars) }
      const padding = 2.2 * p
      ctx.font = `${Math.floor(p * 2.6)}px sans-serif`
      const lineWidth = Math.max(...lines.map(l => ctx.measureText(l).width))
      const w = Math.ceil((lineWidth + padding * 2) / p) * p
      const h = (lines.length * (p * 3)) + padding * 1.8
      const x = startX * p
      const y = startY * p
      // 背景
      ctx.fillStyle = 'rgba(255,255,255,0.9)'
      ctx.fillRect(x, y, w, h)
      // 边框
      ctx.strokeStyle = '#000'
      ctx.lineWidth = Math.max(1, Math.floor(p / 3))
      ctx.strokeRect(x, y, w, h)
      // 小尾巴
      ctx.beginPath()
      ctx.moveTo(x + p * 2, y + h)
      ctx.lineTo(x + p * 4, y + h)
      ctx.lineTo(x + p * 3, y + h + p)
      ctx.closePath()
      ctx.fillStyle = 'rgba(255,255,255,0.9)'
      ctx.fill()
      ctx.stroke()
      // 文本
      ctx.fillStyle = '#222'
      lines.forEach((l, i) => {
        ctx.fillText(l, x + padding, y + padding + (i + 1) * (p * 2.2) - p * 0.4)
      })
    }
    
  }
}
</script>

<style scoped>
.pixel-play {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
}
.pixel-canvas {
  display: block;
  image-rendering: pixelated;
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

.ui-panel {
  position: absolute;
  right: 16px;
  top: 16px;
  width: 280px;
  background: rgba(255,255,255,0.75);
  border: 2px solid #222;
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.2);
  padding: 12px;
  z-index: 110;
  backdrop-filter: blur(4px);
}
.hint {
  font-size: 12px;
  margin-bottom: 8px;
  color: #333;
}
.audio-controls { display: flex; gap: 8px; margin-bottom: 8px; }
.btn-audio {
  padding: 6px 10px;
  border: 1px solid #222;
  background: rgba(255,255,255,0.85);
  border-radius: 8px;
  cursor: pointer;
  font-size: 12px;
}
.btn-audio:active { transform: scale(0.98); }

.chat { display: flex; flex-direction: column; gap: 8px; }
.messages {
  height: 180px;
  overflow: auto;
  background: #f8fafc;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 8px;
}
.msg { display: flex; margin: 6px 0; }
.msg.user { justify-content: flex-end; }
.msg.cat { justify-content: flex-start; }
.msg.system { justify-content: center; }
.bubble {
  display: inline-block;
  padding: 6px 10px;
  border-radius: 8px;
  border: 1px solid #333;
  background: #fff;
  font-size: 14px;
}
.msg.user .bubble { background: #dbeafe; }
.msg.cat .bubble { background: #fde68a; }
.msg.system .bubble { background: #e5e7eb; }
.input { display: flex; gap: 8px; }
.input input {
  flex: 1;
  padding: 6px 10px;
  border: 1px solid #bbb;
  border-radius: 8px;
  font-size: 14px;
}
.btn-send {
  padding: 6px 12px;
  border: 1px solid #222;
  background: #fff;
  border-radius: 8px;
  cursor: pointer;
}
.btn-send:active { transform: scale(0.98); }

@media (max-width: 480px) {
  .ui-panel { width: calc(100% - 32px); left: 16px; right: 16px; top: 16px; }
}
</style>


